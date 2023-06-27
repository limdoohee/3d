("use client");
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";
import { useTranslation } from "react-i18next";

//------------------------------------------------------------------------------- Antd
import { Drawer } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_Template_Policy from "../../_lib/template/policy";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const { auth, lang } = props.store;
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [openLang, setOpenLang] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [recentLogin, setRecentLogin] = useState("");

    const showLang = () => {
        setOpenLang(true);
    };

    const showSignUp = () => {
        setOpenSignUp(!openSignUp);
    };

    const login_data = [
        { id: "1", login_title: t(`login.main.google`), signup_title: t(`login.main.signup.google`), className: "google", img: <DDS.icons.google /> },
        { id: "2", login_title: t(`login.main.apple`), signup_title: t(`login.main.signup.apple`), className: "apple", img: <DDS.icons.apple /> },
        { id: "3", login_title: t(`login.main.naver`), signup_title: t(`login.main.signup.naver`), className: "naver", img: <DDS.icons.naver /> },
        { id: "4", login_title: t(`login.main.kakao`), signup_title: t(`login.main.signup.kakao`), className: "kakao", img: <DDS.icons.kakao /> },
    ];

    const [policyOpen, setpolicyOpen] = useState(false);
    const [policyType, setpolicyType] = useState("terms");

    return (
        <>
            <div className="login wrap">
                <div className="inner">
                    <h1>
                        <DDS.logos.default />
                    </h1>
                    <p id="login-desc">
                        {lang.t("policy.text1")}
                        <span
                            onClick={() => {
                                setpolicyOpen(true);
                                setpolicyType("terms");
                            }}
                        >
                            {lang.t("policy.terms.title")}
                        </span>
                        {lang.t("policy.text2")}
                        <span
                            onClick={() => {
                                setpolicyOpen(true);
                                setpolicyType("privacy");
                            }}
                        >
                            {lang.t("policy.privacy.title")}
                        </span>
                        {lang.t("policy.text3")}
                    </p>

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
                                    {l.img}
                                    <span>{l.login_title} </span>
                                    {recentLogin === l.className.toUpperCase() && <span className="recent">{t(`login.main.recent`)}</span>}
                                </li>
                            );
                        })}
                    </ul>
                    <div className="help">
                        <div>
                            <p>{t(`login.main.help`)}</p>
                            <strong onClick={showSignUp}>
                                {t(`login.main.signUp`)}
                                <span className="tooltip">{t(`login.main.tooltip`)}</span>
                            </strong>
                        </div>
                    </div>
                </div>

                <div className="language-select">
                    <h3 onClick={showLang}>
                        <span>
                            <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230601112943364_dk.webp" />
                        </span>
                        {lang.i18n.language == "en" && "EN"}
                        {lang.i18n.language == "ko" && "KR"}
                        <span>
                            <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230601112943266_dk.webp" />
                        </span>
                    </h3>
                </div>
            </div>

            {/* ///////////////////////////////////////////////////// 언어선택 */}
            <Drawer
                height={"auto"}
                className="login drawer"
                title={t(`login.main.language-select`)}
                placement="bottom"
                onClose={() => {
                    setOpenLang(false);
                }}
                open={openLang}
                closeIcon={false}
            >
                <div
                    onClick={() => {
                        lang.changeLanguage("en");
                        setOpenLang(false);
                    }}
                >
                    English
                    {lang.i18n.language == "en" && <DDS.icons.check className="checked login" />}
                </div>
                <div
                    onClick={() => {
                        lang.changeLanguage("ko");
                        setOpenLang(false);
                    }}
                >
                    한국어
                    {lang.i18n.language == "ko" && <DDS.icons.check className="checked login" />}
                </div>
            </Drawer>
            {/* ///////////////////////////////////////////////////// 언어선택 */}

            {/* ///////////////////////////////////////////////////// 가입하기 */}
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
                            <li
                                className={l.className}
                                key={idx}
                                onClick={() => {
                                    `${auth.login(`${l.className}`, router.asPath)}`;
                                }}
                            >
                                {l.img}
                                <span>{l.signup_title}</span>
                            </li>
                        );
                    })}
                </ul>
            </Drawer>
            {/* ///////////////////////////////////////////////////// 가입하기 */}
            <DK_Template_Policy open={policyOpen} setopen={setpolicyOpen} type={policyType} store={store} />
        </>
    );
});

export default Home;
