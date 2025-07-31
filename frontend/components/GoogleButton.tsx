import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface GoogleButtonProps {
    googleText: string;
    handleLogin : ()=>void
  }

const GoogleButton: React.FC<GoogleButtonProps>  = ({googleText,handleLogin}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={handleLogin} >
      <Image
        source={{
          uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/2048px-Google_%22G%22_logo.svg.png',
        }}
        style={styles.logo}
      />
      <Text style={styles.buttonText}>{googleText}</Text>
    </TouchableOpacity>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  logo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
