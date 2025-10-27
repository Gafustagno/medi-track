import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { getLocalStorage, RemoveLocalStorage } from '../../service/Storage';
import app from '../config/FirebaseConfig';
import Colors from './../../constant/Colors';
export default function Profile() {

  const [user,setUser]=useState();
  const Menu = [
    {
      id: 1,
      name: 'Adicionar Medicamento',
      icon: 'add-circle',
      path: '/add-new-medication'
    },
    {
      id: 5,
      name: 'Meus Medicamentos',
      icon: 'medkit',
      path: '(tabs)'
    },
    {
      id: 2,
      name: 'Histórico',
      icon: 'time',
      path: '/History'
    },
  
    {
      id: 4,
      name: 'Logout',
      icon: 'exit', 
      path: 'logout'
    }
  ]

  const router = useRouter();

  const onPressMenu = async(menu) => {
    if (menu.path == 'logout') {
      const auth = getAuth(app);
      signOut(auth)
     await RemoveLocalStorage();
      router.replace('/login')
      return;
    }

    router.push(menu.path)

  }
  useEffect(()=>{
    GetUser();
  },[])
  const GetUser=async()=>{
    const userData=await getLocalStorage('userDetail');
    setUser(userData)
  }
  return (
    <View style={{
      padding: 25,
    
      backgroundColor:'white',
      height:'100%'
    }}>
      <Text style={{
        fontFamily: 'outfit-medium',
        fontSize: 30
      }}/>

      <View style={{
        display: 'flex',
        alignItems: 'center',
        marginVertical: 25
      }}>
        <Image source={require('./../../assets/images/Mood_Happy.png')} style={{
          width: 80,
          height: 80,
         

        }} />

        <Text style={{
          fontFamily: 'outfit-bold',
          fontSize: 24,
          marginTop: 6,
          fontWeight:'bold'
        }}>{user?.displayName}</Text>
        <Text style={{
          fontFamily: 'outfit',
          fontSize: 16,
          color: Colors.GRAY
        }}>{user?.email}</Text>

      </View>

      <FlatList
        data={Menu}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => onPressMenu(item)}
            key={item.id}
            style={{
              marginVertical: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              backgroundColor: Colors.WHITE,
              padding: 10,
              borderRadius: 10
            }}>
            <Ionicons name={item?.icon} size={30}
              color={Colors.PRIMARY}
              style={{
                padding: 10,
                backgroundColor: Colors.LIGHT_PRIMARY,
                borderRadius: 10
              }}
            />
            <Text style={{
              fontFamily: 'outfit',
              fontSize: 20
            }}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

    </View>
  )
}