import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../_lib/component/layout";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const { common } = store;
    const router = useRouter();

    React.useEffect(() => {  
        common.getBuildId();
    }, []);

    return (
        <DDS_Layout.container>
            INDEX <p>buildId : {common.buildId}</p>
        </DDS_Layout.container>
    );
});

export default Home;
