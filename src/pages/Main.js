import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, SafeAreaView, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import api from '../services/api';
import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";
export default function Main({ navigation }) {
  const id = navigation.getParam('user')
  const [users, setUsers] = useState([])
  
  useEffect(() => {
    async function loadDevs() {
       const response = await api.get('/dev', {
         headers: {user: id}
       })

       setUsers(response.data);
    }
    loadDevs();
  }, [id])

  async function handlerDislikes() {
    const [ user, ...rest ] = users; 

    await api.post(`/dev/${user._id}/dislike`,null, {
      headers:{
        user: id,
      }
    })
    setUsers(rest)
  }
  async function handlerLikes() {
    const [ user, ...rest ] = users;

    await api.post(`/dev/${user._id}/like`,null, {
      headers:{
        user: id,
      }
    })
    setUsers(rest)
  }

  async function hendlerLogOut(){
    await AsyncStorage.clear();
    navigation.navigate('Login');
  }

  return (
    <SafeAreaView style={styles.container}>
    <TouchableOpacity onPress={hendlerLogOut}>
      <Image style={{marginTop:30}} source={logo}/>
      </TouchableOpacity>
     <View style={styles.cardsContainer}>
        { users.length === 0? <Text style={styles.acabou}> Acabou :( </Text>: 
      users.map((user, i) => (
        <View key={user._id} style={[styles.cards, {zIndex: users.length - i}]}>
          <Image style={styles.avatar} source={{uri: user.avatar}}/>
          <View style={styles.footer}>
          <Text style={styles.name}>{user.name}</Text>
          <Text numberOfLines={3} style={styles.bio}>{user.bio}</Text>
          </View>
      </View>
      )) }
     </View>

     <View style={styles.buttonContainer}>
     <TouchableOpacity style={styles.button} onPress={handlerLikes}>
      <Image source={like}/>
     </TouchableOpacity>
     <TouchableOpacity style={styles.button} onPress={handlerDislikes}>
     <Image source={dislike}/>
     </TouchableOpacity>
     </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#f5f5f5',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  cardsContainer: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    maxHeight: 500,
  },
  cards: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 30,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
     
  },
  avatar: {
    flex: 1,
    height: 300,
  },
  footer: {
    backgroundColor: '#fff', 
    paddingHorizontal: 20,
    paddingVertical: 15,

  },
  name:{
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333'
  },
  bio: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    lineHeight: 18,

  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    elevation: 2,
  },
  acabou: {
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    color:'#999',
  }
})