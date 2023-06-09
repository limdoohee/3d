import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../_lib/component/layout";
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
        <DDS_Layout.container>
            <div className="dk error">
                <div className="center">
                    <h3>Oops...</h3>
                    <p>
                        {lang.t("error.404.description1")}
                        <br />
                        {lang.t("error.404.description2")}
                    </p>
                </div>
                <div className="bottom">
                    <DDS.button.default
                        className={"dds button primary block"}
                        onClick={() => {
                            router.back();
                        }}
                    >
                        {lang.t("error.404.historyBack")}
                    </DDS.button.default>
                </div>
            </div>
        </DDS_Layout.container>
    );
});

export default Home;
