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

export const getDatesRange = (startDate, endDate) => {
  const start = moment(new Date(startDate), "DD/MM/YYYY");
  const end = moment(new Date(endDate), "DD/MM/YYYY");
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
