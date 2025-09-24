import { FlatList, View } from 'react-native'
import Header from '../../components/Header'
import MedicationList from '../../components/MedicationList'

export default function HomeScreen() {
  return (
    <FlatList
        data={[]}
        style={{
          padding:20,
          backgroundColor:'white',
          height:'100%',
         
        }}
        ListHeaderComponent={
          <View >
            <Header/>
            <MedicationList/>
          </View>
        }
        />
  )
}