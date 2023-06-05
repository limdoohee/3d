import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Component
import ChatComponent from "../../_lib/component/chat";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Template
import ChatTemplate from "../../_lib/template/chat";
//------------------------------------------------------------------------------- Template

const Home = observer((props) => {
    const { common, chat } = props.store;
    const router = useRouter();

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/test/chat") {
            chat.joinChat({ name: "kimjh", id: "kimjh", url: "sendbird_open_channel_10510_f7b58093d862c9af9af0f9499049cfd7e1469d5e" });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    return (
        <>
            <Head>
                <title>Chat Test</title>
            </Head>
            <ChatTemplate.open store={props.store} />
        </>
    );
});

export default Home;
