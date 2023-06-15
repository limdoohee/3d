import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import Sticky from "react-sticky-el";
import { InView } from "react-intersection-observer";
import { animateScroll as scroll, Events, scrollSpy, scroller, Element } from "react-scroll";
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

    return (
        <DDS.layout.container className={"fluid"}>
            <DK_template_header.default store={store} title={lang.t("setting.profile.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting sub">
                    <div className="account">
                        <div className="profile">
                            <div className="inner">
                                <DDS.profile.default />
                                <div className="camera">
                                    <DDS.icons.camera />
                                </div>
                            </div>
                            <DDS.button.default className="dds button none">현재 사진 삭제</DDS.button.default>
                        </div>
                        <ul className="form">
                            <li>
                                <h5>
                                    <strong>닉네임</strong>
                                    <span>20/20</span>
                                </h5>
                                <DDS.input.default className="dds input primary" placeholder="닉네임을 입력해주세요" />
                                <p>이미 존재하는 닉네임입니다.</p>
                            </li>
                            <li>
                                <h5>
                                    <strong>소개</strong>
                                    <span>00/50</span>
                                </h5>
                                <DDS.input.textarea rows={4} placeholder="소개글을 입력해주세요" maxLength={6} className="dds input primary" />
                            </li>
                        </ul>
                    </div>
                </div>
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
