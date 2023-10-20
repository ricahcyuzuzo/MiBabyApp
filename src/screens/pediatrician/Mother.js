import { ActivityIndicator, Modal, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Entypo } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_URL } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Mother = ({ navigation }) => {
  const [ modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mothers, setMothers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMothers();
  }, [])
  
  const getMothers = () => {
    axios.get(`${API_URL}/mothers`).then((res) => {
      setMothers(res.data.mothers);
    }).catch((err) => console.log(err));
  }

  const handleAddMother = async () => {
    const token = await AsyncStorage.getItem('token');
        setLoading(true)
        const payload = {
            name,
            phone,
        }
        axios.post(`${API_URL}/signup`, payload, {
            headers: {
                Authorization: token,
            }
        }).then(() => {
            setLoading(false)
            setModalVisible(false);
            getMothers();
          }).catch((err) => {
            setLoading(false);
            setModalVisible(false);
            alert(err?.response?.data?.message);
        })
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
      <View style={styles.header}>
            <TouchableOpacity onPress={() => setModalVisible(true)}><AntDesign name="pluscircle" size={28} color="black" /></TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'bold', }}>Mothers</Text>
            <View style={{ flexDirection: 'row',  }}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}><Entypo name="menu" size={34} color="black" /></TouchableOpacity>
            </View>
        </View>
        <View style={{ marginTop: 30}} />
       { mothers.map((item, idx) => 
       <View key={idx} style={{
        flexDirection: 'row',
        gap: 5,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center'
       }}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('BABIES', { motherId: item._id })}
          style={{ 
            width: '90%',
            height: 50,
            borderRadius: 10,
            backgroundColor: '#e5e5e5',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 20,
        }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4c4c4c', marginLeft: 10, }}>{item.name}</Text>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#4c4c4c', marginLeft: 10, position: 'absolute', bottom: 3, right: 10, }}>{item.phone}</Text>
        </TouchableOpacity>
       </View>)}
        {
            mothers.length === 0 && <Text style={{ fontSize: 30, fontWeight: '900', width: '70%', textAlign: 'center', alignSelf: 'center', marginTop: 20, }}>No Mothers added yet.</Text>
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
                    <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 20, marginTop: 20, marginLeft: 20, }}>Add a mother</Text>
                    <View style={{ marginTop: 100, }}>
                        <Text style={{ width: '90%', alignSelf: 'center', }}>Name</Text>
                        <TextInput style={styles.textInput} value={name} onChangeText={(val) => setName(val)} placeholder='Enter Name' />
                        <Text style={{ width: '90%', alignSelf: 'center', marginTop: 20, }}>Phone</Text>
                        <TextInput style={styles.textInput} value={phone} onChangeText={(val) => setPhone(val)} placeholder='Enter Phone' />
                        <TouchableOpacity onPress={handleAddMother} style={styles.button} >
                            { loading ? <ActivityIndicator color={'#fff'} size={24} /> : <Text style={styles.buttonText}>Add</Text> }
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

export default Mother

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