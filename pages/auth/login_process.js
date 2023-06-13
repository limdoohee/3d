import { Cookie } from "@mui/icons-material";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import cookie from "react-cookies";
import TagManager from "react-gtm-module";
import ReactGA from "react-ga4";
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

    if (router.query.token) {
        auth.checkLoginJwt(router.query.token, async (e) => {
            common.debug(e);
            if (e.result) {
                // const tagManagerArgs = {
                //     gtmId: common.gtmId,
                // };
                // TagManager.initialize(tagManagerArgs);

                // if (e.selfAuth == false && e.termsAgree == false) {
                //     var signupArg = {
                //         dataLayer: {
                //             event: "sign_up",
                //             signup_type: "회원가입분류",
                //         },
                //     };
                //     TagManager.dataLayer(signupArg);

                //     !(function (e, t, n, s, u, a) {
                //         e.twq ||
                //             ((s = e.twq =
                //                 function () {
                //                     s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
                //                 }),
                //             (s.version = "1.1"),
                //             (s.queue = []),
                //             (u = t.createElement(n)),
                //             (u.async = !0),
                //             (u.src = "https://static.ads-twitter.com/uwt.js"),
                //             (a = t.getElementsByTagName(n)[0]),
                //             a.parentNode.insertBefore(u, a));
                //     })(window, document, "script");
                //     twq("config", "od7q0");
                //     // Insert Twitter Event ID
                //     twq("event", "tw-od7q0-oeave", {
                //         email_address: null, // use this to pass a user’s email address
                //     });
                // }

                // const loginArg = {
                //     dataLayer: {
                //         user_id: e.seq,
                //     },
                // };
                // TagManager.dataLayer(loginArg);

                // console.log(loginArg);
                // console.log(TagManager);

                // sessionStorage.setItem("bannerOn", true);
                await cookie.remove("loginToken", { path: "/" });
                await cookie.save("loginToken", router.query.token, { path: "/" });

                Router.push("/signup/success");
            }
        });
    } else {
        if (router.query.errorCode) {
            auth.errorCode({ code: router.query.errorCode }, (e) => {
                // common.debug(e);
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
