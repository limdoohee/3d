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
import DDS_Icons from "../../_lib/component/icons";
import DDS_Logos from "../../_lib/component/icons";
import SignupDrawer from "../signup/terms.view";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { auth } = props.store;
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [openLang, setOpenLang] = useState(false);
    const [openSignUp, setOpenSignUp] = useState(false);
    const [showTranslate, setShowTranslate] = useState("EN");
    const [handleTranslate, setHandleTranslate] = useState("en");
    const [open, setOpen] = useState(false);
    const [showTerms, setShowTerms] = useState(null);
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
        { id: "1", login_title: t(`login.main.google`), signup_title: t(`login.main.signup.google`), className: "google", img: <DDS_Icons.google className="" /> },
        { id: "2", login_title: t(`login.main.apple`), signup_title: t(`login.main.signup.apple`), className: "apple", img: <DDS_Icons.apple className="sns" /> },
        { id: "3", login_title: t(`login.main.naver`), signup_title: t(`login.main.signup.naver`), className: "naver", img: <DDS_Icons.naver className="sns" /> },
        { id: "4", login_title: t(`login.main.kakao`), signup_title: t(`login.main.signup.kakao`), className: "kakao", img: <DDS_Icons.kakao className="sns" /> },
    ];

    useEffect(() => {
        const loginTitle = document.getElementById("login-desc");
        loginTitle.addEventListener("click", (event) => {
            const clickedText = event.target.innerHTML;
            setOpen(true);
            if (clickedText.includes("Privacy Policy.") || clickedText.includes("개인정보처리방침")) {
                setShowTerms("privacy");
            } else if (clickedText.includes("User Agreement") || clickedText.includes("이용약관")) {
                setShowTerms("agreement");
            }
        });
    }, []);

    const onClose = () => {
        setOpen(false);
    };
    return (
        <>
            <div className="login wrap">
                <div className="inner">
                    <h1>
                        {/* <DDS_Logos.circle /> */}
                        <img src="https://asset.dropkitchen.xyz/contents/202305_dev/20230526113606908_dk.webp" />
                    </h1>
                    <p id="login-desc" dangerouslySetInnerHTML={{ __html: t(`login.main.title`) }} />

                    <Drawer className="modal agreement" placement={"right"} closable={false} onClose={onClose} open={open} width={1500}>
                        <div>
                            <DDS_Icons.angleLeft
                                onClick={() => {
                                    setOpen(false);
                                }}
                            />
                            {<h3>{showTerms === "agreement" ? t(`signup.list1.title`) : t(`signup.list2.title`)} </h3>}
                        </div>
                        <div className="terms">
                            {<h2>{showTerms === "agreement" ? t(`signup.list1.title`) : t(`signup.list2.title`)} </h2>}
                            {<p>{showTerms === "agreement" ? t(`signup.list1.desc`) : t(`signup.list2.desc`)} </p>}
                        </div>
                    </Drawer>

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
                                </li>
                            );
                        })}
                    </ul>
                    <div className="help">
                        <div>
                            <p>Don’t have an account?</p>
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
                        className="login drawer"
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
