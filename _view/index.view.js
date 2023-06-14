import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../_lib/component/layout";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth } = store;
    const router = useRouter();

    React.useEffect(() => {
        common.getBuildId();

        common.debug(auth.loginResult);
    }, []);

    return (
        // <DDS_Layout.container>
        //     <div>{lang.i18n.language}</div>
        //     <h1>{lang.t(`title`)}</h1>
        //     INDEX <p>buildId : {common.buildId}</p>
        // </DDS_Layout.container>
        <></>
    );
});

export default Home;
