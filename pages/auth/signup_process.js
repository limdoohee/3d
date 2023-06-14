import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
//------------------------------------------------------------------------------- Module
import Api from "../../_lib/module/api";
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
const { common, auth } = store;
//------------------------------------------------------------------------------- Store

const Home = (props) => {
    const router = useRouter();
    console.log(router.query);

    if (router.query.email && router.query.clientId) {
        auth.checkLoginJwt(router.query.email && router.query.clientId, async (e) => {
            common.debug(e);
            sessionStorage.removeItem("loginToken");

            sessionStorage.setItem("loginEmail", router.query.email);
            sessionStorage.setItem("loginClientId", router.query.clientId);
            Router.push("/signup/terms");
        });
    } else {
        if (router.query.errorCode) {
            auth.errorCode({ code: router.query.errorCode }, (e) => {
                alert(e.error);
                Router.push("/login");
            });
        }
    }

    // useEffect(() => {
    //     if (router.query.token) {
    //         console.log(1);
    //         auth.checkLoginJwt(router.query.token, async (e) => {
    //             common.debug(e);
    //             if (e.result) {
    //                 // localStorage.setItem("loginToken", router.query.token);
    //                 await cookie.remove("loginToken", { path: "/" });
    //                 await cookie.save("loginToken", router.query.token, { path: "/" });
    //                 var url = "";
    //                 let urlCheck = () => {
    //                     url = sessionStorage.getItem("loginPath") ? sessionStorage.getItem("loginPath") : "/";
    //                 };
    //                 await urlCheck();
    //                 await sessionStorage.removeItem("loginPath");
    //                 Router.push(url);
    //             }
    //         });
    //     }
    // }, []);
    return <></>;
};

export default Home;
