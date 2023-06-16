("use client");
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";
import { useTranslation } from "react-i18next";
//------------------------------------------------------------------------------- Antd
import { Input } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import Component from "../../_lib/component/button";
import DDS_Icons from "../../_lib/component/icons";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { common, auth } = props.store;
    const router = useRouter();
    const { t, i18n } = useTranslation();

    //------------------------------------------------- Init Load
    const initLoad = ({ callback }) => {
        var params = { nickname: value };
        auth.checkNickname(params, (e) => {
            common.debug(e);
            callback && callback(e);
        });
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/signup/nickname") {
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

    const [byteCount, setByteCount] = useState(0);
    const [value, setValue] = useState("");
    const nicknameRef = useRef(null);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);
    const loginEmail = typeof window !== "undefined" ? sessionStorage.getItem("loginEmail") : null;

    const calculateByteCount = (text) => {
        let byteCount = 0;
        for (let i = 0; i < text.length; i++) {
            byteCount += 1;
        }
        return byteCount;
    };

    useEffect(() => {
        const count = calculateByteCount(value);
        setByteCount(count);

        sessionStorage.setItem("IsNicknameValue", value.toString());
    }, [value]);

    const handleNickName = (e) => {
        var param = { nickname: value };

        auth.checkNickname(param, (data) => {
            common.debug(data);
            if (data.result == "ok") {
                console.log(value);
                console.log(isNicknameAvailable);
                setIsNicknameAvailable(true);
            } else {
                setIsNicknameAvailable(false);
            }
        });
    };

    const inputNickname = (e) => {
        const inputValue = e.target.value;
        const alphanumericRegex = /^[a-zA-Z0-9]*$/;
        if (alphanumericRegex.test(inputValue)) {
            setValue(inputValue);
        }
    };

    const handleClear = () => {
        setValue("");
        nicknameRef.current.focus();
    };

    return (
        <>
            <div className="auth ui nickname">
                <h2>{t(`signup.nickname.title`)}</h2>
                <ul className="nickname-list">
                    <li>
                        <label>{t(`signup.nickname.label1`)}</label>
                        <Input type="text" disabled value={loginEmail} />
                    </li>
                    <li>
                        <div>
                            <label className={value !== "" && !isNicknameAvailable && "warning"}>{t(`signup.nickname.label2`)}</label>
                            <span className="count">
                                {value ? byteCount : 0} / <span>20</span>
                            </span>
                        </div>
                        <div className="input-area">
                            <Input
                                ref={nicknameRef}
                                type="text"
                                placeholder={t(`signup.nickname.placeholder`)}
                                onChange={(e) => {
                                    inputNickname(e);
                                }}
                                onKeyUp={(e) => {
                                    handleNickName(e);
                                }}
                                value={value}
                                maxLength={20}
                                minLength={3}
                            />
                            {value && <DDS_Icons.xmark_02 className="xmark-02" onClick={handleClear} />}
                        </div>
                        {value !== "" ? <p className={`help ${isNicknameAvailable ? "success" : "warning"}`}>{isNicknameAvailable ? t(`signup.nickname.help-success`) : t(`signup.nickname.help-warning`)}</p> : ""}
                    </li>
                </ul>
                <Component.default
                    className="agree-check"
                    disabled={byteCount === 0 || byteCount <= 2 || !isNicknameAvailable}
                    onClick={() => {
                        router.push("/signup/mobile");
                    }}
                >
                    {t(`common.check`)}
                </Component.default>
            </div>
        </>
    );
});

export default Home;
