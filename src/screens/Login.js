import { ActivityIndicator, Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import AppContext from '../Context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../api';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { setLoggedIn } = useContext(AppContext);

    const storeData = async (token, data) => {
        try {
          await AsyncStorage.setItem('token', token);
          await AsyncStorage.setItem('data', JSON.stringify(data));
        } catch (e) {
          console.log(e);
        }
    };

    const handleLogin = async () => {
        setErrorMessage('');
        setLoading(true);
        const payload = {
            phone,
            password
        }
        axios.post(`${API_URL}/login`, payload).then((res) => {
            setLoading(false);
            const token = res.data.token;
            const decodedToken = jwtDecode(token);
            setLoggedIn(decodedToken?.user?.type);
            storeData(token, decodedToken.user);
        }).catch((err) => {
            setLoading(false);
            setErrorMessage(err?.response?.data?.message);

        })
    }


  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.subContainer}>
            <Text style={styles.login}>Sign In</Text>
            <TextInput style={styles.textInput} value={phone} maxLength={10} keyboardType='phone-pad' onChangeText={(val) => setPhone(val)} placeholder='Enter Phone' />
            <TextInput secureTextEntry={true} style={styles.textInput} value={password} onChangeText={(val) => setPassword(val)} placeholder='Enter Password' />
            <TouchableOpacity onPress={handleLogin} style={styles.button} >
                { loading ? <ActivityIndicator color={'#fff'} size={24} /> : <Text style={styles.buttonText}>Login</Text> }
            </TouchableOpacity>
            {errorMessage?.length > 0 && <Text style={{ color: '#a12', textAlign: 'center', marginTop: 20, }}>{errorMessage}</Text>}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
    subContainer: {
        width: '100%',
    },
    buttonText: {
        color: '#fff',
    },
    button: {
        width: '90%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
    },
    textInput: {
        width: '90%',
        height: 50,
        borderWidth: 1,
        borderColor: '#c4c4c4',
        borderRadius: 10,
        marginTop: 20,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
    login: {
        fontSize: 50,
        color: '#000',
        fontWeight: '900',
        textAlign: 'center',
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
})