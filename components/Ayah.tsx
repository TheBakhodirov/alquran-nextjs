import { RootState } from "@/store";
import { useSelector } from "react-redux";
import style from "styles/Ayah.module.scss";
import { IoPlay } from "react-icons/io5";

type AyahPropType = {
  surahNumber: number;
  number: number;
  arText: string;
  uzText: string;
  audio: string;
  changeSurah?: Function;
};

const Ayah = ({
  surahNumber,
  number,
  arText,
  uzText,
  audio,
  changeSurah,
}: AyahPropType) => {
  const mode = useSelector((state: RootState) => state.theme.mode);

  const handleClick = () => {};

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      <span className={style.ayahNumber}>{`${number}`}</span>
      <p className={style.ayahArText}>{arText}</p>
      <p className={style.ayahUzText}>{uzText}</p>
      <button className={style.playBtn} onClick={handleClick}>
        {/* {isCurrentSurah && isCurrentAyah && isPlaying ? (
          <i className="bi bi-pause-circle-fill"></i>
        ) : (
          <i className="bi bi-play-circle-fill"></i>
        )} */}
        <IoPlay />
      </button>
    </div>
  );
};

export default Ayah;
