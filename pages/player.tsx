import style from "styles/QuranPlayer.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { GetStaticProps } from "next";
import { Scheherazade_New } from "@next/font/google";
import axios from "axios";
import {
  TbPlayerPlay,
  TbPlayerPause,
  TbPlayerSkipBack,
  TbPlayerSkipForward,
} from "react-icons/tb";
import { BsBook } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { playerActions } from "@/store/playerSlice";
import { Spin, Drawer } from "antd";
import {
  LoadingOutlined,
  CloseOutlined,
  CloseCircleTwoTone,
} from "@ant-design/icons";

type PlayerProps = {
  surahs: {
    data: {
      name: string;
      number: number;
      englishName: string;
      englishNameTranslation: string;
    }[];
  };
  audioData: {
    data: {
      name: string;
      englishName: string;
      englishNameTranslation: string;
      number: number;
      numberOfAyahs: number;
      ayahs: {
        numberInSurah: number;
        audio: string;
        text: string;
        sajda: boolean;
      }[];
    };
  };
  uzData: {
    data: {
      ayahs: {
        text: string;
      }[];
    };
  };
};

const api = axios.create({
  baseURL: "https://api.alquran.cloud/v1/surah",
});

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: "400",
});

const SurahLoader = (
  <LoadingOutlined style={{ fontSize: 46, color: "#3a9f70" }} spin />
);
const AudioLoader = (
  <LoadingOutlined style={{ fontSize: 18, color: "#3a9f70" }} spin />
);

const QuranPlayer = ({ surahs, audioData, uzData }: PlayerProps) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const { isPlaying, currentSurahNumber, currentAudioNumber } = useSelector(
    (state: RootState) => state.player
  );
  const [ayahs, setAyahs] = useState(audioData);
  const [uzAyahs, setUzAyahs] = useState(uzData);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioFetchErr, setAudioFetchErr] = useState(false);
  const [canPlay, setCanPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const [firstInit, setFirstInit] = useState(true);
  const [showDrawer, setShowDrawer] = useState(false);
  const audioElement = useRef<HTMLAudioElement>(null);
  const ayahsContainer = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const audio = audioElement.current;

  useEffect(() => {
    return () => {
      dispatch(playerActions.pause());
      dispatch(playerActions.setCurrentSurahNumber(0));
      dispatch(playerActions.setCurrentAudioNumber(0));
      audio?.pause();
    };
  }, []);

  useEffect(() => {
    if (firstInit) {
      setFirstInit(false);
    }

    if (!firstInit) {
      changeSurah();
    }
  }, [currentSurahNumber]);

  useEffect(() => {
    if (isPlaying && !fetchError) {
      audio?.play();
    } else audio?.pause();
  }, [isPlaying, currentAudioNumber, canPlay]);

  async function changeSurah() {
    audio?.pause();
    dispatch(playerActions.pause());
    setCanPlay(false);
    setFetchError(false);
    setLoading(true);
    try {
      const res = await api.get(`/${currentSurahNumber}/uz.sodik`);
      setUzAyahs(res?.data);
    } catch (error) {
      setFetchError(true);
    }
    try {
      const res = await api.get(`/${currentSurahNumber}/ar.alafasy`);
      setAyahs(res?.data);
    } catch (error) {
      setFetchError(true);
    }

    if (!fetchError) {
      dispatch(playerActions.setCurrentAudioNumber(0));
      setProgress(0);
      dispatch(playerActions.play());
      setCanPlay(true);
      if (ayahsContainer.current) {
        ayahsContainer.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    }
    setLoading(false);
  }

  const handlePlay = () => {
    if (audio?.paused || !isPlaying) {
      dispatch(playerActions.play());
    } else dispatch(playerActions.pause());
  };

  const handleChangeAyah = (ayahNumber: Number) => {
    dispatch(playerActions.setCurrentAudioNumber(ayahNumber));
    if (!isPlaying) dispatch(playerActions.play());
  };

  const handlePrev = () => {
    if (currentAudioNumber === 0) {
      return;
    } else {
      dispatch(playerActions.setCurrentAudioNumber(currentAudioNumber - 1));
      if (!isPlaying) dispatch(playerActions.play());
    }
  };

  const handleNext = () => {
    if (currentAudioNumber === ayahs.data.ayahs.length - 1) {
      return;
    } else {
      dispatch(playerActions.setCurrentAudioNumber(currentAudioNumber + 1));
      if (!isPlaying) dispatch(playerActions.play());
    }
  };

  const onEnded = () => {
    if (currentAudioNumber === ayahs.data.ayahs.length - 1) {
      dispatch(playerActions.setCurrentAudioNumber(0));
      dispatch(playerActions.pause());
      setProgress(0);
      return;
    } else {
      dispatch(playerActions.setCurrentAudioNumber(currentAudioNumber + 1));
    }
  };

  const onPlaying = () => {
    const duration = audio!.duration;
    const ct = audio!.currentTime;
    const currentProgress = (ct / duration) * 100;
    setProgress(currentProgress);
  };

  const onCanPlay = () => {
    setAudioLoading(false);
    setAudioFetchErr(false);
    setCanPlay(true);
  };

  const onLoading = () => {
    setCanPlay(false);
    setAudioFetchErr(false);
    setAudioLoading(true);
  };

  const onError = () => {
    setAudioLoading(false);
    setAudioFetchErr(true);
    setProgress(0);
  };

  const openDrawer = () => setShowDrawer(true);

  const closeDrawer = () => setShowDrawer(false);

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      <div className={style.playerMain}>
        <div className={style.ayahsList} ref={ayahsContainer}>
          {ayahs.data.ayahs.map((item, index) => (
            <div
              className={
                currentAudioNumber === item.numberInSurah - 1
                  ? style.activeAyahBox
                  : style.ayahBox
              }
              onClick={() => handleChangeAyah(item.numberInSurah - 1)}
              key={index}
            >
              <div className={style.ayahInfo}>
                <p
                  className={style.ayahNumber}
                >{`${ayahs.data.number}-${item.numberInSurah}`}</p>
                <div className={scheherazade.className}>
                  <p className={style.surahArName}>{ayahs.data.name}</p>
                </div>
              </div>
              <div className={style.ayahText}>
                <p>{uzAyahs.data.ayahs[index]?.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={style.audioPlayer}>
          <audio
            src={ayahs.data.ayahs[currentAudioNumber].audio}
            ref={audioElement}
            onEnded={onEnded}
            onTimeUpdate={onPlaying}
            onCanPlay={onCanPlay}
            onLoadStart={onLoading}
            onError={onError}
          ></audio>
          <div className={style.mainBtns}>
            <div className={style.playBtns}>
              <button>
                <TbPlayerSkipBack onClick={handlePrev} />
              </button>
              {audioLoading ? (
                <div className={style.audioLoader}>
                  <Spin indicator={AudioLoader} />
                </div>
              ) : audioFetchErr ? (
                <div className={style.audioError}>
                  <CloseOutlined />
                </div>
              ) : (
                <button onClick={handlePlay}>
                  {isPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
                </button>
              )}
              <button>
                <TbPlayerSkipForward onClick={handleNext} />
              </button>
            </div>
            <div className={style.controlBtns}>
              <button className={style.drawerTriggerBtn} onClick={openDrawer}>
                <BsBook />
                Surahs
              </button>
            </div>
          </div>
          <div className={style.progressBarWrapper}>
            <div
              className={style.progressBar}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        {loading && (
          <div className={style.loader}>
            <Spin indicator={SurahLoader} />
          </div>
        )}
        {fetchError && (
          <div className={style.error}>
            <CloseCircleTwoTone twoToneColor={"#f55"} />
            <p>Something went wrong</p>
          </div>
        )}
      </div>
      <div className={style.playerSurahsList}>
        <div className={style.surahsContainer}>
          {surahs.data.map((item, index) => (
            <div
              className={
                currentSurahNumber === item.number
                  ? style.activeSurahBox
                  : style.surahBox
              }
              key={index}
              onClick={() =>
                dispatch(playerActions.setCurrentSurahNumber(item.number))
              }
            >
              <div className={style.surahNumber}>
                <p className={style.number}>{item.number}</p>
              </div>
              <div className={style.surahInfo}>
                <p className={style.name}>{item.englishName}</p>
                <p className={style.translationName}>
                  {item.englishNameTranslation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Drawer
        placement="right"
        width={300}
        onClose={closeDrawer}
        open={showDrawer}
        bodyStyle={{ padding: "0" }}
        closable={false}
      >
        <div
          className={
            mode === "light"
              ? style.playerSurahsListDrawer
              : style.playerSurahsListDrawerDark
          }
        >
          <div className={style.surahsContainer}>
            {surahs.data.map((item, index) => (
              <div
                className={
                  currentSurahNumber === item.number
                    ? style.activeSurahBox
                    : style.surahBox
                }
                key={index}
                onClick={() => {
                  dispatch(playerActions.setCurrentSurahNumber(item.number));
                  setShowDrawer(false);
                }}
              >
                <div className={style.surahNumber}>
                  <p className={style.number}>{item.number}</p>
                </div>
                <div className={style.surahInfo}>
                  <p className={style.name}>{item.englishName}</p>
                  <p className={style.translationName}>
                    {item.englishNameTranslation}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data: surahs } = await api.get("");
  const { data: audioData } = await api.get(`${1}/ar.alafasy`);
  const { data: uzData } = await api.get(`/${1}/uz.sodik`);

  return {
    props: { surahs, audioData, uzData },
  };
};

export default QuranPlayer;
