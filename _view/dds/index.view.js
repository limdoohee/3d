import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const { store } = props;
    const router = useRouter();

    return (
        <>
            <DDS.layout.container store={store}>
                <div className="dds style-guide">
                    <h1>DDS Style Guide</h1>
                    <h4>Component</h4>
                    <ul>
                        <li>
                            <Link href="/dds/icons">icons</Link>
                        </li>
                        <li>
                            <Link href="/dds/button">Button</Link>
                        </li>
                        <li>
                            <Link href="/dds/input">Input</Link>
                        </li>
                        <li>
                            <Link href="/dds/checkbox">checkbox</Link>
                        </li>
                        <li>
                            <Link href="/dds/tabs">Tabs</Link>
                        </li>
                        <li>
                            <Link href="/dds/profile">Profile</Link>
                        </li>
                        <li>
                            <Link href="/dds/progress">Progress</Link>
                        </li>
                        <li>
                            <Link href="/dds/chips">Chips</Link>
                        </li>
                        <li>
                            <Link href="/dds/message">Message</Link>
                        </li>
                    </ul>
                    <h4>Template</h4>
                    <ul>
                        <li>
                            <Link href="/dds/gnb">gnb</Link>
                        </li>
                        <li>
                            <Link href="/dds/chat">Chat</Link>
                        </li>
                        <li>
                            <Link href="/dds/point">Point</Link>
                        </li>
                        <li>
                            <Link href="/dds/alarm">Alarm</Link>
                        </li>
                        <li>
                            <Link href="/dds/magazine">Magazine</Link>
                        </li>
                        <li>
                            <Link href="/dds/drop_list">Drop list</Link>
                        </li>
                    </ul>
                    <h4>Test</h4>
                    <ul>
                        <li>
                            <Link href="/dds/analysis">analysis</Link>
                        </li>
                    </ul>
                </div>
            </DDS.layout.container>
        </>
    );
});

export default Home;
