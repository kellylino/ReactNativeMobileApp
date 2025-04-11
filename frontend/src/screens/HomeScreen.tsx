import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Header from "../components/Header";
import { SelectList } from 'react-native-dropdown-select-list';
import { HabitData } from "../types/types";
import { showMessage } from "react-native-flash-message";
import axios from "axios";
import { base_url } from "../APIs/axiosHelper";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { initializeHabits, createHabit, updatedHabit, deleteHabit } from "../reducers/habitReducer";
import { AppDispatch, RootState } from "../reducers/store";
import { initializeEvents } from "../reducers/eventReducer";
import Icon from "react-native-vector-icons/Ionicons";

const data = [
  { key: '1', value: 'Days' },
  { key: '2', value: 'Hours' },
];

const HomeScreen = () => {
  //const navigation = useNavigation<StackNavigationProp<any>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [habitName, setHabitName] = useState("");
  const [targetValue, setTargetValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  //const [habitData, setHabitData] = useState<HabitData[]>([]);
  const [customImage, setCustomImage] = useState("");
  const [imageUrl, setImageUrl] = useState("https://habitstack.s3.eu-north-1.amazonaws.com/default.png");
  const imageUrlRef = useRef(imageUrl);
  const [selectedHabit, setSelectedHabit] = useState<HabitData | null>(null);

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedImg, setUpdatedImg] = useState("");
  const updatedImgRef = useRef(updatedImg);
  const [updatedHabitName, setUpdatedHabitName] = useState("");
  const [updatedTargetValue, setUpdatedTargetValue] = useState("");
  const [updatedSelectedType, setupdatedSelectedType] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    (async () => {
      try {
        dispatch(initializeHabits());
        dispatch(initializeEvents());
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
          return;
        }
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    })();
  }, []);

  const habits = useSelector((state: RootState) => state.habits);
  //console.log("habit home: ", habits);

  const HabitItem = ({ habit }: { habit: HabitData }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelectedHabit(habit);
        setUpdateModalVisible(true);
        setUpdatedImg(habit.habit_img)
        setUpdatedHabitName(habit.habit_name);
        setUpdatedTargetValue(habit.habit_target_time.toString());
        setupdatedSelectedType(habit.habit_target_type === 'days' ? 'Days' : 'Hours');
      }}
    >
      <View style={styles.iconWrapper}>
        <Image source={{ uri: habit.habit_img }} style={styles.icon} resizeMode="cover" />
      </View>
      <View>
      <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">{habit.habit_name}</Text>
      </View>
    </TouchableOpacity>
  );

  const pickImage = async () => {
    console.log("Pick image function called.");
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setCustomImage(result.assets[0].uri);
    }
  };

  const handleHabitsCreate = async () => {
    try {
      if (!habitName || !targetValue || !selectedType) {
        showMessage({ message: "Please fill in all fields", type: "danger" });
        return;
      }

      if (customImage) {
        try {
          const formData = new FormData();
          const fileName = customImage.split('/').pop();
          const fileType = `image/${fileName?.split('.').pop()}`;

          formData.append("image", {
            uri: customImage,
            name: fileName,
            type: fileType,
          } as any);

          console.log("FormData content:", formData);

          const uploadResponse = await axios.post(
            `http://${base_url}:6000/api/upload`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setImageUrl(uploadResponse.data.imageUrl);
          imageUrlRef.current = uploadResponse.data.imageUrl;
          console.log("Image upload response: ", uploadResponse.data);
        } catch (error) {
          console.error("Error uploading image:", error);
          showMessage({ message: "Error uploading image", type: "danger" });
        }
      } else {
        imageUrlRef.current = "https://habitstack.s3.eu-north-1.amazonaws.com/default.png";
      }

      const newHabit: HabitData = {
        _id: Math.random().toString(),
        habit_img: imageUrlRef.current,
        habit_name: habitName,
        habit_target_time: parseInt(targetValue, 10),
        habit_target_type: selectedType.toLowerCase() as "hours" | "days",
        habit_accumulating_time: 0,
        habit_progress: 0,
        is_checked: false,
        checked_dates:[],
        hours_accumulated_period:[],
        goal_reached: false,
      };

      console.log("newHabit: ", newHabit);
      dispatch(createHabit(newHabit))
      setHabitName("");
      setTargetValue("");
      setCustomImage("");
      setImageUrl("");

      showMessage({ message: "Habit created successfully!", type: "success" });
      setModalVisible(false);
    } catch (error: any) {
      console.error("Error creating habit:", error);
      showMessage({ message: error.message || "Failed to create habit", type: "danger" });
    }
  };

  const handleHabitUpdate = async () => {
    if (!selectedHabit) return;

    try {

      if (customImage) {
        const formData = new FormData();
        const fileName = customImage.split('/').pop();
        const fileType = `image/${fileName?.split('.').pop()}`;

        formData.append("image", {
          uri: customImage,
          name: fileName,
          type: fileType,
        } as any);

        const uploadResponse = await axios.post(
          `http://${base_url}:6000/api/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setUpdatedImg(uploadResponse.data.imageUrl);
        updatedImgRef.current = uploadResponse.data.imageUrl
      } else {
        updatedImgRef.current = selectedHabit.habit_img;
      }

      const habitDataUpdating: HabitData = {
        ...selectedHabit,
        habit_name: updatedHabitName || selectedHabit.habit_name,
        habit_img: updatedImgRef.current,
        habit_target_time: updatedTargetValue ? parseInt(updatedTargetValue, 10) : selectedHabit.habit_target_time,
        habit_target_type: updatedSelectedType.toLowerCase() as "hours" | "days",
        habit_progress: selectedHabit.habit_accumulating_time / ( updatedTargetValue ? parseInt(updatedTargetValue, 10) : selectedHabit.habit_target_time ),
      };

      console.log("home screen updatedHabit: ", updatedHabit);
      dispatch(updatedHabit(selectedHabit._id, habitDataUpdating));

      showMessage({ message: "Habit updated successfully!", type: "success" });
      setUpdateModalVisible(false);
      setHabitName("");
      setTargetValue("");
      setSelectedType("");
      setCustomImage("");
    } catch (error: any) {
      console.error("Error updating habit:", error);
      showMessage({
        message: error.message,
        type: 'danger',
      });
    }
  };

  const handleHabitDelete = async () => {
    if (!selectedHabit) return;

    try {
      dispatch(deleteHabit(selectedHabit._id))
      console.log("delete: ", selectedHabit._id);
      showMessage({ message: "Habit deleted successfully!", type: "success" });
      setHabitName("");
      setTargetValue("");
      setSelectedType("");
      setCustomImage("");
      setUpdateModalVisible(false);
    } catch (error) {
      console.error("Error deleting habit:", error);
      showMessage({ message: "Failed to delete habit", type: "danger" });
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity
        onPress={() => {
          console.log("Plus icon clicked");
          setModalVisible(true);
        }}
        style={styles.plusButton}
      >
        {/* <Text style={styles.plusText}>+</Text> */}
        <Icon name="add-circle" size={35} color="#000" />
      </TouchableOpacity>
      <FlatList
        data={habits}
        renderItem={({ item }) => <HabitItem habit={item} />}
        keyExtractor={(item) => item._id}
        numColumns={3}
        key={"3-columns"}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for Adding Habit */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            {/* <Text style={styles.modalTitle}>Add Habit</Text> */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false)
                setHabitName("");
                setTargetValue("");
                setSelectedType("");
                setCustomImage("");
              }}
            >
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>

            {/* Custom Image Upload */}
            {customImage && (
              <Image source={{ uri: customImage }} style={styles.customImage} />
            ) }

            <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
              <Text style={styles.imageUploadText}>
                {customImage ? "Change Image" : "Upload Custom Image"}
              </Text>
            </TouchableOpacity>


            {/* Habit Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Enter habit name"
              value={habitName}
              onChangeText={setHabitName}
            />

            {/* Target Input */}
            <View style={styles.rowContainer}>
              <TextInput
                style={styles.input_picker}
                placeholder="Target time"
                keyboardType="numeric"
                value={targetValue}
                onChangeText={setTargetValue}
              />

              <View style={styles.selectListWrapper}>
                {/* style={styles.selectListWrapper} */}
                <SelectList
                  placeholder="Select type"
                  setSelected={(val: string) => setSelectedType(val)}
                  data={data}
                  save="value"
                  boxStyles={styles.selectListBox}
                  dropdownStyles={styles.dropdownStyles}
                />
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              {/* <TouchableOpacity style={styles.cancelButton} onPress={() => {
                setModalVisible(false)
                setHabitName("");
                setTargetValue("");
                setSelectedType("");
                setCustomImage("");
              }
              }>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  handleHabitsCreate();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Habit Modal */}
      <Modal
        visible={updateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>

            {/* <View style={styles.modalHeader}> */}
            {/* <Text style={styles.modalTitle}>Update Habit</Text> */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setUpdateModalVisible(false);
                setCustomImage("");
              }}
            >
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
            {/* </View> */}

            {selectedHabit && (
              <>
                {customImage ? (
                  <Image source={{ uri: customImage }} style={styles.customImage} />
                ) : (
                  <Image source={{ uri: selectedHabit.habit_img }} style={styles.customImage} />
                )}

                {/* Image Upload Button */}
                <TouchableOpacity style={styles.imageUploadButton} onPress={pickImage}>
                  <Text style={styles.imageUploadText}>
                    Change Image
                  </Text>
                </TouchableOpacity>

                {/* Habit Name Input */}
                <TextInput
                  style={styles.input}
                  placeholder="Enter habit name"
                  value={updatedHabitName}
                  onChangeText={(text) => setUpdatedHabitName(text)}
                />

                {/* Target Input */}
                <View style={styles.rowContainer}>
                  <TextInput
                    style={styles.input_picker}
                    placeholder="Enter target number"
                    keyboardType="numeric"
                    value={updatedTargetValue}
                    onChangeText={(text) => setUpdatedTargetValue(text)} // update targetValue
                  />

                  {/* Target Type Selector */}
                  <View style={styles.selectListWrapper}>
                    <SelectList
                      placeholder="Select type"
                      setSelected={(val: string) => setupdatedSelectedType(val)} // update selected type
                      data={data}
                      save="value"
                      boxStyles={styles.selectListBox}
                      dropdownStyles={styles.dropdownStyles}
                      defaultOption={{
                        key: selectedHabit.habit_target_type,
                        value: selectedHabit.habit_target_type === "days" ? "Days" : "Hours",
                      }}
                    />
                  </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={
                      handleHabitDelete
                    }
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleHabitUpdate}
                  >
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E7E7FF",
    //position: "relative",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  listContainer: {
    paddingVertical: 25,
    paddingHorizontal: 10,
  },
  item: {
    flex: 1,
    maxWidth: "33%",
    alignItems: "center",
    marginVertical: 10,
    padding: 5,
  },
  iconWrapper: {
    backgroundColor: "white",
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  plusButton: {
    width: 40,
    height: 40,
    //backgroundColor: "#E7E7FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    elevation: 3,
    position: "absolute",
    right: 5,
    top: 60,
    zIndex: 1,
  },
  plusText: {
    fontSize: 30,
    color: "black",
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "93.5%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input_picker: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  selectListWrapper: {
    flex: 1,
    height: 50,
  },
  selectListBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    //justifyContent: "center",
  },
  dropdownStyles: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    //marginTop: 5,
    backgroundColor: "white",
    zIndex: 10,
  },
  imageUploadButton: {
    backgroundColor: "#6C63FF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  imageUploadText: {
    color: "white",
    fontWeight: "bold",
  },
  customImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  closeButton: {
    right: -140,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#000",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10
    //justifyContent: "space-between",
    // width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginRight: 5,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#6C63FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HomeScreen;
