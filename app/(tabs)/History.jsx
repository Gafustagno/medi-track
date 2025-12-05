import { router } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MedicationCardItem from '../../components/MedicationCardItem';
import { db } from '../../config/FirebaseConfig';
import Colors from '../../constant/Colors';
import { GetPrevDateRangeToDisplay } from '../../service/ConvertDateTime';
import { getLocalStorage } from '../../service/Storage';

export default function History() {
  const [selectedDate,setSelectedDate]=useState(moment().format('DD/MM/YYYY'));
  const [dateRange,setDateRange]=useState();
  const [loading,setLoading]=useState(false);
  const [medList,setMedList]=useState([]);

  useEffect(()=>{
    GetDateList();
    GetMedicationList(selectedDate);
  },[])

  const GetDateList=()=>{
    const dates=GetPrevDateRangeToDisplay();
    setDateRange(dates);
  }

  const GetMedicationList = async (selectedDate) => {
    setLoading(true);
    const user = await getLocalStorage('userDetail');
    setMedList([]);
    try {
      // busca todos os medicamentos do usuário
      const q = query(collection(db, 'medication'), where('userEmail', '==', user?.email));
      const querySnapshot = await getDocs(q);

      const list = querySnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // filtrar localmente
      const filtered = list.filter(med => {
        if (Array.isArray(med.dates) && med.dates.includes(selectedDate)) return true;

        const sel = moment(selectedDate, 'L'); // 'L' -> 'DD/MM/YYYY'
        if (!med.startDate) return false;

        const start = moment(new Date(med.startDate));
        if (!start.isValid()) return false;

        if (med.continuous) {
          // se é contínuo, aparece para qualquer dia >= start
          return sel.isSameOrAfter(start, 'day');
        }

        if (med.endDate) {
          const end = moment(new Date(med.endDate));
          if (!end.isValid()) return false;
          return sel.isBetween(start.clone().subtract(1, 'day'), end.clone().add(1, 'day'), 'day');
        }

        return false;
      });

      setMedList(filtered);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  return (
    <FlatList 
      data={[]}
      style={{
        height:'100%',
        backgroundColor:'white'
      }}
      ListHeaderComponent={
      <View style={styles?.mainContainer}>
          <Image source={require('./../../assets/images/Health-Article-Box1.png')}
            style={styles.imageBanner}
          />

          <Text style={styles.header}>Histórico</Text>

          <FlatList
              data={dateRange}
              horizontal
              style={{marginTop:15}}
              showsHorizontalScrollIndicator={false}
              renderItem={({item,index})=>(
                  <TouchableOpacity style={[styles.dateGroup,
                    {backgroundColor:item.formattedDate==selectedDate?Colors.PRIMARY:Colors.LIGHT_GRAY_BORDER}]}
                  onPress={()=>{setSelectedDate(item.formattedDate);
                      GetMedicationList(item.formattedDate)
                  }}>
                      <Text style={[styles.day,{color:item.formattedDate==selectedDate?'white':'black'}]}>{item.day}</Text>
                      <Text style={[styles.date,{color:item.formattedDate==selectedDate?'white':'black'}]}>{item.date}</Text>
                  </TouchableOpacity>
              )}
          />

  {medList?.length>0?  <FlatList
              data={medList}
              onRefresh={()=>GetMedicationList(selectedDate)}
              refreshing={loading}
              renderItem={({item,index})=>(
                  <TouchableOpacity onPress={()=>router.push({
                      pathname:'/action-modal',
                      params:{
                          ...item,
                          docId: item.id,
                          selectedDate:selectedDate,
                          reminders: JSON.stringify(item.reminders || (item.reminder ? [item.reminder] : []))
                      }
                  })}>
                <MedicationCardItem medicine={item} selectedDate={selectedDate} /> 
                </TouchableOpacity>
              )}
          />:
          <Text style={{
            fontSize:25,
            padding:30,
            fontWeight:'bold',
            color:Colors.GRAY,
            textAlign:'center'
          }}>Nenhum medicamento encontrado</Text>
          }

      </View>}
    />
  )
}

const styles = StyleSheet.create({
  mainContainer:{
    padding:20,
    backgroundColor:'white',
    
  },
  imageBanner: {
    width: '100%',
    height: 350,
    resizeMode: 'contain',
    borderRadius: 0,
    backgroundColor: 'black',
  },
  header:{
    fontSize:25,
    fontWeight:'bold',
    marginTop:20
  },
  dateGroup:{
    padding:15,
    backgroundColor:Colors.LIGHT_GRAY_BORDER,
    display:'flex',
    alignItems:'center',
    marginRight:10,
    borderRadius:10
  },
  day:{
    fontSize:20
  },
  date:{
    fontSize:26,
    fontWeight:'bold'
  }
})
