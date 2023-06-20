import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DropListTemplate from "../../_lib/template/drop_list";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const { common, chat } = store;
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
                    <h1>Drop list (status : {common.ui.dropListOpen ? "open" : "close"})</h1>
                    <DDS.button.default
                        onClick={() => {
                            common.uiChange("dropListOpen", true);
                        }}
                        className="dds button text"
                    >
                        Drop list open
                    </DDS.button.default>
                    <DropListTemplate.default store={props.store} />
                </div>
            </DDS.layout.container>
        </>
    );
});

export default Home;
