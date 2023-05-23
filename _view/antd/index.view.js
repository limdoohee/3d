import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import { SearchOutlined, PoweroffOutlined } from "@ant-design/icons";

import D_Button from "../../_lib/component/button";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    return (
        <>
            <h1>ANTD</h1>
            {/* //////////////////////////////////////////////////////////////////////////// Button */}
            <h3>Button</h3>
            <h5>.default</h5>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <D_Button.default>Default Button</D_Button.default>
                <D_Button.default disabled>Disabled Button</D_Button.default>
                <D_Button.default danger>Danger Button</D_Button.default>
                <D_Button.default type="primary">Primary Button</D_Button.default>
                <D_Button.default>Default Button</D_Button.default>
                <D_Button.default type="dashed">Dashed Button</D_Button.default>
                <D_Button.default type="text">Text Button</D_Button.default>
                <D_Button.default type="link">Link Button</D_Button.default>
                <D_Button.default type="primary" shape="circle" icon={<SearchOutlined />} />
                <D_Button.default type="primary" icon={<SearchOutlined />}>
                    Search
                </D_Button.default>
                <D_Button.default type="primary" size="large">
                    Large Button
                </D_Button.default>
                <D_Button.default type="primary" size="small">
                    Small Button
                </D_Button.default>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", margin: "10px 0 0 0" }}>
                <D_Button.default type="primary" block>
                    Primary Block Button
                </D_Button.default>
            </div>
            <h5>.tooltip</h5>
            <div style={{ display: "flex", gap: "10px" }}>
                <D_Button.tooltip title="title">Tooltip Button</D_Button.tooltip>
            </div>
            <h5>.loading</h5>
            <div style={{ display: "flex", gap: "10px" }}>
                <D_Button.loading
                    title="title"
                    icon={<PoweroffOutlined />}
                    onClick={(e) => {
                        setTimeout(() => {
                            e.setloading(false);
                        }, 1000);
                    }}
                >
                    Loading Button
                </D_Button.loading>
            </div>
            <h5>.dropdown</h5>
            <div style={{ display: "flex", gap: "10px" }}>
                <D_Button.dropdown
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
                </D_Button.dropdown>
            </div>
            {/* //////////////////////////////////////////////////////////////////////////// Button */}
            {/* //////////////////////////////////////////////////////////////////////////// Typography */}
            {/* //////////////////////////////////////////////////////////////////////////// Typography */}
        </>
    );
});

export default Home;
