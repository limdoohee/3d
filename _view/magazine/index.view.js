import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
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
        <DDS.layout.container>
            <DK_template_header.default store={store} title={lang.t("magazine.title")} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>매거진</DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
