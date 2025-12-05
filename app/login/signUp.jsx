//app/login/signUp.jsx
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/FirebaseConfig';
import Colors from '../../constant/Colors';
import { setLocalStorage } from '../../service/Storage';

export default function SignUp() {

    const router=useRouter();

    const [email,setEmail]=useState();
    const [password,setPassword]= useState();
    const [userName, setUserName]=useState();

    const OnCreateAccount=()=> {
      
      if(!email || !password|| !userName)
        {
          ToastAndroid.show('Preencha todos os campos', ToastAndroid.BOTTOM)
          Alert.alert('Por favor, preencha e-mail e senha')
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
            ToastAndroid.show('E-mail já cadastrado', ToastAndroid.BOTTOM)
            Alert.alert('E-mail já cadastrado')
          }
          // ..
        });
    }
  return (
    <View style={{
            padding:25
        }}>
          <Text style={styles.textHeader}>Criar nova conta</Text>
          
          <View style={{
            marginTop:25
          }}>
            <Text>Nome</Text>
            <TextInput placeholder='Nome'
            placeholderTextColor="#777"
            onChangeText={(value)=>setUserName(value)}
            style={styles.textInput}
            autoComplete="off"
            />
          </View>
    
          <View style={{
            marginTop:25
          }}>
            <Text>Email</Text>
            <TextInput placeholder='Email' placeholderTextColor="#777" style={styles.textInput}
              onChangeText={(value)=>setEmail(value)}
              autoComplete="off"
            />
          </View>
    
          <View style={{
            marginTop:25
          }}>
            <Text>Senha</Text>
            <TextInput placeholder='Senha' placeholderTextColor="#777" style={styles.textInput}
            onChangeText={(value)=>setPassword(value)}
            secureTextEntry={true}
            autoComplete="off"
            /> 
          </View>
    
          <TouchableOpacity style={styles.button}
            onPress={OnCreateAccount}
          >
            <Text style={{
                fontSize:17,
                color:'white',
                textAlign:'center'
            }}>Criar conta</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.buttonCreate}
          onPress={()=>router.push('login/signIn')}
          >
            <Text style={{
                fontSize:17,
                color:Colors.PRIMARY,
                textAlign:'center'
            }}>Já tem uma conta? Faça login</Text>
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