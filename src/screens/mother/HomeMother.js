import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { API_URL } from '../../api';
import { AntDesign } from '@expo/vector-icons';
import AppContext from '../../Context/AppContext';

const HomeMother = ({ navigation }) => {
    const [user, setUser] = useState({});
    const [babies, setBabies] = useState([]);
    const { setLoggedIn, expoPushToken } = useContext(AppContext);

    useEffect(() => {
        getUser();
        getBabies();
    }, []);

    const getUser = async () => {
        const token = await AsyncStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        setUser(decodedToken.user);
        updatePushNotification();
    }

    const getBabies = async () => {
        const token = await AsyncStorage.getItem('token');
        axios.get(`${API_URL}/babies_mother`, {
            headers: {
                Authorization: token
            }
        }).then(res => {
            setBabies(res.data.babies);
        }).catch(err => {
            console.log(err);
        })
    }

    const updatePushNotification = async () => {
        const token = await AsyncStorage.getItem('token');
        const expoTkn = expoPushToken;
        axios.patch(`${API_URL}/notification`, {
            expoPushToken: expoTkn
        }, {
            headers: {
                Authorization: token,
            }
        }).then(res => {
            console.log(res?.data?.message);
        }).catch((err) => console.log(err));
    }

  return (
    <SafeAreaView>
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{
                    fontWeight: '900',
                    fontSize: 30,
                }}>Hi {user?.name?.split(" ")[0]},</Text>
            </View>
            <ScrollView>
            <View style={{ 
                width: '90%',
                alignSelf: 'center',
                marginTop: 20,
                gap: 20,
            }}>
            {
                babies.map((item, idx) => 
                <TouchableOpacity onPress={() => navigation.navigate('HOME_NUTRI', { babyId: item._id })} key={idx} style={{
                    width: '95%',
                    height: 170,
                    backgroundColor: '#ffe5ec',
                    borderRadius: 20,
                    alignSelf: 'center',
                }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: '300',
                        alignSelf: 'center',
                        marginTop: 10,
                    }}>{item.name}</Text>
                    <Text style={{
                        fontSize: 30,
                        fontWeight: '900',
                        textAlign: 'center',
                        marginTop: 20,
                    }}>{item.age}</Text>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 30,
                        width: '90%',
                        alignSelf: 'center',
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.height}M</Text>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.weight}Kg</Text>
                    </View>
                </TouchableOpacity>)
            }
            {
            babies.length === 0 && <Text style={{ fontSize: 30, fontWeight: '900', width: '70%', textAlign: 'center', alignSelf: 'center', marginTop: 20, }}>No babies added yet.</Text>
            }
        </View>
        </ScrollView>
        </View>
        <TouchableOpacity onPress={async() => {
            setLoggedIn('not-loggedin');
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('data');
        }} style={{ position: 'absolute', top: 40, right: 20, backgroundColor: '#222', width: 40, height: 40, justifyContent: 'center', alignSelf: 'center', borderRadius: 10, alignItems: 'center', }}>
            <AntDesign name="logout" size={24} color="white" />
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HomeMother

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    header: {
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center',
    },
})