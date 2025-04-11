import { useState } from 'react';
import { Image, View, StyleSheet, Text, StatusBar } from 'react-native';
import CustomButton from '../components/CustomButton';
import AccountInputField from '../components/AccountInputField';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.wrapper}>
        <Image
          source={require('../../assets/images/register-login.png')}
          style={styles.backgroundImage}
        />
        <Text style={styles.text_forgot}>Reset Password</Text>
        <AccountInputField
          label="password"
          placeholder="Enter new password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <CustomButton
          title="Confirm"
          //color="#723480"
          onPress={() => console.log("reset password")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    marginBottom:0
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: 300,
    resizeMode: 'center',
  },
  text_forgot: {
    fontSize: 32,
    color: '#1F2A3A',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    color: 'grey',
    marginBottom: 60,
  },
});

export default ResetPasswordScreen;