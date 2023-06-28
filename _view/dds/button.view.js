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
                    <p>
                        <DDS.button.default
                            onClick={(e) => {
                                location.href = "/dds";
                            }}
                        >
                            Back
                        </DDS.button.default>
                    </p>
                    <h1>Button</h1>
                    <h4>유형</h4>
                    <p>Button은 스타일 및 쓰임새에 따라 Contained Button, Outlined Button, Text Button, Icon Button 4가지로 분류. </p>
                    <div className="dds style-guide-inner">
                        <div className="part">
                            <DDS.button.default className="dds button primary">Button primary</DDS.button.default>
                            <DDS.button.default className="dds button secondary">Button secondary</DDS.button.default>
                            <DDS.button.default className="dds button outline">Button outline</DDS.button.default>
                            <DDS.button.default className="dds button text">Button text</DDS.button.default>
                            <DDS.button.default className="dds button primary" disabled>
                                Button primary
                            </DDS.button.default>
                        </div>
                        <div className="part">
                            <DDS.button.default className="dds button primary" icon={<DDS.icons.angleDown />}></DDS.button.default>
                            <DDS.button.default className="dds button primary rounded" icon={<DDS.icons.angleDown />}></DDS.button.default>
                            <DDS.button.default className="dds button secondary" icon={<DDS.icons.angleDown />}></DDS.button.default>
                            <DDS.button.default className="dds button secondary rounded" icon={<DDS.icons.angleUp />}></DDS.button.default>
                            <DDS.button.default className="dds button none rounded" icon={<DDS.icons.circleArrowUp />}></DDS.button.default>
                            <DDS.button.default className="dds button none rounded large" icon={<DDS.icons.circleArrowUp />}></DDS.button.default>
                        </div>
                    </div>
                    <h4>크기</h4>
                    <div className="dds style-guide-inner">
                        <DDS.button.default className="dds button primary large">Button large</DDS.button.default>
                        <DDS.button.default className="dds button primary ">Button defalult</DDS.button.default>
                        <DDS.button.default className="dds button primary small">Button small</DDS.button.default>
                    </div>
                    <h4>Block</h4>
                    <div className="dds style-guide-inner">
                        <DDS.button.default className="dds button primary block">Button block</DDS.button.default>
                    </div>
                </div>
            </DDS.layout.container>

            {/* //////////////////////////////////////////////////////////////////////////// Button */}
            {/* <h3>Button</h3>
            <h5>.default</h5>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <DDS.button.default>Default Button</DDS.button.default>
                <DDS.button.default disabled>Disabled Button</DDS.button.default>
                <DDS.button.default danger>Danger Button</DDS.button.default>
                <DDS.button.default type="primary">Primary Button</DDS.button.default>
                <DDS.button.default>Default Button</DDS.button.default>
                <DDS.button.default type="dashed">Dashed Button</DDS.button.default>
                <DDS.button.default type="text">Text Button</DDS.button.default>
                <DDS.button.default type="link">Link Button</DDS.button.default>
                <DDS.button.default type="primary" shape="circle" icon={<SearchOutlined />} />
                <DDS.button.default type="primary" icon={<SearchOutlined />}>
                    Search
                </DDS.button.default>
                <DDS.button.default type="primary" size="large">
                    Large Button
                </DDS.button.default>
                <DDS.button.default type="primary" size="small">
                    Small Button
                </DDS.button.default>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", margin: "10px 0 0 0" }}>
                <DDS.button.default type="primary" block>
                    Primary Block Button
                </DDS.button.default>
            </div>
            <h5>.tooltip</h5>
            <div style={{ display: "flex", gap: "10px" }}>
                <DDS.button.tooltip title="title">Tooltip Button</DDS.button.tooltip>
            </div>
            <h5>.loading</h5>
            <div style={{ display: "flex", gap: "10px" }}>
                <DDS.button.loading
                    title="title"
                    icon={<PoweroffOutlined />}
                    onClick={(e) => {
                        setTimeout(() => {
                            e.setloading(false);
                        }, 1000);
                    }}
                >
                    Loading Button
                </DDS.button.loading>
            </div>
            <h5>.dropdown</h5>
            <div style={{ display: "flex", gap: "10px" }}>
                <DDS.button.dropdown
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
                </DDS.button.dropdown>
            </div> */}
            {/* //////////////////////////////////////////////////////////////////////////// Button */}
            {/* //////////////////////////////////////////////////////////////////////////// Typography */}
            {/* //////////////////////////////////////////////////////////////////////////// Typography */}
        </>
    );
});

export default Home;
