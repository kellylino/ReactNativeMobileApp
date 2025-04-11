import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message';
import userAPI from '../APIs/userAPI';
import CustomButton from '../components/CustomButton';
import Header from "../components/Header";
import { RootStackParamList, UserData } from '../types/types';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { base_url } from '../APIs/axiosHelper';

const MeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [customImage, setCustomImage] = useState("");
  const [newUsername, setNewUsername] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const response = await userAPI.getUserById();
        setUserData(response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    })();
  }, []);

  console.log("user: ", userData);
  console.log("newUsername: ", newUsername);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('habits');
      await AsyncStorage.removeItem('events');
      navigation.navigate('Login');
      showMessage({
        message: 'You have been logged out successfully.',
        type: 'success',
      });
    } catch (error) {
      console.log('Error during logout:', error);
      showMessage({
        message: 'Failed to logout. Please try again.',
        type: 'danger',
      });
    }
  };

  const pickImage = async () => {
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

  const handleUpdateProfile = async () => {
    try {

      if (!newUsername && !customImage) {
        setModalVisible(false);
        showMessage({ message: "Nothing is updating", type: "warning" });
        return;
      }

      let uploadedImageUrl = userData?.profile_img;

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
        uploadedImageUrl = uploadResponse.data.imageUrl;
      }

      const updatedUserData = {
        ...userData,
        username: newUsername,
        profile_img: uploadedImageUrl,
      } as UserData;

      await userAPI.updateUser(updatedUserData);
      const response = await userAPI.getUserById();  // Fetch the latest data
      setUserData(response);
      //setUserData(updatedUserData);
      console.log("updated username user data: ", response);
      //showMessage({ message: "Profile updated successfully!", type: "success" });
      setModalVisible(false);
      setNewUsername("")
      setCustomImage("")
    } catch (error) {
      console.error("Error updating profile:", error);
      showMessage({ message: "Failed to update profile.", type: "danger" });
    }
  };

  return (
    <View style={styles.container}>
      <Header />
      {userData && (
        <View style={styles.profileRow}>
          <TouchableOpacity
            style={styles.profileContainer}
            onPress={() => {
              setModalVisible(true);
              setNewUsername(userData.username);
            }}
          >
            <View style={styles.iconWrapper}>
              <Image
                source={{ uri: userData?.profile_img }}
                style={styles.profileImage}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.profileColumn}>
            <Text style={styles.username}>{userData.username}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </View>
        </View>
      )}

      <View style={styles.dataCenterButton}>
        <CustomButton
          title="Data Center"
          color="white"
          textColor="black"
          onPress={() => console.log("Data Center")}
        />
      </View>

      <View style={styles.logoutButton}>
        <CustomButton
          title="Logout"
          color="white"
          textColor="black"
          onPress={handleLogout}
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TouchableOpacity onPress={pickImage}>
              {customImage ? (
                <Image source={{ uri: customImage }} style={styles.modalProfileImage} />
              ) : (
                <Image source={{ uri: userData?.profile_img }} style={styles.modalProfileImage} />
              )}
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newUsername}
              onChangeText={(text) => setNewUsername(text)}
            />
            <View style={styles.modalButtonContainer}>
              <Button title="Cancel" onPress={() => {
                setModalVisible(false)
                setNewUsername("")
                setCustomImage("")
              }} />
              <Button title="Update" onPress={handleUpdateProfile} />
            </View>
          </View>
        </View>
      </Modal>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7E7FF',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  profileColumn: {
    flexDirection: 'column',
    alignItems: 'center',

  },
  profileContainer: {
    flex: 1,
    maxWidth: "50%",
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "#FFFFFF",
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
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  email: {
    fontSize: 16,
    //fontWeight: 'bold',
    //padding: 10,
    color: "#666"
  },
  dataCenterButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 5,
    marginBottom: 20
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#B0B0B0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default MeScreen;