import Router from "next/router";
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import cookie from "react-cookies";

const Home = observer(() => {
    useEffect(() => {
        const appCheck = async () => {
            await cookie.remove("loginToken", { path: "/" });
            await cookie.save("loginToken", Router.query.loginToken, { path: "/" });

            Router.query.type && sessionStorage.setItem("type");
            Router.query.code && sessionStorage.setItem("code");

            location.href = "/";
        };

        appCheck();
    }, []);
    return <></>;
});

export default Home;
