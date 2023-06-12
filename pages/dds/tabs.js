import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import "../../_lib/module/i18n";

import { useTranslation } from "react-i18next";
//------------------------------------------------------------------------------- Store
import Store from "../../_store/store";
const store = new Store();
//------------------------------------------------------------------------------- Store
//------------------------------------------------------------------------------- View
import View from "../../_view/dds/tabs.view";
//------------------------------------------------------------------------------- View

let langSelect = "en";

const Home = observer((props) => {
    const router = useRouter();

    const { t, i18n } = useTranslation();

    // const changeLanguage = (lng) => {
    //     i18n.changeLanguage(lng);
    // };

    return (
        <>
            <View props={props} />
        </>
    );
});

export default Home;
