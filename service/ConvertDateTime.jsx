//service\ConvertDateTime.jsx

import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

export const FormatDate = (timestamp) => {
  return new Date(timestamp).setHours(0, 0, 0, 0);
};

export const formatDateForText = (date) => {
  return moment(date).format("L"); // Ex: 14 de outubro de 2025
};

export const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const timeString = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  console.log(timeString);
  return timeString; // Ex: 09:00
};

export const getDatesRange = (startDate, endDate, maxDays = null) => {
  const start = moment(new Date(startDate));
  let end;

  if (endDate) {
    end = moment(new Date(endDate));
  } else if (maxDays) {
    end = moment(new Date(startDate)).add(maxDays, 'days');
  } else {
    // sem endDate e sem maxDays -> retorna apenas o start
    end = moment(new Date(startDate));
  }

  const dates = [];
  while (start.isSameOrBefore(end)) {
    dates.push(start.format("L")); // Ex: 14/10/2025
    start.add(1, "days");
  }

  return dates;
};


export const GetDateRangeToDisplay = () => {
  const dateList = [];
  for (let i = 0; i <= 7; i++) {
    dateList.push({
      date: moment().add(i, "days").format("DD"), // 27
      day: moment().add(i, "days").format("dd"), // qua
      formattedDate: moment().add(i, "days").format("L"), // 14/10/2025
    });
  }

  return dateList;
};

export const GetPrevDateRangeToDisplay = () => {
  const dates = [];
  for (let i = 0; i <= 7; i++) {
    const date = moment().subtract(i, "days");

    dates.push({
      date: date.format("DD"),
      day: date.format("dd"),
      formattedDate: date.format("L"),
    });
  }
  return dates;
};

/* para converter de volta o horario de acordo com o q está salvo no firestore (em timestamp) qd o usuario vai editar o medicamento */
export const timeStringToDate = (timeString) => {
  if (!timeString) return new Date();
  const [hours, minutes] = timeString.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  return date;
};
 