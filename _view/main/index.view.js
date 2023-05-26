import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTimer } from "react-timer-hook";
import Ai from "../../_lib/module/component/ai";
import MisteryBox from "../../_lib/module/component/misteryBox";

const Home = observer((props) => {
    const { drop } = props.store;

    const Digit = ({ value, title }) => {
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
    };

    let timerContainer;
    const Timer = ({ expiryTimestamp }) => {
        const { seconds, minutes, hours, days, totalSeconds } = useTimer({
            expiryTimestamp,
            onExpire: () => {
                drop.dataChange("status", "ing");
                console.warn("onExpire called");
            },
        });
        timerContainer = `timerContainer ${totalSeconds < 1800 ? "red" : ""}`;
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
    };

    // const [time, setTime] = useState(new Date());
    // console.log("dd");
    // before:예정, ing:진행
    // const drop = {
    //     startDate: "2023-05-26 09:28:00", // 드롭 오픈 시간
    //     endDate: "2023-05-28 16:45:00", // 드롭 마감 시간
    //     owner: 123,
    //     status: "before",
    // };

    let time = new Date();
    // const openTime = new Date(drop.openDate);
    // const currTime = new Date();
    // const diff = (openTime.getTime() - currTime.getTime()) / 1000;
    // time.setSeconds(time.getSeconds() + diff);

    useEffect(() => {
        // console.log(time);
        const openTime = new Date(drop.data.startDate);
        const currTime = new Date();
        const diff = (openTime.getTime() - currTime.getTime()) / 1000;
        time.setSeconds(time.getSeconds() + diff);
    }, []);

    return (
        <>
            <div className="drop">
                <h2>{drop.data.status === "before" ? "Upcoming" : "Started Drop"}</h2>
                <Timer expiryTimestamp={time} />
                <div className="owner">
                    Owner <strong>{drop.data.owner}</strong>
                </div>
            </div>
            <MisteryBox dropStatus={drop.data.status} />
            {/* <Ai dropStatus={drop.data.status} /> */}
        </>
    );
});

export default Home;
