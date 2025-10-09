import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constant/Colors';
import { getLocalStorage } from '../service/Storage';

export default function Header() {

    const router=useRouter();
    const [user, setUser]=useState();
    useEffect(()=>{
        GetUserDetail();
    },[])

    const GetUserDetail=async()=>{
        const userInfo=await getLocalStorage('userDetail');
        console.log(userInfo);
        setUser(userInfo);
    }

  return (
    <View style={{
        marginTop:20,
        
    }}>
        <View style={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            width:'100%'
        }}>
            
      <View style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        gap:10,
    
      }}>
        <Image source={require('./../assets/images/smiley.png')}
            style={{
                width:40,
                height:45
            }}
        />
        <Text style={{
            fontSize:25,
            fontWeight:'bold'
        }}>Olá, {user?.displayName} 👋</Text>

        </View>
        <TouchableOpacity onPress={()=>router.push('/add-new-medication')}>
        <Ionicons name="medkit-outline" size={34} color={Colors.DARK_GRAY} />
        </TouchableOpacity>
      </View>
    </View>
  )
}