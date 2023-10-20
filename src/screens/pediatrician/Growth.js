import { ActivityIndicator, Modal, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../api';

const Growth = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [month, setMonth] = useState('');
    const [loading, setLoading] = useState(false);
    const [growth, setGrowth] = useState([]);

    useEffect(() => {
        handleGetBabyGrowth();
    }, [])
    
    const handleAddBabyGrowth = async () => {
        const token = await AsyncStorage.getItem('token');
        setLoading(true)
        const payload = {
            height,
            weight,
            month,
        }
        axios.post(`${API_URL}/growth?motherId=${route.params.motherId}&babyId=${route.params.babyId}`, payload, {
            headers: {
                Authorization: token,
            }
        }).then(() => {
            setLoading(false)
            setModalVisible(false);
            handleGetBabyGrowth()
        }).catch((err) => {
            setLoading(false);
            setModalVisible(false);
            alert(err?.response?.data?.message);
        })
    }

    const handleGetBabyGrowth = async () => {
        const token = await AsyncStorage.getItem('token');
        axios.get(`${API_URL}/growth?babyId=${route.params.babyId}`, {
            headers: {
                Authorization: token,
            }
        }).then((res) => {
            setGrowth(res.data.growth);
            console.log(res.data);
        }).catch((err) => {
            setLoading(false);
            setModalVisible(false);
            alert(err?.response?.data?.message);
        })
    }
  return (
    <SafeAreaView>
        <View style={styles.header}>
            <View style={{ flexDirection: 'row',  }}>
                <TouchableOpacity onPress={() => navigation.goBack()}><AntDesign name="left" size={34} color="black" /></TouchableOpacity>
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', }}>Growth</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}><AntDesign name="pluscircle" size={28} color="black" /></TouchableOpacity>
        </View>
        <View>
            {growth.map((item, idx) => <View key={idx} 
            style={{ 
                width: '90%',
                height: 50,
                borderRadius: 10,
                backgroundColor: '#e5e5e5',
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
                paddingRight: 20,
                alignSelf: 'center',
                marginTop: 20,
            }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4c4c4c', marginLeft: 10, }}>{item.month}th Month</Text>
                <View style={{
                    position: 'absolute', bottom: 3, right: 10, marginLeft: 10
                }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#4c4c4c',}}>{item.weight} Kg</Text>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#4c4c4c',}}>{item.height} cm</Text>
                </View>
            </View>)}
        </View>
        <View>
        <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <StatusBar barStyle='dark-content' />
                <View style={{
                    width: '90%',
                    height: '80%',
                    backgroundColor: '#fff'
                }}>
                    <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 20, marginTop: 20, marginLeft: 20, }}>Add a mother</Text>
                    <View style={{ marginTop: 100, }}>
                        <Text style={{ width: '90%', alignSelf: 'center', }}>Weight</Text>
                        <TextInput style={styles.textInput} onChangeText={(val) => setWeight(val)} placeholder='Enter Weight' />
                        <Text style={{ width: '90%', alignSelf: 'center', marginTop: 20, }}>Height</Text>
                        <TextInput style={styles.textInput} onChangeText={(val) => setHeight(val)} placeholder='Enter Height' />
                        <Text style={{ width: '90%', alignSelf: 'center', marginTop: 20, }}>Month</Text>
                        <TextInput style={styles.textInput} onChangeText={(val) => setMonth(val)} placeholder='Enter Month' />
                        <TouchableOpacity onPress={handleAddBabyGrowth} style={styles.button} >
                            { loading ? <ActivityIndicator color={'#fff'} size={24} /> : <Text style={styles.buttonText}>Add</Text> }
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: 'absolute', top: 20, right: 20, }}>
                        <AntDesign name="closecircle" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
        </View>
    </SafeAreaView>
  )
}

export default Growth

const styles = StyleSheet.create({
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
        marginTop: 5,
        alignSelf: 'center',
        paddingHorizontal: 20,
      },
      container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 20,
      },
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? 0 : 20,
      },
})