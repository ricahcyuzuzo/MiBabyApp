import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomePediat from '../../screens/pediatrician/HomePediat';
import Mother from '../../screens/pediatrician/Mother';
import Babies from '../../screens/pediatrician/Babies';

const Drawer = createDrawerNavigator();

const PediatNavigation = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name='Home Pediat' component={HomePediat} />
        <Drawer.Screen name='Mother' component={Mother} />
    </Drawer.Navigator>    
  )
}

export default PediatNavigation

const styles = StyleSheet.create({})
