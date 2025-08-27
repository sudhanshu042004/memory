import GoogleButton from '@/components/GoogleButton';
import { useAuth } from "@/context/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE

const SigninPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { signIn } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const checkLogin = async () => {
  //     const user = await AsyncStorage.getItem("session");
  //     if (user) {
  //       setIsLoggedIn(true);
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   };
  //   checkLogin();
  // }, []);

  // if (isLoggedIn === null) return null;

  // if (isLoggedIn) {
  //   return <Redirect href="/Home/page" />;
  // }


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing", "Email and password are required.");
      return;
    }
    if (password.length < 8 || password.length > 16) {
      Alert.alert("Password", "Password must be 8–16 characters.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
      console.log(res.data)
      if (res.data?.status === "statusOk") {
        const jwt: string | undefined = res.data?.cookie;
        //if (jwt) await AsyncStorage.setItem('session', jwt);
        console.log(jwt)
        if (jwt){
          await AsyncStorage.setItem('session', jwt);
         
       }

        Alert.alert("Success", res.data?.message ?? "Logged in.");
        router.replace("/(dashboard)/(tabs)/Home/page");
      } else {
        Alert.alert("Failed", res.data?.message ?? "Login failed.");
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
  const passwordRef = useRef<TextInput>(null)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'android' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8e8e93"
          keyboardType="email-address"
          autoCapitalize="none"
          selectionColor="#4a80f0"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={()=>{
            passwordRef.current?.focus()
          }}
          submitBehavior="submit"
          returnKeyType='next'
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8e8e93"
          secureTextEntry
          selectionColor="#4a80f0"
          value={password}
          onChangeText={setPassword}
          ref={passwordRef}
          returnKeyType='go'
        />

        <TouchableOpacity style={styles.signinButton} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signinButtonText}>SIGN IN</Text>}
        </TouchableOpacity>

        <TouchableOpacity>
          <GoogleButton googleText="Sign in  with Google" handleLogin={signIn} />
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Do not have an account? </Text>
          
            <TouchableOpacity onPress={()=>router.push("/(auth)/Signup/page")} >
              <Text style={styles.signLink}>SignUp</Text>
            </TouchableOpacity>
         
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  innerContainer: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  input: {
    height: 50, backgroundColor: '#1e1e1e', borderRadius: 8, paddingHorizontal: 16,
    marginBottom: 16, fontSize: 16, color: '#ffffff', borderWidth: 1, borderColor: '#333333',
  },
  signinButton: {
    backgroundColor: '#4a80f0', height: 50, borderRadius: 8, justifyContent: 'center',
    alignItems: 'center', marginTop: 10, marginBottom: 24,
  },
  signinButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  footerText: { color: '#8e8e93', fontSize: 14 },
  signLink: { color: '#4a80f0', fontSize: 14, fontWeight: 'bold' },
});

export default SigninPage;