import Router, { useRouter } from "next/router";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import cookie from "react-cookies";

const Home = observer(() => {
    const router = useRouter();

    const appCheck = async (callback) => {
        await cookie.remove("loginToken", { path: "/" });
        await cookie.save("loginToken", router.query.loginToken, { path: "/" });

        router.query.type && (await sessionStorage.setItem("type", router.query.type));
        router.query.code && (await sessionStorage.setItem("code", router.query.code));
        if (router.query.reviewYn) {
            console.log("reviewYn");
            await localStorage.setItem("reviewYn", router.query.reviewYn);
        }
        callback();
    };

    useEffect(() => {
        if (router.isReady) {
            appCheck(() => {
                location.href = "/";
            });
        }
    }, [router.isReady]);

    return <></>;
});

export default Home;
