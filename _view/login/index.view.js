("use client");
import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";
import { useTranslation } from "react-i18next";

//------------------------------------------------------------------------------- Antd
import { Drawer, Button } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { auth } = props.store;
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [openLang, setOpenLang] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [showTranslate, setShowTranslate] = useState("EN");
    const [handleTranslate, setHandleTranslate] = useState("en");

    const lang_selected = [
        {
            lang: "English",
            show: "EN",
            translate: "en",
        },
        {
            lang: "한국어",
            show: "KR",
            translate: "ko",
        },
    ];

    const [isCategorySelect, setIsCategorySelect] = useState([true, ...Array(lang_selected.length - 1).fill(false)]);

    const showLang = () => {
        setOpenLang(true);
    };

    const showSignUp = () => {
        setOpenSignUp(!openSignUp);
    };

    const handleToggle = (l, idx) => {
        setShowTranslate(l.show);
        setOpenLang(false);
        const newArr = Array(lang_selected.length).fill(false);
        newArr[idx] = true;
        setIsCategorySelect(newArr);
        i18n.changeLanguage(l.translate);
        setHandleTranslate(l.translate);
    };
    useEffect(() => {
        sessionStorage.setItem("LangValue", handleTranslate);
    }, [showTranslate]);

    const login_data = [
        { id: "1", login_title: t(`login.main.google`), signup_title: t(`login.main.signup.google`), className: "google", img: "https://asset.dropkitchen.xyz/contents/202305_dev/20230530104331221_dk.webp", signup: "Google로 가입하기" },
        { id: "2", login_title: t(`login.main.apple`), signup_title: t(`login.main.signup.apple`), className: "apple", img: "https://asset.dropkitchen.xyz/contents/202305_dev/20230530104331090_dk.webp", signup: "Apple로 가입하기" },
        { id: "3", login_title: t(`login.main.naver`), signup_title: t(`login.main.signup.naver`), className: "naver", img: "https://asset.dropkitchen.xyz/contents/202305_dev/20230530104331382_dk.webp", signup: "Naver로 가입하기" },
        { id: "4", login_title: t(`login.main.kakao`), signup_title: t(`login.main.signup.kakao`), className: "kakao", img: "https://asset.dropkitchen.xyz/contents/202305_dev/20230530104331291_dk.webp", signup: "Kakao로 가입하기" },
    ];

    return (
        <>
            <div className="login wrap">
                <div className="inner">
                    <h1>
                        <img src="https://asset.dropkitchen.xyz/contents/202305_dev/20230526113606908_dk.webp" />
                    </h1>
                    <p dangerouslySetInnerHTML={{ __html: t(`login.main.title`) }}></p>
                    <ul className="login-sns">
                        {login_data.map((l, idx) => {
                            return (
                                <li
                                    key={idx}
                                    className={l.className}
                                    onClick={() => {
                                        `${auth.login(`${l.className}`, router.asPath)}`;
                                    }}
                                >
                                    <img src={l.img} />
                                    <span>{l.login_title} </span>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="help">
                        <div>
                            <div>Don’t have an account?</div>
                            <strong onClick={showSignUp}>Sign Up</strong>
                        </div>
                        <span className="tooltip">{t(`login.main.tooltip`)}</span>
                    </div>
                </div>

                <Drawer
                    height={"auto"}
                    className="login drawer signup"
                    title={t(`login.main.signup.title`)}
                    placement="bottom"
                    closable={false}
                    onClose={() => {
                        setOpenSignUp(false);
                    }}
                    open={openSignUp}
                >
                    <ul className="login-sns">
                        {login_data.map((l, idx) => {
                            return (
                                <li className={l.className} key={idx}>
                                    <img src={l.img} />
                                    <span>{l.signup_title}</span>
                                </li>
                            );
                        })}
                    </ul>
                </Drawer>

                <div className="language-select">
                    <h3 onClick={showLang}>
                        <span>
                            <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230601112943364_dk.webp" />
                        </span>
                        {showTranslate}
                        <span>
                            <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230601112943266_dk.webp" />
                        </span>
                    </h3>
                    <Drawer
                        height={"auto"}
                        className="login drawer lang"
                        title={t(`login.main.language-select`)}
                        placement="bottom"
                        onClose={() => {
                            setOpenLang(false);
                        }}
                        open={openLang}
                        closeIcon={<img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230601101932223_dk.webp" />}
                    >
                        {lang_selected.map((l, idx) => {
                            return (
                                <div
                                    key={idx}
                                    onClick={() => {
                                        handleToggle(l, idx);
                                    }}
                                >
                                    {l.lang}
                                    {isCategorySelect[idx] && <img src="https://asset.dropkitchen.xyz/contents/202305_dev/20230530132727224_dk.webp" />}
                                </div>
                            );
                        })}
                    </Drawer>
                </div>
            </div>
        </>
    );
});

export default Home;
