import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = {
    NickNameInput: observer((props) => {
        const { value, setvalue, store } = props;
        const { common, auth, lang } = store;

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
                    auth.checkNickname(params, (e) => {
                        // common.debug(e);
                        // sethelpText(e.id ? e.message : "사용 가능한 닉네임 입니다.");
                        // setvalue((prevstate) => ({ ...prevstate, result: e.id ? false : true }));
                        if (e.id) {
                            sethelpText(e.message);
                            setvalue((prevstate) => ({ ...prevstate, result: false }));
                        } else {
                            sethelpText("사용 가능한 닉네임 입니다.");
                            setvalue((prevstate) => ({ ...prevstate, result: true }));
                        }
                    });
                } else {
                    sethelpText("최소 3글자 이상 영문, 숫자 만 사용 가능합니다.");
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
            placeholder: "닉네임을 입력해주세요",
            onChange: onChange,
            // onKeyDown: onChange,
            defaultValue: value.value,
            maxLength: 20,
            value: value.value,
        };

        const [helpText, sethelpText] = useState("최소 3글자 이상 영문, 숫자 만 사용 가능합니다.");
        const [totalByte, settotalByte] = useState(0);

        return (
            <>
                <div className="dk profile nickname-input">
                    <h5>
                        <strong>닉네임 (20byte 이내)</strong>
                        <span>{totalByte}/20</span>
                    </h5>
                    <DDS.input.default {...inputSetting} />
                    <p>{helpText}</p>
                </div>
            </>
        );
    }),
};

export default Home;