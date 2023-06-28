import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { useTimer } from "react-timer-hook";
import { Cookies } from "react-cookie";

import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";

import MisteryBox from "../../_lib/module/component/MisteryBox";

const cookies = new Cookies();

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { drop, lang, common, auth, gallery, member } = store;
    const [changeTime, setTime] = useState();
    const [open, setOpen] = useState(false);
    const [notice, setNotice] = useState(false);
    const device_alarm = cookies.get("device_alarm");
    const [coachMark, setCoachMark] = useState("hidden");

    /** 타이머 관련 변수 */
    let openTime;
    let time = new Date();
    const currTime = new Date();
    let diff;

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {
        gallery.getData({ sendbirdId: "dropkitchen_member_" + auth.loginResult.seq }, (e) => {
            callback && callback(e);
        });
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/main") {
            initLoad({
                callback: (e) => {},
            });
        }
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
                if (drop.data.curr.status === "processing") {
                    drop.dataChange("status", "closed");
                    console.warn("closed");
                }
                if (drop.data.curr.status === "ready") {
                    // drop.dataChange("status", "processing");
                    console.warn("processing");
                    window.location.replace("/main");
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
            await drop.getData();
        } catch (e) {
            console.error;
        }
    }

    useEffect(() => {
        if (cookies.get("device_alarm") === "N") setOpen(true);
        if (cookies.get("device_alarm") === "Y") {
            if (auth.loginResult.dropsAgree === "N" || auth.loginResult.adsAgree === "N") setNotice(true);
        }
    }, []);

    useEffect(() => {
        // dropData().then(() => {
        drop.dataChange("coachMark", "hidden");
        if (drop.data.curr.status === "ready") openTime = new Date(drop.data.curr.startAt);
        if (drop.data.curr.status === "processing") openTime = new Date(drop.data.curr.endAt);
        diff = (openTime.getTime() - currTime.getTime()) / 1000;
        setTime(time.setSeconds(time.getSeconds() + diff));

        if (sessionStorage.getItem("signupComplete")) {
            setCoachMark("");
            drop.dataChange("coachMark", "");
        }
        // });
    }, [drop.data.curr.status]);

    const headerLeft = <span></span>;

    const headerRight = [
        () => (
            <DDS.button.default
                className={`dds button none gallery ${gallery.data.unconfirmedLuckyBox ? "badge" : ""}`}
                icon={<DDS.icons.myGalleryBlackOn />}
                onClick={() => {
                    router.push("/userGallery?memberSeq=" + auth.loginResult.seq);
                }}
            />
        ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.shareNode />}
                onClick={() => {
                    window.location.href = "native://share?contents=" + encodeURI(drop.data.mainLink);
                }}
            />
        ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.bell />}
                onClick={() => {
                    router.push("/alarm");
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

    const changePushAgree = async () => {
        await member.changePushAgree({ type: "ads", status: "Y" }, (e) => {
            if (e.id === "ok") member.changePushAgree({ type: "drop", status: "Y" });
        });
    };

    const messageData = {
        className: "orgMessage",
        content: `${time.getFullYear()}년 ${time.getMonth()}월 ${time.getDate()}일에 알림 받는데 동의하셨어요.잊지 않고 소식 전할게요!`,
    };

    const modalData = {
        open: open,
        setOpen: setOpen,
        img: "../../static/img/bell.png",
        title: lang.t("main.modal.title"),
        context: lang.t("main.modal.context"),
        confirm: {
            label: lang.t("main.modal.confirm"),
            action: () => {
                window.location.href = "native://device_alarm_settings";
            },
        },
        cancel: {
            label: lang.t("main.modal.close"),
            action: () => {},
        },
    };

    const checkHandle = (checked) => {
        if (checked) {
            changePushAgree();

            common.messageApi.open(messageData);
            setTimeout(() => {
                setNotice(false);
            }, 3000);
        }
    };

    const Alarm = () => {
        return (
            <div className="notice">
                <span>{lang.t("main.alarm")}</span>
                <DDS.switch.default onChange={checkHandle} />
            </div>
        );
    };

    return (
        <>
            <DDS.layout.container store={store}>
                <DK_template_header.default store={store} className="top" left={headerLeft} right={headerRight} />
                <DK_template_GNB.default store={store} />
                <DDS.layout.content>
                    <div className={`coachMark ${coachMark}`}>
                        <div className="left">
                            <img src="../../static/img/coachMark_left.png" alt="my gallery" />
                            <div>
                                <h4>{lang.t("main.coachMark.gallery.title")}</h4>
                                <p>{lang.t("main.coachMark.gallery.desc")}</p>
                            </div>
                        </div>
                        <div className="right">
                            <img src="../../static/img/coachMark_right.png" alt="share" />
                            <div>
                                <h4>{lang.t("main.coachMark.share.title")}</h4>
                                <p>{lang.t("main.coachMark.share.desc")}</p>
                            </div>
                        </div>
                        <div className="center">
                            <img src="../../static/img/coachMark_center.png" alt="drop box" />
                            <div>
                                <h4>{lang.t("main.coachMark.box.title")}</h4>
                                <p>{lang.t("main.coachMark.box.desc")}</p>
                            </div>
                        </div>
                        <DDS.button.default
                            className="dds button primary"
                            onClick={() => {
                                sessionStorage.removeItem("signupComplete");
                                setCoachMark("hidden");
                                drop.dataChange("coachMark", "hidden");
                            }}
                        >
                            {lang.t("main.coachMark.confirm")}
                        </DDS.button.default>
                    </div>
                    <div className="drop">
                        <h2>{drop.data.curr.status === "processing" ? "Ongoing Art Drop" : "Upcoming"}</h2>
                        <Timer expiryTimestamp={changeTime} />
                        {drop.data.curr.status === "processing" && (
                            <div className="owner">
                                Owner <strong>{common.numberFormat(drop.data.curr.ownerCnt)}</strong>
                            </div>
                        )}
                    </div>
                    {drop.data.curr.status && <MisteryBox {...props} />}

                    {notice && <Alarm />}
                    {drop.data.curr.coachMark === "hidden" && <DDS.modal.bottom {...modalData} />}
                </DDS.layout.content>
            </DDS.layout.container>
        </>
    );
});

export default Home;
