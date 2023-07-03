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
//------------------------------------------------------------------------------- Template
import AuthenticationPhone from "../../_lib/template/authenticationPhone";
//------------------------------------------------------------------------------- Template

const Home = observer((props) => {
    const { store } = props;
    const router = useRouter();
    const { common, auth, lang } = props.store;

    const app = initializeApp(common.firebaseConfig);
    getAuth(app).languageCode = lang.i18n.language;

    let languageSet = {
        certificate: {
            btn: lang.t("signup.mobile.certificate.btn"),
            reBtn: lang.t("signup.mobile.certificate.reBtn"),
            label: lang.t("signup.mobile.certificate.label"),
            placeholder: lang.t("signup.mobile.certificate.placeholder"),
            over: lang.t("signup.mobile.certificate.over"),
        },
        message: {
            success: lang.t("signup.mobile.message.success"),
            fail: lang.t("signup.mobile.message.fail"),
            over: lang.t("signup.mobile.message.over"),
        },
    };

    const [inviteValue, setinviteValue] = useState({ type: null, code: null });

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

            const cookieInviteType = cookie.load("invite_type", { path: "/" });
            const cookieInviteCode = cookie.load("invite_code", { path: "/" });

            setinviteValue({ type: cookieInviteType !== null && cookieInviteType !== undefined ? cookieInviteType : null, code: cookieInviteCode !== null && cookieInviteCode !== undefined ? cookieInviteCode : null });

            console.log(cookie.load("invite_type", { path: "/" }), cookie.load("invite_code", { path: "/" }));
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const handleToggle = (l, idx) => {
        setOpen(false);
        const newArr = Array(countryCodeDataEN.length).fill(false);
        newArr[idx] = true;
        setIsCategorySelect(newArr);
        setValue(l.dial_code);
    };

    const [isCategorySelect, setIsCategorySelect] = useState([true, ...Array(countryCodeDataEN.length - 1).fill(false)]);

    let actionCheck = false;
    const [actionLoading, setactionLoading] = useState(false);

    const phoneVerify = async (uid) => {
        var params = {
            clientId: sessionStorage.getItem("loginClientId"),
            email: sessionStorage.getItem("loginEmail"),
            countryCode: authenticationValue.countryCode,
            uid: uid,
            lang: localStorage.getItem("lang"),
            cellNo: authenticationValue.cellNo,
            nickname: sessionStorage.getItem("signupNickname"),
            adsAgree: sessionStorage.getItem("signupMarketing"),
            terms1Agree: "Y",
            terms2Agree: "Y",
            type: inviteValue.type && sessionStorage.getItem("type"),
            code: inviteValue.code && inviteValue.code,
        };
        inviteValue.type && (params.type = inviteValue.type);
        inviteValue.code && (params.code = inviteValue.code);
        console.log(params);
        await auth.phoneVerify(params, async (e) => {
            common.debug(e);
            if (e.result == "ok") {
                await cookie.save("loginToken", e.loginToken, { path: "/" });
                await sessionStorage.setItem("signupComplete", true);
                common.debug(e);
                if (e.message) {
                    if (confirm(e.message)) {
                        location.href = "/";
                        console.log("/");
                    }
                } else {
                    location.href = "/signup/success";
                    console.log("/signup/success");
                }
            } else {
                common.messageApi.info({
                    content: e.message,
                });
            }
            actionCheck = false;
            setactionLoading(false);
        });
    };

    const nextStep = async (e) => {
        e.preventDefault();
        if (actionCheck == false) {
            actionCheck = true;
            setactionLoading(true);
            authenticationValue.confirmationResult
                .confirm(authenticationValue.authCode)
                .then((result) => {
                    phoneVerify(result.user.uid);
                })
                .catch((error) => {
                    actionCheck = false;
                    setactionLoading(false);
                    common.messageApi.info({
                        content: languageSet.message.fail,
                    });
                });
        }
    };

    const [authenticationValue, setauthenticationValue] = useState({
        countryCode: "82",
        cellNo: "",
        authCode: "",
        uid: null,
        confirmationResult: null,
        result: false,
    });

    useEffect(() => {
        if (authenticationValue.result === false) {
            setactionLoading(false);
        }
    }, [authenticationValue.result]);

    const [checkCookieCount, setcheckCookieCount] = useState(0);
    const checkCookie = () => {
        if (process.env.STAGE !== "PRODUCTION") {
            var cookieAll = cookie.loadAll({ path: "/" });
            alert(JSON.stringify(cookieAll));
        }
    };

    return (
        <>
            <DDS.layout.back className={"fluid"} store={store}>
                <div className="auth ui mobile">
                    <h2
                        onClick={() => {
                            setcheckCookieCount(checkCookieCount + 1);
                            console.log(checkCookieCount);
                            if (checkCookieCount == 10) {
                                checkCookie();
                            }
                        }}
                    >
                        {lang.t(`signup.mobile.title`)}
                    </h2>
                    <AuthenticationPhone data={{ value: authenticationValue, set: setauthenticationValue }} store={store} />
                    <div id="recaptcha-container"></div>
                    <DDS.button.default className="agree-check" disabled={authenticationValue.result && actionLoading === false ? false : true} onClick={nextStep}>
                        {lang.t(`common.check`)}
                    </DDS.button.default>
                </div>
            </DDS.layout.back>
        </>
    );
});

export default Home;
