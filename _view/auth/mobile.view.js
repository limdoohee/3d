("use client");
import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";
import { useTranslation } from "react-i18next";
import Component from "../../_lib/component/button";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";

//------------------------------------------------------------------------------- Antd
import { Input, Select, Drawer, Space, message } from "antd";
import { Checkbox, Button } from "antd-mobile";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const [value, setValue] = useState("82");
    const [open, setOpen] = useState(false);
    const [certificate, setCertificate] = useState(false);
    const [code, setCode] = useState("");
    const phoneNumberRef = useRef(null);
    const confirmCodeRef = useRef(null);
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [login, setLogin] = useState(true);
    const [messageApi, contextHolder] = message.useMessage();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isCodeEntered, setIsCodeEntered] = useState(false);
    const [timer, setTimer] = useState(180 * 1000);
    const [confirmCodeSubmitTime, setConfirmCodeSubmitTime] = useState(null);

    const handleToggle = (l, idx) => {
        setOpen(false);
        const newArr = Array(options.length).fill(false);
        newArr[idx] = true;
        setIsCategorySelect(newArr);
        setValue(l.label);
    };

    const options = [
        { ko: "한국", en: "korea", label: 82 },
        { ko: "한국", en: "korea", label: 812 },
    ];
    const [isCategorySelect, setIsCategorySelect] = useState([true, ...Array(options.length - 1).fill(false)]);

    // 인증받기
    const MsgIcon = () => {
        return <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230607111211213_dk.webp" />;
    };
    const info = ({ content, className }) => {
        messageApi.info({
            content: content,
            duration: 2,
            className: `message-info ${className}`,
            icon: <MsgIcon />,
        });
    };
    const handleChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const firebaseConfig = {
        apiKey: "AIzaSyBZLsr9rPiODqvWsRch2LuiVktSdZ8eKTM",
        authDomain: "test-6f78c.firebaseapp.com",
        projectId: "test-6f78c",
        storageBucket: "test-6f78c.appspot.com",
        messagingSenderId: "538474652058",
        appId: "1:538474652058:web:dc647d152cab249c575a23",
        measurementId: "G-E03WK93X0R",
    };
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    auth.languageCode = "ko";

    useEffect(() => {
        window.recaptchaVerifier = new RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible",
                timeout: 180000,
            },
            auth,
        );

        // ...
    }, []);

    const handleSendCode = () => {
        const appVerifier = window.recaptchaVerifier;
        const phoneNumber = phoneNumberRef.current.value;
        const auth = getAuth();
        signInWithPhoneNumber(auth, "+" + value + phoneNumber, appVerifier)
            .then((confirmationResult) => {
                setConfirmationResult(confirmationResult);
                setConfirmCodeSubmitTime(new Date());
                setTimer(180 * 1000); // 타이머 초기화
                setCode(""); // 코드 초기화
                info({
                    content: "인증번호가 전송되었습니다. ",
                    className: "success",
                });
                setCertificate(true);
                console.log("value", value);
                console.log("appVerifier", appVerifier);
                console.log("phoneNumber", phoneNumber);
            })
            .catch((error) => {
                info({
                    content: "인증 실패하였습니다. 입력한 정보가 맞는지 확인해주세요.",
                });
            });
    };

    useEffect(() => {
        if (confirmCodeSubmitTime) {
            let countdown = Math.floor((confirmCodeSubmitTime.getTime() + 180 * 1000 - Date.now()) / 1000);
            const interval = setInterval(() => {
                countdown -= 1;
                setTimer(countdown * 1000);

                if (countdown === 0) {
                    clearInterval(interval);
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
        const firebaseError = (error) => {
            if ("auth/invalid-verification-code" === error.code) {
                info({
                    content: "인증 실패하였습니다. 입력한 정보가 맞는지 확인해주세요.",
                });
            } else if ("auth/code-expired)" === error.code) {
                info({
                    content: "인증 실패하였습니다. 입력한 정보가 맞는지 확인해주세요.",
                });
            } else if ("auth/too-many-requests" === error.code) {
                info({
                    content: "인증 실패하였습니다. 입력한 정보가 맞는지 확인해주세요.",
                });
            } else {
                info({
                    content: "인증 실패하였습니다. 입력한 정보가 맞는지 확인해주세요.",
                });
            }
        };
        event.preventDefault();
        const authCode = confirmCodeRef.current.value;
        if (confirmationResult) {
            confirmationResult
                .confirm(authCode)
                .then((result) => {
                    localStorage.setItem("isLoggedIn", "true");
                    Router.push("/auth/success");
                })
                .catch((error) => {
                    firebaseError(error);
                });
        } else {
            alert("인증 요청이 이루어지지 않았습니다.");
        }
    };
    return (
        <>
            <div className="auth ui mobile">
                <h2>{t(`auth.mobile.title`)}</h2>
                <div className="mobile-list">
                    <>
                        <div className="input-area">
                            <label>{t(`auth.mobile.label`)}</label>
                            <div className="form">
                                <strong
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                >
                                    +{value}
                                    <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230605162934932_dk.webp" />
                                </strong>
                                <input type="number" placeholder={t(`auth.mobile.placeholder`)} ref={phoneNumberRef} value={phoneNumber} onChange={handleChange} />
                                <button
                                    className="btn send"
                                    id="phoneNumberButton"
                                    type="button"
                                    onClick={() => {
                                        handleSendCode();
                                    }}
                                    disabled={!phoneNumber}
                                >
                                    {certificate ? t(`auth.mobile.certificate.reBtn`) : t(`auth.mobile.certificate.btn`)}
                                </button>
                            </div>
                            {certificate && (
                                <form className="form" onSubmit={handleConfirmCodeSubmit}>
                                    <div className="time">
                                        <label>{t(`auth.mobile.certificate.label`)}</label>
                                        {<div>{formatTime(Math.floor(timer / 1000))}</div>}
                                    </div>

                                    <input
                                        ref={confirmCodeRef}
                                        type="text"
                                        placeholder={t(`auth.mobile.certificate.placeholder`)}
                                        onChange={(e) => {
                                            setCode(e.target.value);
                                        }}
                                        onFocus={() => {
                                            setIsCodeEntered(true);
                                        }}
                                        onBlur={() => {
                                            setIsCodeEntered(false);
                                        }}
                                        value={code}
                                        maxLength={6}
                                    />
                                    {isCodeEntered || code ? (
                                        <button className="btn certificate" id="phoneNumberButton" type="submit">
                                            {t(`common.check`)}
                                        </button>
                                    ) : null}
                                    {code && (
                                        <span
                                            onClick={() => {
                                                setCode("");
                                                confirmCodeRef.current.focus();
                                            }}
                                        >
                                            <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230605132550204_dk.webp" />
                                        </span>
                                    )}
                                </form>
                            )}
                        </div>
                        <Drawer
                            height={"auto"}
                            className="login drawer lang"
                            title={t(`auth.mobile.sel-region`)}
                            placement="bottom"
                            onClose={() => {
                                setOpen(false);
                            }}
                            open={open}
                            closeIcon={<img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230601101932223_dk.webp" />}
                        >
                            {options.map((l, idx) => (
                                <div
                                    className={isCategorySelect[idx] ? "selected" : ""}
                                    key={idx}
                                    onClick={() => {
                                        handleToggle(l, idx);
                                    }}
                                >
                                    <strong>{l.ko}</strong>
                                    <span>{l.label}</span>
                                </div>
                            ))}
                        </Drawer>
                        {contextHolder}
                        <div id="recaptcha-container"></div>
                    </>
                </div>
            </div>
        </>
    );
});

export default Home;
