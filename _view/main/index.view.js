import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useTimer } from "react-timer-hook";
import MisteryBox from "../../_lib/module/component/misteryBox";

import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";

import AlarmTemplate from "../../_lib/template/alarm";

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { drop, common } = store;
    let openTime;
    let time = new Date();

    //------------------------------------------------- Init Load
    const initLoad = () => {
        console.log(drop);
        // drop.getDrop();
    };

    //------------------------------------------------- Router isReady
    useEffect(() => {
        initLoad({ callback: (e) => {} });
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

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
                if (drop.data.status === "processing") {
                    drop.dataChange("status", "closed");
                    console.warn("closed");
                }
                if (drop.data.status === "ready") {
                    drop.dataChange("status", "processing");
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
        initLoad();
        if (drop.data.status === "ready") openTime = new Date(drop.data.startDate);
        if (drop.data.status === "processing") openTime = new Date(drop.data.endDate);
        if (drop.data.status === "closed") openTime = new Date(drop.next.startDate);

        const currTime = new Date();
        const diff = (openTime.getTime() - currTime.getTime()) / 1000;
        time.setSeconds(time.getSeconds() + diff);
    }, [drop.data.status]);

    const headerLeft = (
        <DDS.button.default
            className="dds button none gallery badge"
            icon={<DDS.icons.myGalleryBlackOn />}
            onClick={() => {
                router.push("/userGallery");
            }}
        />
    );

    const headerRight = [
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.shareNode />}
                onClick={() => {
                    common.uiChange("gnbOpen", true);
                }}
            />
        ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.bell />}
                onClick={() => {
                    common.uiChange("alarmOpen", true);
                }}
            />
        ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.bars />}
                onClick={() => {
                    common.uiChange("gnbOpen", true);
                }}
            />
        ),
    ];

    return (
        <>
            <DDS.layout.container>
                <DK_template_header.default store={store} className="top" left={headerLeft} right={headerRight} />
                <DK_template_GNB.default store={store} />
                <DDS.layout.content>
                    <div className="drop">
                        <h2>{drop.data.status === "processing" ? "Started Drop" : "Upcoming"}</h2>
                        <Timer expiryTimestamp={time} />
                        {drop.data.status === "processing" && (
                            <div className="owner">
                                Owner <strong>{drop.data.owner}</strong>
                            </div>
                        )}
                    </div>
                    <MisteryBox {...props} />
                    <AlarmTemplate.default store={props.store} />
                </DDS.layout.content>
            </DDS.layout.container>
        </>
    );
});

export default Home;
