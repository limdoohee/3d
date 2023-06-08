import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useTimer } from "react-timer-hook";
import Ai from "../../_lib/module/component/ai";
import MisteryBox from "../../_lib/module/component/MisteryBox";

const Home = observer((props) => {
    const { drop } = props.store;
    let openTime;
    let time = new Date();

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
                if (drop.data.status === "open") {
                    drop.dataChange("status", "close");
                    console.warn("closed");
                }
                if (drop.data.status === "before") {
                    drop.dataChange("status", "open");
                    console.warn("opening");
                }
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

    useEffect(() => {
        if (drop.data.status === "before") openTime = new Date(drop.data.startDate);
        if (drop.data.status === "open") openTime = new Date(drop.data.endDate);
        if (drop.data.status === "next") openTime = new Date(drop.next.startDate);

        console.log(openTime);
        const currTime = new Date();
        const diff = (openTime.getTime() - currTime.getTime()) / 1000;
        time.setSeconds(time.getSeconds() + diff);
    }, [drop.data.status]);

    return (
        <>
            <div className="drop">
                <h2>{drop.data.status === "open" ? "Started Drop" : "Upcoming"}</h2>
                <Timer expiryTimestamp={time} />
                {drop.data.status === "open" && (
                    <div className="owner">
                        Owner <strong>{drop.data.owner}</strong>
                    </div>
                )}
            </div>
            <MisteryBox {...props} />
            {/* <Ai dropStatus={drop.data.status} /> */}
        </>
    );
});

export default Home;
