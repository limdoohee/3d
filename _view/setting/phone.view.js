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

    let languageSet = {
        certificate: {
            btn: lang.t("signup.mobile.certificate.btn"),
            reBtn: lang.t("signup.mobile.certificate.reBtn"),
            label: lang.t("signup.mobile.certificate.label"),
            placeholder: lang.t("signup.mobile.certificate.placeholder"),
            over: lang.t("signup.mobile.certificate.over"),
        },
        message: {
            success: lang.t("signup.mobile.message.success"),
            fail: lang.t("signup.mobile.message.fail"),
            over: lang.t("signup.mobile.message.over"),
        },
    };

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

    const [step, setStep] = useState(1);

    return (
        <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
            <DK_template_header.default store={store} title={lang.t("setting.account.info.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <PhoneChange store={store} setStep={setStep} />
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;

const PhoneChange = observer((props) => {
    const { setStep } = props;
    const { store } = props;
    const { common, member, auth, lang } = props.store;

    let actionCheck = false;
    const [actionLoading, setactionLoading] = useState(false);

    const changePhoneNo = () => {
        const params = {
            countryCode: authenticationValue.countryCode,
            cellNo: authenticationValue.cellNo,
            authCode: authenticationValue.authCode,
        };

        member.changePhoneNo(params, (e) => {
            console.log("params", params);
            console.log("e", e);
            if (e.result == "ok") {
                Router.push("/setting/account");
            }
            actionCheck = false;
            setactionLoading(false);
        });
    };

    const handleConfirmCodeSubmit = (e) => {
        e.preventDefault();
        if (actionCheck == false) {
            actionCheck = true;
            setactionLoading(true);
            authenticationValue.confirmationResult
                .confirm(authenticationValue.authCode)
                .then((result) => {
                    changePhoneNo();
                })
                .catch((error) => {
                    actionCheck = false;
                    setactionLoading(false);
                    common.messageApi.info({
                        content: languageSet.message.fail,
                    });
                });
        }
    };

    const [authenticationValue, setauthenticationValue] = useState({
        countryCode: "82",
        cellNo: "",
        authCode: "",
        uid: null,
        confirmationResult: null,
        result: false,
    });

    useEffect(() => {
        if (authenticationValue.result === false) {
            setactionLoading(false);
        }
    }, [authenticationValue.result]);

    return (
        <>
            <div className="page-setting sub">
                <div className="account">
                    <h3>휴대폰 번호를 입력해주세요</h3>
                    <DK_template_AuthenticationPhone data={{ value: authenticationValue, set: setauthenticationValue }} store={store} />
                </div>
                <div className="save">
                    <DDS.button.default disabled={authenticationValue.result && actionLoading === false ? false : true} className="dds button primary block large" onClick={handleConfirmCodeSubmit}>
                        {lang.t(`common.check`)}
                    </DDS.button.default>
                </div>
            </div>
        </>
    );
});
