import GoogleButton from '@/components/GoogleButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE;

const SignupPage = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     const user = await AsyncStorage.getItem("session");
  //     setIsLoggedIn(!!user);
  //   };
  //   checkLogin();
  // }, []);

  // if (isLoggedIn === null) return null;
  // if (isLoggedIn) {
  //   return <Redirect href="/Home/page" />
  // }

  const handleSignup = async () => {
    if (!email || !password || !name) {
      Alert.alert("Missing", "Name, email and password are required.");
      return;
    }
    if (password.length < 8 || password.length > 16) {
      Alert.alert("Password", "Password must be 8–16 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/auth/signup`, { email, password, name });

      if (res.data?.status === "success") {
        const jwt: string | undefined = res.data?.cookie;
        if (jwt) {
          await AsyncStorage.setItem('session', jwt);
        }

        Alert.alert("Success", res.data?.message ?? "Account created.");
        setName(""); setEmail(""); setPassword("");
        router.replace("/Home/page");
      } else {
        Alert.alert("Failed", res.data?.message ?? "Signup failed.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ??
        (err?.message?.includes('Network') ? 'Network error' : err?.message) ??
        "something went wrong!!!";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };
  const emailRef = useRef<TextInput>(null)
  const passwordRef = useRef<TextInput>(null)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Create Account</Text>

        <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#8e8e93"
          selectionColor="#4a80f0" value={name} onChangeText={setName}
          onSubmitEditing={() => {
            emailRef.current?.focus()
          }}
          submitBehavior='submit'
          returnKeyType='next' />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#8e8e93"
          keyboardType="email-address" autoCapitalize="none" selectionColor="#4a80f0" value={email}
          onChangeText={setEmail}
          ref={emailRef}
          onSubmitEditing={() => {
            passwordRef.current?.focus()
          }}
          submitBehavior='submit'
          returnKeyType='next' />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#8e8e93"
          secureTextEntry selectionColor="#4a80f0" value={password}
          onChangeText={setPassword}
          ref={passwordRef} submitBehavior='submit' returnKeyType='go' />

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signupButtonText}>SIGN UP</Text>}
        </TouchableOpacity>

        <TouchableOpacity>
          <GoogleButton googleText="Signup with Google" handleLogin={() => console.log("hello")} />
        </TouchableOpacity>

        <View className="mt-2" style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>

          <TouchableOpacity onPress={()=>router.dismissAll()} ><Text style={styles.loginLink}>Login</Text></TouchableOpacity>

        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  innerContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 40, textAlign: 'center' },
  input: { height: 50, backgroundColor: '#1e1e1e', borderRadius: 8, paddingHorizontal: 16, marginBottom: 16, fontSize: 16, color: '#ffffff', borderWidth: 1, borderColor: '#333333' },
  signupButton: { backgroundColor: '#4a80f0', height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10, marginBottom: 24 },
  signupButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  footerText: { color: '#8e8e93', fontSize: 14 },
  loginLink: { color: '#4a80f0', fontSize: 14, fontWeight: 'bold' },
});

export default SignupPage;
