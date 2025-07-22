import GoogleButton from '@/components/GoogleButton';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

const SigninPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = () => {
    // Your login logic here
  };

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
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#8e8e93"
          secureTextEntry
          selectionColor="#4a80f0"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.signinButton} onPress={handleLogin}>
          <Text style={styles.signinButtonText}>SIGN IN</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <GoogleButton googleText="Sign in  with Google"/>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Do not have an account? </Text>
          
         
          <Link href="/(auth)/Signup/page" replace asChild>
            <TouchableOpacity>
              <Text style={styles.signLink}>SignUp</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#333333',
  },
  signinButton: {
    backgroundColor: '#4a80f0',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  signinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:10
  },
  footerText: {
    color: '#8e8e93',
    fontSize: 14,
  },
  signLink: {
    color: '#4a80f0',
    fontSize: 14,
    fontWeight: 'bold',
  },
});


export default SigninPage;