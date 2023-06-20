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
    const [introduction, setintroduction] = useState({ value: auth.loginResult.introduction, result: false });
    const [imageSeq, setimageSeq] = useState();
    const [submitCheck, setsubmitCheck] = useState(false);

    const complete = () => {
        // analysisSubmit
        common.analysisSubmit({
            component: "button",
            componentId: "button_complete",
            action: "click",
        });

        var params = {};
        inputNickname.value !== auth.loginResult.name && (params.nickname = inputNickname.value);
        introduction.value !== auth.loginResult.introduction && (params.introduction = introduction.value);
        imageSeq && (params.profileImageSeq = imageSeq.imageSeq);
        console.log(params);
        auth.changeProfile(params, (res) => {
            console.log("changeProfile", res);
            if (res.result == "ok") {
                auth.checkLoginCSR({}, (re) => {
                    console.log("checkLoginCSR", re);
                });
            }
        });
    };

    const imageUpload = (e, k) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        // console.log(e.target.files[0]);
        auth.uploadProfileImage(formData, (res) => {
            if (res.imageSeq) {
                setimageSeq(res);
            }
        });
    };

    useEffect(() => {
        if (imageSeq || inputNickname.value !== auth.loginResult.name || introduction.value !== auth.loginResult.introduction) {
            setsubmitCheck(true);
        } else {
            setsubmitCheck(false);
        }
    }, [imageSeq, inputNickname, introduction]);

    return (
        <>
            <DDS.layout.container className={"fluid"} store={store}>
                <DK_template_header.default store={store} title={lang.t("setting.profile.title")} right={headerRight} />
                <DK_template_GNB.default store={store} />
                {/* Content */}
                <DDS.layout.content>
                    <div className="page-setting sub">
                        <div className="account">
                            <div className="profile">
                                <div className="inner">
                                    <DDS.profile.default src={auth.loginResult.profileImage ? auth.loginResult.profileImage : null} />
                                    <div className="camera">
                                        <DDS.icons.camera />
                                        <input type="file" onChange={imageUpload} />
                                    </div>
                                </div>
                                <DDS.button.default className="dds button none">현재 사진 삭제</DDS.button.default>
                            </div>
                            <ul className="form">
                                <li>
                                    <NickNameInput value={inputNickname} setvalue={setinputNickname} store={store} />
                                </li>
                                <li>
                                    <IntroductionInput value={introduction} setvalue={setintroduction} store={store} />
                                </li>
                            </ul>
                        </div>
                        <div className="save">
                            <DDS.button.default className="dds button primary block large" onClick={complete} disabled={submitCheck ? false : true}>
                                수정 완료
                            </DDS.button.default>
                        </div>
                    </div>
                </DDS.layout.content>
                {/* Content */}
            </DDS.layout.container>
        </>
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
        defaultValue: value.value,
    };

    const [helpText, sethelpText] = useState("");

    return (
        <>
            <h5>
                <strong>닉네임</strong>
                <span>{value.value ? value.value.length : 0}/20</span>
            </h5>
            <DDS.input.default {...inputSetting} />
            <p>{helpText}</p>
        </>
    );
};
//////////////////////////////////////////////////////////////////////// NickNameInput

//////////////////////////////////////////////////////////////////////// IntroductionInput
const IntroductionInput = (props) => {
    const { value, setvalue, store } = props;
    const { common, auth } = store;

    const onChange = (e) => {
        var v = e.target.value;
        setvalue((prevstate) => ({ ...prevstate, value: v }));
    };

    const inputSetting = {
        className: "dds input primary",
        placeholder: "소개글을 입력해주세요",
        onKeyUp: onChange,
        // onKeyDown: onChange,
        defaultValue: value.value,
        rows: 4,
        // maxLength: 6,
    };

    const [helpText, sethelpText] = useState("");

    return (
        <>
            <h5>
                <strong>소개</strong>
                <span>{value.value ? value.value.length : 0}/50</span>
            </h5>
            <DDS.input.textarea {...inputSetting} />
            <p>{helpText}</p>
        </>
    );
};
//////////////////////////////////////////////////////////////////////// IntroductionInput
