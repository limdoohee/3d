import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../../_lib/component/layout";
import DDS_Button from "../../_lib/component/button";
import DDS_Icons from "../../_lib/component/icons";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
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
                    <h1>Button</h1>
                    <h4>유형</h4>
                    <p>Button은 스타일 및 쓰임새에 따라 Contained Button, Outlined Button, Text Button, Icon Button 4가지로 분류. </p>
                    <div className="dds style-guide-inner">
                        <div className="part">
                            <DDS_Button.default className="dds button primary">Button primary</DDS_Button.default>
                            <DDS_Button.default className="dds button secondary">Button secondary</DDS_Button.default>
                            <DDS_Button.default className="dds button outline">Button outline</DDS_Button.default>
                            <DDS_Button.default className="dds button text">Button text</DDS_Button.default>
                            <DDS_Button.default className="dds button primary" disabled>
                                Button primary
                            </DDS_Button.default>
                        </div>
                        <div className="part">
                            <DDS_Button.default className="dds button primary" icon={<DDS_Icons.angleDown />}></DDS_Button.default>
                            <DDS_Button.default className="dds button primary rounded" icon={<DDS_Icons.angleDown />}></DDS_Button.default>
                            <DDS_Button.default className="dds button secondary" icon={<DDS_Icons.angleDown />}></DDS_Button.default>
                            <DDS_Button.default className="dds button secondary rounded" icon={<DDS_Icons.angleUp />}></DDS_Button.default>
                            <DDS_Button.default className="dds button none rounded" icon={<DDS_Icons.circleArrowUp />}></DDS_Button.default>
                            <DDS_Button.default className="dds button none rounded" icon={<DDS_Icons.circleArrowUp className="large" />}></DDS_Button.default>
                        </div>
                    </div>
                    <h4>크기</h4>
                    <div className="dds style-guide-inner">
                        <DDS_Button.default className="dds button primary large">Button large</DDS_Button.default>
                        <DDS_Button.default className="dds button primary ">Button defalult</DDS_Button.default>
                        <DDS_Button.default className="dds button primary small">Button small</DDS_Button.default>
                    </div>
                    <h4>Block</h4>
                    <div className="dds style-guide-inner">
                        <DDS_Button.default className="dds button primary block">Button block</DDS_Button.default>
                    </div>
                </div>
            </DDS_Layout.container>

            {/* //////////////////////////////////////////////////////////////////////////// Button */}
            {/* <h3>Button</h3>
            <h5>.default</h5>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <DDS_Button.default>Default Button</DDS_Button.default>
                <DDS_Button.default disabled>Disabled Button</DDS_Button.default>
                <DDS_Button.default danger>Danger Button</DDS_Button.default>
                <DDS_Button.default type="primary">Primary Button</DDS_Button.default>
                <DDS_Button.default>Default Button</DDS_Button.default>
                <DDS_Button.default type="dashed">Dashed Button</DDS_Button.default>
                <DDS_Button.default type="text">Text Button</DDS_Button.default>
                <DDS_Button.default type="link">Link Button</DDS_Button.default>
                <DDS_Button.default type="primary" shape="circle" icon={<SearchOutlined />} />
                <DDS_Button.default type="primary" icon={<SearchOutlined />}>
                    Search
                </DDS_Button.default>
                <DDS_Button.default type="primary" size="large">
                    Large Button
                </DDS_Button.default>
                <DDS_Button.default type="primary" size="small">
                    Small Button
                </DDS_Button.default>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", margin: "10px 0 0 0" }}>
                <DDS_Button.default type="primary" block>
                    Primary Block Button
                </DDS_Button.default>
            </div>
            <h5>.tooltip</h5>
            <div style={{ display: "flex", gap: "10px" }}>
                <DDS_Button.tooltip title="title">Tooltip Button</DDS_Button.tooltip>
            </div>
            <h5>.loading</h5>
            <div style={{ display: "flex", gap: "10px" }}>
                <DDS_Button.loading
                    title="title"
                    icon={<PoweroffOutlined />}
                    onClick={(e) => {
                        setTimeout(() => {
                            e.setloading(false);
                        }, 1000);
                    }}
                >
                    Loading Button
                </DDS_Button.loading>
            </div>
            <h5>.dropdown</h5>
            <div style={{ display: "flex", gap: "10px" }}>
                <DDS_Button.dropdown
                    items={[
                        {
                            key: "1",
                            label: "1st item",
                        },
                        {
                            key: "2",
                            label: "2nd item",
                        },
                        {
                            key: "3",
                            label: "3rd item",
                        },
                    ]}
                    onMenuClick={(e) => {
                        console.log("click", e);
                    }}
                    onClick={() => {
                        console.log("onClick");
                    }}
                >
                    Loading Button
                </DDS_Button.dropdown>
            </div> */}
            {/* //////////////////////////////////////////////////////////////////////////// Button */}
            {/* //////////////////////////////////////////////////////////////////////////// Typography */}
            {/* //////////////////////////////////////////////////////////////////////////// Typography */}
        </>
    );
});

export default Home;
