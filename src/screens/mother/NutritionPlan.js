import { ActivityIndicator, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { API_URL } from '../../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NutritionPlanMother = ({ navigation, route }) => {
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
    </SafeAreaView>
  )
}

export default NutritionPlanMother

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