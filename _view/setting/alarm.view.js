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
    const { common, lang, auth, member } = store;
    const router = useRouter();

    const checkSet = { drop: auth.loginResult.dropsAgree == "Y" ? true : false, marketing: auth.loginResult.adsAgree == "Y" ? true : false };
    const [checked, setchecked] = useState(checkSet);

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {};
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/setting/alarm") {
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

    const changePushAgree = (type, status) => {
        var params = { type: type, status: status };
        member.changePushAgree(params, (e) => {});
    };

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            <DK_template_header.default store={store} title={lang.t("setting.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting main">
                    {Router.query.device_alarm == "N" && (
                        <dl>
                            <dd className="none">
                                <div className="alarm-info">
                                    <h4>광고성 정보 수신 동의</h4>
                                    <p>
                                        드롭, 이벤트 및 다양한 혜택과 정보 알림을
                                        <br />
                                        받기 위해서 기기 알림을 켜주세요!
                                    </p>
                                </div>
                                <span>
                                    <DDS.button.default className="dds button primary small">알림 켜기</DDS.button.default>
                                </span>
                            </dd>
                        </dl>
                    )}
                    <dl>
                        <dd className="none">
                            <h4>광고성 정보 수신 동의</h4>
                            <span>
                                <DDS.switch.default
                                    className="primary small"
                                    checked={checked.marketing}
                                    onChange={(e) => {
                                        setchecked((prev) => ({ ...prev, marketing: e }));
                                        changePushAgree("marketing", e ? "Y" : "N");
                                    }}
                                />
                            </span>
                        </dd>
                        <dd className="none">
                            <h4>서비스 알림 동의</h4>
                            <span>
                                <DDS.switch.default
                                    className="primary small"
                                    checked={checked.drop}
                                    onChange={(e) => {
                                        setchecked((prev) => ({ ...prev, drop: e }));
                                        changePushAgree("drop", e ? "Y" : "N");
                                    }}
                                />
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
