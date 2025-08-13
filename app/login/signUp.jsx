import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import Colors from '../../constant/Colors';
import { setLocalStorage } from '../../service/Storage';
import { auth } from './../config/FirebaseConfig';

export default function SignUp() {

    const router=useRouter();

    const [email,setEmail]=useState();
    const [password,setPassword]= useState();
    const [userName, setUserName]=useState();

    const OnCreateAccount=()=> {
      
      if(!email || !password|| !userName)
        {
          ToastAndroid.show('Please fill all details', ToastAndroid.BOTTOM)
          Alert.alert('Please Enter Email and Password')
          return;
        }

      createUserWithEmailAndPassword(auth, email, password)
        .then(async(userCredential) => {
          // Signed up 
          const user = userCredential.user;
          
          await updateProfile(user,{
            displayName:userName
          })

        await setLocalStorage('userDetail',user);

          router.push('(tabs)')
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if(errorCode=='auth/email-already-in-use')
          {
            ToastAndroid.show('Email already exist', ToastAndroid.BOTTOM)
            Alert.alert('Email already in exist')
          }
          // ..
        });
    }
  return (
    <View style={{
            padding:25
        }}>
          <Text style={styles.textHeader}>Create New Account</Text>
          
          <View style={{
            marginTop:25
          }}>
            <Text>Full Name</Text>
            <TextInput placeholder='Full Name'
            onChangeText={(value)=>setUserName(value)}
            style={styles.textInput}/>
          </View>
    
          <View style={{
            marginTop:25
          }}>
            <Text>Email</Text>
            <TextInput placeholder='Email' style={styles.textInput}
              onChangeText={(value)=>setEmail(value)}
            />
          </View>
    
          <View style={{
            marginTop:25
          }}>
            <Text>Password</Text>
            <TextInput placeholder='Password' style={styles.textInput}
            onChangeText={(value)=>setPassword(value)}
            secureTextEntry={true}
            /> 
          </View>
    
          <TouchableOpacity style={styles.button}
            onPress={OnCreateAccount}
          >
            <Text style={{
                fontSize:17,
                color:'white',
                textAlign:'center'
            }}>Create Account</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.buttonCreate}
          onPress={()=>router.push('login/signUp')}
          >
            <Text style={{
                fontSize:17,
                color:Colors.PRIMARY,
                textAlign:'center'
            }}>Already Account? Sign in</Text>
          </TouchableOpacity>
    
        </View>
      )
}

const styles = StyleSheet.create({
     textHeader:{
        fontSize:30,
        fontWeight:'bold'
     },
     subText:{
        fontSize:30,
        fontWeight:'bold',
        marginTop:10,
        color:Colors.GRAY
     },
     textInput:{
        padding:10,
        borderWidth:1,
        fontSize:17,
        borderRadius:10,
        marginTop:5,
        backgroundColor:'white'
     },
     button:{
        padding:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:10,
        marginTop:20
     },
     buttonCreate:{
        padding:15,
        backgroundColor:'white',
        borderRadius:10,
        marginTop:20,
        borderWidth:1,
        borderColor:Colors.PRIMARY
     }
})