import React, { useContext, useState } from "react";
import { Inter_400Regular, Inter_500Medium, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { Text, View, StyleSheet, Pressable, TextInput, Modal, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "@/context/UserContext";

const defaultProfilePic = "https://picsum.photos/seed/696/3000/2000";

const ProfilePage = () => {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_500Medium,
  });
  const userContext = useContext(UserContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState("");

  const [profileImage, setProfileImage] = useState(defaultProfilePic);

  const nameEmail = userContext?.user?.email;
  const [email, setEmail] = useState(nameEmail);
  const name = userContext?.user?.name;
  const [fullName, setFullName] = useState(name);
  const [userName, setUserName] = useState(name);

  const handleOpenModal = (field: string) => {
    setActiveField(field);
    setModalVisible(true);
  };

  const handleSave = () => {
    setModalVisible(false);
  };

  const pickImage = async () => {
    // Permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission Required", "You need to allow gallery access to choose a photo.");
      return;
    }

    // Open gallery
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // square crop
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "black" },
          headerTitleStyle: {
            color: "white",
            fontFamily: "Inter_500Medium",
            fontSize: 19,
            fontWeight: "500",
          },
          headerTintColor: "white",
          title: "Profile",
          animation: "slide_from_right",
        }}
      />

      <Text style={styles.profileHeading}>Profile</Text>

      <View style={styles.userDetailsContainer}>
        {/* Profile picture row */}
        <Pressable onPress={pickImage}>
          <View style={styles.pictureContainer}>
            <Text style={styles.pictureText}>Profile Picture</Text>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={profileImage}
                contentFit="cover"
                transition={1000}
              />
            </View>
          </View>
        </Pressable>

        <View style={styles.hr} />

        {/* Email */}
        <Pressable onPress={() => handleOpenModal("Email")}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldValue}>{email}</Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.hr} />

        {/* Full Name */}
        <Pressable onPress={() => handleOpenModal("Full Name")}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldValue}>{fullName}</Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.hr} />

        {/* Username */}
        <Pressable onPress={() => handleOpenModal("Username")}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Username</Text>
            <Text style={styles.extraText}>
              Nickname or first name, however you want to be called in Ai-memory
            </Text>
            <View style={styles.fieldBox}>
              <Text style={styles.fieldValue}>{userName}</Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.hr} />
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit {activeField}</Text>
            <TextInput
              style={styles.modalInput}
              value={
                activeField === "Email"
                  ? email
                  : activeField === "Full Name"
                    ? fullName
                    : userName
              }
              onChangeText={(text) => {
                if (activeField === "Email") setEmail(text);
                if (activeField === "Full Name") setFullName(text);
                if (activeField === "Username") setUserName(text);
              }}
              placeholder={`Enter ${activeField}`}
              placeholderTextColor="#777"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtn}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.saveBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <View style={styles.accountDelete}>
        <Text style={styles.textHeading} >Account Delete</Text>
        <View style={styles.boxContainer}>
          <View style={styles.boxContainerRow} >
            <View style={styles.boxContainerTextBox} >
              <Text style={styles.boxMainText} >Delete Account & Data</Text>
              <Text style={styles.boxSecondaryText}>Once deleted, your account and data cannot be recovered.</Text>
            </View>
            <View style={styles.deleteTextBox} >
              <Text style={styles.deleteText}>Delete...</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    paddingHorizontal: 20,
  },
  profileHeading: {
    color: "white",
    fontSize: 24,
    fontFamily: "Inter_500Medium",
    marginVertical: 20,
  },
  userDetailsContainer: {
    borderColor: "#5a5b5e",
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#17181b",
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  pictureContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pictureText: {
    color: "white",
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#303339",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: "#25272E",
    marginVertical: 15,
  },
  fieldContainer: {
    gap: 6,
  },
  fieldLabel: {
    color: "white",
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  fieldBox: {
    borderWidth: 1,
    borderColor: "#303339",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  fieldValue: {
    color: "white",
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  extraText: {
    color: "gray",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#17181b",
    padding: 20,
    borderRadius: 10,
    width: "85%",
  },
  modalTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "Inter_500Medium",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#303339",
    borderRadius: 6,
    color: "white",
    padding: 10,
    marginBottom: 20,
    fontFamily: "Inter_500Medium",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 20,
  },
  cancelBtn: {
    color: "gray",
    fontSize: 15,
  },
  saveBtn: {
    color: "#6D78E7",
    fontSize: 15,
    fontWeight: "bold",
  },
  textHeading: {
    color: "white",
    fontSize: 25,
    fontFamily: "Inter_600SemiBold",
    paddingLeft: 4
  },
  boxContainer: {
    backgroundColor: "#17181B",
    marginHorizontal: 8,
    marginVertical: 20,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 5,
    borderColor: "#25272E",
    borderWidth: 1,
  },
  boxContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  boxContainerTextBox: {
    gap: 4,
    flexShrink: 2,
    marginRight: 25
  },
  boxMainText: {
    color: "white",
    fontFamily: "Inter_500Medium",
  },
  boxSecondaryText: {
    color: '#9A9B9E',
    fontFamily: "Inter_400Regular",
    textAlign: 'left',
    fontSize: 12,
    flexShrink: 1,
    flexWrap: "wrap"
  },
  deleteTextBox: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4

  },
  deleteText: {
    color: "#F4817E"
  },
  accountDelete:{
    marginTop:30
  }
});