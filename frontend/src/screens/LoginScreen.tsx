import { Image, View, StyleSheet, StatusBar, AppStateStatus, AppState } from 'react-native';
import CustomButton from '../components/CustomButton';
import AccountLinkText from '../components/AccountLinkText';
import AccountInputField from '../components/AccountInputField';
import { useEffect, useRef, useState } from 'react';
import { RootStackParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import userAPI from '../APIs/userAPI';
import { showMessage } from 'react-native-flash-message';
import { setToken } from '../APIs/axiosHelper';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../reducers/store';
import { initializeHabits } from '../reducers/habitReducer';
import { initializeEvents } from '../reducers/eventReducer';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    try {
      const user = await userAPI.loginUser(email, password)
      const token = user.token;
      console.log('User login successfully. Token:', token);
      setToken(token);
      // dispatch(initializeHabits());
      // dispatch(initializeEvents());
      navigation.navigate('Layout');
    } catch (error: any) {
      showMessage({
        message: error.message,
        type: 'danger',
      });
    }
  }

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
          title="Login"
          onPress={handleLogin}
        />
         <AccountLinkText
            promptText=''
            linkText="Forgot your password?"
            navigateTo="ForgotPassword"
          />
        <AccountLinkText
          promptText="Don't have an account?"
          linkText="Sign up"
          navigateTo="Register"
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
    marginBottom: 50,
  },
  inputContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
});

export default LoginScreen;