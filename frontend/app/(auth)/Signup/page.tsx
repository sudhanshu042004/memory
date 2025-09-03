import GoogleButton from '@/components/GoogleButton';
import { Inter_400Regular, Inter_500Medium, Inter_700Bold, useFonts } from '@expo-google-fonts/inter';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text,
  TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

const SignupPage = () => {
  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_700Bold, Inter_500Medium });
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateForm = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
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
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/auth/signup`, { email, password, name });
      if (res.data?.status === "success") {
        const jwt: string | undefined = res.data?.cookie;
        if (jwt) await AsyncStorage.setItem('session', jwt);

        Alert.alert("Success", res.data?.message ?? "Account created.");
        setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
        router.replace("/(dashboard)/(tabs)/Home/page");
      } else {
        setError(res.data?.message ?? "Signup failed.");
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

  if (!fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6D78E7" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior={Platform.OS === 'android' ? 'padding' : 'height'} style={styles.container}>
        <View style={styles.innerContainer}>

          {/* Header */}
          <Text style={styles.welcome}>Create Account For AI-Memory</Text>
          <Text style={styles.subtitle}>Sign up to start your journey</Text>

          {/* Inputs */}
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#8e8e93"
            selectionColor="#4a80f0"
            value={name}
            onChangeText={setName}
            onSubmitEditing={() => emailRef.current?.focus()}
            returnKeyType="next"
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#8e8e93"
            keyboardType="email-address"
            autoCapitalize="none"
            selectionColor="#4a80f0"
            value={email}
            onChangeText={setEmail}
            ref={emailRef}
            onSubmitEditing={() => passwordRef.current?.focus()}
            returnKeyType="next"
          />

          {/* Password */}
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
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#8e8e93" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#8e8e93"
              secureTextEntry={!showConfirmPassword}
              selectionColor="#4a80f0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              ref={confirmPasswordRef}
              returnKeyType="go"
              onSubmitEditing={handleSignup}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#8e8e93" />
            </TouchableOpacity>
          </View>

          {/* Error */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Signup Button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupButtonText}>SIGN UP</Text>}
          </TouchableOpacity>

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Signup */}
          <GoogleButton googleText="Sign up with Google" handleLogin={() => console.log("Google signup")} />

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
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
    backgroundColor: "#121212"
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212"
  },

  welcome: {
    fontSize: 22,
    color: "white",
    fontFamily: "Inter_700Bold",
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    color: "#aaa",
    marginBottom: 30,
    fontFamily: "Inter_400Regular"
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
  eyeIcon: { paddingHorizontal: 12 },

  errorText: {
    color: "red",
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    marginBottom: 10
  },

  signupButton: {
    height: 50,
    backgroundColor: "#6D78E7",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  signupButtonText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Inter_500Medium"
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#333333"
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
    marginTop: 10
  },
  footerText: {
    fontSize: 14,
    color: "#8e8e93",
    fontFamily: "Inter_500Medium"
  },
  signLink: {
    fontSize: 14,
    color: "#6D78E7",
    fontWeight: "bold",
    fontFamily: "Inter_500Medium"
  },
});

export default SignupPage;