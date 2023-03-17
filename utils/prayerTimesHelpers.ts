import { images } from "@/constants";
import { StaticImageData } from "next/image";

type DataTypes = string[];

type PrayerData = {
  time: string;
  isCurrent: Boolean;
  name: string;
  icon: StaticImageData;
};

type PrayerTimes = PrayerData[];

function handleData(obj: DataTypes): PrayerTimes {
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

function revalidateData(data: PrayerTimes): PrayerTimes {
  const revalidatedData: PrayerTimes = [];

  data.map((prayer, index) => {
    revalidatedData.push({
      ...prayer,
      isCurrent: isCurrentPrayer(
        prayer.time,
        data[index + 1].time,
        data[0].time
      ),
    });
  });

  return revalidatedData;
}

function getTime(): string {
  const date = new Date();
  let minutes = date.getMinutes().toString();
  let hours = date.getHours().toString();

  if (parseInt(minutes) < 10) {
    minutes = "0" + minutes;
  }

  const time = `${hours}${minutes}`;

  return time;
}

function isCurrentPrayer(
  prayerTime: string,
  nextPrayerTime: string,
  fajrTime: string
) {
  let isCurrent = false;
  const currentTime = parseInt(getTime());

  const currentPrayer = parseInt(prayerTime.replace(":", ""));
  const nextPrayer = parseInt(nextPrayerTime?.replace(":", ""));
  const fajr = parseInt(fajrTime.replace(":", ""));

  if (
    (currentTime >= currentPrayer && currentTime < nextPrayer) ||
    (currentTime >= currentPrayer && !nextPrayer) ||
    (currentTime < fajr && !nextPrayer)
  ) {
    isCurrent = true;
  }
  return isCurrent;
}

export default { handleData, revalidateData, getTime };
