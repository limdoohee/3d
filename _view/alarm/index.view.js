import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
import AlarmTemplate from "../../_lib/template/alarm";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const { common, chat, lang } = store;
    const router = useRouter();

    const headerRight = [];

    return (
        <>
            <DDS.layout.container className={"fluid"} store={store}>
                <DK_template_header.default store={store} title={lang.t("alarm.title")} right={headerRight} />
                <DK_template_GNB.default store={store} />
                {/* Content */}
                <DDS.layout.content>
                    <AlarmTemplate.default store={props.store} />
                </DDS.layout.content>
                {/* Content */}
            </DDS.layout.container>
        </>
    );
});

export default Home;
