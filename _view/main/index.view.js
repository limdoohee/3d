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
    const { drop, lang, common, auth, gallery } = store;
    const [changeTime, setTime] = useState();
    const [open, setOpen] = useState(false);
    const [notice, setNotice] = useState(false);
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
                    drop.dataChange("status", "processing");
                    console.warn("processing");
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
        // setOpen(true);
        if (sessionStorage.getItem("signupComplete")) {
            setCoachMark("");
            sessionStorage.removeItem("signupComplete");
        }
    }, []);

    useEffect(() => {
        dropData().then(() => {
            if (drop.data.curr.status === "ready") openTime = new Date(drop.data.curr.startAt);
            if (drop.data.curr.status === "processing") openTime = new Date(drop.data.curr.endAt);
            if (drop.data.curr.status === "closed") openTime = new Date(drop.data.next.endAt);
            diff = (openTime.getTime() - currTime.getTime()) / 1000;
            setTime(time.setSeconds(time.getSeconds() + diff));
        });
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

    const messageData = {
        className: "orgMessage",
        content: "2023년 5월 24일에 마케팅 및 알림 받는데 동의했습니다.",
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
                common.messageApi.open(messageData);
            },
        },
        cancel: {
            label: lang.t("main.modal.close"),
            action: () => {
                setNotice(true);
            },
        },
    };

    const checkHandle = (checked) => {
        if (checked) {
            common.messageApi.open(messageData);
            setTimeout(() => {
                setNotice(false);
            }, 3000);
        }
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
                                <h4>마이갤러리</h4>
                                <p>
                                    나의 갤러리로
                                    <br />
                                    이동할 수 있어요
                                </p>
                            </div>
                        </div>
                        <div className="right">
                            <img src="../../static/img/coachMark_right.png" alt="share" />
                            <div>
                                <h4>공유하기</h4>
                                <p>
                                    친구에게
                                    <br />
                                    공유해보세요
                                </p>
                            </div>
                        </div>
                        <div className="center">
                            <img src="../../static/img/coachMark_center.png" alt="drop box" />
                            <div>
                                <h4>드롭 박스</h4>
                                <p>
                                    진행중인 드롭을 탭해
                                    <br />
                                    디지털 아트를 받아보세요
                                </p>
                            </div>
                        </div>
                        <DDS.button.default
                            className="dds button primary"
                            onClick={() => {
                                setCoachMark("hidden");
                            }}
                        >
                            시작하기
                        </DDS.button.default>
                    </div>
                    <div className="drop">
                        <h2>{drop.data.curr.status === "processing" ? "Started Drop" : "Upcoming"}</h2>
                        <Timer expiryTimestamp={changeTime} />
                        {drop.data.curr.status === "processing" && (
                            <div className="owner">
                                Owner <strong>{common.numberFormat(drop.data.curr.ownerCnt)}</strong>
                            </div>
                        )}
                    </div>
                    {drop.data.curr.status && <MisteryBox {...props} />}

                    {notice && (
                        <div className="notice">
                            <span>드롭키친 관련 알림 받기 동의</span>
                            <DDS.switch.default onChange={checkHandle} />
                        </div>
                    )}
                    {coachMark === "hidden" && <DDS.modal.bottom {...modalData} />}
                    <AlarmTemplate.default store={props.store} />
                </DDS.layout.content>
            </DDS.layout.container>
        </>
    );
});

export default Home;
