import { api_url } from "@/utils/contants";
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";


const AddTextScreen = () => {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_400Regular,
  });

  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  if (!fontsLoaded) return null;

  const saveText = async () => {
    if (!textInput.trim()) {
      Alert.alert("No Text", "Please enter some text first.");
      return;
    }

    setIsProcessing(true);
    setProcessingResult(null);
     const token = await AsyncStorage.getItem('session')
     console.log(token)
    try {
      const response = await fetch(api_url+'/text', {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "Cookie": `token=${token}`
         },
        body: JSON.stringify({ text: textInput }),
      });

      const data = await response.json();

      if (response.ok && data.status === "statusOK") {
        setProcessingResult({ success: true, message: data.message });
        setTextInput("");
      } else {
        setProcessingResult({
          success: false,
          message: data.message || "Failed to save text.",
        });
      }
    } catch (error) {
      setProcessingResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.textHeading}>Add Text</Text>

        {/* Text Input */}
        <View style={styles.boxContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Write something to save..."
            placeholderTextColor="#9A9B9E"
            multiline
            value={textInput}
            onChangeText={setTextInput}
          />
        </View>

        {/* Save Button */}
        {textInput.length > 0 && (
          <View style={styles.boxContainer}>
            {!isProcessing ? (
              <Pressable onPress={saveText}>
                <View style={styles.boxContainerRow}>
                  <View style={styles.boxContainerTextBox}>
                    <Text style={styles.boxMainText}>Save Text</Text>
                    <Text style={styles.boxSecondaryText}>
                      Save this text into your memory collection
                    </Text>
                  </View>
                  <View style={styles.iconBox}>
                    <Ionicons name="save-outline" color={"#4CAF50"} size={22} />
                  </View>
                </View>
              </Pressable>
            ) : (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.processingText}>Saving text...</Text>
              </View>
            )}
          </View>
        )}

        {/* Result */}
        {processingResult && (
          <View style={styles.boxContainer}>
            <View style={styles.resultHeader}>
              <Ionicons
                name={
                  processingResult.success ? "checkmark-circle" : "alert-circle"
                }
                color={processingResult.success ? "#4CAF50" : "#F4817E"}
                size={24}
              />
              <Text
                style={[
                  styles.resultTitle,
                  {
                    color: processingResult.success ? "#4CAF50" : "#F4817E",
                  },
                ]}
              >
                {processingResult.success ? "Saved Successfully" : "Save Failed"}
              </Text>
            </View>
            <Text style={styles.resultMessage}>
              {processingResult.message}
            </Text>
          </View>
        )}

        <View style={{ marginTop: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTextScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
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
  textInput: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: "top",
  },
  boxContainerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  boxContainerTextBox: { gap: 4, flexShrink: 1, marginRight: 25 },
  boxMainText: { color: "white", fontFamily: "Inter_500Medium" },
  boxSecondaryText: {
    color: "#9A9B9E",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  iconBox: { justifyContent: "center", alignItems: "center", marginRight: 10 },
  processingContainer: { alignItems: "center", paddingVertical: 20 },
  processingText: {
    color: "white",
    fontFamily: "Inter_500Medium",
    marginTop: 15,
    fontSize: 16,
  },
  resultHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  resultTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    marginLeft: 10,
  },
  resultMessage: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
});
