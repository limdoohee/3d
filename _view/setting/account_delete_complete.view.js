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
    const { common, lang, auth, member } = store;
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

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting sub">
                    <div className="account-delete">
                        <div className="complete">
                            <div className="image">
                                <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230629102314297_dk.webp" />
                            </div>
                            <h4>{lang.t("setting.account.delete.desc11")}</h4>
                            <p>{lang.t("setting.account.delete.desc12")}</p>
                            <p>{lang.t("setting.account.delete.desc13")}</p>
                        </div>
                    </div>
                    <div className="save">
                        <DDS.button.default
                            className="dds button primary block large"
                            onClick={() => {
                                //
                                common.analysisSubmit({
                                    component: "account",
                                    componentId: "account_delete_complete",
                                    action: "click",
                                });
                                location.href = "/login";
                            }}
                        >
                            닫기
                        </DDS.button.default>
                    </div>
                </div>
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
