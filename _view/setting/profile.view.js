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
import DK_template_profile from "../../_lib/template/profile";
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

    const [inputNickname, setinputNickname] = useState({ value: auth.loginResult.nickname, result: false });
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
        inputNickname.value !== auth.loginResult.nickname && (params.nickname = inputNickname.value);
        introduction.value !== auth.loginResult.introduction && (params.introduction = introduction.value);
        imageSeq && (params.profileImageSeq = imageSeq.imageSeq);
        console.log(params);
        auth.changeProfile(params, (res) => {
            console.log("changeProfile", res);
            if (res.result == "ok") {
                auth.checkLoginCSR({}, (re) => {
                    console.log("checkLoginCSR", re);
                    setsubmitCheck(false);
                    common.messageApi.open({
                        type: "success",
                        content: "프로필 변경이 완료되었습니다.",
                    });
                });
            } else {
                common.messageApi.open({
                    type: "warning",
                    content: `${res.message}`,
                });
            }
        });
    };

    const imageUpload = (e, k) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        auth.uploadProfileImage(formData, (res) => {
            if (res.imageSeq) {
                console.log(res);
                setthumbnailImage(res.imageUrl);
                setimageSeq(res);
            }
        });
    };

    useEffect(() => {
        if (imageSeq || inputNickname.value !== auth.loginResult.nickname || introduction.value !== auth.loginResult.introduction) {
            setsubmitCheck(true);
        } else {
            setsubmitCheck(false);
        }
    }, [imageSeq, inputNickname, introduction]);

    const [thumbnailImage, setthumbnailImage] = useState(auth.loginResult.profileImage);

    return (
        <>
            <DDS.layout.container className={"fluid"} store={store} pageMotion={true}>
                <DK_template_header.default store={store} title={lang.t("setting.profile.title")} />
                <DK_template_GNB.default store={store} />
                {/* Content */}
                <DDS.layout.content>
                    <div className="page-setting sub">
                        <div className="account">
                            <div className="profile">
                                <div className="inner">
                                    <DDS.profile.default src={thumbnailImage} />
                                    <div className="camera">
                                        <DDS.icons.camera />
                                    </div>
                                    <input type="file" onChange={imageUpload} />
                                </div>
                                {/* <DDS.button.default className="dds button none">현재 사진 삭제</DDS.button.default> */}
                            </div>
                            <ul className="form">
                                <li>
                                    <DK_template_profile.NickNameInput value={inputNickname} setvalue={setinputNickname} store={store} />
                                </li>
                                <li>
                                    <IntroductionInput value={introduction} setvalue={setintroduction} store={store} />
                                </li>
                            </ul>
                        </div>
                        <div className="save">
                            <DDS.button.default className="dds button primary block large" onClick={complete} disabled={submitCheck ? false : true}>
                                {lang.t("setting.save")}
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

//////////////////////////////////////////////////////////////////////// IntroductionInput
const IntroductionInput = (props) => {
    const { value, setvalue, store } = props;
    const { common, auth, lang } = store;

    const onChange = (e) => {
        var v = e.target.value;
        var t = checkByte(v);

        if (t <= 50) {
            settotalByte(t);
            setvalue((prevstate) => ({ ...prevstate, value: v }));
        } else {
            settotalByte(50);
        }
    };

    const inputSetting = {
        className: "dds input primary",
        placeholder: lang.t("setting.profile.descPlaceHolder"),
        onChange: onChange,
        // onKeyDown: onChange,
        defaultValue: value.value,
        rows: 4,
        value: value.value,
        // maxLength: 6,
    };

    const checkByte = (v) => {
        var t = 0;
        if (v) {
            for (var i = 0; i < v.length; i++) {
                var currentByte = v.charCodeAt(i);
                if (currentByte > 128) {
                    t += 2;
                } else {
                    t++;
                }
            }
        }
        return t;
    };

    useEffect(() => {
        settotalByte(checkByte(value.value));
    }, []);

    const [helpText, sethelpText] = useState("");
    const [totalByte, settotalByte] = useState(0);

    return (
        <>
            <h5>
                <strong>{lang.t("setting.profile.bio")}</strong>
                <span>{totalByte}/50</span>
            </h5>
            <DDS.input.textarea {...inputSetting} />
            <p>{helpText}</p>
        </>
    );
};
//////////////////////////////////////////////////////////////////////// IntroductionInput
