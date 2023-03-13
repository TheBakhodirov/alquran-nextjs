import style from "styles/Surahs.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import axios from "axios";
import { GetStaticProps, GetStaticPaths } from "next";
import Link from "next/link";
import SurahCard from "@/components/SurahCard";

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
  const mode = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      <div className={style.surahsWrapper}>
        {data.data.map((item) => {
          return (
            <Link href={`surahs/${item.number}`} key={item.number}>
              <SurahCard item={item} />
            </Link>
          );
        })}
      </div>
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
