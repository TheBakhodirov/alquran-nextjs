import style from "styles/Surahs.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import { GetStaticProps, GetStaticPaths } from "next";
import { type } from "os";
import Link from "next/link";

type surahData = {
  data: {
    englishName: string;
    englishNameTranslation: string;
    name: string;
    number: number;
    numberOfAyahs: number;
    revelationType: string;
  }[];
};

type PropType = {
  data: surahData;
};

const api = axios.create({
  baseURL: "https://api.alquran.cloud/v1/surah",
});

const Surahs = ({ data }: PropType) => {
  const mode = useSelector((state: RootState) => state.themeReducer.mode);

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      {data.data.map((item) => {
        return (
          <Link href={`surahs/${item.number}`} key={item.number}>
            <div className={style.surahBox}>
              <div className={style.surahNumber}>
                <p className={style.number}>{item.number}</p>
              </div>
              <div className={style.surahInfo}>
                <p className={style.name}>{item.englishName}</p>
                <p className={style.translationName}>
                  {item.englishNameTranslation}
                </p>
                <p className={style.verseCount}>Verse {item.numberOfAyahs}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("");

  return {
    props: { data },
  };
};

export default Surahs;
