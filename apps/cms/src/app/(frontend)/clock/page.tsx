"use client";

import { useEffect, useState, useCallback } from "react";
import useTimer from "./useTimer";
import { mainStructure, onedayStructure, sideStructure, Structure } from "./structures";

function timeFormat(num: number) {
  return num.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
}

type StructureKey = 'main' | 'side' | 'oneday';

const structures: Record<StructureKey, Structure[]> = {
  main: mainStructure,
  side: sideStructure,
  oneday: onedayStructure
}

function App() {
  const [structureKey, setStructureKey] = useState<StructureKey>('oneday');
  const structure = structures[structureKey];

  const [tourneyLvl, setTourneyLvl] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const { secs, mins, setMins, setSecs } = useTimer(
    structure[tourneyLvl].time,
    isPaused
  );

  const sb = structure[tourneyLvl].sb
  const bb = structure[tourneyLvl].bb


  useEffect(() => {
    if (mins === -1) {
      setTourneyLvl((prev) => prev + 1);
    }
  }, [mins]);

  useEffect(() => {
    setMins(structure[tourneyLvl].time - 1);
    setSecs(59)
  }, [tourneyLvl]);

  const goPrevLvl = useCallback(() => {
    if (tourneyLvl === 0) return;
    setTourneyLvl((prev) => prev - 1);
  }, [tourneyLvl, setTourneyLvl]);

  const goNextLvl = useCallback(() => {
    if (tourneyLvl === structure.length - 1) return;
    setTourneyLvl((prev) => prev + 1);
  }, [tourneyLvl, setTourneyLvl]);

  return (
    <div className="App">
      <div className="clock">{`${timeFormat(mins)}:${timeFormat(secs)}`}</div>
      <div className="structure">
        <div className="flex-container">
          <div className="sb">
            <label>SB</label>
            <span>{sb ?? "--"}</span>
          </div>
          <div className="bb">
            <label>BB+ANTE</label>
            <span>{bb ?? "--"}</span>
          </div>
        </div>
      </div>
      <button className="prev" onClick={goPrevLvl}>
        ⏮︎
      </button>
      <button
        className="play"
        onClick={() => setIsPaused(false)}
        style={{ display: isPaused ? "" : "none" }}
      >
        ⏵︎
      </button>
      <button
        className="pause"
        onClick={() => setIsPaused(true)}
        style={{ display: !isPaused ? "" : "none" }}
      >
        ⏸︎
      </button>
      <button className="prev" onClick={goNextLvl}>
        ⏭︎
      </button>
    </div>
  );
}

export default App;
