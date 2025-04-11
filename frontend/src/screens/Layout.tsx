import { View, StyleSheet } from "react-native";
import { RootStackParamList } from '../types/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import NavigationTab from '../components/BottomNavigation';
import { PaperProvider } from 'react-native-paper';
import Header from "../components/Header";
import Draw from '../screens/Draw';
const Layout = () => {
  //const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <PaperProvider>
      <View style={styles.container}>
        {/* <Header /> */}
        <NavigationTab />
      </View>
    </PaperProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Layout;