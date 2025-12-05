// components/MedicationCardItem.jsx
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/FirebaseConfig';
import Colors from '../constant/Colors';
import { TypeList } from '../constant/Options';

export default function MedicationCardItem({ medicine, selectedDate = '' , onDelete}) {
  const [status, setStatus] = useState();
  const router = useRouter();

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar exclusão",
      `Deseja realmente excluir o medicamento "${medicine.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "medication", medicine.id));
              alert("Medicamento excluído!");
              if (onDelete) onDelete(medicine.id);
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

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
      const reminders = medicine.reminders || (medicine.reminder ? [medicine.reminder] : []);
      const actionsToday = (medicine.action || []).filter(a => a.date === selectedDate);
      if (actionsToday.length === 0) {
        setStatus(null);
        return;
      }
      const takenCount = reminders.filter(r => actionsToday.some(a => a.time === r && a.status === 'Tomou')).length;
      setStatus({ takenCount, total: reminders.length });
    } catch (e) {
      // silencioso
    }
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
      <View style={styles.imageContainer}>
        <Image source={getIconByType(medicine?.type?.name)} style={styles.image} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{medicine?.name}</Text>
        <Text style={styles.sub}>{medicine?.when}</Text>
        <Text style={styles.dose}>{medicine?.dose} {medicine?.type?.name}</Text>
      </View>

      <View style={styles.rightColumn}>
        {/* badge de status agora fica aqui em cima */}
        <View style={styles.statusInline}>
          {status?.total ? (
            status.takenCount === status.total ? (
              <View style={[styles.statusBadge, { backgroundColor: Colors.GREEN }]}/>
            ) : status.takenCount === 0 ? (
              <View style={[styles.statusBadge, { backgroundColor: 'red' }]}/>
            ) : (
              <Text style={styles.partialStatusText}>{`${status.takenCount}/${status.total}`}</Text>
            )
          ) : null}
        </View>

        <View style={styles.reminderContainer}>
          <Ionicons name="timer-outline" size={18} color="black" />
          <Text style={styles.reminderText}>
            {reminders.length === 1 ? reminders[0] : `${reminders[0]} ${reminders.length>1 ? `+${reminders.length-1}` : ''}`}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={handleEdit} style={styles.actionBtn}>
            <Ionicons name="create-outline" size={22} color="blue" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={22} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BORDER,
    marginTop: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  imageContainer: {
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginRight: 12,
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flexShrink: 1,
  },
  sub: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
  },
  dose: {
    color: Colors.PRIMARY,
    marginTop: 4,
  },
  rightColumn: {
    width: 110,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  statusInline: {
    alignSelf: 'flex-end',
    marginBottom: 6,
    minHeight: 18,
  },
  statusBadge: {
    width: 18,
    height: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
  },
  partialStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  reminderContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BORDER,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  reminderText: {
    fontWeight: '700',
    fontSize: 14,
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
