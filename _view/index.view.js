import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../_lib/component/layout";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    const [buildId, setBuildId] = React.useState(null);

    React.useEffect(() => {
        // const hasTargetFile = Array.from(document.querySelectorAll("script"))
        //     .map(({ src }) => src)
        //     .some((url) => url.includes("_buildManifest.js"));
        // if (!hasTargetFile) {
        //     return;
        // }

        setBuildId(JSON.parse(document.querySelector("#__NEXT_DATA__").textContent).buildId);

        console.log(JSON.parse(document.querySelector("#__NEXT_DATA__").textContent).buildId);
    }, []);

    if (Boolean(buildId)) {
        console.log("buildId: " + buildId);
    }

    return <DDS_Layout.container>INDEX</DDS_Layout.container>;
});

export default Home;
