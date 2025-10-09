import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MedicationCardItem from '../../components/MedicationCardItem';
import Colors from '../../constant/Colors';
import { db } from '../config/FirebaseConfig';


export default function MedicationActionModal() {
    const medicine=useLocalSearchParams();
    const router=useRouter();

    const UpdateActionStatus=async(status)=>{
        try{
            const docRef=doc(db,'medication',medicine?.docId);
            await updateDoc(docRef,{
                action:arrayUnion({
                    status:status,
                    time:moment().format('LT'),
                    date:medicine?.selectedDate
                })
            });

            Alert.alert(status,'Registrado!',[
                {
                    text:'Ok',
                    onPress:()=>router.replace('(tabs)')
                }
            ])
        }catch(e)
        {
            console.log(e)
        }
    }
  

  return (
    <View style={styles.container}>
        <Image source={require('./../../assets/images/notification.gif')}
            style={{
                width:120,
                height:120
            }}
        />
        <Text style={{fontSize:18}}>{medicine?.selectedDate}</Text>
        <Text style={{fontSize:38,fontWeight:'bold',color:Colors.PRIMARY}}>{medicine?.reminder}</Text>
        <Text style={{fontSize:18}}>É hora de tomar</Text>
        
        <MedicationCardItem medicine={medicine}/>
        
        <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.closeBtn}
            onPress={()=>UpdateActionStatus('Não Tomou')}
            >
                    <Ionicons name="close-outline" size={24} color="red" />
                    <Text style={{
                        fontSize:20,
                        color:'red'
                    }}>Não Tomou</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.successBtn}
             onPress={()=>UpdateActionStatus('Tomou')}
            >
                    <Ionicons name="checkmark-outline" size={24} color="white" />
                    <Text style={{
                        fontSize:20,
                        color:'white'
                    }}>Tomou</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity
        onPress={()=>router.back()}
        style={{
            position:'absolute',
            bottom:25
        }}>
        <Ionicons name="close-circle" size={44} color={Colors.GRAY} />
        </TouchableOpacity>


    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        padding:25,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'white',
        height:'100%'
    },
    btnContainer:{
        flexDirection:'row',
        gap:10,
        marginTop:25
    },
    closeBtn:{
        padding:10,
        flexDirection:'row',
        gap:6,
        borderWidth:1,
        alignItems:'center',
        borderColor:'red',
        borderRadius:10
    },
    successBtn:{
        padding:10,
        flexDirection:'row',
        gap:6,
        backgroundColor:Colors.GREEN,
        alignItems:'center',
       
        borderRadius:10
    }
})