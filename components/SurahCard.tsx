import { RootState } from "@/store";
import { useSelector } from "react-redux";
import style from "styles/SurahCard.module.scss";

type PropType = {
  item: {
    englishName: string;
    englishNameTranslation: string;
    number: number;
    numberOfAyahs?: number;
  };
};

const SurahCard = ({ item }: PropType) => {
  const mode = useSelector((state: RootState) => state.theme.mode);

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      <div className={style.surahNumber}>
        <p className={style.number}>{item.number}</p>
      </div>
      <div className={style.surahInfo}>
        <p className={style.name}>{item.englishName}</p>
        <p className={style.translationName}>{item.englishNameTranslation}</p>
        <p className={style.verseCount}>Verse {item.numberOfAyahs}</p>
      </div>
    </div>
  );
};

export default SurahCard;
