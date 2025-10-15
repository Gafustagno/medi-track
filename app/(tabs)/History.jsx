import { router } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MedicationCardItem from '../../components/MedicationCardItem';
import Colors from '../../constant/Colors';
import { GetPrevDateRangeToDisplay } from '../../service/ConvertDateTime';
import { getLocalStorage } from '../../service/Storage';
import { db } from '../config/FirebaseConfig';

export default function History() {
  const [selectedDate,setSelectedDate]=useState(moment().format('DD/MM/YYYY'));
  const [dateRange,setDateRange]=useState();
  const [loading,setLoading]=useState(false);
  const [medList,setMedList]=useState();
  useEffect(()=>{
    GetDateList();
    GetMedicationList(selectedDate);
  },[])

  const GetDateList=()=>{
    const dates=GetPrevDateRangeToDisplay();
    setDateRange(dates);
  }

  const GetMedicationList=async(selectedDate)=>{
    setLoading(true);
    const user=await getLocalStorage('userDetail');
    setMedList([]);
    try{
    const q=query(collection(db,'medication'),
    where('userEmail','==',user?.email),
    where('dates','array-contains',selectedDate));


    const querySnapshot=await getDocs(q);
  
    console.log("--",selectedDate)
    querySnapshot.forEach((doc)=>{
        console.log("docId:-"+doc.id+'==>',doc.data())
        setMedList(prev=>[...prev,doc.data()])
    })
    setLoading(false);

    }catch(e)
    {
        console.log(e)
    setLoading(false);

    }
}
  return (
    <FlatList 
    data={[]}
    style={{
      height:'100%',
      backgroundColor:'white'
    }}
    ListHeaderComponent={
    <View style={styles?.mainContainer}>
        <Image source={require('./../../assets/images/med-history.png')}
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
                        selectedDate:selectedDate
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
  imageBanner:{
    width:'100%',
    height:200,
    borderRadius:15
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