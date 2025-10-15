import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../constant/Colors';
import { setLocalStorage } from '../../service/Storage';
import { auth } from './../config/FirebaseConfig';

export default function SignIn() {

    const router=useRouter();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();

    const onSignInClick=()=>{

      if(!email || !password)
      {
        Alert.alert("Informe e-mail e senha")
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
      .then(async(userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user);
        await setLocalStorage('userDetail',user);
        router.replace('/(tabs)')
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if(errorCode=="auth/invalid-credential")
        {
          Alert.alert('E-mail ou senha inválidos')
        }
      });
    }

  
  return (
    <View style={{
        padding:25
    }}>      {/* melhor tirar isso */}
      <Text style={styles.textHeader}>Boas-vindas</Text>
      <Text style={styles.subText}>Que bom que voltou!</Text>      

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
        <Text>Senha</Text>
        <TextInput placeholder='Senha' style={styles.textInput}
        secureTextEntry={true}
        onChangeText={(value)=>setPassword(value)}
        />
      </View>

      <TouchableOpacity style={styles.button}
      onPress={onSignInClick}
      >
        <Text style={{
            fontSize:17,
            color:'white',
            textAlign:'center'
        }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonCreate}
      onPress={()=>router.push('login/signUp')}
      >
        <Text style={{
            fontSize:17,
            color:Colors.PRIMARY,
            textAlign:'center'
        }}>Criar conta</Text>
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