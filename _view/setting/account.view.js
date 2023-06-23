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
            <DK_template_header.default store={store} title={lang.t("setting.account.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                {step == 1 && (
                    <div className="page-setting sub">
                        <div className="account">
                            <ul className="form">
                                <li>
                                    <h5>
                                        <strong>이메일</strong>
                                    </h5>
                                    <h4>
                                        <strong>{auth.loginResult.email}</strong>
                                        <span>
                                            <DDS.button.default className="dds button secondary rounded kakao" icon={<DDS.icons.kakao />} />
                                        </span>
                                    </h4>
                                </li>
                                <li>
                                    <h5>
                                        <strong>휴대폰 번호</strong>
                                    </h5>
                                    <h4>
                                        <strong>{auth.loginResult.cellNo}</strong>
                                        <span>
                                            <DDS.button.default
                                                className="dds button primary small"
                                                onClick={() => {
                                                    setStep(2);
                                                }}
                                            >
                                                변경
                                            </DDS.button.default>
                                        </span>
                                    </h4>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
                {step == 2 && <PhoneChange store={store} setStep={setStep} />}
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;

const PhoneChange = observer((props) => {
    const { setStep } = props;
    const { store } = props;
    const { member, auth, lang } = props.store;

    const handleConfirmCodeSubmit = (event) => {
        event.preventDefault();
        const params = {
            countryCode: authenticationValue.countryCode,
            cellNo: authenticationValue.cellNo,
            authCode: authenticationValue.authCode,
        };

        member.changePhoneNo(params, (e) => {
            console.log("params", params);
            // router.push("/setting");
            setStep(1);
            console.log("e", e);
        });
    };

    const [authenticationValue, setauthenticationValue] = useState({
        countryCode: "82",
        cellNo: "",
        authCode: "",
        uid: null,
        confirmationResult: null,
        result: false,
    });

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

    return (
        <>
            <div className="page-setting sub">
                <div className="account">
                    <h3>휴대폰 번호를 입력해주세요</h3>
                    <DK_template_AuthenticationPhone data={{ value: authenticationValue, set: setauthenticationValue }} store={store} />
                </div>
                <div className="save">
                    <DDS.button.default disabled={authenticationValue.result ? false : true} className="dds button primary block large" onClick={handleConfirmCodeSubmit}>
                        {lang.t(`common.check`)}
                    </DDS.button.default>
                </div>
            </div>
        </>
    );
});
