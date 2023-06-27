("use client");
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";
import { useTranslation } from "react-i18next";

//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { common, lang } = props.store;

    //------------------------------------------------- Init Load
    const initLoad = ({ callback }) => {
        callback && callback();
    };
    //------------------------------------------------- Init Load
    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/signup/success") {
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady
    const [nickName, setNickName] = useState("");

    useEffect(() => {
        setNickName(sessionStorage.getItem("signupNickname"));

        setTimeout(() => {
            router.push("/");
        }, 3000);
    }, []);

    return (
        <>
            <div className="auth ui success">
                <img src="https://asset.dropkitchen.xyz/contents/202306_dev/20230627145407967_dk.webp" />
                <h3>
                    <span>{nickName}</span>
                    <strong dangerouslySetInnerHTML={{ __html: lang.t(`signup.success.desc1`) }} />
                </h3>
                <p dangerouslySetInnerHTML={{ __html: lang.t(`signup.success.desc2`) }} />
            </div>
        </>
    );
});

export default Home;
