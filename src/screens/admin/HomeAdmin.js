import { SafeAreaView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import AppContext from '../../Context/AppContext';
import { API_URL } from '../../api';

const HomeAdmin = ({ navigation }) => {
    const [counts, setCounts] = useState({});
    const { setLoggedIn } = useContext(AppContext);

    useEffect(() => {
        getNumbers();
    }, []);

    const getNumbers = async () => {
        axios.get(`${API_URL}/numbers`).then(res => {
            setCounts(res.data);
        }).catch((err) => console.log(err));
    }
  return (
    <SafeAreaView>
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={{ fontSize: 18, fontWeight: '800' }}>Admin</Text>
                <TouchableOpacity onPress={() => navigation.openDrawer()}><Entypo name="menu" size={34} color="black" /></TouchableOpacity>
            </View>
            <View style={styles.bodyCounts}>
                <View style={styles.box}>
                    <Text style={styles.text}>Mothers</Text>
                    <Text style={styles.number}>{counts?.mothers}</Text>
                </View>
                <View style={[styles.box, { backgroundColor: '#f2b5d4' }]}>
                    <Text style={styles.text}>Pediats</Text>
                    <Text style={styles.number}>{counts?.pediats}</Text>
                </View>
                <View style={[styles.box, { backgroundColor: '#cdb4db' }]}>
                    <Text style={styles.text}>Babies</Text>
                    <Text style={styles.number}>{counts?.babies}</Text>
                </View>
            </View>
            <View>

            </View>
        </View>
        <TouchableOpacity onPress={() => setLoggedIn('not-loggedin')} style={{ position: 'absolute', bottom: 20, right: 20, backgroundColor: '#222', width: 40, height: 40, justifyContent: 'center', alignSelf: 'center', borderRadius: 10, alignItems: 'center', }}>
            <AntDesign name="logout" size={24} color="white" />
        </TouchableOpacity>
    </SafeAreaView>
  )
}

export default HomeAdmin

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20
    },
    number: {
        fontSize: 60,
        fontWeight: 'bold', 
        textAlign: 'center',
    },
    bodyCounts: {
        flexDirection: 'row',
        width: '100%',
        height: 400,
        gap: 10,
        justifyContent: 'center',
        marginTop: 20,
        flexWrap: 'wrap'
    },
    box: {
        width: '45%',
        height: '45%',
        borderRadius: 10,
        backgroundColor: '#83c5be',
    },
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    header: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    }
})