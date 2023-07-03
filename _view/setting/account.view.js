import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Antd
import { Drawer, message } from "antd";
//------------------------------------------------------------------------------- Antd
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Template
import DK_template_AuthenticationPhone from "../../_lib/template/authenticationPhone";
//------------------------------------------------------------------------------- Template

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
        // () => (
        //     <DDS.button.default
        //         className="dds button none"
        //         icon={<DDS.icons.bars />}
        //         onClick={() => {
        //             common.uiChange("gnbOpen", true);
        //         }}
        //     />
        // ),
    ];

    const [step, setStep] = useState(1);

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            <DK_template_header.default store={store} title={lang.t("setting.account.info.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting sub">
                    <div className="account">
                        <ul className="form">
                            <li>
                                <h5>
                                    <strong>{lang.t("setting.account.info.email")}</strong>
                                </h5>
                                <h4>
                                    <strong>{auth.loginResult.email}</strong>
                                    <span>
                                        {auth.loginResult.currentLoginSocial == "KAKAO" && <DDS.button.default className="dds button secondary rounded kakao" icon={<DDS.icons.kakao />} />}
                                        {auth.loginResult.currentLoginSocial == "GOOGLE" && <DDS.button.default className="dds button secondary rounded google" icon={<DDS.icons.google />} />}
                                        {auth.loginResult.currentLoginSocial == "NAVER" && <DDS.button.default className="dds button secondary rounded naver" icon={<DDS.icons.naver />} />}
                                        {auth.loginResult.currentLoginSocial == "APPLE" && <DDS.button.default className="dds button secondary rounded apple" icon={<DDS.icons.apple />} />}
                                    </span>
                                </h4>
                            </li>
                            <li>
                                <h5>
                                    <strong>{lang.t("setting.account.info.phone")}</strong>
                                </h5>
                                <h4>
                                    <strong>{auth.loginResult.cellNo}</strong>
                                    <span>
                                        <DDS.button.default
                                            className="dds button primary small"
                                            onClick={() => {
                                                location.href = "/setting/phone";
                                            }}
                                        >
                                            {lang.t("setting.account.info.phone")}
                                        </DDS.button.default>
                                    </span>
                                </h4>
                            </li>
                        </ul>
                        <div className="delete">
                            <span>{lang.t("setting.account.delete.ask")}</span>
                            <span
                                onClick={() => {
                                    location.href = "/setting/account_delete";
                                }}
                            >
                                {lang.t("setting.account.delete.title")}
                            </span>
                        </div>
                    </div>
                </div>
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
