import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import cookie from "react-cookies";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth, member } = store;
    const router = useRouter();

    const checkSet = { drop: auth.loginResult.dropsAgree == "Y" ? true : false, marketing: auth.loginResult.adsAgree == "Y" ? true : false };
    const [checked, setchecked] = useState(checkSet);

    //------------------------------------------------- Init Load
    const initLoad = () => {};
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/setting/alarm") {
            common.getBuildId();
            initLoad({
                callback: () => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const changePushAgree = (type, status) => {
        common.analysisSubmit({
            component: "alarm",
            componentId: `alarm_agree_${type}_${status}`,
            action: "click",
        });

        var params = { type: type, status: status };
        member.changePushAgree(params, () => {
            location.href = "native://reload";
        });
    };

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            <DK_template_header.default store={store} title={lang.t("setting.alarm.title")} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting main">
                    {cookie.load("device_alarm", { path: "/" }) == "N" && (
                        <dl>
                            <dd className="none">
                                <div className="alarm-info">
                                    <h4>{lang.t("setting.alarm.deviceOn.title")}</h4>
                                    <p>{lang.t("setting.alarm.deviceOn.desc")}</p>
                                </div>
                                <span>
                                    <DDS.button.default
                                        className="dds button primary small"
                                        onClick={() => {
                                            window.location.href = "native://device_alarm_settings";
                                        }}
                                    >
                                        {lang.t("setting.alarm.preferences")}
                                    </DDS.button.default>
                                </span>
                            </dd>
                        </dl>
                    )}
                    <dl>
                        <dd className="none">
                            <h4>{lang.t("setting.alarm.check1")}</h4>
                            <span>
                                <DDS.switch.default
                                    className="primary small"
                                    checked={checked.marketing}
                                    onChange={(e) => {
                                        setchecked((prev) => ({ ...prev, marketing: e }));
                                        changePushAgree("ads", e ? "Y" : "N");
                                    }}
                                />
                            </span>
                        </dd>
                        <dd className="none">
                            <h4>{lang.t("setting.alarm.check2")}</h4>
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
