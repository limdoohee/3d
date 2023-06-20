import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DDS_Button from "../../_lib/component/button";
import DDS_Icons from "../../_lib/component/icons";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
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
                    <h1>Chips</h1>
                    <h4>유형</h4>
                    <p> </p>
                    <div className="dds style-guide-inner">
                        <div className="part">
                            <DDS.chips.default className="primary">Chips</DDS.chips.default>
                        </div>
                    </div>
                </div>
            </DDS.layout.container>
        </>
    );
});

export default Home;
