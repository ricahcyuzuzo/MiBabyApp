import { ActivityIndicator, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_URL } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NutritionPlan = ({ navigation, route }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [action, setAction] = useState('');
    const [hour, setHour] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingDelete, setLoadingDelete] = useState([]);
    const [nutritions, setNutritions] = useState([]);

    useEffect(() => {
        getNutrition();
    }, []);

    const getNutrition = async () => {
        axios.get(`${API_URL}/nutrition?baby=${route.params.babyId}`).then((res) => {
            setNutritions(res.data.nutritions);
        }).catch(err => console.log(err));
    }

    const deleteNutrition = async (id) => {
        setLoadingDelete([...loadingDelete, id]);
        axios.delete(`${API_URL}/nutrition?id=${id}`).then((res) => {
            getNutrition();
            const removeLoading = loadingDelete.filter((item) => item !== id);
            setLoadingDelete(removeLoading);
        }).catch(err => {
            getNutrition();
            const removeLoading = loadingDelete.filter((item) => item !== id);
            setLoadingDelete(removeLoading);
            alert(err?.response?.data?.message);
        });
    }

    const createNutritions = async () => {
        const token = await AsyncStorage.getItem('token');
        setLoading(true);
        const payload = {
            action,
            hour,
            ingredients,
            babyId: route.params.babyId,
            motherId: route.params.motherId, 
        }
        
        axios.post(`${API_URL}/nutrition`, payload, {
            headers: {
                Authorization: token,
            }
        }).then(res => {
            setLoading(false);
            getNutrition();
            setModalVisible(false);
        }).catch(err => {
            setLoading(false);
            alert(err?.response?.data?.message);
        });
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
            }}>Nutrition Plan</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}><AntDesign name="pluscircle" size={28} color="black" /></TouchableOpacity>
        </View>
        <ScrollView>
        <View style={{ 
            width: '90%',
            alignSelf: 'center',
            marginTop: 20,
            gap: 20,
            paddingBottom: 20,
         }}>
            {
                nutritions.map((item, idx) => 
                <View key={idx} style={{
                    width: '95%',
                    minHeight: 170,
                    backgroundColor: '#ffe5ec',
                    borderRadius: 20,
                    alignSelf: 'center',
                    paddingBottom: 10,
                }}>
                    <Text style={{
                        fontSize: 24,
                        fontWeight: '300',
                        alignSelf: 'center',
                        marginTop: 10,
                    }}>{item.action}</Text>
                    <Text style={{
                        fontSize: 30,
                        fontWeight: '900',
                        textAlign: 'center',
                        marginTop: 20,
                    }}>{item.hour}</Text>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: 30,
                        width: '90%',
                        alignSelf: 'center',
                        flexWrap: 'wrap',
                    }}>
                        <Text style={{ fontSize: 18, fontWeight: '600' }}>{item.ingredients}</Text>
                    </View>
                    {
                        loadingDelete.find(itm => itm === item._id) ? 
                        <ActivityIndicator size={24} color={'red'} style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                        }} />
                        :
                        <TouchableOpacity onPress={() => deleteNutrition(item._id)} style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                        }}>
                            <AntDesign name="delete" size={24} color="red" /> 
                        </TouchableOpacity>
                    }
                    {/* <TouchableOpacity style={{
                        position: 'absolute',
                        top: 45,
                        right: 10,
                    }}>
                        <Feather name="edit-2" size={20} color="blue" />
                    </TouchableOpacity> */}
                </View>)
            }
            {
            nutritions.length === 0 && <Text style={{ fontSize: 30, fontWeight: '900', width: '70%', textAlign: 'center', alignSelf: 'center', marginTop: 20, }}>No Nutrition Plan added yet for this baby.</Text>
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
                    <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 20, marginTop: 20, marginLeft: 20, }}>Add Nutrition plan</Text>
                    <View style={{ marginTop: 100, }}>
                        <Text style={{ width: '90%', alignSelf: 'center', }}>Action</Text>
                        <TextInput style={styles.textInput} value={action} onChangeText={(val) => setAction(val)} placeholder='Enter Action' />
                        <Text style={{ width: '90%', alignSelf: 'center', marginTop: 20, }}>Hour</Text>
                        <TextInput style={styles.textInput} value={hour} onChangeText={(val) => setHour(val)} placeholder='Enter Hour' />
                        <Text style={{ width: '90%', alignSelf: 'center', marginTop: 20, }}>Ingredients</Text>
                        <TextInput style={styles.textInput} value={ingredients} onChangeText={(val) => setIngredients(val)} placeholder='Enter Ingredients' />
                        <TouchableOpacity  disabled={loading} onPress={createNutritions} style={styles.button} >
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

export default NutritionPlan

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
        backgroundColor: 'white',
        paddingTop: 20,
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