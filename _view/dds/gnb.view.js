import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DDS_Gnb from "../../_lib/template/gnb";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const { common } = store;
    const router = useRouter();

    return (
        <>
            <DDS.layout.container store={store}>
                <div className="dds style-guide">
                    <p>
                        <DDS.button.default
                            onClick={(e) => {
                                router.push("/dds");
                            }}
                        >
                            Back
                        </DDS.button.default>
                    </p>
                    <h1>Gnb (status : {common.ui.gnbOpen ? "open" : "close"})</h1>
                    <DDS.button.default
                        onClick={() => {
                            common.uiChange("gnbOpen", true);
                        }}
                        className="dds button text"
                    >
                        <DDS.icons.bars />
                        <DDS_Gnb.default store={store}></DDS_Gnb.default>
                    </DDS.button.default>
                </div>
            </DDS.layout.container>
        </>
    );
});

export default Home;
