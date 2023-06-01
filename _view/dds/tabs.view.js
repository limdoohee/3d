import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../../_lib/component/layout";
import DDS_Button from "../../_lib/component/button";
import DDS_Tabs from "../../_lib/component/tabs";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    const onChange = (key) => {
        console.log(key);
    };
    const items = [
        {
            key: "1",
            label: `메뉴1`,
            children: `Content of Tab Pane 1`,
        },
        {
            key: "2",
            label: `메뉴2`,
            children: `Content of Tab Pane 2`,
        },
        {
            key: "3",
            label: `메뉴3`,
            children: `Content of Tab Pane 3`,
        },
        {
            key: "4",
            label: `메뉴4`,
            children: `Content of Tab Pane 4`,
        },
        {
            key: "5",
            label: `메뉴5`,
            children: `Content of Tab Pane 5`,
        },
        {
            key: "6",
            label: `메뉴6`,
            children: `Content of Tab Pane 6`,
        },
    ];

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
                    <h1>Tabs</h1>
                    <h4>유형</h4>
                    <p>Tabs는 페이지 내 유사한 정보를 그룹핑하여 콘텐츠를 정리할 때 사용합니다.</p>
                    <p>Tabs 와 Tabs group 2가지로 분류, Tabs 섹션이 2~4가지는 가장 기본적인 Tabs를 사용하며 섹션이 5가지 이상, 즉 다수일 경우 Tabs Group을 사용하며 길어질 경우 스크롤이 가능합니다.</p>
                    <div className="dds style-guide-inner">
                        <DDS_Tabs.default defaultActiveKey="1" items={items} onChange={onChange} />
                    </div>
                </div>
            </DDS_Layout.container>
        </>
    );
});

export default Home;
