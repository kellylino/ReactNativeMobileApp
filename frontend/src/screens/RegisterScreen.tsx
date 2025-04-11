import { Image, View, StyleSheet, StatusBar } from 'react-native';
import CustomButton from '../components/CustomButton';
import AccountLinkText from '../components/AccountLinkText';
import AccountInputField from '../components/AccountInputField';
import { useState } from 'react';
import userAPI from '../APIs/userAPI';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { showMessage } from 'react-native-flash-message';
import validator from 'validator';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  console.log(password)

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const validateInputs = () => {
    if (!validator.isEmail(email)) {
      showMessage({
        message: 'Invalid email format',
        type: 'danger',
      });
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      showMessage({
        message: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.',
        type: 'danger',
      });
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    console.log("register");
    try {
      const newUser = { username, email, password };
      const response = await userAPI.createUser(newUser);
      console.log('User created successfully:', response);

      navigation.navigate('Login');
    } catch (error: any) {
      console.log('register screen error:', error);

      showMessage({
        message: error.message,
        type: 'danger',
      });
    }
  };


  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.wrapper}>
        <Image
          source={require('../../assets/images/register-login.png')}
          style={styles.backgroundImage}
        />
        <View style={styles.inputContainer}>
          <AccountInputField
            label="Username"
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <AccountInputField
            label="Email"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <AccountInputField
            label="Password"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>
        <CustomButton
          title="Sign Up"
          //color="#723480"
          onPress={handleSignUp}
        />
        <AccountLinkText
          promptText="Already have an account?"
          linkText="Sign in"
          navigateTo="Login"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    flex: 1,
  },
  backgroundImage: {
    width: '80%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
});

export default RegisterScreen;