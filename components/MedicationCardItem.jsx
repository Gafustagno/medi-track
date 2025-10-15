import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '../constant/Colors';
import { TypeList } from '../constant/Options';

export default function MedicationCardItem({ medicine, selectedDate = '' }) {
  const [status, setStatus] = useState();

  useEffect(() => {
    CheckStatus();
  }, [medicine]);

  const CheckStatus = () => {
    try {
      const data = medicine?.action?.find((item) => item?.date == selectedDate);
      setStatus(data);
    } catch (e) {}
  };

  // 👇 função que retorna o ícone correto com base no tipo
  const getIconByType = (typeName) => {
    const foundType = TypeList.find(
      (item) => item.name.toLowerCase() === typeName?.toLowerCase()
    );
    return foundType ? foundType.icon : require('../assets/images/Antibiotics.png');
  };

  return (
    <View style={styles.container}>
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
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{medicine?.reminder}</Text>
      </View>

      {status?.date && (
        <View style={styles.statusContainer}>
          {status?.status == 'Tomou' ? (
            <Ionicons name="checkmark-circle" size={24} color={Colors.GREEN} />
          ) : status?.status == 'Não Tomou' ? (
            <Ionicons name="close-circle" size={24} color="red" />
          ) : null}
        </View>
      )}
    </View>
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
    justifyContent: 'space-between',
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
