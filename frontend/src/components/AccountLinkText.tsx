import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, AccountLinkProps } from '../types/types';

const AccountLinkText: React.FC<AccountLinkProps> = ({ promptText, linkText, navigateTo }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>{promptText} </Text>
      <TouchableOpacity onPress={() => navigation.replace(navigateTo)}>
        <Text style={styles.link_text}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //marginBottom: 10,
    marginTop: 10,
    // padding: 10,
  },
  text: {
    fontStyle: 'italic',
    fontSize: 13,
  },
  link_text: {
    color: '#6C63FF',
    fontStyle: 'italic',
    fontSize: 13,
  },
});

export default AccountLinkText;