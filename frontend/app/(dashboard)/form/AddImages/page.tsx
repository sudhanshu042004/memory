import { api_url } from "@/utils/contants";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";


const AddImageScreen = () => {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_400Regular,
  });

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "You need to allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", {
      uri: selectedImage,
      name: `upload-${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    try {
      const token=await AsyncStorage.getItem('session')
      const response = await fetch(api_url+'/imagePost', {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "Cookie":`token=${token}`
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", data.message || "Image uploaded successfully!");
        setSelectedImage(null);
      } else {
        Alert.alert("Error", data.message || "Failed to upload image.");
      }
    } catch (error) {
      Alert.alert("Upload Error", "Something went wrong while uploading.");
    } finally {
      setUploading(false);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    console.log("nullified")
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.textHeading}>Select Image</Text>
        <View style={styles.boxContainer}>

          <Pressable onPress={pickImage}>
            <View style={styles.boxContainerRow}>
              <View style={styles.boxContainerTextBox}>
                <Text style={styles.boxMainText}>Choose from Gallery</Text>
                <Text style={styles.boxSecondaryText}>
                  Select an image from your photo library
                </Text>
              </View>
              <View style={styles.iconBox}>
                <Ionicons name="image-outline" color={"white"} size={22} />
              </View>
            </View>
          </Pressable>


          {selectedImage && (
            <>
              <View style={styles.hr} />
              <Pressable onPress={clearSelectedImage}>
                <View style={styles.boxContainerRow}>
                  <View style={styles.boxContainerTextBox}>
                    <Text style={styles.boxMainText}>Clear Selection</Text>
                    <Text style={styles.boxSecondaryText}>
                      Remove the selected image
                    </Text>
                  </View>
                  <View style={styles.iconBox}>
                    <Ionicons name="close-circle-outline" color={"#F4817E"} size={22} />
                  </View>
                </View>
              </Pressable>
            </>
          )}
        </View>

        {selectedImage && (
          <>
            <Text style={styles.textHeading}>Preview</Text>
            <View style={styles.boxContainer}>
              <View style={styles.previewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              </View>
            </View>
          </>
        )}

        {selectedImage && (
          <>
            <Text style={styles.textHeading}>Upload</Text>
            <View style={styles.boxContainer}>
              {!uploading ? (
                <Pressable onPress={uploadImage}>
                  <View style={styles.boxContainerRow}>
                    <View style={styles.boxContainerTextBox}>
                      <Text style={styles.boxMainText}>Upload to Memory</Text>
                      <Text style={styles.boxSecondaryText}>
                        Save this image to your memory collection
                      </Text>
                    </View>
                    <View style={styles.iconBox}>
                      <Ionicons name="cloud-upload-outline" color={"#4CAF50"} size={22} />
                    </View>
                  </View>
                </Pressable>
              ) : (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text style={styles.uploadingText}>Uploading your image...</Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Empty State */}
        {!selectedImage && (
          <>
            <Text style={styles.textHeading}>Getting Started</Text>
            <View style={styles.boxContainer}>
              <View style={styles.emptyStateContainer}>
                <Ionicons name="image-outline" color={"#9A9B9E"} size={48} />
                <Text style={styles.emptyStateTitle}>No image selected</Text>
                <Text style={styles.emptyStateDescription}>
                  Choose an image from your gallery to create a new memory
                </Text>
              </View>
            </View>
          </>
        )}

        <View style={{ marginTop: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddImageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  textHeading: {
    color: "white",
    fontSize: 25,
    fontFamily: "Inter_600SemiBold",
    paddingLeft: 20,
    marginTop: 20,
  },
  boxContainer: {
    backgroundColor: "#17181B",
    marginHorizontal: 20,
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
    alignItems: "center",
  },
  boxContainerTextBox: {
    gap: 4,
    flexShrink: 1,
    marginRight: 25,
  },
  boxMainText: {
    color: "white",
    fontFamily: "Inter_500Medium",
  },
  boxSecondaryText: {
    color: "#9A9B9E",
    fontFamily: "Inter_400Regular",
    textAlign: "left",
    fontSize: 12,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  iconBox: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  hr: {
    borderBottomWidth: 1.5,
    marginVertical: 10,
    borderBottomColor: "#25272E",
    marginTop: 15,
    marginBottom: 10,
  },
  previewContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  previewImage: {
    width: 280,
    height: 280,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#25272E",
  },
  uploadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  uploadingText: {
    color: "#9A9B9E",
    fontFamily: "Inter_500Medium",
    marginLeft: 15,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  emptyStateTitle: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    marginTop: 15,
    marginBottom: 8,
  },
  emptyStateDescription: {
    color: "#9A9B9E",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});