import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import ChatTemplate from "../../_lib/template/chat";
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
                    <h1>Message</h1>
                    <DDS.button.default
                        onClick={() => {
                            common.messageApi.open({
                                type: "success",
                                content: "This is an error message",
                            });
                        }}
                        className="dds button primary"
                    >
                        Message Open
                    </DDS.button.default>
                    <ChatTemplate.open store={props.store} />
                </div>
            </DDS.layout.container>
        </>
    );
});

export default Home;
