import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.3.101:5000/api/v1/fileUpload";

const AddPdfScreen = () => {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_400Regular,
  });

  const [pdfFile, setPdfFile] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<{
    success: boolean;
    message: string;
    documentsProcessed?: number;
  } | null>(null);

  if (!fontsLoaded) return null;

  // 📂 PDF picker
  const pickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPdfFile(result.assets[0]); // sirf ek file lenge
        setProcessingResult(null);
      }
    } catch (err) {
      Alert.alert("Error", "Could not pick PDF file.");
    }
  };

  // 🚀 Process PDF with backend
  const processPdf = async () => {
    if (!pdfFile) {
      Alert.alert("No PDF", "Please select a PDF first.");
      return;
    }

    setIsProcessing(true);
    setProcessingResult(null);

    try {
      const formData = new FormData();
      formData.append("pdfFile", {
        uri: pdfFile.uri,
        name: pdfFile.name,
        type: "application/pdf",
      } as any);
       const token =await AsyncStorage.getItem("session")
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          "Cookie":`token=${token}`
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.status === "statusOK") {
        setProcessingResult({
          success: true,
          documentsProcessed: data.documentsProcessed,
          message: data.message,
        });
        setPdfFile(null);
      } else {
        setProcessingResult({
          success: false,
          message: data.message || "Failed to process PDF.",
        });
      }
    } catch (error) {
      setProcessingResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.textHeading}>Add PDF</Text>

        {/* PDF Input Box */}
        <View style={styles.boxContainer}>
          <Pressable onPress={pickPdf}>
            <View style={styles.boxContainerRow}>
              <View style={styles.boxContainerTextBox}>
                <Text style={styles.boxMainText}>
                  {pdfFile ? "Change PDF" : "Select PDF"}
                </Text>
                <Text style={styles.boxSecondaryText}>
                  {pdfFile ? pdfFile.name : "Pick a PDF file to upload"}
                </Text>
              </View>
              <View style={styles.iconBox}>
                <Ionicons name="document-outline" color={"white"} size={22} />
              </View>
            </View>
          </Pressable>
        </View>

        {/* Process PDF */}
        {pdfFile && (
          <>
            <Text style={styles.textHeading}>Process PDF</Text>
            <View style={styles.boxContainer}>
              {!isProcessing ? (
                <Pressable onPress={processPdf}>
                  <View style={styles.boxContainerRow}>
                    <View style={styles.boxContainerTextBox}>
                      <Text style={styles.boxMainText}>
                        Extract & Save to Memory
                      </Text>
                      <Text style={styles.boxSecondaryText}>
                        Extract text content and save to your memory collection
                      </Text>
                    </View>
                    <View style={styles.iconBox}>
                      <Ionicons
                        name="download-outline"
                        color={"#4CAF50"}
                        size={22}
                      />
                    </View>
                  </View>
                </Pressable>
              ) : (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text style={styles.processingText}>
                    Extracting PDF content...
                  </Text>
                  <Text style={styles.processingSubText}>
                    This may take a few moments
                  </Text>
                </View>
              )}
            </View>
          </>
        )}

        {/* Result */}
        {processingResult && (
          <>
            <Text style={styles.textHeading}>
              {processingResult.success ? "Success" : "Error"}
            </Text>
            <View style={styles.boxContainer}>
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Ionicons
                    name={
                      processingResult.success
                        ? "checkmark-circle"
                        : "alert-circle"
                    }
                    color={processingResult.success ? "#4CAF50" : "#F4817E"}
                    size={24}
                  />
                  <Text
                    style={[
                      styles.resultTitle,
                      {
                        color: processingResult.success
                          ? "#4CAF50"
                          : "#F4817E",
                      },
                    ]}
                  >
                    {processingResult.success
                      ? "PDF Processed Successfully"
                      : "Processing Failed"}
                  </Text>
                </View>

                <Text style={styles.resultMessage}>
                  {processingResult.message}
                </Text>

                {processingResult.success &&
                  processingResult.documentsProcessed && (
                    <Text style={styles.resultStats}>
                      Documents processed: {processingResult.documentsProcessed}
                    </Text>
                  )}
              </View>
            </View>
          </>
        )}

        {/* Empty state */}
        {!pdfFile && !processingResult && (
          <>
            <Text style={styles.textHeading}>Getting Started</Text>
            <View style={styles.boxContainer}>
              <View style={styles.emptyStateContainer}>
                <Ionicons name="document-outline" color={"#9A9B9E"} size={48} />
                <Text style={styles.emptyStateTitle}>No PDF selected</Text>
                <Text style={styles.emptyStateDescription}>
                  Select a PDF to extract and save its content to your memory
                  collection. Works great for research papers, reports, and more.
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

export default AddPdfScreen;

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
    flex: 1,
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
  boxContainerTextBox: { gap: 4, flexShrink: 1, marginRight: 25 },
  boxMainText: { color: "white", fontFamily: "Inter_500Medium" },
  boxSecondaryText: {
    color: "#9A9B9E",
    fontFamily: "Inter_400Regular",
    textAlign: "left",
    fontSize: 12,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  iconBox: { justifyContent: "center", alignItems: "center", marginRight: 10 },
  processingContainer: { alignItems: "center", paddingVertical: 20 },
  processingText: {
    color: "white",
    fontFamily: "Inter_500Medium",
    marginTop: 15,
    fontSize: 16,
  },
  processingSubText: {
    color: "#9A9B9E",
    fontFamily: "Inter_400Regular",
    marginTop: 5,
    fontSize: 12,
  },
  resultContainer: { paddingVertical: 10 },
  resultHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  resultTitle: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    marginLeft: 10,
    flexShrink: 1,
  },
  resultMessage: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  resultStats: {
    color: "#4CAF50",
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    marginBottom: 8,
  },
  emptyStateContainer: { alignItems: "center", paddingVertical: 30 },
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
