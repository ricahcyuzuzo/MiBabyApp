import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from '../screens/Login';

const Stack = createNativeStackNavigator();

const Global = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='LOGIN' component={Login} />
    </Stack.Navigator>    
  )
}

export default Global

const styles = StyleSheet.create({})