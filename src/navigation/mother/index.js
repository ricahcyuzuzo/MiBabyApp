import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeMother from '../../screens/mother/HomeMother';
import NutritionPlanMother from '../../screens/mother/NutritionPlan';

const Stack = createNativeStackNavigator();

const MotherNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='HOME_MOTHER' component={HomeMother} />
        <Stack.Screen name='HOME_NUTRI' component={NutritionPlanMother} />
    </Stack.Navigator>    
  )
}

export default MotherNavigation 

const styles = StyleSheet.create({})