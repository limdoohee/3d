import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import Sticky from "react-sticky-el";
import { useTranslation } from "react-i18next";

import { InView } from "react-intersection-observer";
import { animateScroll as scroll, Events, scrollSpy, scroller, Element } from "react-scroll";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import countryCodeData from "../../_lib/locales/en/countryCode.en.json";
import cookie from "react-cookies";

//------------------------------------------------------------------------------- Antd
import { Drawer, message } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Module
import Date_Module from "../../_lib/module/date";
//------------------------------------------------------------------------------- Module

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth, magazine } = store;
    const router = useRouter();

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {};
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/setting") {
            common.getBuildId();
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const headerRight = [
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

    const [step, setStep] = useState(1);

    return (
        <DDS.layout.container className={"fluid"}>
            <DK_template_header.default store={store} title={lang.t("setting.account.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                {step == 1 && (
                    <div className="page-setting sub">
                        <div className="account">
                            <ul className="form">
                                <li>
                                    <h5>
                                        <strong>닉네임</strong>
                                    </h5>
                                    <h4>
                                        <strong>abc@gmail.com</strong>
                                        <span>
                                            <DDS.button.default className="dds button secondary rounded kakao" icon={<DDS.icons.kakao />} />
                                        </span>
                                    </h4>
                                </li>
                                <li>
                                    <h5>
                                        <strong>휴대폰 번호</strong>
                                    </h5>
                                    <h4>
                                        <strong>0109****299</strong>
                                        <span>
                                            <DDS.button.default
                                                className="dds button primary small"
                                                onClick={() => {
                                                    setStep(2);
                                                }}
                                            >
                                                변경
                                            </DDS.button.default>
                                        </span>
                                    </h4>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
                {step == 2 && <PhoneChange store={store} setStep={setStep} />}
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;

const PhoneChange = observer((props) => {
    const { setStep } = props;
    const { member, auth } = props.store;
    const { t, i18n } = useTranslation();
    const router = useRouter();

    const [value, setValue] = useState("82");
    const [open, setOpen] = useState(false);
    const [certificate, setCertificate] = useState(false);
    const [code, setCode] = useState("");
    const confirmCodeRef = useRef();
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isCodeEntered, setIsCodeEntered] = useState(false);
    const [timer, setTimer] = useState(180 * 1000);
    const [confirmCodeSubmitTime, setConfirmCodeSubmitTime] = useState(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const handleToggle = (l, idx) => {
        setOpen(false);
        const newArr = Array(countryCodeData.length).fill(false);
        newArr[idx] = true;
        setIsCategorySelect(newArr);
        setValue(l.dial_code);
    };

    const [isCategorySelect, setIsCategorySelect] = useState([true, ...Array(countryCodeData.length - 1).fill(false)]);

    const info = ({ content, className }) => {
        if (messageApi) {
            messageApi.info({
                content: content,
                duration: 2,
                className: `message-info ${className}`,
                icon: <DDS.icons.snackbarCircle />,
            });
        }
    };
    const firebaseConfig = {
        apiKey: "AIzaSyCwZtLeU5e0_Fs-Rv435wGJVYNUSJsaKvg",
        authDomain: "dropkitchen-bedde.firebaseapp.com",
        databaseURL: "https://dropkitchen-bedde-default-rtdb.firebaseio.com",
        projectId: "dropkitchen-bedde",
        storageBucket: "dropkitchen-bedde.appspot.com",
        messagingSenderId: "998669151634",
        appId: "1:998669151634:web:0d49a1e3107633eeb9a54b",
        measurementId: "G-6065J3XYB0",
    };
    const app = initializeApp(firebaseConfig);
    getAuth(app).languageCode = "ko";

    useEffect(() => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible",
                timeout: 180000,
            },
            getAuth(),
        );
    }, []);

    const handleSendCode = () => {
        const appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(getAuth(), "+" + value + phoneNumber, appVerifier)
            .then((confirmationResult) => {
                setConfirmationResult(confirmationResult);
                setConfirmCodeSubmitTime(new Date());
                setTimer(180 * 1000);
                setCode("");
                info({
                    content: t(`signup.mobile.message.success`),
                    className: "success",
                });
                setCertificate(true);
                console.log("appVerifier", appVerifier);
            })
            .catch((error) => {
                info({
                    content: t(`signup.mobile.message.fail`),
                });
            });
    };

    useEffect(() => {
        if (confirmCodeSubmitTime) {
            let countdown = Math.floor((confirmCodeSubmitTime.getTime() + 180 * 1000 - Date.now()) / 1000);
            setTimer(countdown * 1000);
            setIsTimerRunning(true);

            const interval = setInterval(() => {
                countdown -= 1;
                setTimer(countdown * 1000);

                if (countdown === 0) {
                    clearInterval(interval);
                    setIsTimerRunning(false);
                    info({
                        content: t(`signup.mobile.message.over`),
                        className: "success",
                    });
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [confirmCodeSubmitTime]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const handleConfirmCodeSubmit = (event) => {
        event.preventDefault();

        const authCode = confirmCodeRef.current.value;

        if (confirmationResult) {
            confirmationResult
                .confirm(authCode)
                .then((result) => {
                    console.log(result);
                    onAuthStateChanged(getAuth(), (user) => {
                        if (user) {
                            const params = {
                                countryCode: value,
                                cellNo: phoneNumber,
                                authCode: code,
                            };

                            member.changePhoneNo(params, (e) => {
                                console.log("params", params);
                                // router.push("/setting");
                                setStep(1);
                                console.log("e", e);
                            });
                        }
                    });
                    console.log("result", result);
                })
                .catch((error) => {
                    info({
                        content: t(`signup.mobile.message.fail`),
                    });
                });
        } else {
            info({
                content: t(`signup.mobile.message.fail`),
            });
        }
    };

    return (
        <>
            <div className="page-setting sub">
                <div className="account">
                    <ul className="form">
                        <li>
                            <h3></h3>
                        </li>
                        <li>
                            <h5>
                                <strong>{t(`signup.mobile.label`)}</strong>
                            </h5>
                            <div className="phone">
                                <DDS.input.default
                                    className="dds input primary large"
                                    placeholder={t(`signup.mobile.placeholder`)}
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        setPhoneNumber(e.target.value);
                                    }}
                                    prefix={
                                        <DDS.button.default className="dds button none">
                                            <strong
                                                onClick={() => {
                                                    setOpen(true);
                                                }}
                                            >
                                                +{value}
                                                <DDS.icons.caretDown className={"dds icons small"} />
                                            </strong>
                                        </DDS.button.default>
                                    }
                                    inputMode="numeric"
                                />
                                <DDS.button.default
                                    className="dds button primary large send"
                                    id="phoneNumberButton"
                                    type="button"
                                    onClick={() => {
                                        handleSendCode();
                                    }}
                                    disabled={!phoneNumber}
                                >
                                    {certificate ? t(`signup.mobile.certificate.reBtn`) : t(`signup.mobile.certificate.btn`)}
                                </DDS.button.default>
                            </div>
                        </li>
                        {certificate && (
                            <li>
                                <h5>
                                    <strong>{t(`signup.mobile.certificate.label`)}</strong>
                                    {isTimerRunning ? <span>{formatTime(Math.floor(timer / 1000))}</span> : <span>{t(`signup.mobile.certificate.over`)}</span>}
                                </h5>
                                <input
                                    className="dds input primary large"
                                    placeholder={t(`signup.mobile.certificate.placeholder`)}
                                    ref={confirmCodeRef}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                    }}
                                    value={code}
                                    onFocus={() => {
                                        setIsCodeEntered(true);
                                    }}
                                    onBlur={() => {
                                        setIsCodeEntered(false);
                                    }}
                                />
                                {/* <p>오류메세지</p> */}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="confirm">
                    {isCodeEntered || code ? (
                        <DDS.button.default className="dds button primary block large" id="phoneNumberButton" onClick={handleConfirmCodeSubmit}>
                            {t(`common.check`)}
                        </DDS.button.default>
                    ) : null}
                </div>
                <Drawer
                    height={"auto"}
                    className="login drawer lang"
                    title={t(`signup.mobile.sel-region`)}
                    placement="bottom"
                    onClose={() => {
                        setOpen(false);
                    }}
                    open={open}
                    closeIcon={false}
                >
                    {countryCodeData.map((item, idx) => (
                        <div
                            className={isCategorySelect[idx] ? "selected" : ""}
                            key={idx}
                            onClick={() => {
                                handleToggle(item, idx);
                            }}
                        >
                            <span>{item.name}</span>
                            <span>+{item.dial_code}</span>
                        </div>
                    ))}
                </Drawer>
                {contextHolder}
                <div id="recaptcha-container"></div>
            </div>
        </>
    );
});
