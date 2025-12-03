/*MedicationList.jsx*/

import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../app/config/FirebaseConfig';
import Colors from '../constant/Colors';
import { GetDateRangeToDisplay } from '../service/ConvertDateTime';
import { getLocalStorage } from '../service/Storage';
import EmptyState from './EmptyState';
import MedicationCardItem from './MedicationCardItem';
import { useIsFocused } from "@react-navigation/native";



export default function MedicationList() {

        const [medList,setMedList]=useState();
        const [dateRange,setDateRange]=useState();
        const [selectedDate,setSelectedDate]=useState(moment().format('DD/MM/YYYY'));
        const [loading,setLoading]=useState(false);
        
        /* para editar e excluir is Focused*/
        const isFocused = useIsFocused();

        useEffect(() => {
        if (isFocused) {
            GetMedicationList(selectedDate);
        }
        }, [isFocused]);

        const router=useRouter();
        useEffect(()=>{
            GetDateRangeList();   /*retirei o getmedicationlist daqui pra nao ficar duplicado - estava dando erro pq repetia id */          
        },[])
    
        const GetDateRangeList=()=>{
            const dateRange=GetDateRangeToDisplay();
            setDateRange(dateRange);
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

            const list = querySnapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data(),
            }));

            setMedList(list);
            } catch (e) {
                console.log(e);
            }

            setLoading(false);
            };
                      
            /*
            console.log("--",selectedDate)
            querySnapshot.forEach((doc)=>{
                console.log("docId:-"+doc.id+'==>',doc.data())
                setMedList(prev=>[...prev,{id: doc.id, ...doc.data()}]) /* adiciona doc id pra pq pega pelo id pra editar e excluir
            })
            setLoading(false);
    
            }catch(e)
            {
                console.log(e)
            setLoading(false);
    
            }
        }
    */
      return (
        <View style={{
            marginTop:25
        }}>
            <Image source={require('./../assets/images/header.jpg')}
            style={{
                width:'100%',
                height:200,
                borderRadius:15
            }}
            />
    
            <FlatList
                data={dateRange}
                horizontal
                style={{marginTop:15}}
                showsHorizontalScrollIndicator={false}
                renderItem={({item,index})=>(
                    <TouchableOpacity style={[styles.dateGroup,{backgroundColor:item.formattedDate==selectedDate?Colors.PRIMARY:Colors.LIGHT_GRAY_BORDER}]}
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
                renderItem={({item,index})=>(  /*nao pode ser touchable o card inteiro senao ao clicar em editar ou excluir dispara o action-modal inteiro*/
                    <MedicationCardItem medicine={item}
                    selectedDate={selectedDate}
                    onPress={() => router.push({ pathname: '/action-modal', params: item })} />                  
                )}
            />:<EmptyState/>}
    
           
    
        </View>
      )
    }
    
    const styles = StyleSheet.create({
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