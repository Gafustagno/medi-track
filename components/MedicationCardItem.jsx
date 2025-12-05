// components/MedicationCardItem.jsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constant/Colors';
import { TypeList } from '../constant/Options';

/* excluir medicamento*/
import { useRouter } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from '../config/FirebaseConfig';


export default function MedicationCardItem({ medicine, selectedDate = '' , onDelete}) {
  const [status, setStatus] = useState();
  /* excluir medicamento*/
  const router = useRouter();

  const handleDelete = async () => {

    Alert.alert(
    "Confirmar exclusão",
    `Deseja realmente excluir o medicamento "${medicine.name}"?`,
    [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
            try {
              await deleteDoc(doc(db, "medication", medicine.id));
              alert("Medicamento excluído!");

              if (onDelete) onDelete(medicine.id); // remove da UI imediatamente
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  /* editar medicamento */
  const handleEdit = () => {
    router.push({
      pathname: "/edit-medication",
      params: { id: medicine.id }
    });
  };

  useEffect(() => {
    CheckStatus();
  }, [medicine]);

  const CheckStatus = () => {
    try {
      // ajustar lógica para múltiplos horários
      const reminders = medicine.reminders || (medicine.reminder ? [medicine.reminder] : []);
      const actionsToday = (medicine.action || []).filter(a => a.date === selectedDate);
      if (actionsToday.length === 0) {
        setStatus(null);
        return;
      }
      const takenCount = reminders.filter(r => actionsToday.some(a => a.time === r && a.status === 'Tomou')).length;
      setStatus({ takenCount, total: reminders.length });
    } catch (e) {}
  };

  const getIconByType = (typeName) => {
    const foundType = TypeList.find(
      (item) => item.name.toLowerCase() === typeName?.toLowerCase()
    );
    return foundType ? foundType.icon : require('../assets/images/Antibiotics.png');
  };

  const reminders = medicine.reminders || (medicine.reminder ? [medicine.reminder] : []);

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() =>
        router.push({
          pathname: "/action-modal",
          params: {
            ...medicine,
            selectedDate,
            docId: medicine.id,
            reminders: JSON.stringify(reminders),
          },
        })
      }
    >
      <View style={styles.subContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={getIconByType(medicine?.type?.name)}
            style={{ width: 60, height: 60 }}
          />
        </View>
        <View>
          <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{medicine?.name}</Text>
          <Text style={{ fontSize: 13 }}>{medicine?.when}</Text>
          <Text style={{ color: Colors.PRIMARY }}>
            {medicine?.dose} {medicine?.type?.name}
          </Text>
        </View>
      </View>

      <View style={styles.reminderContainer}>
        <Ionicons name="timer-outline" size={22} color="black" />
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {reminders.length === 1 ? reminders[0] : `${reminders[0]} ${reminders.length>1 ? `+${reminders.length-1}` : ''}`}
        </Text>
      </View>

      {status?.total && (
        <View style={styles.statusContainer}>
          {status.takenCount === status.total ? (
            <Ionicons name="checkmark-circle" size={24} color={Colors.GREEN} />
          ) : status.takenCount === 0 ? (
            <Ionicons name="close-circle" size={24} color="red" />
          ) : (
            <Text>{`${status.takenCount}/${status.total}`}</Text>
          )}
        </View>
      )}

    {/* Botões editar e excluir */}
    <View style={{ flexDirection: "row", gap: 20, marginTop: 10 }}>
      <TouchableOpacity onPress={handleEdit}>
        <Ionicons name="create-outline" size={26} color="blue" />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDelete}>
        <Ionicons name="trash-outline" size={26} color="red" />
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
    );
}


const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BORDER,
    marginTop: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    marginRight: 15,
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderContainer: {
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BORDER,
  },
  statusContainer: {
    position: 'absolute',
    top: 5,
    padding: 7,
  },
}); 
