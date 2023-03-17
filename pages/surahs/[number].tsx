import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import style from "styles/Surah.module.scss";
import Ayah from "@/components/Ayah";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { Spin } from "antd";
import { LoadingOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { playerActions } from "@/store/playerSlice";

type Ayah = {
  audio: string;
  number: number;
  numberInSurah: number;
  sajda: boolean;
  text: string;
};

type DataType = {
  data: {
    ayahs: Ayah[];
    englishName: string;
    englishNameTranslation: string;
    name: string;
    number: number;
    numberOfAyahs: number;
    revelationType: string;
  };
};
type UzDataType = {
  data: {
    ayahs: { text: string }[];
    name: string;
  };
};

const api = axios.create({
  baseURL: "https://api.alquran.cloud/v1/surah",
});

const spinner = <LoadingOutlined style={{ fontSize: 60 }} spin />;

const Surah = () => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const { isPlaying, currentAudio } = useSelector(
    (state: RootState) => state.player
  );
  const { query } = useRouter();
  const audioElement = useRef<HTMLAudioElement>(null);
  const [data, setData] = useState<DataType | null>(null);
  const [uzData, setUzData] = useState<UzDataType | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getSurah = async () => {
      const arData = await api
        .get(`${query.number}/ar.alafasy`)
        .then((data) => {
          setData(data?.data);
          setError(null);
        })
        .catch((e) => setError(e));
      const uzData = await api
        .get(`/${query.number}/uz.sodik`)
        .then((data) => {
          setUzData(data?.data);
          setError(null);
        })
        .catch((e) => setError(e))
        .finally(() => setLoading(false));
    };

    if (query.number !== undefined && !data) {
      getSurah();
    }
  }, [query]);

  useEffect(() => {
    if (isPlaying) {
      audioElement.current?.play();
    } else audioElement.current?.pause();
  }, [isPlaying, currentAudio]);

  useEffect(() => {
    return () => {
      dispatch(playerActions.pause());
      dispatch(playerActions.setCurrentAudio(""));
      dispatch(playerActions.setCurrentAudioNumber(0));
      audioElement.current?.pause();
    };
  }, []);

  const onEnded = () => {
    dispatch(playerActions.pause());
  };

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      {loading ? (
        <div className={style.loading}>
          <Spin indicator={spinner} />
        </div>
      ) : error ? (
        <div className={style.error}>
          <CloseCircleTwoTone twoToneColor={"#f55"} />
          <p>Something went wrong</p>
        </div>
      ) : (
        <div className={style.ayahsWrapper}>
          <audio
            src={currentAudio}
            ref={audioElement}
            onEnded={onEnded}
          ></audio>
          {data?.data.ayahs.map((item, i) => {
            return (
              <Ayah
                key={i}
                surahNumber={data.data.number}
                number={item.numberInSurah}
                arText={item.text}
                uzText={uzData!.data.ayahs[i]?.text}
                audio={item.audio}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Surah;
