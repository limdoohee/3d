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
    const router = useRouter();
    const { t, i18n } = useTranslation();

    const [byteCount, setByteCount] = useState(0);
    const [value, setValue] = useState("");
    const nicknameRef = useRef(null);

    const items = Array.from({ length: 3 }, (_, idx) => t(`auth.terms-agreement.list${idx + 1}`));

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

    const handleClear = () => {
        setValue("");
        nicknameRef.current.focus();
    };
    useEffect(() => {
        const count = calculateByteCount(value);
        setByteCount(count);
    }, [value]);

    return (
        <>
            <div className="auth ui nickname">
                <h2>{t(`auth.nickname.title`)}</h2>
                <ul className="nickname-list">
                    <li>
                        <label>{t(`auth.nickname.label1`)}</label>
                        <Input type="text" disabled value="abc@gmail.com" />
                    </li>
                    <li>
                        <div>
                            <label className="warning">{t(`auth.nickname.label2`)}</label>
                            <span className="count">
                                {value ? byteCount : 0} / <span>20</span>
                            </span>
                        </div>
                        <div className="input-area">
                            <Input
                                ref={nicknameRef}
                                type="text"
                                placeholder={t(`auth.nickname.placeholder`)}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    let maxLength = 20;
                                    if (/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(inputValue)) {
                                        maxLength = 10;
                                    }

                                    if (inputValue.length > maxLength) {
                                        setValue(inputValue.slice(0, maxLength));
                                    } else {
                                        setValue(inputValue);
                                    }
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
                        <span className="help warning">{t(`auth.nickname.help-warning`)}</span>
                    </li>
                </ul>
                <Component.default
                    className="agree-check"
                    disabled={byteCount === 0}
                    onClick={() => {
                        Router.push("/auth/mobile");
                    }}
                >
                    {t(`common.check`)}
                </Component.default>
            </div>
        </>
    );
});

export default Home;
