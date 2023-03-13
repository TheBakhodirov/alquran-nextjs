import { useEffect, useState } from "react";
import { images } from "@/constants";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import axios from "axios";
import style from "styles/Prayers.module.scss";
import { GetServerSideProps } from "next";
import prayersTimeHelpers from "@/utils/prayersTimeHelpers";
import Image, { StaticImageData } from "next/image";
import { message } from "antd";

const api = axios.create({
  baseURL: "https://islomapi.uz/api/present/",
});

type PropType = {
  data: {
    time: String;
    isCurrent: Boolean;
    name: String;
    icon: StaticImageData;
  }[];
};

const prayers = ({ data }: PropType) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const region = useSelector((state: RootState) => state.prayer.region);
  const [messageApi, contextHolder] = message.useMessage();
  const [prayersData, setPrayersData] = useState(data);
  const [firstInit, setFirstInit] = useState(true);

  useEffect(() => {
    const getPrayerData = async () => {
      const res = await api
        .get(`day?region=${region}`)
        .then((data) => {
          const result = prayersTimeHelpers.handleData(data.data?.times);
          setPrayersData(result);
        })
        .catch(() =>
          messageApi.open({
            type: "error",
            content: "Unexpected error. Please, try again",
          })
        );
    };

    if (firstInit) {
      setFirstInit(false);
      return;
    } else getPrayerData();
  }, [region]);

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      <div className={style.prayerTimes}>
        <div className={style.foreground}>
          {prayersData?.map((prayer, index) => (
            <div
              key={index}
              className={
                prayer.isCurrent ? style.prayerBoxActive : style.prayerBox
              }
              style={{
                backgroundImage: `url(${images.prayerBgImgs[index].src})`,
              }}
            >
              <div className={style.prayerName}>
                <Image
                  src={prayer.icon.src}
                  alt={`${prayer.name} icon`}
                  width={30}
                  height={30}
                />
                <p>{prayer.name}</p>
              </div>
              <div className={style.prayerTime}>
                <p>{prayer.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await api.get("day?region=Toshkent");

  const result = prayersTimeHelpers.handleData(data?.times);

  return {
    props: { data: result },
  };
};

export default prayers;
