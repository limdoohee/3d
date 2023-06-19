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

    const [inputNickname, setinputNickname] = useState({ value: auth.loginResult.name, result: false });

    const complete = () => {
        // analysisSubmit
        common.analysisSubmit({
            component: "button",
            componentId: "button_complete",
            action: "click",
        });
    };

    return (
        <DDS.layout.container className={"fluid"}>
            <DK_template_header.default store={store} title={lang.t("setting.profile.title")} right={headerRight} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <div className="page-setting sub">
                    <div className="account">
                        <div className="profile">
                            <div className="inner">
                                <DDS.profile.default />
                                <div className="camera">
                                    <DDS.icons.camera />
                                    <input type="file" />
                                </div>
                            </div>
                            <DDS.button.default className="dds button none">현재 사진 삭제</DDS.button.default>
                        </div>
                        <ul className="form">
                            <li>
                                <NickNameInput value={inputNickname} setvalue={setinputNickname} store={store} />
                            </li>
                            <li>
                                <h5>
                                    <strong>소개</strong>
                                    <span>00/50</span>
                                </h5>
                                <DDS.input.textarea rows={4} placeholder="소개글을 입력해주세요" maxLength={6} className="dds input primary" />
                            </li>
                        </ul>
                    </div>
                    <div className="save">
                        <DDS.button.default className="dds button primary block large" disabled={inputNickname.result ? false : true} onClick={complete}>
                            수정 완료
                        </DDS.button.default>
                    </div>
                </div>
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;

//////////////////////////////////////////////////////////////////////// NickNameInput
const NickNameInput = (props) => {
    const { value, setvalue, store } = props;
    const { common, auth } = store;

    const onChange = (e) => {
        var v = e.target.value;
        setvalue((prevstate) => ({ ...prevstate, value: v }));
        var params = { nickname: v };
        auth.checkNickname(params, (e) => {
            common.debug(e);
            sethelpText(e.id ? e.message : "");
            setvalue((prevstate) => ({ ...prevstate, result: e.id ? false : true }));
            if (e.id) {
            }
        });
    };

    const inputSetting = {
        className: "dds input primary",
        placeholder: "닉네임을 입력해주세요",
        onKeyUp: onChange,
        // onKeyDown: onChange,
        maxLength: 20,
    };

    const [helpText, sethelpText] = useState("");

    return (
        <>
            <h5>
                <strong>닉네임</strong>
                <span>{value.value.length}/20</span>
            </h5>
            <DDS.input.default {...inputSetting} />
            <p>{helpText}</p>
        </>
    );
};
//////////////////////////////////////////////////////////////////////// NickNameInput
