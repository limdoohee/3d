import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import cookie, { plugToRequest } from "react-cookies";
//------------------------------------------------------------------------------- Store
import Store from "../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Module
import checkLogin from "../_lib/module/checkLogin";
//------------------------------------------------------------------------------- Module
//------------------------------------------------------------------------------- View
import View from "../_view/index.view";
//------------------------------------------------------------------------------- View

const Home = observer((props) => {
    useEffect(async () => {
        await cookie.remove("loginToken", { path: "/" });
        await cookie.save("loginToken", props.query.loginToken, { path: "/" });

        Router.query.type && sessionStorage.setItem("type");
        Router.query.code && sessionStorage.setItem("code");

        location.href = "/";
    }, []);
    return <></>;
});

//------------------------------------------------------------------------------- getServerSideProps
export async function getServerSideProps(context) {
    let datas = { query: context.query };
    return { props: datas };
}
//------------------------------------------------------------------------------- getServerSideProps

export default Home;
