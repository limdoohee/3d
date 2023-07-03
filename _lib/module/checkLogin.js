import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import cookie from "cookie";
import { useTimer, useStopwatch } from "react-timer-hook";
import moment from "moment";
import Cookie from "react-cookies";
//------------------------------------------------------------------------------- Module
import Api from "./api";
//------------------------------------------------------------------------------- Module

// 테스트 토큰

const pageFunc = {
    default: {
        // ------------------------------------------------------------ checkLoginDefaultSSR
        ssr: async (context) => {
            let cookies;
            let datas = { result: "none" };
            if (context.req.headers.cookie) {
                cookies = await cookie.parse(context.req.headers.cookie);

                if (cookies.loginToken) {
                    const result = await Api.post(`/dks-api/v2/check_login`, {}, cookies.loginToken ? cookies.loginToken : null, true);
                    const data = await result.json();
                    if (data.data) {
                        data.data["loginToken"] = cookies.loginToken;
                    }
                    datas = data.data ? data.data : { result: "none", cookie: cookies.loginToken };
                }
            }

            return datas;
        },
    },
    loginResultCheck: ({ rule, result, okUrl, store }) => {
        const { common } = store;
        // 로그인 분기
        useEffect(() => {
            // if (process.env.STAGE == "PRODUCTION") {
            //     var broswerInfo = navigator.userAgent;
            //     var webViewCheck = broswerInfo.indexOf(";;;aos;") !== -1 ? true : false;
            // }

            if (result.result == "ok") {
                if (okUrl) {
                    common.debug("상태 : 로그인 토큰이 정상적으로 존재 하여 로그인 성공 URL 이 있는경우");
                    location.href = okUrl;
                } else {
                    common.init();
                    common.debug("상태 : 로그인 토큰이 정상적으로 존재 하는 경우");
                }
            } else {
                switch (rule) {
                    case "loginOnly":
                        Cookie.remove("loginToken");
                        location.href = "/login";
                        common.debug("상태 : 로그인 토큰 없이 로그인 있어야 되는 페이지 출력");
                        break;
                    case "public":
                        common.init();
                        break;
                    default:
                        common.init();
                        common.debug("상태 : 로그인 토큰 없이 로그인 권한이 없어도 되는 페이지 출력");
                        break;
                }
            }
            //======================================== ReactGA
            common.gaCheck(window.location.pathname, window.location.search, window.dataLayer);
            //======================================== ReactGA
        }, []);
    },
};

export default pageFunc;
