import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import cookie from "react-cookies";
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
const { common, auth } = store;
//------------------------------------------------------------------------------- Store

const Home = () => {
    const router = useRouter();

    const errorCodeAction = async () => {
        await auth.errorCode({ code: router.query.errorCode }, (e) => {
            console.log(e);
            alert(e.error);
            location.href = "/login";
        });
    };

    useEffect(() => {
        if (router.isReady) {
            if (router.query.token) {
                // 로그인 토큰이 있는 경우
                auth.checkLoginJwt(router.query.token, async (e) => {
                    common.debug(e);
                    e.currentLoginSocial && localStorage.setItem("recentLogin", e.currentLoginSocial);
                    if (e.result) {
                        await cookie.remove("loginToken", { path: "/" });
                        await cookie.save("loginToken", router.query.token, { path: "/" });
                        location.href = "/";
                    }
                });
                // 로그인 토큰이 있는 경우
            } else if (router.query.errorCode) {
                console.log(router.query.errorCode);
                // 에러코드가 있는 경우
                errorCodeAction();
                // 에러코드가 있는 경우
            } else {
                location.href = "/";
            }
        }
    }, [router.isReady]);
    return <></>;
};

export default Home;
