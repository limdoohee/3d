import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../../_lib/component/layout";
import DDS_Gnb from "../../_lib/template/gnb";
import DDS_Button from "../../_lib/component/button";
import DDS_Icons from "../../_lib/component/icons";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const { common } = store;
    const router = useRouter();

    return (
        <>
            <DDS_Layout.container>
                <div className="dds style-guide">
                    <p>
                        <DDS_Button.default
                            onClick={(e) => {
                                router.push("/dds");
                            }}
                        >
                            Back
                        </DDS_Button.default>
                    </p>
                    <h1>Gnb</h1>
                    <DDS_Button.default
                        onClick={() => {
                            common.uiChange("gnbOpen", true);
                        }}
                        className="dds button text"
                    >
                        <DDS_Icons.bars />
                    </DDS_Button.default>
                    <DDS_Gnb.default store={store}></DDS_Gnb.default>
                    <DDS_Layout.container></DDS_Layout.container>
                </div>
            </DDS_Layout.container>
        </>
    );
});

export default Home;
