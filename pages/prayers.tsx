import { useEffect, useRef, useState } from "react";
import { images } from "@/constants";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import axios from "axios";
import style from "styles/Prayers.module.scss";
import { GetServerSideProps, GetStaticProps } from "next";
import prayersTimeHelpers from "@/utils/prayerTimesHelpers";
import Image, { StaticImageData } from "next/image";
import { message } from "antd";

const api = axios.create({
  baseURL: "https://islomapi.uz/api/present/",
});

type PropType = {
  data: {
    time: string;
    isCurrent: Boolean;
    name: string;
    icon: StaticImageData;
  }[];
};

const prayers = ({ data }: PropType) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const region = useSelector((state: RootState) => state.prayer.region);
  const [messageApi, contextHolder] = message.useMessage();
  const [prayersData, setPrayersData] = useState(data);
  const [firstInit, setFirstInit] = useState(true);
  const activePrayerDiv = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);

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
    } else {
      getPrayerData();
      container.current?.scrollTo({
        left: activePrayerDiv.current!.offsetLeft,
        behavior: "smooth",
      });
    }
  }, [region]);

  useEffect(() => {
    container.current?.scrollTo({
      left: activePrayerDiv.current!.offsetLeft,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      <div className={style.prayerTimes}>
        <div className={style.foreground} ref={container}>
          {prayersData?.map((prayer, index) => (
            <div
              key={index}
              className={
                prayer.isCurrent ? style.prayerBoxActive : style.prayerBox
              }
              style={{
                backgroundImage: `url(${images.prayerBgImgs[index].src})`,
              }}
              ref={prayer.isCurrent ? activePrayerDiv : null}
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

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("day?region=Toshkent");

  const result = prayersTimeHelpers.handleData(data?.times);

  return {
    props: { data: result },
  };
};

export default prayers;
