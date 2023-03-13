import { images } from "@/constants";
import { StaticImageData } from "next/image";

type DataTypes = String[];

type PrayerTimes = {
  time: String;
  isCurrent: Boolean;
  name: String;
  icon: StaticImageData;
}[];

function handleData(obj: DataTypes) {
  const prayerTimes: PrayerTimes = [];
  Object.values(obj).map((value, index) => {
    prayerTimes.push({
      ...images.prayerTimesIcons[index],
      time: value,
      isCurrent: isCurrentPrayer(
        value,
        Object.values(obj)[index + 1],
        Object.values(obj)[0]
      ),
    });
  });

  return prayerTimes;
}

function getTime(): String {
  const date = new Date();
  let minutes = date.getMinutes().toString();
  let hours = date.getHours().toString();
  if (parseInt(minutes) < 10) {
    minutes = "0" + minutes;
  }
  if (parseInt(hours) < 10) {
    hours = "0" + hours;
  }
  const time = `${hours} : ${minutes}`;
  return time;
}

function isCurrentPrayer(
  prayerTime: String,
  nextPrayerTime: String,
  fajrTime: String
) {
  let isCurrent = false;
  const time = getTime();
  const currentTime = parseInt(time.match(/\d/g)?.join("") || "0000");
  // @ts-ignore: Object is possibly 'null'.
  const currentPrayer = parseInt(prayerTime?.match(/\d/g).join(""));
  // @ts-ignore: Object is possibly 'null'.
  const nextPrayer = parseInt(nextPrayerTime?.match(/\d/g).join(""));
  // @ts-ignore: Object is possibly 'null'.
  const fajr = parseInt(fajrTime?.match(/\d/g).join(""));

  if (
    (currentTime >= currentPrayer && currentTime < nextPrayer) ||
    (currentTime >= currentPrayer && !nextPrayer) ||
    (currentTime < fajr && !nextPrayer)
  ) {
    isCurrent = true;
  }
  return isCurrent;
}

export default { handleData, getTime };
