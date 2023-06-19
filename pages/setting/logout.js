import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import cookie from "react-cookies";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
const { common, auth } = store;
//------------------------------------------------------------------------------- Store

const Home = (props) => {
    const router = useRouter();

    useEffect(async () => {
        await cookie.remove("loginToken", { path: "/" });
        // await Router.push("/");
        location.href = "/";
    }, []);
    return <></>;
};

export default Home;
