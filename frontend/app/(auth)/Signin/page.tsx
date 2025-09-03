import GoogleButton from '@/components/GoogleButton';
import { useAuth } from "@/context/auth";
import { Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { 
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, 
  TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

const SigninPage = () => {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold, Inter_500Medium });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  const validateForm = () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    if (password.length < 8 || password.length > 16) {
      setError("Password must be 8–16 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      if (res.data?.status === "statusOk") {
        const jwt: string | undefined = res.data?.cookie;
        console.log(jwt)
        if (jwt) await AsyncStorage.setItem('session', jwt);
        Alert.alert("Success", res.data?.message ?? "Logged in.");
        router.replace("/(dashboard)/(tabs)/Home/page");
      } else {
        setError(res.data?.message ?? "Login failed.");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 
                  (err?.message?.includes('Network') ? 'Network error' : err?.message) ??
                  "Something went wrong!";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.innerContainer}>
        
          <Text style={styles.welcome}>Welcome Back AI-Memory</Text>
          <Text style={styles.subtitle}>Sign in to continue to your account</Text>

          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8e8e93"
            keyboardType="email-address"
            autoCapitalize="none"
            selectionColor="#4a80f0"
            value={email}
            onChangeText={setEmail}
            onSubmitEditing={() => passwordRef.current?.focus()}
            returnKeyType='next'
          />

          
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#8e8e93"
              secureTextEntry={!showPassword}
              selectionColor="#4a80f0"
              value={password}
              onChangeText={setPassword}
              ref={passwordRef}
              returnKeyType='go'
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#8e8e93" />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Signin Button */}
          <TouchableOpacity style={styles.signinButton} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signinButtonText}>SIGN IN</Text>}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity onPress={() => router.push("/(auth)/ForgotPassword/page")}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Button */}
          <GoogleButton googleText="Sign in with Google" handleLogin={signIn} />

          {/* Footer Signup */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/Signup/page")}>
              <Text style={styles.signLink}>Sign Up</Text>
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
  passwordBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1F22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 16,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "white",
    fontFamily: "Inter_500Medium",
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 10,
  },
  signinButton: {
    height: 50,
    backgroundColor: "#6D78E7",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  signinButtonText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Inter_500Medium",
    textAlign: "center", 
    width: "100%",
  },
  forgotText: {
    color: "#6D78E7",
    textAlign: "right",
    fontFamily: "Inter_500Medium",
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#333333",
  },
  dividerText: {
    color: "#8e8e93",
    marginHorizontal: 10,
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    minWidth: 30, 
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    flexWrap: "wrap", 
  },
  footerText: {
    fontSize: 14,
    color: "#8e8e93",
    fontFamily: "Inter_500Medium",
    flexWrap: "wrap", 
  },
  signLink: {
    fontSize: 14,
    color: "#6D78E7",
    fontWeight: "bold",
    fontFamily: "Inter_500Medium",
  },
  
});

export default SigninPage;