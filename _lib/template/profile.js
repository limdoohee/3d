import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { observer } from "mobx-react-lite";
import firebase from "firebase/app";
import "firebase/auth";
import cookie from "react-cookies";
import { useTimer, useStopwatch } from "react-timer-hook";
import moment from "moment";

import countryCodeDataEN from "../../_lib/locales/en/countryCode.en.json";
import countryCodeDataKo from "../../_lib/locales/ko/countryCode.ko.json";
//------------------------------------------------------------------------------- Antd
import { Drawer } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import DDS_Icons from "../../_lib/component/icons";
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Template
//------------------------------------------------------------------------------- Template

const Home = {
    NickNameInput: observer((props) => {
        const { value, setvalue, store } = props;
        const { common, auth, lang } = store;

        let languageSet = {
            title: lang.t(`signup.nickname.title`),
            label1: lang.t(`signup.nickname.label1`),
            label2: lang.t(`signup.nickname.label2`),
            placeholder: lang.t(`signup.nickname.placeholder`),
            "help-success": lang.t(`signup.nickname.help-success`),
            "help-warning": lang.t(`signup.nickname.help-warning`),
            "help-already": lang.t(`signup.nickname.help-already`),
        };

        const onChange = (e) => {
            var v = e.target.value;
            const reg = /[^a-zA-Z0-9ㄱ-힣]/g;
            v = v.replace(reg, "");
            var t = checkByte(v);

            console.log(v);

            if (t <= 20) {
                settotalByte(t);
                setvalue((prevstate) => ({ ...prevstate, value: sliceByByte(v, 20) }));

                if (t > 2) {
                    var params = { nickname: v };
                    if (auth.loginResult.nickname === v) {
                        sethelpText("");
                        setvalue((prevstate) => ({ ...prevstate, result: true }));
                    } else {
                        auth.checkNickname(params, (e) => {
                            // common.debug(e);
                            // sethelpText(e.id ? e.message : "사용 가능한 닉네임 입니다.");
                            // setvalue((prevstate) => ({ ...prevstate, result: e.id ? false : true }));

                            if (e.id) {
                                sethelpText(e.message);
                                setvalue((prevstate) => ({ ...prevstate, result: false }));
                            } else {
                                sethelpText(languageSet["help-success"]);
                                setvalue((prevstate) => ({ ...prevstate, result: true }));
                            }
                        });
                    }
                } else {
                    sethelpText(languageSet["help-warning"]);
                    setvalue((prevstate) => ({ ...prevstate, result: false }));
                }
            } else {
                settotalByte(20);
            }
        };

        const checkByte = (v) => {
            var t = 0;
            for (var i = 0; i < v.length; i++) {
                var currentByte = v.charCodeAt(i);
                if (currentByte > 128) {
                    t += 2;
                } else {
                    t++;
                }
            }
            return t;
        };

        const sliceByByte = (s, len) => {
            if (s == null || s.length == 0) {
                return "";
            }
            var size = 0;
            var rIndex = s.length;

            for (var i = 0; i < s.length; i++) {
                size += checkByte(s.charAt(i));
                if (size == len) {
                    rIndex = i + 1;
                    break;
                } else if (size > len) {
                    rIndex = i;
                    break;
                }
            }
            var r = s.substring(0, rIndex);

            return r ? r : "";
        };

        const inputSetting = {
            className: "dds input primary",
            placeholder: lang.t(`signup.nickname.placeholder`),
            onChange: onChange,
            // onKeyDown: onChange,
            defaultValue: value.value,
            maxLength: 20,
            value: value.value,
        };

        const [helpText, sethelpText] = useState("");
        const [totalByte, settotalByte] = useState(0);

        useEffect(() => {
            var val = checkByte(value.value);
            console.log(val);
            settotalByte(val);
        }, []);

        return (
            <>
                <div className="dk profile nickname-input">
                    <h5>
                        <strong>{lang.t(`signup.nickname.label2`)}</strong>
                        <span>{totalByte}/20</span>
                    </h5>
                    <DDS.input.default {...inputSetting} className="dds input primary large" />
                    <p>{helpText}</p>
                </div>
            </>
        );
    }),
};

export default Home;
