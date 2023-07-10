import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { animateScroll as scroll } from "react-scroll";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
import DK_template_profile from "../../_lib/template/profile";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth } = store;
    const router = useRouter();

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

    const [inputNickname, setinputNickname] = useState({ value: auth.loginResult.nickname, result: false });
    const [introduction, setintroduction] = useState({ value: auth.loginResult.introduction, result: false });
    const [submitCheck, setsubmitCheck] = useState(false);

    const messageData = {
        key: "saved",
        content: lang.t("setting.profile.save"),
    };

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
        params.profileImageUrl = thumbnailImage;
        console.log(params);
        auth.changeProfile(params, (res) => {
            console.log("changeProfile", res);
            if (res.result == "ok") {
                common.analysisSubmit({
                    component: "profile",
                    componentId: `pprofile_change_complete`,
                    action: "click",
                });
                auth.checkLoginCSR({}, (re) => {
                    console.log("checkLoginCSR", re);
                    setsubmitCheck(false);
                    common.messageApi.open(messageData);
                    location.href = "native://reload";
                });
            } else {
                common.messageApi.open({
                    type: "warning",
                    content: `${res.message}`,
                });
            }
        });
    };

    const imageUpload = (e) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        var checkImage = e.target.files[0].type;
        checkImage = checkImage.indexOf("image");
        console.log(checkImage);
        if (checkImage === 0) {
            auth.uploadProfileImage(formData, (res) => {
                if (res.imageSeq) {
                    console.log(res);
                    setthumbnailImage(res.imageUrl);
                    setsubmitCheck(true);
                }
            });
        } else {
            alert("이미지만 업로드 가능합니다.");
        }
    };

    const deletePhoto = () => {
        setthumbnailImage(null);
        setsubmitCheck(true);
    };

    useEffect(() => {
        if (inputNickname.value.length > 0 && (thumbnailImage !== auth.loginResult.profileImage || inputNickname.value !== auth.loginResult.nickname || introduction.value !== auth.loginResult.introduction)) {
            setsubmitCheck(true);
        } else {
            setsubmitCheck(false);
        }
    }, [thumbnailImage, inputNickname, introduction]);

    const [thumbnailImage, setthumbnailImage] = useState(auth.loginResult.profileImage);

    const DeletePhoto = () => {
        return (
            <DDS.button.default className="dds button none" onClick={deletePhoto}>
                {lang.t("setting.profile.deletePhoto")}
            </DDS.button.default>
        );
    };

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
                                    <DDS.profile.default src={thumbnailImage ? thumbnailImage : "https://asset.dropkitchen.xyz/contents/202306_dev/20230628174629865_dk.webp"} />
                                    <div className="camera">
                                        <DDS.icons.camera />
                                    </div>
                                    <input type="file" onChange={imageUpload} accept="image/*" />
                                </div>
                                {thumbnailImage && <DeletePhoto />}
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
    const { lang } = store;

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
        id: "bio-change",
        onFocus: (e) => {
            var v = document.querySelector("#bio-change").offsetTop;
            scroll.scrollTo(v, {
                smooth: true,
                duration: 0,
            });
        },
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

    const [totalByte, settotalByte] = useState(0);

    return (
        <>
            <h5>
                <strong>{lang.t("setting.profile.bio")}</strong>
                <span>{totalByte}/50</span>
            </h5>
            <DDS.input.textarea {...inputSetting} />
        </>
    );
};
//////////////////////////////////////////////////////////////////////// IntroductionInput
