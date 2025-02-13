import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'react-native-md5';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const storedHash = await AsyncStorage.getItem('userHash');
    if (storedHash) {
      navigation.replace('Home');
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async () => {
    if (!email || !validateEmail(email)) {
      setIsEmailValid(false);
      return;
    }

    const emailHash = md5.hex_md5(email);
    await AsyncStorage.setItem('userHash', emailHash);
    Alert.alert('Login successful!');
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Image source={require('./assets/login.jpg')} style={styles.image} />
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Sign in to access your account</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, !isEmailValid && styles.invalidInput]}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setIsEmailValid(true);
          }}
          keyboardType="email-address"
        />
        {!isEmailValid && <Text style={styles.errorText}>Invalid email address</Text>}
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userHash');
    Alert.alert('Logged out successfully.');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.welcome}>Welcome Back</Text>
        <Text style={styles.description}>
          You have successfully logged in to your account.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 100,
    marginBottom: 20,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    width: '100%',
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'left',
  },
  button: {
    backgroundColor: '#16C47F',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});