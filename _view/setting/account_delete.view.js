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
            <DK_template_header.default store={store} title={lang.t("setting.account.delete.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting sub">
                    <h4>{lang.t("setting.account.delete.desc1")}</h4>
                    <ul>
                        <li>
                            <div>
                                <DDS.icons.point />
                                {lang.t("setting.account.delete.desc2")}
                            </div>
                            <strong>{common.numberFormat(auth.loginResult.pointAmount)}P</strong>
                        </li>
                        <li>
                            <div>
                                <DDS.icons.drop />
                                {lang.t("setting.account.delete.desc3")}
                            </div>
                            <strong>10개</strong>
                        </li>
                    </ul>
                    <ol>
                        <li>{lang.t("setting.account.delete.desc4")}</li>
                        <dd>{lang.t("setting.account.delete.desc5")}</dd>
                    </ol>
                    <DDS.checkbox.default checked={false} onChange={() => {}}>
                        {lang.t(`setting.account.delete.desc6`)}
                    </DDS.checkbox.default>
                    <div className="save">
                        <DDS.button.default
                            className="dds button primary block large"
                            onClick={() => {
                                history.back();
                            }}
                        >
                            {lang.t(`common.check`)}
                        </DDS.button.default>
                    </div>
                </div>
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
