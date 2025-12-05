// app/action-modal/index.jsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constant/Colors';

export default function MedicationActionModal() {
    const params = useLocalSearchParams();
    const router = useRouter();

    // parse reminders if provided
    const reminders = (() => {
      try {
        if (params?.reminders) return JSON.parse(params.reminders);
        if (params?.reminder) return [params.reminder];
      } catch (e) {
        return params?.reminders || [];
      }
      return [];
    })();

    const specificTime = params?.time || null; // expecting "HH:mm" or null
    const selectedDate = params?.selectedDate;

    const UpdateActionStatus = async (status, timeToUse) => {
      try {
        const docRef = doc(db, 'medication', params?.docId);
        const snap = await getDoc(docRef);
        const data = snap.exists() ? snap.data() : {};
        const existing = Array.isArray(data.action) ? data.action : [];

        // normalize time format (use provided timeToUse or current time in HH:mm)
        const normalizedTime = timeToUse || moment().format('HH:mm');

        // remove any previous action for this date+time (so user can correct)
        const filtered = existing.filter(
          (a) => !(a.date === selectedDate && a.time === normalizedTime)
        );

        const newEntry = {
          status,
          time: normalizedTime,
          date: selectedDate,
          timestamp: Date.now(),
        };

        // save the updated actions array
        await updateDoc(docRef, {
          action: [...filtered, newEntry],
        });

        Alert.alert(status, 'Registrado!', [
          {
            text: 'Ok',
            onPress: () => router.replace('(tabs)'),
          },
        ]);
      } catch (e) {
        console.log(e);
        Alert.alert('Erro', 'Não foi possível registrar a ação.');
      }
    };

    // If there's a specific time passed (ex. from a notification), show single big buttons
    if (specificTime) {
      return (
        <View style={styles.container}>
            <Image source={require('./../../assets/images/notification.gif')}
                style={{ width:120, height:120 }}
            />
            <Text style={{fontSize:18}}>{selectedDate}</Text>
            <Text style={{fontSize:38,fontWeight:'bold',color:Colors.PRIMARY}}>{specificTime}</Text>
            <Text style={{fontSize:18}}>É hora de tomar</Text>
                
            <View style={styles.btnContainer}>
                <TouchableOpacity style={styles.closeBtn}
                onPress={()=>UpdateActionStatus('Não Tomou', specificTime)}
                >
                        <Ionicons name="close-outline" size={24} color="white" left={5} />
                        <Text style={{ fontSize:20, color:'white' }}>Não Tomou</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.successBtn}
                 onPress={()=>UpdateActionStatus('Tomou', specificTime)}
                >
                        <Ionicons name="checkmark-outline" size={24} color="white" left={5} />
                        <Text style={{ fontSize:20, color:'white' }}>Tomou</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>router.back()} style={{ position:'absolute', bottom:25 }}>
              <Ionicons name="close-circle" size={44} color={Colors.GRAY} />
            </TouchableOpacity>
        </View>
      );
    }

    // otherwise, show list of reminders and let user choose which horário marcar
    return (
      <View style={styles.container}>
          <Image source={require('./../../assets/images/notification.gif')}
              style={{ width:120, height:120 }}
          />
          <Text style={{fontSize:18}}>{selectedDate}</Text>
          <Text style={{fontSize:18, marginTop:6}}>Selecione o horário que deseja registrar</Text>

          <View style={{width:'100%', marginTop:20}}>
            {(reminders || []).map((r) => (
              <View key={r} style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:8, borderBottomWidth:1, borderColor:'#eee'}}>
                <Text style={{fontSize:18}}>{r}</Text>
                <View style={{flexDirection:'row', gap:8}}>
                  <TouchableOpacity style={[styles.smallBtn, {backgroundColor:Colors.RED}]} onPress={()=> UpdateActionStatus('Não Tomou', r)}>
                    <Text style={{color:'white'}}>Não</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.smallBtn, {backgroundColor: Colors.GREEN}]} onPress={()=> UpdateActionStatus('Tomou', r)}>
                    <Text style={{color:'white'}}>Tomou</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity onPress={()=>router.back()} style={{ position:'absolute', bottom:25 }}>
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
        borderRadius:10,
        backgroundColor:Colors.RED,
    },
    successBtn:{
        padding:10,
        flexDirection:'row',
        gap:6,
        backgroundColor:Colors.GREEN,
        alignItems:'center',
        borderRadius:10
    },
    smallBtn:{
      paddingHorizontal:10,
      paddingVertical:6,
      borderRadius:6,
      justifyContent:'center',
      alignItems:'center'
    }
})
