import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import "../_lib/module/i18n";

import { useTranslation } from "react-i18next";
//------------------------------------------------------------------------------- Store
import Store from "../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- Component
//------------------------------------------------------------------------------- Component

let langSelect = "en";

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    const { t, i18n } = useTranslation();

    console.log("i18n", i18n);

    // const changeLanguage = (lng) => {
    //     i18n.changeLanguage(lng);
    // };

    return (
        <>
            INDEX
            {/* <div>{t(`title`)}</div> */}
        </>
    );
});

export default Home;
