import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useTimer } from "react-timer-hook";
import MisteryBox from "../../_lib/module/component/MisteryBox";

import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";

import AlarmTemplate from "../../_lib/template/alarm";

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { drop, lang, common } = store;
    let openTime;
    let time = new Date();
    const currTime = new Date();
    let diff;
    const [changeTime, setTime] = useState();
    const [open, setOpen] = useState(false);

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
        console.log("expiryTimestamp", expiryTimestamp);
        const { seconds, minutes, hours, days, totalSeconds } = useTimer({
            expiryTimestamp,
            onExpire: () => {
                if (drop.data.curr.status === "processing") {
                    drop.dataChange("status", "closed");
                    console.warn("closed");
                }
                if (drop.data.curr.status === "ready") {
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

    async function dropData() {
        try {
            // You can await here
            await drop.getData();
        } catch (e) {
            console.error;
        }
    }

    useEffect(() => {
        setOpen(true);
    }, []);

    useEffect(() => {
        dropData().then(() => {
            if (drop.data.curr.status === "ready") openTime = new Date(drop.data.curr.startAt);
            if (drop.data.curr.status === "processing") openTime = new Date(drop.data.curr.endAt);
            if (drop.data.curr.status === "closed") openTime = new Date(drop.data.next.startAt);
            console.log(openTime);
            diff = (openTime.getTime() - currTime.getTime()) / 1000;
            setTime(time.setSeconds(time.getSeconds() + diff));
            // Timer.restart(time);
            console.log(time, time.setSeconds(time.getSeconds() + diff));
            // setChange(true);
        });
    }, [drop.data.curr.status]);

    const headerLeft = <span></span>;

    const headerRight = [
        () => (
            <DDS.button.default
                className="dds button none gallery badge"
                icon={<DDS.icons.myGalleryBlackOn />}
                onClick={() => {
                    router.push("/userGallery");
                }}
            />
        ),
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

    const modalData = {
        open: open,
        setOpen: setOpen,
        title: lang.t("main.modal.title"),
        context: lang.t("main.modal.context"),
        confirm: {
            label: lang.t("main.modal.confirm"),
            action: () => {
                // Router.push("/gallery");
            },
        },
        cancel: {
            label: lang.t("main.modal.close"),
            action: () => {},
        },
    };

    return (
        <>
            <DDS.layout.container store={store}>
                <DK_template_header.default store={store} className="top" left={headerLeft} right={headerRight} />
                <DK_template_GNB.default store={store} />
                <DDS.layout.content>
                    <div className="drop">
                        <h2>{drop.data.curr.status === "processing" ? "Started Drop" : "Upcoming"}</h2>
                        <Timer expiryTimestamp={changeTime} />
                        {drop.data.curr.status === "processing" && (
                            <div className="owner">
                                Owner <strong>{drop.data.curr.ownerCnt}</strong>
                            </div>
                        )}
                    </div>
                    <MisteryBox {...props} />
                    <DDS.modal.bottom {...modalData} />
                    <AlarmTemplate.default store={props.store} />
                </DDS.layout.content>
            </DDS.layout.container>
        </>
    );
});

export default Home;
