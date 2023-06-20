import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import { Spin } from "antd";
//------------------------------------------------------------------------------- Component
import DDS from "../_lib/component/dds";
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
        <DDS.layout.container store={store}>
            <div className="dds loading-full">
                {" "}
                <Spin />
            </div>
        </DDS.layout.container>
    );
});

export default Home;
