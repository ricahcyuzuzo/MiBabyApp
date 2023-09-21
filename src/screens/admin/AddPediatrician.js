import { ActivityIndicator, Modal, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../api';

const AddPediatrician = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [pediats, setPediats] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getPediats();
    }, []);

    const handleAddPediat = async () => {
        const token = await AsyncStorage.getItem('token');
        setLoading(true)
        const payload = {
            name,
            phone,
        }
        axios.post(`${API_URL}/pediat`, payload, {
            headers: {
                Authorization: token,
            }
        }).then(() => {
            setLoading(false)
            getPediats();
        }).catch((err) => {
            setLoading(false);
            alert(err?.response?.data?.message);
        })
    }

    const getPediats = async () => {
        const token = await AsyncStorage.getItem('token');
        const results = await axios.get(`${API_URL}/pediat`, {
            headers: {
                Authorization: token
            }
        });
        console.log(results.data, 'jjj')
        setPediats(results.data.pediats);
    }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => setModalVisible(true)}><AntDesign name="pluscircle" size={28} color="black" /></TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', }}>Pediatricians</Text>
            <View style={{ flexDirection: 'row',  }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}><Entypo name="menu" size={34} color="black" /></TouchableOpacity>
            </View>
        </View>
        <View style={{ marginTop: 30, }} />
       { pediats.map((item, idx) => <View key={idx} style={{ 
            width: '90%',
            height: 50,
            borderRadius: 10,
            backgroundColor: '#e5e5e5',
            justifyContent: 'space-between',
            alignSelf: 'center',
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 20,
        }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4c4c4c', marginLeft: 10, }}>{item.name}</Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#4c4c4c', marginLeft: 10, position: 'absolute', bottom: 3, right: 10, }}>{item.phone}</Text>
        </View>)}
        {
            pediats.length === 0 && <Text style={{ fontSize: 30, fontWeight: '900', width: '70%', textAlign: 'center', alignSelf: 'center', marginTop: 20, }}>No Pediats added yet.</Text>
        }
      </View>
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
                    <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 20, marginTop: 20, marginLeft: 20, }}>Add Pediatrician</Text>
                    <View style={{ marginTop: 100, }}>
                        <Text style={{ width: '90%', alignSelf: 'center', }}>Name</Text>
                        <TextInput style={styles.textInput} value={name} onChangeText={(val) => setName(val)} placeholder='Enter Name' />
                        <Text style={{ width: '90%', alignSelf: 'center', marginTop: 20, }}>Phone</Text>
                        <TextInput style={styles.textInput} value={phone} onChangeText={(val) => setPhone(val)} placeholder='Enter Phone' />
                        <TouchableOpacity onPress={handleAddPediat} style={styles.button} >
                            { loading ? <ActivityIndicator color={'#fff'} size={24} /> : <Text style={styles.buttonText}>Login</Text> }
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => setModalVisible(false)} style={{ position: 'absolute', top: 20, right: 20, }}>
                        <AntDesign name="closecircle" size={28} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </SafeAreaView>
  )
}

export default AddPediatrician

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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
        marginTop: Platform.OS === 'ios' ? 0 : 20,
    },
    container: {
        width: '100%',
        height: '100%',
        paddingTop: 20,
    }
})