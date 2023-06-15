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

//------------------------------------------------------------------------------- Antd
import { Input, Select, Drawer, Space, message } from "antd";
import { Checkbox, Button } from "antd-mobile";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { common, auth } = props.store;
    const router = useRouter();
    const { t, i18n } = useTranslation();

    //------------------------------------------------- Init Load
    const initLoad = ({ callback }) => {
        callback && callback();
    };
    //------------------------------------------------- Init Load
    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/signup/success") {
            initLoad({
                callback: (e) => {
                    const translateSet = sessionStorage.getItem("LangValue");
                    if (translateSet) {
                        i18n.changeLanguage(translateSet);
                    }
                },
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady
    const [nickName, setNickName] = useState("");
    useEffect(() => {
        setNickName(sessionStorage.getItem("IsNicknameValue"));
    }, []);

    useEffect(() => {
        setTimeout(() => {
            Router.push("/");
        }, 3000);
    }, []);
    return (
        <>
            <div className="auth ui success">
                <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230614102427819_dk.webp" />
                <h3>
                    <span>{nickName}</span>
                    <strong dangerouslySetInnerHTML={{ __html: t(`signup.success.desc1`) }} />
                </h3>
                <p dangerouslySetInnerHTML={{ __html: t(`signup.success.desc2`) }} />
            </div>
        </>
    );
});

export default Home;
