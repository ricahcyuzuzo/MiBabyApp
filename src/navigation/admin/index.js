import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeAdmin from '../../screens/admin/HomeAdmin';
import AddPediatrician from '../../screens/admin/AddPediatrician';

const Drawer = createDrawerNavigator();

const AdminNavigation = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name='Home' component={HomeAdmin} />
        <Drawer.Screen name='Pediatrician' component={AddPediatrician} />
    </Drawer.Navigator>    
  )
}

export default AdminNavigation

const styles = StyleSheet.create({})