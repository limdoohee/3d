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

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            <DK_template_header.default store={store} title={lang.t("setting.title")} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting main">
                    <dl>
                        <dd
                            onClick={() => {
                                location.href = "/setting/profile";
                            }}
                        >
                            <div className="profile">
                                <DDS.profile.default src={auth.loginResult.profileImage} />
                                <div className="name">
                                    <h4>{auth.loginResult.nickname}</h4>
                                    <p>{lang.t("setting.profile.title")}</p>
                                </div>
                            </div>
                            <span>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dt>{lang.t("setting.alarm.title")}</dt>
                        <dd
                            onClick={() => {
                                location.href = "/setting/alarm";
                            }}
                        >
                            <h4>{lang.t("setting.alarm.setting.title")}</h4>
                            <span>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dt>{lang.t("setting.account.title")}</dt>
                        <dd
                            onClick={() => {
                                location.href = "/setting/account";
                            }}
                        >
                            <h4>{lang.t("setting.account.info.title")}</h4>
                            <span>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                        <dd
                            onClick={() => {
                                location.href = "/setting/lang";
                            }}
                        >
                            <h4>{lang.t("setting.account.language.title")}</h4>
                            <span>
                                <strong>{lang.i18n.language == "ko" ? "한국어" : "English"}</strong>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dt>{lang.t("setting.info.title")}</dt>
                        <dd
                            onClick={() => {
                                location.href = "/setting/info";
                            }}
                        >
                            <h4>{lang.t("setting.info.info.title")}</h4>
                            <span>
                                <DDS.icons.angleRight />
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dd
                            onClick={() => {
                                location.href = "/setting/logout";
                            }}
                        >
                            <h4>{lang.t("setting.logout.title")}</h4>
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
