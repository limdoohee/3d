import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../../_lib/component/layout";
import DDS_Button from "../../_lib/component/button";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    return (
        <>
            <DDS_Layout.container>
                <div className="dds style-guide">
                    <h1>DDS Style Guide</h1>
                    <ul>
                        <li>
                            <Link href="/dds/gnb">gnb</Link>
                        </li>
                        <li>
                            <Link href="/dds/chat">Chat</Link>
                        </li>
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
                            <Link href="/dds/tabs">Tabs</Link>
                        </li>
                        <li>
                            <Link href="/dds/profile">Profile</Link>
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
                    </ul>
                </div>
            </DDS_Layout.container>
        </>
    );
});

export default Home;
