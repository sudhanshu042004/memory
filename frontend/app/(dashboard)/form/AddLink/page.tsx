import { api_url } from "@/utils/contants";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, useFonts } from "@expo-google-fonts/inter";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const AddUrlScreen = () => {
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_400Regular,
  });

  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProcessedUrl, setLastProcessedUrl] = useState("");
  const [processingResult, setProcessingResult] = useState<{
    success: boolean;
    documentsProcessed?: number;
    message: string;
  } | null>(null);

  const validateUrl = (inputUrl: string): boolean => {
    try {
      const urlPattern = /^https?:\/\/.+/;
      return urlPattern.test(inputUrl.trim());
    } catch {
      return false;
    }
  };

  const extractWebContent = async () => {
    if (!url.trim()) {
      Alert.alert("URL Required", "Please enter a valid URL.");
      return;
    }

    if (!validateUrl(url)) {
      Alert.alert("Invalid URL", "Please enter a valid URL starting with http:// or https://");
      return;
    }

    setIsProcessing(true);
    setProcessingResult(null);

    try {
      const token=await AsyncStorage.getItem("session")
      const response = await fetch(api_url+'/webExtract', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie":`token=${token}`
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === "statusOk") {
        setProcessingResult({
          success: true,
          documentsProcessed: data.documentsProcessed,
          message: data.message
        });
        setLastProcessedUrl(url);
        setUrl("");
      } else {
        setProcessingResult({
          success: false,
          message: data.message || "Failed to extract web content."
        });
      }
    } catch (error) {
      setProcessingResult({
        success: false,
        message: "Network error. Please check your connection and try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const openUrl = async (urlToOpen: string) => {
    const supported = await Linking.canOpenURL(urlToOpen);
    if (supported) {
      await Linking.openURL(urlToOpen);
    }
  };

  const clearInput = () => {
    setUrl("");
    setProcessingResult(null);
  };

  const pasteFromClipboard = async () => {
    // Note: You'll need to install @react-native-clipboard/clipboard for this feature
    // For now, this is a placeholder
    Alert.alert("Feature Coming Soon", "Clipboard paste functionality will be available soon.");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.textHeading}>Enter URL</Text>
        <View style={styles.boxContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.urlInput}
              placeholder="https://example.com"
              placeholderTextColor="#9A9B9E"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              multiline
            />
          </View>
          
          {url.length > 0 && (
            <>
              <View style={styles.hr} />
              <Pressable onPress={()=>console.log("hello")}>
                <View style={styles.boxContainerRow}>
                  <View style={styles.boxContainerTextBox}>
                    <Text style={styles.boxMainText}>Clear URL</Text>
                    <Text style={styles.boxSecondaryText}>
                      Remove the entered URL
                    </Text>
                  </View>
                  <View style={styles.iconBox}>
                    <Ionicons name="close-circle-outline" color={"#F4817E"} size={22} />
                  </View>
                </View>
              </Pressable>
            </>
          )}

          <View style={styles.hr} />
          <Pressable onPress={pasteFromClipboard}>
            <View style={styles.boxContainerRow}>
              <View style={styles.boxContainerTextBox}>
                <Text style={styles.boxMainText}>Paste from Clipboard</Text>
                <Text style={styles.boxSecondaryText}>
                  Paste URL from your clipboard
                </Text>
              </View>
              <View style={styles.iconBox}>
                <Ionicons name="clipboard-outline" color={"white"} size={22} />
              </View>
            </View>
          </Pressable>
        </View>

        {url.length > 0 && validateUrl(url) && (
          <>
            <Text style={styles.textHeading}>Preview</Text>
            <View style={styles.boxContainer}>
              <Pressable onPress={() => openUrl(url)}>
                <View style={styles.boxContainerRow}>
                  <View style={styles.boxContainerTextBox}>
                    <Text style={styles.boxMainText}>Open in Browser</Text>
                    <Text style={styles.urlPreviewText} numberOfLines={2}>
                      {url}
                    </Text>
                  </View>
                  <View style={styles.iconBox}>
                    <Ionicons name="open-outline" color={"#4CAF50"} size={22} />
                  </View>
                </View>
              </Pressable>
            </View>
          </>
        )}

        {url.length > 0 && validateUrl(url) && (
          <>
            <Text style={styles.textHeading}>Extract Content</Text>
            <View style={styles.boxContainer}>
              {!isProcessing ? (
                <Pressable onPress={extractWebContent}>
                  <View style={styles.boxContainerRow}>
                    <View style={styles.boxContainerTextBox}>
                      <Text style={styles.boxMainText}>Extract & Save to Memory</Text>
                      <Text style={styles.boxSecondaryText}>
                        Extract text content and save to your memory collection
                      </Text>
                    </View>
                    <View style={styles.iconBox}>
                      <Ionicons name="download-outline" color={"#4CAF50"} size={22} />
                    </View>
                  </View>
                </Pressable>
              ) : (
                <View style={styles.processingContainer}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text style={styles.processingText}>Extracting content...</Text>
                  <Text style={styles.processingSubText}>This may take a few moments</Text>
                </View>
              )}
            </View>
          </>
        )}

        {processingResult && (
          <>
            <Text style={styles.textHeading}>
              {processingResult.success ? "Success" : "Error"}
            </Text>
            <View style={styles.boxContainer}>
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <Ionicons 
                    name={processingResult.success ? "checkmark-circle" : "alert-circle"} 
                    color={processingResult.success ? "#4CAF50" : "#F4817E"} 
                    size={24} 
                  />
                  <Text style={[
                    styles.resultTitle,
                    { color: processingResult.success ? "#4CAF50" : "#F4817E" }
                  ]}>
                    {processingResult.success ? "Content Extracted Successfully" : "Extraction Failed"}
                  </Text>
                </View>
                
                <Text style={styles.resultMessage}>
                  {processingResult.message}
                </Text>
                
                {processingResult.success && processingResult.documentsProcessed && (
                  <Text style={styles.resultStats}>
                    Documents processed: {processingResult.documentsProcessed}
                  </Text>
                )}

                {lastProcessedUrl && processingResult.success && (
                  <Text style={styles.lastProcessedUrl} numberOfLines={2}>
                    From: {lastProcessedUrl}
                  </Text>
                )}
              </View>
            </View>
          </>
        )}

        {url.length === 0 && !processingResult && (
          <>
            <Text style={styles.textHeading}>Getting Started</Text>
            <View style={styles.boxContainer}>
              <View style={styles.emptyStateContainer}>
                <Ionicons name="link-outline" color={"#9A9B9E"} size={48} />
                <Text style={styles.emptyStateTitle}>No URL entered</Text>
                <Text style={styles.emptyStateDescription}>
                  Enter a URL to extract and save its content to your memory collection. 
                  This works great for articles, blog posts, documentation, and more.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Invalid URL Warning */}
        {url.length > 0 && !validateUrl(url) && (
          <>
            <Text style={styles.textHeading}>Invalid URL</Text>
            <View style={styles.boxContainer}>
              <View style={styles.warningContainer}>
                <Ionicons name="warning-outline" color={"#F4817E"} size={24} />
                <Text style={styles.warningText}>
                  Please enter a valid URL starting with http:// or https://
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

export default AddUrlScreen;

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
    flex:1,
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
  inputContainer: {
    paddingVertical: 5,
  },
  urlInput: {
    color: "white",
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#25272E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3C44",
    minHeight: 50,
    textAlignVertical: "top",
  },
  urlPreviewText: {
    color: "#4CAF50",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    flexShrink: 1,
  },
  processingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
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
  resultContainer: {
    paddingVertical: 10,
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
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
  lastProcessedUrl: {
    color: "#9A9B9E",
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    fontStyle: "italic",
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
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  warningText: {
    color: "#F4817E",
    fontFamily: "Inter_500Medium",
    marginLeft: 15,
    flexShrink: 1,
    fontSize: 14,
  },
});