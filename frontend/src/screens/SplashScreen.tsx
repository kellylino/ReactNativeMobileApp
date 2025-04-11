import { Image, Text, View, StyleSheet, StatusBar } from 'react-native';
import CustomButton from '../components/CustomButton';
import AccountLinkText from '../components/AccountLinkText';
import { RootStackParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const SplashScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <StatusBar />
      <View style={styles.wrapper}>
        <Image
          source={require('../../assets/images/welcome.png')}
          style={styles.backgroundImage}
        />
        <Text style={styles.splash_text} >
          Every habit you build brings you closer to your dreams
        </Text>
        <Text style={styles.text}>Set your first habit now!</Text>
        <CustomButton
          title="Login"
          //color="#723480"
          onPress={() => navigation.navigate('Login')}
        />
        <AccountLinkText
          promptText=''
          linkText="Create an account"
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
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backgroundImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginTop: 50,
  },
  splash_text: {
    fontSize: 13,
    color: '#000',
    fontStyle: 'italic',
    marginTop: -30,
    textAlign: 'center',
  },
  text: {
    fontSize: 17,
    color: '#000',
    fontStyle: 'italic',
    marginTop: 100,
    marginBottom: 100,
    textAlign: 'center',
  },
});

export default SplashScreen;