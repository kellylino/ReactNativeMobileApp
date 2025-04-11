import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Modal } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from "@expo/vector-icons";

interface HabitModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  imageUri: string;
  onPickImage: () => void;
  habitName: string;
  onHabitNameChange: (text: string) => void;
  targetValue: string;
  onTargetValueChange: (text: string) => void;
  selectedType: string;
  onSelectedTypeChange: (val: string) => void;
  onSave: () => void;
  onDelete?: () => void;
  isUpdate?: boolean;
}

const HabitModal: React.FC<HabitModalProps> = ({
  visible,
  onClose,
  title,
  imageUri,
  onPickImage,
  habitName,
  onHabitNameChange,
  targetValue,
  onTargetValueChange,
  selectedType,
  onSelectedTypeChange,
  onSave,
  onDelete,
  isUpdate = false,
}) => {
  const data = [
    { key: "1", value: "Days" },
    { key: "2", value: "Hours" },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {imageUri && <Image source={{ uri: imageUri }} style={styles.customImage} />}

          <TouchableOpacity style={styles.imageUploadButton} onPress={onPickImage}>
            <Text style={styles.imageUploadText}>
              {imageUri ? "Change Image" : "Upload Custom Image"}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Enter habit name"
            value={habitName}
            onChangeText={onHabitNameChange}
          />

          <View style={styles.rowContainer}>
            <TextInput
              style={styles.input_picker}
              placeholder="Enter target number"
              keyboardType="numeric"
              value={targetValue}
              onChangeText={onTargetValueChange}
            />

            <View style={styles.selectListWrapper}>
              <SelectList
                placeholder="Select type"
                setSelected={(val: string) => onSelectedTypeChange(val)}
                data={data}
                save="value"
                boxStyles={styles.selectListBox}
                dropdownStyles={styles.dropdownStyles}
                defaultOption={
                    selectedType
                      ? {
                          key: selectedType,
                          value: selectedType === "days" ? "Days" : "Hours",
                        }
                      : undefined // 如果 selectedType 为空，则不设置默认选项
                  }
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {isUpdate && (
              <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.buttonText}>{isUpdate ? "Update" : "Save"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  customImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginVertical: 10,
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
  input: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  input_picker: {
    flex: 1,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  selectListWrapper: {
    flex: 1,
    height: 55,
  },
  selectListBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    height: 55,
    alignItems: "center",
  },
  dropdownStyles: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
    zIndex: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#6C63FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HabitModal;