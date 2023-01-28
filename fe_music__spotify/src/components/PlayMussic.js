import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { combieLinkMusic } from "../Api/url";
import { choiceMusic } from "../src/features/mussicPlay";

const PlayMussic = () => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state) => state.auth);
  const { data } = useSelector((state) => state.mussicPlay);
  const { files } = useSelector((state) => state.mussic.data);
  const [audio] = useState(new Audio());
  const [play, setPlay] = useState(() => (data ? true : false));
  const [loop, setLoop] = useState(false);

  const [totalTime, setTotalTime] = useState(0);
  const inputAudio = useRef(null);
  const smallTime = useRef(null);

  useEffect(() => {
    if (!data) return;
    audio.src = combieLinkMusic(data.fileId);

    audio.addEventListener("canplay", () => {
      setTotalTime(Math.floor(audio.duration) || 0);
    });

    console.log("render");

    audio.addEventListener("timeupdate", (e) => {
      if (inputAudio.current && smallTime.current) {
        inputAudio.current.value = audio.currentTime;
        smallTime.current.textContent = fmtMSS(Math.floor(audio.currentTime));
        if (audio.duration === audio.currentTime) handleNextMusic();
      }
    });

    setPlay(() => true);
    audio.play();

    return () => {};
  }, [audio, data]);

  useEffect(() => {
    if (audio) play ? audio.play() : audio.pause();
  }, [play, audio]);

  useEffect(() => {
    audio.loop = loop;
  }, [audio, loop]);

  const handleChoiceMusicData = () => {
    if (data) setPlay(!play);
    else if (files && files.length) dispatch(choiceMusic(files[0]));
  };

  const handleNextMusic = () => {
    if (!data) handleChoiceMusicData();
    else if (files && files.length && files.length > 1) {
      const index = [...files].findIndex((x) => x._id === data._id);
      if (index === -1) return;
      let nextIndex = files.length === index + 1 ? 0 : index + 1;
      dispatch(choiceMusic(files[nextIndex]));
    }
  };

  const handlePreMusic = () => {
    if (!data) handleChoiceMusicData();
    else if (files && files.length && files.length > 1) {
      const index = [...files].findIndex((x) => x._id === data._id);
      if (index === -1) return;
      let nextIndex = index === 0 ? files.length - 1 : index - 1;
      console.log(index);
      console.log(nextIndex);
      dispatch(choiceMusic(files[nextIndex]));
    }
  };

  return (
    <>
      <div id="caixaCentral" className="d-flex flex-column align-items-center">
        <div id="caixaSetas" className="d-flex align-items-center">
          

          <button
            type="button"
            className="icones anterior"
            onClick={handlePreMusic}
          >
            <svg role="img" height="16" width="16" viewBox="0 0 16 16">
              <path d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z"></path>
            </svg>
          </button>

          <button
            type="button"
            className="btn playPause"
            onClick={() => handleChoiceMusicData()}
          >
            {play ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-pause-fill"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z" />
              </svg>
            ) : (
              <svg role="img" height="24" width="24" viewBox="0 0 24 24">
                <path d="M7.05 3.606l13.49 7.788a.7.7 0 010 1.212L7.05 20.394A.7.7 0 016 19.788V4.212a.7.7 0 011.05-.606z"></path>
              </svg>
            )}
          </button>

          <button
            type="button"
            className="icones proximo"
            onClick={handleNextMusic}
          >
            <svg role="img" height="16" width="16" viewBox="0 0 16 16">
              <path d="M12.7 1a.7.7 0 00-.7.7v5.15L2.05 1.107A.7.7 0 001 1.712v12.575a.7.7 0 001.05.607L12 9.149V14.3a.7.7 0 00.7.7h1.6a.7.7 0 00.7-.7V1.7a.7.7 0 00-.7-.7h-1.6z"></path>
            </svg>
          </button>

          <button
            type="button"
            className="icones repetir"
            onClick={() => {
              setLoop(!loop);
            }}
          >
            <svg
              fill={loop && "orange"}
              role="img"
              height="16"
              width="16"
              viewBox="0 0 16 16"
              className="text-primary"
            >
              <path d="M0 4.75A3.75 3.75 0 013.75 1h8.5A3.75 3.75 0 0116 4.75v5a3.75 3.75 0 01-3.75 3.75H9.81l1.018 1.018a.75.75 0 11-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 111.06 1.06L9.811 12h2.439a2.25 2.25 0 002.25-2.25v-5a2.25 2.25 0 00-2.25-2.25h-8.5A2.25 2.25 0 001.5 4.75v5A2.25 2.25 0 003.75 12H5v1.5H3.75A3.75 3.75 0 010 9.75v-5z"></path>
            </svg>
          </button>
          {isLogin && (
            <a
              download={data ? combieLinkMusic(data.fileId) : "#"}
              target="true"
              href={data ? combieLinkMusic(data.fileId) : "#"}
              className="icones"
            >
              <svg
                fill={loop && "orange"}
                role="img"
                height="16"
                width="16"
                viewBox="0 0 16 16"
                className="text-primary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-download"
                  viewBox="0 0 16 16"
                >
                  <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                  <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                </svg>
              </svg>
            </a>
          )}
        </div>

        <div id="barraDeProgresso">
          <small ref={smallTime}>00:00</small>
          <input
            type="range"
            max={totalTime}
            ref={inputAudio}
            onChange={(e) => {
              if (audio) audio.currentTime = Number(e.target.value);
            }}
          />
          <small>{fmtMSS(totalTime)}</small>
        </div>
      </div>

      <div id="configAudio" className="d-flex align-items-center">
        

        <div id="volume">
          <button type="button" className="icones outrosDispositivos">
            <svg
              role="presentation"
              height="16"
              width="16"
              aria-label="Volume médio"
              id="volume-icon"
              viewBox="0 0 16 16"
            >
              <path d="M9.741.85a.75.75 0 01.375.65v13a.75.75 0 01-1.125.65l-6.925-4a3.642 3.642 0 01-1.33-4.967 3.639 3.639 0 011.33-1.332l6.925-4a.75.75 0 01.75 0zm-6.924 5.3a2.139 2.139 0 000 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 000-8.474v1.65a2.999 2.999 0 010 5.175v1.649z"></path>
            </svg>
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            onChange={(e) => {
              audio.volume = e.target.value;
            }}
          />
        </div>
      </div>
    </>
  );
};

function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

export default PlayMussic;
