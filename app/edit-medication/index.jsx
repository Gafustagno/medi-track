//app\edit-medication\index.jsx

import Ionicons from "@expo/vector-icons/Ionicons";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constant/Colors";
import { TypeList, WhenToTake } from "../../constant/Options";
import {
  formatTime,
  FormatDate,
  formatDateForText,
  getDatesRange,
  timeStringToDate,
} from "../../service/ConvertDateTime";
import { db } from "../../config/FirebaseConfig";

export default function EditMedicine() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const [form, setForm] = useState({
    name: "",
    dose: "",
    type: { name: "", icon: 0 },
    when: "",
    reminder: "",
    startDate: "",
    endDate: "",
  });

  // CARREGA DADOS DO FIRESTORE
  useEffect(() => {
    loadMedicine();
  }, []);

  const loadMedicine = async () => {
    const ref = doc(db, "medication", id);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setForm({
        name: data.name || "",
        dose: data.dose || "",
        type: {
          name: data.type?.name || "",
          icon: data.type?.icon ?? 0,
        },
        when: data.when || "",
        reminder: data.reminder || "",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
      });
    }
  };

  // SALVA EDIÇÕES NO FIRESTORE
  const saveEdit = async () => {
    const ref = doc(db, "medication", id);
    const snap = await getDoc(ref);
    const data = snap.data();

    const newDates = getDatesRange(form.startDate, form.endDate);

    await updateDoc(ref, {
      ...form,
      dates: newDates,
      action: data.action ?? [], // preserva histórico
    });

    alert("Medicamento atualizado!");
    router.replace("(tabs)");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Editar Medicamento",
          headerShown: true,
          headerBackVisible: true,
        }}
      />

      <View style={styles.container}>
        {/* Nome */}
        <View style={styles.inputGroup}>
          <Ionicons
            style={styles.icon}
            name="medkit-outline"
            size={24}
            color="black"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Nome do Medicamento"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
            autoComplete="off"
            autoCorrect={false}
            importantForAutofill="no"
          />
        </View>

        {/* Tipo */}
        <FlatList
          data={TypeList}
          horizontal
          style={{ marginTop: 5 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.inputGroup,
                { marginRight: 10 },
                {
                  backgroundColor:
                    item.name === form.type.name ? Colors.PRIMARY : "white",
                },
              ]}
              onPress={() => setForm({ ...form, type: item })}
            >
              <Text
                style={[
                  styles.typeText,
                  {
                    color:
                      item.name === form.type.name ? "white" : "black",
                  },
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Dose */}
        <View style={styles.inputGroup}>
          <Ionicons
            style={styles.icon}
            name="eyedrop-outline"
            size={24}
            color="black"
          />
          <TextInput
            style={styles.textInput}
            placeholder="Dose - Ex: 2,5ml"
            value={form.dose}
            onChangeText={(v) => setForm({ ...form, dose: v })}
            autoComplete="off"
            autoCorrect={false}
            importantForAutofill="no"
          />
        </View>

        {/* Quando tomar */}
        <View style={styles.inputGroup}>
          <Ionicons
            style={styles.icon}
            name="time-outline"
            size={24}
            color="black"
          />
          <Picker
            selectedValue={form.when}
            onValueChange={(v) => setForm({ ...form, when: v })}
            style={{ width: "90%" }}
          >
            {WhenToTake.map((item, index) => (
              <Picker.Item key={index} label={item} value={item} />
            ))}
          </Picker>
        </View>

        {/* Período de Uso */}
        <Text style={styles.label}>Período de Uso</Text>

        <View style={styles.dateInputGroup}>
          {/* DATA INICIAL */}
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowStartDate(true)}
          >
            <Ionicons
              style={styles.icon}
              name="calendar-outline"
              size={24}
              color="black"
            />
            <Text style={styles.text}>
              {form.startDate
                ? formatDateForText(form.startDate)
                : "Data Inicial"}
            </Text>
          </TouchableOpacity>

          {showStartDate && (
            <RNDateTimePicker
              minimumDate={new Date()}
              value={
                form.startDate ? new Date(form.startDate) : new Date()
              }
              onChange={(event) => {
                if (event.type === "dismissed")
                  return setShowStartDate(false);
                setForm({
                  ...form,
                  startDate: FormatDate(event.nativeEvent.timestamp),
                });
                setShowStartDate(false);
              }}
            />
          )}

          {/* DATA FINAL */}
          <TouchableOpacity
            style={styles.dateBox}
            onPress={() => setShowEndDate(true)}
          >
            <Ionicons
              style={styles.icon}
              name="calendar-outline"
              size={24}
              color="black"
            />
            <Text style={styles.text}>
              {form.endDate
                ? formatDateForText(form.endDate)
                : "Data Final"}
            </Text>
          </TouchableOpacity>

          {showEndDate && (
            <RNDateTimePicker
              minimumDate={new Date()}
              value={form.endDate ? new Date(form.endDate) : new Date()}
              onChange={(event) => {
                if (event.type === "dismissed")
                  return setShowEndDate(false);
                setForm({
                  ...form,
                  endDate: FormatDate(event.nativeEvent.timestamp),
                });
                setShowEndDate(false);
              }}
            />
          )}
        </View>

        {/* Horário do Lembrete */}
        <View style={styles.inputGroup}>
          <Ionicons
            style={styles.icon}
            name="timer-outline"
            size={24}
            color="black"
          />
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.text}>
              {form.reminder ? form.reminder : "Selecionar Horário"}
            </Text>
          </TouchableOpacity>
        </View>

        {showTimePicker && (
          <RNDateTimePicker
            mode="time"
            value={
              form.reminder
                ? timeStringToDate(form.reminder)
                : new Date()
            }
            onChange={(event) => {
              if (event.type === "dismissed")
                return setShowTimePicker(false);
              setForm({
                ...form,
                reminder: formatTime(event.nativeEvent.timestamp),
              });
              setShowTimePicker(false);
            }}
          />
        )}

        {/* Botão */}
        <TouchableOpacity style={styles.button} onPress={saveEdit}>
          <Text style={styles.buttonText}>SALVAR ALTERAÇÕES</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 25 },

  inputGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BORDER,
    marginTop: 10,
    backgroundColor: "white",
  },

  dateBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY_BORDER,
    backgroundColor: "white",
  },

  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },

  icon: {
    color: Colors.PRIMARY,
    borderRightWidth: 1,
    paddingRight: 12,
    borderColor: Colors.GRAY,
  },

  typeText: {
    fontSize: 16,
  },

  text: {
    fontSize: 16,
    paddingLeft: 10,
  },

  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 15,
    width: "100%",
    marginTop: 25,
  },

  buttonText: {
    fontSize: 17,
    color: "white",
    textAlign: "center",
  },

  dateInputGroup: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
});
