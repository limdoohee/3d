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
import countryCodeDataEN from "../../_lib/locales/en/countryCode.en.json";
import countryCodeDataKo from "../../_lib/locales/ko/countryCode.ko.json";
import cookie from "react-cookies";
import { useTimer, useStopwatch } from "react-timer-hook";
import moment from "moment";
//------------------------------------------------------------------------------- Antd
import { Drawer } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import DDS_Icons from "../../_lib/component/icons";
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const router = useRouter();
    const { common, auth } = props.store;
    const { t, i18n } = useTranslation();

    const app = initializeApp(common.firebaseConfig);
    getAuth(app).languageCode = "ko";

    //------------------------------------------------- Init Load
    const initLoad = ({ callback }) => {
        callback && callback();
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/signup/mobile") {
            initLoad({
                callback: () => {},
            });

            window.recaptchaVerifier = new RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "invisible",
                    timeout: 180000,
                },
                getAuth(app),
            );
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
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isCodeEntered, setIsCodeEntered] = useState(false);
    const [timer, setTimer] = useState(180 * 1000);
    const [confirmCodeSubmitTime, setConfirmCodeSubmitTime] = useState(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const handleToggle = (l, idx) => {
        setOpen(false);
        const newArr = Array(countryCodeDataEN.length).fill(false);
        newArr[idx] = true;
        setIsCategorySelect(newArr);
        setValue(l.dial_code);
    };

    const [isCategorySelect, setIsCategorySelect] = useState([true, ...Array(countryCodeDataEN.length - 1).fill(false)]);

    const info = ({ content, className }) => {
        common.messageApi.info({
            content: content,
            duration: 2,
            className: `message-info ${className}`,
            icon: <DDS_Icons.snackbarCircle />,
        });
    };

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
            countryCode: authenticationValue.countryCode,
            uid: authenticationValue.uid,
            lang: sessionStorage.getItem("LangValue"),
            cellNo: authenticationValue.cellNo,
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

        if (isTimerRunning && timer === 0) {
            info({
                content: t(`signup.mobile.message.over`),
                className: "success",
            });
        }
    };

    const [authenticationValue, setauthenticationValue] = useState({
        countryCode: "82",
        cellNo: "",
        authCode: "",
        uid: null,
        confirmationResult: null,
    });

    return (
        <>
            <DDS.layout.back className={"fluid"} store={store}>
                <div className="auth ui mobile">
                    <h2>{t(`signup.mobile.title`)}</h2>
                    <AuthenticationPhone data={{ value: authenticationValue, set: setauthenticationValue }} store={store} />
                    <div id="recaptcha-container"></div>
                </div>
            </DDS.layout.back>
        </>
    );
});

export default Home;

const AuthenticationPhone = observer((props) => {
    const { data, store } = props;
    const { common, lang } = store;
    const { countryCode, cellNo, authCode, uid, confirmationResult } = data.value;

    const [open, setOpen] = useState(false);
    const [count, setcount] = useState(0);

    // ----------------------------------------------------------- Firebase 설정
    const app = initializeApp(common.firebaseConfig);
    getAuth(app).languageCode = "ko";
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
        onExpire: () => {},
    });
    // ----------------------------------------------------------- useTimer 설정

    // ----------------------------------------------------------- 인증코드 발송
    const handleSendCode = () => {
        if (cellNo.length > 6) {
            const appVerifier = window.recaptchaVerifier;
            signInWithPhoneNumber(getAuth(), "+" + countryCode + cellNo, appVerifier)
                .then((result) => {
                    data.set((prev) => ({ ...prev, confirmationResult: result, authCode: "" }));
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
                    console.log(result);
                    onAuthStateChanged(getAuth(), (user) => {
                        if (user) {
                            data.set((prev) => ({ ...prev, uid: user.uid }));
                        }
                    });
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
                    {/* {i18n.language === "ko"
                                ? countryCodeDataKo
                                : countryCodeDataEN.map((item, idx) => (
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
                                  ))} */}
                </Drawer>
            </div>
        </>
    );
});
