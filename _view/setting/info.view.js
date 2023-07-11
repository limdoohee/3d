import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { isAndroid, isIOS, isMobile } from "react-device-detect";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
import DK_Template_Policy from "../../_lib/template/policy";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth } = store;
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
    const initLoad = () => {};
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/setting") {
            common.getBuildId();
            initLoad({
                callback: () => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

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
    const updateApp = () => {
        if (isAndroid) {
            location.href = "https://play.google.com/store/apps/details?id=com.xxblue.dropkitchen&isExternBrowser=Y&pli=1";
        } else if (isIOS) {
            location.href = "https://apps.apple.com/app/id6443930923?isExternBrowser=Y";
        } else {
            location.href = "https://play.google.com/store/apps/details?id=com.xxblue.dropkitchen&isExternBrowser=Y&pli=1";
        }
    };

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            <DK_template_header.default store={store} title={lang.t("setting.info.title")} />
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
                                common.analysisSubmit({
                                    component: "terms",
                                    componentId: `terms_read`,
                                    action: "click",
                                });
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
                                common.analysisSubmit({
                                    component: "privacy",
                                    componentId: `privacy_read`,
                                    action: "click",
                                });
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
                                    <DDS.button.default className="dds button primary" onClick={updateApp}>
                                        {lang.t("setting.info.update")}
                                    </DDS.button.default>
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
