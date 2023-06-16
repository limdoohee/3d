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
            <DK_template_header.default store={store} title={lang.t("setting.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting main">
                    <dl>
                        <dd
                            onClick={() => {
                                Router.push(`/setting/profile`);
                            }}
                        >
                            <div className="profile">
                                <DDS.profile.default />
                                <div className="name">
                                    <h4>{auth.loginResult.name}</h4>
                                    <p>내 정보 수정하기</p>
                                </div>
                            </div>
                            <span>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dt>알림</dt>
                        <dd
                            onClick={() => {
                                Router.push(`/setting/alarm`);
                            }}
                        >
                            <h4>알림 설정</h4>
                            <span>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dt>계정</dt>
                        <dd
                            onClick={() => {
                                Router.push(`/setting/account`);
                            }}
                        >
                            <h4>계정 정보</h4>
                            <span>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                        <dd
                            onClick={() => {
                                Router.push(`/setting/lang`);
                            }}
                        >
                            <h4>언어</h4>
                            <span>
                                <strong>한국어</strong>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dt>정보</dt>
                        <dd
                            onClick={() => {
                                Router.push(`/setting/info`);
                            }}
                        >
                            <h4>정보</h4>
                            <span>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dd
                            onClick={() => {
                                Router.push(`/setting/logout`);
                            }}
                        >
                            <h4>로그아웃</h4>
                            <span>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                    </dl>
                </div>
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
