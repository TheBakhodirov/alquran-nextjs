import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import style from "styles/Ayah.module.scss";
import { IoPlay, IoPause } from "react-icons/io5";
import { useState } from "react";
import { playerActions } from "@/store/playerSlice";

type AyahPropType = {
  surahNumber: number;
  number: number;
  arText: string;
  uzText: string;
  audio: string;
  changeSurah?: Function;
};

const Ayah = ({ number, arText, uzText, audio }: AyahPropType) => {
  const mode = useSelector((state: RootState) => state.theme.mode);
  const { isPlaying, currentAudioNumber } = useSelector(
    (state: RootState) => state.player
  );
  const dispatch = useDispatch();

  const handleClick = () => {
    if (isPlaying && number === currentAudioNumber) {
      dispatch(playerActions.pause());
    } else if (!isPlaying && number === currentAudioNumber) {
      dispatch(playerActions.play());
    } else {
      dispatch(playerActions.setCurrentAudio(audio));
      dispatch(playerActions.setCurrentAudioNumber(number));
      dispatch(playerActions.play());
    }
  };

  return (
    <div className={mode === "light" ? style.light : style.dark}>
      <span className={style.ayahNumber}>{`${number}`}</span>
      <p className={style.ayahArText}>{arText}</p>
      <p className={style.ayahUzText}>{uzText}</p>
      <button className={style.playBtn} onClick={handleClick}>
        {number === currentAudioNumber && isPlaying ? <IoPause /> : <IoPlay />}
      </button>
    </div>
  );
};

export default Ayah;
