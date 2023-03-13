import { RootState } from "@/store";
import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TbPlayerPlayFilled, TbPlayerPauseFilled } from "react-icons/tb";
import { playerActions } from "@/store/playerSlice";

const Player = () => {
  const {
    showPlayer,
    isPlaying,
    currentSurah,
    currentSurahNumber,
    currentAudioNumber,
  } = useSelector((state: RootState) => state.player);
  const [progress, setProgress] = useState(0);
  const audioElement = useRef<HTMLAudioElement>(null);
  const dispatch = useDispatch();

  function play() {
    if (audioElement.current?.paused) {
      if (currentAudioNumber === 0) {
        dispatch(playerActions.setCurrentAudioNumber(currentAudioNumber + 1));
      }
      dispatch(playerActions.play());
    } else {
      dispatch(playerActions.pause());
    }
  }

  function closePlayer() {
    dispatch(playerActions.closePlayer());
    setProgress(0);
  }

  function onPlaying() {
    const duration = audioElement.current!.duration;
    const ct = audioElement.current!.currentTime;
    const currentProgress = (ct / duration) * 100;
    setProgress(currentProgress);
  }

  if (!showPlayer) {
    return null;
  }

  return (
    <div className="player">
      <audio
        // src={currentAudio}
        ref={audioElement}
        // onEnded={handleEnded}
        onTimeUpdate={onPlaying}
        // onLoadStart={onLoading}
        // onCanPlay={onLoaded}
        // onError={onError}
        // onStalled={() => onStalled}
      ></audio>
      <div className="player-controls">
        <button className="play-pause-btn" onClick={play}>
          {isPlaying ? <TbPlayerPauseFilled /> : <TbPlayerPlayFilled />}
        </button>
      </div>
      <div className="player-info">
        <div className="surah-info">
          <span className="surah-info-name-number">
            <p className="surah-name">{currentSurah}</p>
            <p className="ayah-in-surah">
              {currentSurahNumber} :{" "}
              {currentAudioNumber === 0 ? 1 : currentAudioNumber}
            </p>
          </span>
        </div>
        <div className="progress-bar-wrapper">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <button className="player-close-btn" onClick={closePlayer}>
        Close
      </button>
    </div>
  );
};

export default Player;
