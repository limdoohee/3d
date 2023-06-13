("use client");
import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";
import { useTranslation } from "react-i18next";
import Component from "../../_lib/component/button";
//------------------------------------------------------------------------------- Antd
import { Input } from "antd";
import { Checkbox, Space, Button } from "antd-mobile";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
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
            initLoad({ callback: (e) => {} });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const [byteCount, setByteCount] = useState(0);
    const [value, setValue] = useState("");
    const nicknameRef = useRef(null);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(null);

    const calculateByteCount = (text) => {
        let byteCount = 0;
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            if (charCode <= 0x7f) {
                byteCount += 1;
            } else {
                byteCount += 2;
            }
        }
        return byteCount;
    };

    useEffect(() => {
        const count = calculateByteCount(value);
        setByteCount(count);

        sessionStorage.setItem("IsNicknameValue", value.toString());
    }, [value]);

    useEffect(() => {
        const inputValue = value;
        let maxLength = 20;
        if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(inputValue)) {
            maxLength = 10;
        }
        if (inputValue.length > maxLength) {
            setValue(inputValue.slice(0, maxLength));
        }
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
                        <Input type="text" disabled value="abc@gmail.com" />
                    </li>
                    <li>
                        <div>
                            <label className="warning">{t(`signup.nickname.label2`)}</label>
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
                                    setValue(e.target.value);
                                }}
                                onKeyUp={(e) => {
                                    handleNickName(e);
                                }}
                                value={value}
                                maxLength={20}
                            />
                            {value && (
                                <span onClick={handleClear}>
                                    <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230605132550204_dk.webp" />
                                </span>
                            )}
                        </div>
                        {value !== "" ? <p className={`help ${isNicknameAvailable ? "success" : "warning"}`}>{isNicknameAvailable ? t(`signup.nickname.help-success`) : t(`signup.nickname.help-warning`)}</p> : ""}
                    </li>
                </ul>
                <Component.default
                    className="agree-check"
                    disabled={byteCount === 0 || !isNicknameAvailable}
                    onClick={() => {
                        Router.push("/signup/mobile");
                    }}
                >
                    {t(`common.check`)}
                </Component.default>
            </div>
        </>
    );
});

export default Home;
