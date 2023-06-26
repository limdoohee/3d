import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { observer } from "mobx-react-lite";
import firebase from "firebase/app";
import "firebase/auth";
import { useTimer, useStopwatch } from "react-timer-hook";
import moment from "moment";

import countryCodeDataEN from "../locales/en/countryCode.en.json";
import countryCodeDataKo from "../locales/ko/countryCode.ko.json";
//------------------------------------------------------------------------------- Antd
import { Drawer } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import DDS_Icons from "../../_lib/component/icons";
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { data, store } = props;
    const { common, lang } = store;
    const { countryCode, cellNo, authCode, uid, confirmationResult } = data.value;

    const [open, setOpen] = useState(false);
    const [count, setcount] = useState(0);

    // ----------------------------------------------------------- Firebase 설정
    const app = initializeApp(common.firebaseConfig);
    getAuth(app).languageCode = lang.i18n.language == "en" ? "en" : "ko";
    useEffect(() => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible",
                timeout: 180000,
            },
            getAuth(app),
        );
    }, []);
    // ----------------------------------------------------------- Firebase 설정

    // ----------------------------------------------------------- useTimer 설정
    const authTime = new Date();
    authTime.setSeconds(authTime.getSeconds());
    var expiryTimestamp = authTime;
    const { seconds, minutes, hours, days, isRunning, start, pause, resume, restart } = useTimer({
        expiryTimestamp,
        onExpire: () => {
            data.set((prev) => ({ ...prev, confirmationResult: null }));
        },
    });
    // ----------------------------------------------------------- useTimer 설정

    // ----------------------------------------------------------- 인증코드 발송
    const handleSendCode = () => {
        if (cellNo.length > 6) {
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(getAuth(), "+" + countryCode + cellNo, appVerifier)
                .then((res) => {
                    data.set((prev) => ({ ...prev, confirmationResult: res, authCode: "" }));
                    initTime();
                    setcount(count + 1);
                })
                .catch((error) => {
                    common.debug(error);
                    common.messageApi.info({
                        content: "error",
                    });
                });
        } else {
            common.messageApi.info({
                content: "유효한 전화번호를 입력해 주세요.",
            });
        }
    };

    const initTime = () => {
        const endTime = new Date();
        endTime.setSeconds(endTime.getSeconds() + 180);
        restart(endTime);
    };
    // ----------------------------------------------------------- 인증코드 발송
    // ----------------------------------------------------------- 인증코드 체크
    useEffect(() => {
        if (authCode.length == 6) {
            confirmationResult
                .confirm(authCode)
                .then((result) => {
                    console.log(result.user.uid);
                    data.set((prev) => ({ ...prev, uid: result.user.uid, result: true }));
                })
                .catch((error) => {
                    common.messageApi.info({
                        content: "error",
                    });
                });
        }
    }, [authCode]);
    // ----------------------------------------------------------- 인증코드 체크

    const phoneInputSetting = {
        placeholder: "휴대폰 번호 입력",
        prefix: (
            <>
                <span
                    onClick={() => {
                        setOpen(true);
                    }}
                >
                    <strong>+{countryCode}</strong>
                    <DDS_Icons.caretDown className="dds icons" />
                </span>
            </>
        ),
        value: cellNo,
        onChange: (e) => {
            var v = e.target.value;
            const reg = /[^0-9]/g;
            v = v.replace(reg, "");
            data.set((prev) => ({ ...prev, cellNo: v }));
        },
    };

    const authcodeInputSetting = {
        placeholder: "인증번호 6자리 입력",
        value: authCode,
        onChange: (e) => {
            var v = e.target.value;
            const reg = /[^0-9]/g;
            v = v.replace(reg, "");
            data.set((prev) => ({ ...prev, authCode: v }));
        },
        maxLength: 6,
    };

    const [countryCodeData, setcountryCodeData] = useState({ arr: [], select: null });
    useEffect(() => {
        setcountryCodeData((prev) => ({ ...prev, arr: lang.i18n.language === "ko" ? countryCodeDataKo : countryCodeDataEN }));
    }, []);

    return (
        <>
            <div className="dk authentication-phone">
                <h5>
                    <strong>휴대폰 번호</strong>
                </h5>
                <div className="inputs">
                    <DDS.input.default {...phoneInputSetting} />
                    <DDS.button.default
                        className="dds button primary large"
                        onClick={() => {
                            handleSendCode();
                        }}
                    >
                        {count > 0 ? "재전송" : "인증하기"}
                    </DDS.button.default>
                </div>
                {confirmationResult && (
                    <>
                        <h5>
                            <strong>인증번호</strong>
                            <span>
                                {minutes < 10 ? `0${minutes}` : `${minutes}`}:{seconds < 10 ? `0${seconds}` : `${seconds}`}
                            </span>
                        </h5>
                        <DDS.input.default {...authcodeInputSetting} className="dds input primary large block" />
                    </>
                )}
                <div id="recaptcha-container"></div>
            </div>
            <Drawer
                height={"auto"}
                className="login drawer lang"
                title={lang.t(`signup.mobile.sel-region`)}
                placement="bottom"
                onClose={() => {
                    setOpen(false);
                }}
                open={open}
                closeIcon={false}
            >
                {countryCodeData.arr.map((item, idx) => (
                    <div
                        className={idx == countryCodeData.select ? "selected" : ""}
                        key={idx}
                        onClick={() => {
                            data.set((prev) => ({ ...prev, countryCode: item.dial_code }));
                            setcountryCodeData((prev) => ({ ...prev, select: idx }));
                            setOpen(false);
                        }}
                    >
                        <span>{item.name}</span>
                        <span>+{item.dial_code}</span>
                    </div>
                ))}
            </Drawer>
        </>
    );
});

export default Home;
