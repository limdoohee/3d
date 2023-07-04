import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import cookie from "react-cookies";
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

    const [open, setOpen] = useState(false);
    const modalData = {
        open: open,
        setOpen: setOpen,
        title: (
            <>
                <div style={{ textAlign: "center", margin: "0 0 20px 0" }}>
                    <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230629100754248_dk.webp" style={{ width: 120, height: 120 }} />
                </div>
                {lang.t("setting.account.delete.desc7")}
            </>
        ),
        context: <>{lang.t("setting.account.delete.desc8")}</>,
        confirm: {
            label: lang.t("setting.account.delete.desc9"),
            action: () => {
                setOpen(false);
            },
        },
        cancel: {
            label: lang.t("setting.account.delete.desc10"),
            action: () => {
                common.analysisSubmit({
                    component: "account",
                    componentId: "account_delete_confirm",
                    action: "click",
                });
                member.signout({}, async (e) => {
                    if (e.result == "ok") {
                        await cookie.remove("loginToken", { path: "/" });
                        location.href = "/setting/account_delete_complete";
                    } else {
                        common.messageApi.open({
                            type: "warning",
                            content: `${e.message}`,
                        });
                    }
                });
            },
        },
    };

    const [check, setcheck] = useState(false);

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            <DK_template_header.default store={store} title={lang.t("setting.account.delete.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting sub ">
                    <div className="account-delete">
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
                                <strong>{common.numberFormat(auth.loginResult.dropAmount)}개</strong>
                            </li>
                        </ul>
                        <ol>
                            <li>{lang.t("setting.account.delete.desc4")}</li>
                            <li>{lang.t("setting.account.delete.desc5")}</li>
                        </ol>
                        <DDS.checkbox.default
                            checked={check}
                            onChange={(e) => {
                                setcheck(e);
                                console.log(e);
                            }}
                        >
                            {lang.t(`setting.account.delete.desc6`)}
                        </DDS.checkbox.default>
                    </div>
                    <div className="save">
                        <DDS.button.default
                            className="dds button primary block large"
                            onClick={() => {
                                setOpen(true);
                                common.analysisSubmit({
                                    component: "account",
                                    componentId: "account_delete_start",
                                    action: "click",
                                });
                            }}
                            disabled={!check}
                        >
                            {lang.t(`common.check`)}
                        </DDS.button.default>
                    </div>
                </div>
                <DDS.modal.bottom {...modalData} />
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
