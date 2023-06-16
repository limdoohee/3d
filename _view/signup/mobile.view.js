("use client");
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";
import { useTranslation } from "react-i18next";
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
import DDS_Icons from "../../_lib/component/icons";

//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { auth } = props.store;
    const router = useRouter();
    const { t, i18n } = useTranslation();

    //------------------------------------------------- Init Load
    const initLoad = ({ callback }) => {
        callback && callback();
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/signup/mobile") {
            initLoad({
                callback: () => {
                    const translateSet = sessionStorage.getItem("LangValue");
                    if (translateSet) {
                        i18n.changeLanguage(translateSet);
                    }
                },
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const [value, setValue] = useState("82");
    const [open, setOpen] = useState(false);
    const [certificate, setCertificate] = useState(false);
    const [code, setCode] = useState("");
    const phoneNumberRef = useRef(null);
    const confirmCodeRef = useRef(null);
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
        messageApi.info({
            content: content,
            duration: 2,
            className: `message-info ${className}`,
            icon: <DDS_Icons.snackbarCircle />,
        });
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
            // "recaptcha-container",
            "phoneNumberButton",
            {
                size: "invisible",
                timeout: 180000,
            },
            getAuth(app),
        );
    }, []);

    const handleSendCode = () => {
        const appVerifier = window.recaptchaVerifier;
        const phoneNumber = phoneNumberRef.current.value;
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
        var params = {
            clientId: sessionStorage.getItem("loginClientId"),
            email: sessionStorage.getItem("loginEmail"),
            uid: null,
            lang: sessionStorage.getItem("LangValue"),
            cellNo: phoneNumber,
            nickname: sessionStorage.getItem("IsNicknameValue"),
            adsAgree: sessionStorage.getItem("IsTermsValue"),
            terms1Agree: "Y",
            terms2Agree: "Y",
        };

        event.preventDefault();
        const authCode = confirmCodeRef.current.value;
        if (confirmationResult) {
            confirmationResult
                .confirm(authCode)
                .then((result) => {
                    console.log(result);
                    onAuthStateChanged(getAuth(), (user) => {
                        if (user) {
                            params.uid = user.uid;
                            auth.phoneVerify(params, (e) => {
                                cookie.save("loginToken", e.loginToken, { path: "/" });
                                console.log("parmas", params);
                                router.push("/signup/success");
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
            alert(t(`signup.mobile.message.fail`));
        }
    };

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const handleKeyboardShow = (e) => {
            const keyboardHeight = e.target.innerHeight - window.innerHeight;
            setKeyboardHeight(keyboardHeight);
        };

        const handleKeyboardHide = () => {
            setKeyboardHeight(0);
        };

        window.addEventListener("resize", handleKeyboardShow);
        window.addEventListener("orientationchange", handleKeyboardShow);
        window.addEventListener("focusout", handleKeyboardHide);

        return () => {
            window.removeEventListener("resize", handleKeyboardShow);
            window.removeEventListener("orientationchange", handleKeyboardShow);
            window.removeEventListener("focusout", handleKeyboardHide);
        };
    }, []);
    return (
        <>
            <div className="auth ui mobile">
                <h2>{t(`signup.mobile.title`)}</h2>
                <div className="mobile-list">
                    <>
                        <div className="input-area">
                            <label>{t(`signup.mobile.label`)}</label>
                            <div className="form">
                                <strong
                                    onClick={() => {
                                        setOpen(true);
                                    }}
                                >
                                    +{value}
                                    <DDS_Icons.caretDown />
                                </strong>
                                <input
                                    type="text"
                                    placeholder={t(`signup.mobile.placeholder`)}
                                    ref={phoneNumberRef}
                                    value={phoneNumber}
                                    inputMode="numeric"
                                    onChange={(e) => {
                                        // const inputValue = e.target.value.replace(/[^0-9]/g, "");
                                        setPhoneNumber(e.target.value);
                                    }}
                                />
                                <button
                                    className="btn send"
                                    id="phoneNumberButton"
                                    type="button"
                                    onClick={() => {
                                        handleSendCode();
                                    }}
                                    disabled={!phoneNumber}
                                >
                                    {certificate ? t(`signup.mobile.certificate.reBtn`) : t(`signup.mobile.certificate.btn`)}
                                </button>
                            </div>
                            {certificate && (
                                <form className="form" onSubmit={handleConfirmCodeSubmit}>
                                    <div className="time">
                                        <label>{t(`signup.mobile.certificate.label`)}</label>
                                        {isTimerRunning ? <div>{formatTime(Math.floor(timer / 1000))}</div> : <div>00:00</div>}
                                    </div>

                                    <input
                                        ref={confirmCodeRef}
                                        type="text"
                                        placeholder={t(`signup.mobile.certificate.placeholder`)}
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
                                        inputMode="numeric"
                                        autoComplete="“one-time-code”"
                                    />
                                    {isCodeEntered || code ? (
                                        <button className="btn certificate" id="phoneNumberButton" type="submit" style={{ transform: `translateY(-${keyboardHeight}px)` }}>
                                            {t(`common.check`)}
                                        </button>
                                    ) : null}
                                    {code && (
                                        <DDS_Icons.xmark_02
                                            className="xmark-02"
                                            onClick={() => {
                                                setCode("");
                                                confirmCodeRef.current.focus();
                                            }}
                                        />
                                    )}
                                </form>
                            )}
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
                        {/* <div id="recaptcha-container"></div> */}
                    </>
                </div>
            </div>
        </>
    );
});

export default Home;
