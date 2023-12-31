import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import Sticky from "react-sticky-el";
import { InView } from "react-intersection-observer";
import { animateScroll as scroll, Events, scrollSpy, scroller, Element } from "react-scroll";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
import DropListTemplate from "../../_lib/template/drop_list";
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Module
import Date_Module from "../../_lib/module/date";
//------------------------------------------------------------------------------- Module

const Home = observer((props) => {
    const { store } = props;
    const { common, lang, auth, magazine } = store;
    const router = useRouter();

    // const headerRight = [
    //     () => (
    //         <DDS.button.default
    //             className="dds button none"
    //             icon={<DDS.icons.bars />}
    //             onClick={() => {
    //                 common.uiChange("gnbOpen", true);
    //             }}
    //         />
    //     ),
    // ];

    return (
        <DDS.layout.container className={"fluid"} store={store}>
            <DK_template_header.default store={store} title={lang.t("dropList.title")} />
            <DK_template_GNB.default store={store} />
            {/* Content */}
            <DDS.layout.content>
                <DropListTemplate.default store={props.store} />
            </DDS.layout.content>
            {/* Content */}
        </DDS.layout.container>
    );
});

export default Home;
