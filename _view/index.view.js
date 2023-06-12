import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import "../_lib/module/i18n";

import { useTranslation } from "react-i18next";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../_lib/component/layout";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    const { t, i18n } = useTranslation();

    // const changeLanguage = (lng) => {
    //     i18n.changeLanguage(lng);
    // };

    return (
        <DDS_Layout.container>
            INDEX
            {/* <div>{t(`description.part1`)}</div> */}
        </DDS_Layout.container>

        
    );
});

export default Home;
