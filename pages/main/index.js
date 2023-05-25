import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTimer } from "react-timer-hook";
import Ai from "../../_lib/module/component/ai";

import * as THREE from "three";
import { ArcballControls } from "three/addons/controls/ArcballControls.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import MisteryBox from "../../_lib/module/component/MisteryBox";

function Digit({ value, title }) {
    const leftDigit = value >= 10 ? value.toString()[0] : "0";
    const rightDigit = value >= 10 ? value.toString()[1] : value.toString();
    return (
        <div className="digit">
            <div className="digitContainer">
                <span className="singleDigit">{leftDigit}</span>
                <span className="singleDigit">{rightDigit}</span>
            </div>
            <span className="title">{title}</span>
        </div>
    );
}

let timerContainer;
function Timer({ expiryTimestamp }) {
    const { seconds, minutes, hours, days, totalSeconds } = useTimer({ expiryTimestamp, onExpire: () => console.warn("onExpire called") });
    // console.log(totalSeconds);
    // 수정 필요
    timerContainer = `timerContainer ${totalSeconds < 1800 ? "red" : ""}`;
    // if (days === 0 && hours === 0 && minutes < 30 && minutes !== 0) {
    //     // console.log(seconds, minutes, hours, days)
    //     timerContainer = "timerContainer red";
    // } else {
    //     timerContainer = "timerContainer";
    // }

    return (
        <div className={timerContainer}>
            {days !== undefined ? <Digit value={days} title="DAY" /> : null}
            {days !== undefined ? <span className="separtorContainer"></span> : null}
            <Digit value={hours} title="HRS" />
            <span className="separtorContainer"></span>
            <Digit value={minutes} title="MIN" />
            <span className="separtorContainer"></span>
            <Digit value={seconds} title="SEC" />
        </div>
    );
}

const Home = observer((props) => {
    // const [time, setTime] = useState(new Date());
    // before:예정, ing:진행
    const dropInfo = {
        openDate: "2023-05-28 13:17:50",
        owner: 123,
        status: "ing",
    };

    let time = new Date();
    const openTime = new Date(dropInfo.openDate);
    const currTime = new Date();
    const diff = (openTime.getTime() - currTime.getTime()) / 1000;
    time.setSeconds(time.getSeconds() + diff);

    // useEffect(() => {
    //     // console.log(time);
    //     const openTime = new Date(dropInfo.openDate);
    //     const currTime = new Date();
    //     const diff = (openTime.getTime() - currTime.getTime()) / 1000;
    //     setTime(time1.setSeconds(time1.getSeconds() + diff));
    // }, []);

    return (
        <>
            <div className="dropInfo">
                <h2>{dropInfo.staus === "before" ? "Upcoming" : "Started Drop"}</h2>
                <Timer expiryTimestamp={time} />
                <div className="owner">
                    Owner <strong>{dropInfo.owner}</strong>
                </div>
            </div>
            <MisteryBox dropStatus={dropInfo.status} />
            <Ai dropStatus={dropInfo.status} />
        </>
    );
});

export default Home;
