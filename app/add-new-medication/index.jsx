//app/add-new-medication/index.jsx

import { ScrollView } from 'react-native'
import AddMedicationForm from '../../components/AddMedicationForm'
import AddMedicationHeader from '../../components/AddMedicationHeader'


export default function AddNewMedication() {
  return (
    <ScrollView>
      <AddMedicationHeader/>

      <AddMedicationForm/>
    </ScrollView>
  )
}