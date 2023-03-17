import { useEffect, useRef, useState } from "react";
import { images } from "@/constants";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import axios from "axios";
import style from "styles/Prayers.module.scss";
import prayersTimeHelpers from "@/utils/prayerTimesHelpers";
import Image, { StaticImageData } from "next/image";
import { message, Spin } from "antd";
import { LoadingOutlined, CloseCircleTwoTone } from "@ant-design/icons";

const api = axios.create({
  baseURL: "https://islomapi.uz/api/present/",
});

type DataType = {
  time: string;
  isCurrent: Boolean;
  name: string;
  icon: StaticImageData;
}[];

const spinner = (
  <LoadingOutlined style={{ fontSize: 60, color: "#3a9f70" }} spin />
);

const prayers = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const region = useSelector((state: RootState) => state.prayer.region);
  const [messageApi, contextHolder] = message.useMessage();
  const [prayersData, setPrayersData] = useState<DataType | null>(null);
  const [firstInit, setFirstInit] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const activePrayerDiv = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getPrayerData = async () => {
      const res = await api
        .get(`day?region=${region}`)
        .then((data) => {
          const result = prayersTimeHelpers.handleData(data.data?.times);
          setPrayersData(result);
          setFirstInit(false);
        })
        .catch((e) => {
          if (!firstInit) {
            messageApi.open({
              type: "error",
              content: "Network error. Please, try again",
            });
          } else if (firstInit) {
            setError(e);
          }
        })
        .finally(() => setLoading(false));
    };
    getPrayerData();
  }, [region]);

  useEffect(() => {
    container.current?.scrollTo({
      left: activePrayerDiv.current!.offsetLeft,
      behavior: "smooth",
    });
  }, [prayersData]);

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      {loading ? (
        <div className={style.loading}>
          <Spin indicator={spinner} />
        </div>
      ) : error ? (
        <div className={style.error}>
          <CloseCircleTwoTone twoToneColor={"#f55"} />
          <p>Something went wrong...</p>
        </div>
      ) : (
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
      )}
      {contextHolder}
    </div>
  );
};

export default prayers;
