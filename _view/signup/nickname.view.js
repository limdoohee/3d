("use client");
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import Component from "../../_lib/component/button";
import DDS_Icons from "../../_lib/component/icons";
import DDS from "../../_lib/component/dds";
import DK_template_profile from "../../_lib/template/profile";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const router = useRouter();
    const { common, auth, lang } = props.store;

    //------------------------------------------------- Init Load
    const initLoad = ({ callback }) => {};
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/signup/nickname") {
            setloginEmail(sessionStorage.getItem("loginEmail") ? sessionStorage.getItem("loginEmail") : null);
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const [loginEmail, setloginEmail] = useState();
    const [inputNickname, setinputNickname] = useState({ value: "", result: false });

    const nextStep = async () => {
        await sessionStorage.setItem("signupNickname", inputNickname.value);
        await router.push("/signup/mobile");
    };

    return (
        <>
            <DDS.layout.back className={"fluid"} store={store}>
                <div className="auth ui nickname">
                    <h2>{lang.t(`signup.nickname.title`)}</h2>
                    <ul className="nickname-list">
                        <li>
                            <label>{lang.t(`signup.nickname.label1`)}</label>
                            <DDS.input.default disabled value={loginEmail} className="dds input primary large" />
                        </li>
                        <li>
                            <DK_template_profile.NickNameInput value={inputNickname} setvalue={setinputNickname} store={store} />
                        </li>
                    </ul>
                    <DDS.button.default className="agree-check" disabled={inputNickname.result ? false : true} onClick={nextStep}>
                        {lang.t(`common.check`)}
                    </DDS.button.default>
                </div>
            </DDS.layout.back>
        </>
    );
});

export default Home;
