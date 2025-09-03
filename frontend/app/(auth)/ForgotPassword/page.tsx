import { useState } from "react";
import { 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, 
  Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard 
} from "react-native";
import { useRouter } from "expo-router";
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

const ForgotPasswordPage = () => {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_700Bold });
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateEmail = () => {
    if (!email) {
      setError("Email is required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateEmail()) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
      if (res.data?.status === "statusOk") {
        Alert.alert("Success", res.data?.message ?? "Password reset password sent.");
        router.replace("/(auth)/Signin/page");
      } else {
        setError(res.data?.message ?? "Something went wrong.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Network error or server issue.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!fontsLoaded) return null;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "android" ? "padding" : "height"} 
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.welcome}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email and we’ll send you a reset password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8e8e93"
            keyboardType="email-address"
            autoCapitalize="none"
            selectionColor="#4a80f0"
            value={email}
            onChangeText={setEmail}
            returnKeyType="done"
          />

          {/* Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Reset Button */}
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleForgotPassword} 
            disabled={loading}
          >
            {loading 
              ? <ActivityIndicator color="#fff" /> 
              : <Text style={styles.resetButtonText}>SEND RESET PASSWORD</Text>}
          </TouchableOpacity>

          {/* Back to Signin */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember password? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/Signin/page")}>
              <Text style={styles.signLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  welcome: {
    fontSize: 24,
    color: "white",
    fontFamily: "Inter_700Bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 30,
    fontFamily: "Inter_400Regular",
  },
  input: {
    height: 50,
    backgroundColor: "#1E1F22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "white",
    fontFamily: "Inter_500Medium",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 10,
  },
  resetButton: {
    height: 50,
    backgroundColor: "#6D78E7",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  resetButtonText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Inter_500Medium",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#8e8e93",
    fontFamily: "Inter_500Medium",
  },
  signLink: {
    fontSize: 14,
    color: "#6D78E7",
    fontWeight: "bold",
    fontFamily: "Inter_500Medium",
  },
});

export default ForgotPasswordPage;