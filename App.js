
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Global from './src/navigation';
import AppContext from './src/Context/AppContext';
import AdminNavigation from './src/navigation/admin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PediatNavigation from './src/navigation/pediats';
import { View } from 'react-native';
import Constants from 'expo-constants';
import Babies from './src/screens/pediatrician/Babies';
import NutritionPlan from './src/screens/pediatrician/NutritionPlan';
import MotherNavigation from './src/navigation/mother';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
 });

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo push token:", token);
  } else {
    alert('Must use physical device for Push Notifications');
  }
 
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
 
  return token;
 }

 async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Test title',
    body: 'Test body',
    data: { testData: 'test data' },
  };
 
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
 }

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState('not-loggedin');
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    getLoggedIn();
  }, [])

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
 
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
 
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
 
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const getLoggedIn = async () => {
    const logged = await AsyncStorage.getItem('data');
    const parsedData = JSON.parse(logged);
    setLoggedIn(parsedData.type);
  }

  return (
    <View style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
    }}>
      <AppContext.Provider value={{ loggedIn, setLoggedIn, expoPushToken }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='GLOBAL'>
          { loggedIn === 'admin' ? 
            <Stack.Screen name='ADMIN' component={AdminNavigation} />
            :
            loggedIn === 'pediat' ?
            <>
              <Stack.Screen name='PEDIAT' component={PediatNavigation} />
              <Stack.Screen name='BABIES' component={Babies} />
              <Stack.Screen name='NUTRITION' component={NutritionPlan} />
            </>
            :
            loggedIn === 'mother' ?
              <Stack.Screen name='MOTHER' component={MotherNavigation} />
            :
            <Stack.Screen name='GLOBAL' component={Global} />
          }
        </Stack.Navigator>
      </NavigationContainer>
    </AppContext.Provider>
    </View>
  );
}
