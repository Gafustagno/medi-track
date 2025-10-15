import { useRouter } from 'expo-router';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constant/Colors';
import ConstantString from '../constant/ConstantString';

export default function EmptyState() {
  
  const router=useRouter();
    
  return (
    <View style={{
        marginTop:80,
        display:'flex',
        alignItems:'center'
    }}>
      <Image source={require('./../assets/images/medicine_zomboid.png')}
      style={{
        width:200,
        height:200,
        marginTop:-90
      }}
    />
    <Text style={{
        fontSize:35,
        fontWeight:'bold',
        marginTop:30
    }}>{ConstantString.NoMedication}</Text>

    <Text style={{
        fontSize:16,
        color:Colors.DARK_GRAY,
        textAlign:'center',
        marginTop:20
    }}>{ConstantString.MedicationSubText}</Text>

    <TouchableOpacity style={{
        backgroundColor:Colors.PRIMARY,
        padding:15,
        borderRadius:10,
        width:'100%',
        marginTop:30
    }}

    onPress={()=>router.push('/add-new-medication')}    
    >
        <Text style={{
            textAlign:'center',
            fontSize:17,
            color:'white'
        }}>{ConstantString.AddNewMedicationBtn}</Text>
    </TouchableOpacity>

    </View>
  )
}