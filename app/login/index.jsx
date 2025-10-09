import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constant/Colors';

export default function LoginScreen() {

  const router=useRouter();
  return (
    <View>
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: 40,
        }}
      >
        <Image
          source={require('./../../assets/images/login.png')}
          style={styles.image}
        />
      </View>

      <View
        style={{
          padding: 25,
          backgroundColor: Colors.PRIMARY,
          height: '100%',
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
          }}
        >
          Viva com saúde no apocalipse!
        </Text>

        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontSize: 17,
            marginTop: 20,
          }}
        >
          Controle seus remédios. Cuidar da saúde é mais fácil do que matar zumbi.
        </Text>

          <TouchableOpacity style={styles?.button}
          onPress={()=>router.push('login/signIn')}
          >
            <Text style={{
                textAlign:'center',
                fontSize:16,
                color:Colors.PRIMARY
            }}>Continuar</Text>
          </TouchableOpacity>
          <Text style={{
            color:'white',
            marginTop:4
          }}>Nota: Ao clicar no botão Continuar, você concorda com nossos termos e condições</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 210,
    height: 450,
    borderRadius: 23,
  },
  button:{
    padding:15,
    backgroundColor:'white',
    borderRadius:99,
    marginTop:25
  }
});
