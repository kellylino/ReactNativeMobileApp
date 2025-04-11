import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';
import { AccountInputFieldProps } from '../types/types'

const AccountInputField: React.FC<AccountInputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor='#000000'
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#A0A0A0',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
});

export default AccountInputField;