import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import Sticky from "react-sticky-el";
import { InView } from "react-intersection-observer";
import { animateScroll as scroll, Events, scrollSpy, scroller, Element } from "react-scroll";

import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import firebase from "firebase/app";
import "firebase/auth";
import countryCodeData from "../../_lib/locales/en/countryCode.en.json";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Module
import Date_Module from "../../_lib/module/date";
//------------------------------------------------------------------------------- Module

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth, magazine } = store;
    const router = useRouter();

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {};
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/setting") {
            common.getBuildId();
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const headerRight = [
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.bars />}
                onClick={() => {
                    common.uiChange("gnbOpen", true);
                }}
            />
        ),
    ];

    const [step, setstep] = useState(2);

    return (
        <DDS.layout.container className={"fluid"}>
            <DK_template_header.default store={store} title={lang.t("setting.account.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                {step == 1 && (
                    <div className="page-setting sub">
                        <div className="account">
                            <ul className="form">
                                <li>
                                    <h5>
                                        <strong>닉네임</strong>
                                    </h5>
                                    <h4>
                                        <strong>abc@gmail.com</strong>
                                        <span>
                                            <DDS.button.default className="dds button secondary rounded kakao" icon={<DDS.icons.kakao />} />
                                        </span>
                                    </h4>
                                </li>
                                <li>
                                    <h5>
                                        <strong>휴대폰 번호</strong>
                                    </h5>
                                    <h4>
                                        <strong>0109****299</strong>
                                        <span>
                                            <DDS.button.default
                                                className="dds button primary small"
                                                onClick={() => {
                                                    setstep(2);
                                                }}
                                            >
                                                변경
                                            </DDS.button.default>
                                        </span>
                                    </h4>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
                {step == 2 && <PhoneChange store={store} />}
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;

const PhoneChange = observer((props) => {
    const { common, auth } = props.store;

    return (
        <>
            <div className="page-setting sub">
                <div className="account">
                    <ul className="form">
                        <li>
                            <h3></h3>
                        </li>
                        <li>
                            <h5>
                                <strong>휴대폰 번호</strong>
                            </h5>
                            <div className="phone">
                                <DDS.input.default
                                    className="dds input primary large"
                                    placeholder="휴대폰 번호 입력"
                                    prefix={
                                        <DDS.button.default className="dds button none">
                                            +82 <DDS.icons.caretDown className={"dds icons small"} />
                                        </DDS.button.default>
                                    }
                                />
                                <DDS.button.default className="dds button primary large" disabled>
                                    인증하기
                                </DDS.button.default>
                            </div>
                        </li>
                        <li>
                            <h5>
                                <strong>인증번호</strong>
                                <span>02:56</span>
                            </h5>
                            <DDS.input.default className="dds input primary large" placeholder="인증번호 6자리 입력" />
                            {/* <p>오류메세지</p> */}
                        </li>
                    </ul>
                </div>
                <div className="confirm">
                    <DDS.button.default className="dds button primary block large" disabled>
                        확인
                    </DDS.button.default>
                </div>
            </div>
        </>
    );
});
