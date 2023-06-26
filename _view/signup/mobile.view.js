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

    const handleToggle = (l, idx) => {
        setOpen(false);
        const newArr = Array(countryCodeDataEN.length).fill(false);
        newArr[idx] = true;
        setIsCategorySelect(newArr);
        setValue(l.dial_code);
    };

    const [isCategorySelect, setIsCategorySelect] = useState([true, ...Array(countryCodeDataEN.length - 1).fill(false)]);

    const nextStep = async (e) => {
        e.preventDefault();
        var params = {
            clientId: sessionStorage.getItem("loginClientId"),
            email: sessionStorage.getItem("loginEmail"),
            countryCode: authenticationValue.countryCode,
            uid: authenticationValue.uid,
            lang: sessionStorage.getItem("LangValue"),
            cellNo: authenticationValue.cellNo,
            nickname: sessionStorage.getItem("signupNickname"),
            adsAgree: sessionStorage.getItem("signupMarketing"),
            terms1Agree: "Y",
            terms2Agree: "Y",
            type: sessionStorage.getItem("type") && sessionStorage.getItem("type"),
            code: sessionStorage.getItem("code") && sessionStorage.getItem("code"),
        };
        console.log(params);
        await auth.phoneVerify(params, async (e) => {
            if (e.result == "ok") {
                await cookie.save("loginToken", e.loginToken, { path: "/" });
                await sessionStorage.setItem("signupComplete", true);
                common.debug(e.loginToken);
                location.href = "/signup/success";
            } else {
                common.messageApi.info({
                    content: e.message,
                });
            }
        });
    };

    const [authenticationValue, setauthenticationValue] = useState({
        countryCode: "82",
        cellNo: "",
        authCode: "",
        uid: null,
        confirmationResult: null,
        result: false,
    });

    return (
        <>
            <DDS.layout.back className={"fluid"} store={store}>
                <div className="auth ui mobile">
                    <h2>{lang.t(`signup.mobile.title`)}</h2>
                    <AuthenticationPhone data={{ value: authenticationValue, set: setauthenticationValue }} store={store} />
                    <div id="recaptcha-container"></div>
                    <DDS.button.default className="agree-check" disabled={authenticationValue.result ? false : true} onClick={nextStep}>
                        {lang.t(`common.check`)}
                    </DDS.button.default>
                </div>
            </DDS.layout.back>
        </>
    );
});

export default Home;
