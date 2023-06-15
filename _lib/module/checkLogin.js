import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import cookie from "cookie";
import { useTimer, useStopwatch } from "react-timer-hook";
import moment from "moment";
//------------------------------------------------------------------------------- Module
import Api from "./api";
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
const { common, auth } = store;
//------------------------------------------------------------------------------- Store

// 테스트 토큰
const testToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMCIsImlhdCI6MTY4NjE5NzIzNH0.LyXlQGghMW2WQM0CA0TZTdnHRNjjzWXX9t2uu_IPSKE";

const pageFunc = {
    default: {
        // ------------------------------------------------------------ checkLoginDefaultSSR
        ssr: async (context) => {
            let cookies;
            let datas = { result: "none" };
            if (context.req.headers.cookie) {
                cookies = await cookie.parse(context.req.headers.cookie);

                if (cookies.loginToken) {
                    const result = await Api.post(`/dks-api/v1/check_login`, {}, cookies.loginToken ? cookies.loginToken : null);
                    const data = await result.json();
                    if (data.data) {
                        data.data["loginToken"] = cookies.loginToken;
                    }
                    datas = data.data ? data.data : { result: "none" };

                    // const result = await Api.post(`/dks-api/v2/check_login`, {}, testToken);
                    // const data = await result.json();
                    // if (data.data) {
                    //     data.data["loginToken"] = testToken;
                    // }
                    // datas = data.data ? data.data : { result: "none" };
                }
            }

            return datas;
        },
    },
};

export default pageFunc;
