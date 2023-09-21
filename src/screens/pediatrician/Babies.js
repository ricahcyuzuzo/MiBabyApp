import { ActivityIndicator, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../../api';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Babies = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [height, setHeight] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [babies, setBabies] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        getBabies();
    }, [])
      
    const getBabies = () => {
        axios.get(`${API_URL}/babies_mother?mother=${route.params.motherId}`).then((res) => {
            setBabies(res.data.babies);
        }).catch((err) => console.log(err));
    }
    
    const handleAddBaby = async () => {
        const token = await AsyncStorage.getItem('token');
        setLoading(true)
        const payload = {
            name,
            height,
            weight,
            age,
            motherId: route.params.motherId,
        }
        axios.post(`${API_URL}/baby`, payload, {
            headers: {
                Authorization: token,
            }
        }).then(() => {
            setLoading(false)
            setModalVisible(false);
            getBabies();
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{ 
                fontSize: 20,
                fontWeight: '900',
            }}>Babies</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}><AntDesign name="pluscircle" size={28} color="black" /></TouchableOpacity>
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
                <TouchableOpacity onPress={() => navigation.navigate('NUTRITION', { babyId: item._id, motherId: route.params.motherId })} key={idx} style={{
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
                    height: 700,
                    backgroundColor: '#fff'
                }}>
                    <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 20, marginTop: 20, marginLeft: 20, }}>Add a baby</Text>
                    <View style={{ marginTop: 100, }}>
                        <Text style={{ width: '90%', alignSelf: 'center', }}>Name</Text>
                        <TextInput style={styles.textInput} value={name} onChangeText={(val) => setName(val)} placeholder='Enter Name' />
                        <Text style={{ width: '90%', alignSelf: 'center', marginTop: 20, }}>Age</Text>
                        <TextInput style={styles.textInput} value={age} onChangeText={(val) => setAge(val)} placeholder='Enter Age' />
                        <Text style={{ width: '90%', alignSelf: 'center', marginTop: 20, }}>Weight</Text>
                        <TextInput style={styles.textInput} value={weight} onChangeText={(val) => setWeight(val)} placeholder='Enter Weight' />
                        <Text style={{ width: '90%', alignSelf: 'center', marginTop: 20, }}>Height</Text>
                        <TextInput style={styles.textInput} value={height} onChangeText={(val) => setHeight(val)} placeholder='Enter Height' />
                        <TouchableOpacity onPress={handleAddBaby} style={styles.button} >
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

export default Babies

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
        paddingTop: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        width: '90%',
        alignSelf: 'center',
    },
})