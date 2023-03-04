import { RootState } from "@/store";
import { GetStaticProps } from "next";
import { useSelector } from "react-redux";
import axios from "axios";
import style from "styles/Surah.module.scss";
import Ayah from "@/components/Ayah";

type Ayah = {
  audio: string;
  number: number;
  numberInSurah: number;
  sajda: boolean;
  text: string;
};

type PropType = {
  data: {
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
  uzData: {
    data: {
      ayahs: { text: string }[];
      name: string;
    };
  };
};
type PathsType = {}[];

const api = axios.create({
  baseURL: "https://api.alquran.cloud/v1/surah",
});

const Surah = ({ data, uzData }: PropType) => {
  // console.log(data.data);
  // console.log(uzData.data);

  const mode = useSelector((state: RootState) => state.themeReducer.mode);

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      {data.data.ayahs.map((item, i) => {
        return (
          <Ayah
            key={i}
            surahNumber={data.data.number}
            number={item.numberInSurah}
            arText={item.text}
            uzText={uzData.data.ayahs[i]?.text}
            audio={item.audio}
            // changeSurah={changeSurah}
          />
        );
      })}
    </div>
  );
};

export async function getStaticPaths() {
  const paths: PathsType = [];

  for (let i = 1; i <= 114; i++) {
    paths.push({ params: { number: `${i}` } });
  }
  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const number = params?.number;
  const { data } = await api.get(`${number}/ar.alafasy`);
  const { data: uzData } = await api.get(`/${number}/uz.sodik`);

  return {
    props: { data, uzData },
  };
};

export default Surah;
