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
import DK_Template_Policy from "../../_lib/template/policy";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Module
import Date_Module from "../../_lib/module/date";
//------------------------------------------------------------------------------- Module

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth, magazine } = store;
    const router = useRouter();
    const [viewInfo, setViewInfo] = useState(false);

    const compInfo = [
        { title: lang.t("setting.info.company.name.title"), desc: lang.t("setting.info.company.name.desc") },
        { title: lang.t("setting.info.company.businessNum.title"), desc: lang.t("setting.info.company.businessNum.desc") },
        { title: lang.t("setting.info.company.ceo.title"), desc: lang.t("setting.info.company.ceo.desc") },
        { title: lang.t("setting.info.company.address.title"), desc: lang.t("setting.info.company.address.desc") },
        { title: lang.t("setting.info.company.contact.title"), desc: lang.t("setting.info.company.contact.desc") },
        { title: lang.t("setting.info.company.email.title"), desc: lang.t("setting.info.company.email.desc") },
        { title: lang.t("setting.info.company.ecommerceNum.title"), desc: lang.t("setting.info.company.ecommerceNum.desc") },
    ];

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

    const [policyOpen, setpolicyOpen] = useState(false);
    const [policyType, setpolicyType] = useState("terms");

    const Info = () => {
        return (
            <ul className="info">
                {compInfo.map((e, i) => (
                    <li key={i}>
                        {e.title} : {e.desc}
                        {i === 6 && (
                            <span
                                onClick={() => {
                                    router.push("https://www.ftc.go.kr/bizCommPop.do?wrkr_no=7558601476&apv_perm_no=");
                                }}
                            >
                                {lang.t("setting.info.company.checkBusiness")}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            <DK_template_header.default store={store} title={lang.t("setting.info.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting main">
                    <dl>
                        <dd
                            className="none"
                            onClick={() => {
                                setpolicyOpen(true);
                                setpolicyType("terms");
                            }}
                        >
                            <h4>{lang.t("setting.info.termsOfUse")}</h4>
                            <span>
                                <DDS.button.default className="dds button none" icon={<DDS.icons.angleRight />} />
                            </span>
                        </dd>
                        <dd
                            className="none"
                            onClick={() => {
                                setpolicyOpen(true);
                                setpolicyType("privacy");
                            }}
                        >
                            <h4>{lang.t("setting.info.privacyPolicy")}</h4>
                            <span>
                                <DDS.button.default className="dds button none" icon={<DDS.icons.angleRight />} />
                            </span>
                        </dd>
                    </dl>
                    <dl>
                        <dd className="none">
                            <div className="alarm-info">
                                <h4>
                                    {lang.t("setting.info.version")}
                                    {auth.loginResult.appVersion}
                                </h4>
                            </div>
                            {auth.loginResult.appVersion !== auth.loginResult.latestAppVersion && (
                                <span>
                                    <DDS.button.default className="dds button primary">{lang.t("setting.info.update")}</DDS.button.default>
                                </span>
                            )}
                        </dd>
                    </dl>
                    <div className="company">
                        <h2>{lang.t("setting.info.company.about")}</h2>
                        {viewInfo ? (
                            <DDS.icons.angleUp
                                onClick={() => {
                                    setViewInfo(false);
                                }}
                            />
                        ) : (
                            <DDS.icons.angleDown
                                onClick={() => {
                                    setViewInfo(true);
                                }}
                            />
                        )}
                    </div>
                    {viewInfo && <Info />}
                </div>
                <DK_Template_Policy open={policyOpen} setopen={setpolicyOpen} type={policyType} store={store} />
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
