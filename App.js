import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import md5 from 'react-native-md5';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'; // Import Roboto
import WaypointLogo from './assets/waypointlogo.svg';
import EmailIcon from './assets/email.svg';

const Stack = createStackNavigator();

const CustomTextInput = ({ label, value, onChangeText, isValid }) => {
  return (
    <View style={[styles.inputContainer, !isValid && styles.invalidInput]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType="email-address"
      />
      <EmailIcon width={20} height={20} style={styles.icon} />
    </View>
  );
};

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);
  let [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

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

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <WaypointLogo width={200} height={200} />
        <Text style={styles.title}>Member Login</Text>
      </View>
      <View style={styles.centerWrapper}>
        <CustomTextInput
          label="Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setIsEmailValid(true);
          }}
          isValid={isEmailValid}
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
        <Text style={styles.description}>You have successfully logged in to your account.</Text>
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
    backgroundColor: '#fff',
    padding: 20,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Roboto_700Bold',
    color: '#000',
  },
  centerWrapper: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    borderWidth: 1,
    borderColor: '#004ACB',
    borderRadius: 5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: 'Roboto_400Regular',
    borderWidth: 0,
  },
  icon: {
    width: 24,
    height: 24,
    position: 'absolute',
    right: 10,
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: 'white',
    paddingHorizontal: 5,
    fontSize: 14,
    color: '#004ACB',
    fontFamily: 'Roboto_700Bold',
  },
  invalidInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'left',
    fontSize: 12,
    fontFamily: 'Roboto_400Regular',
  },
  button: {
    backgroundColor: '#004ACB',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Roboto_700Bold',
  },
  welcome: {
    fontSize: 24,
    fontFamily: 'Roboto_700Bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    fontFamily: 'Roboto_400Regular',
  },
});
