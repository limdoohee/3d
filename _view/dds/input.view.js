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
                                router.push("/dds");
                            }}
                        >
                            Back
                        </DDS.button.default>
                    </p>
                    <h1>Input</h1>
                    <h4>유형</h4>
                    <p>Input은 문자, 숫자, 기호등을 입력하고 편집할 수 있는 입력 컴포넌트입니다.</p>
                    <div className="dds style-guide-inner">
                        <div className="part">
                            <DDS.input.default className="dds input primary" placeholder="텍스트 입력" defaultValue="Input primary" />
                            <DDS.input.default className="dds input primary" disabled placeholder="텍스트 입력" defaultValue="Input primary disabled" />
                            <DDS.input.default className="dds input primary" status="error" placeholder="텍스트 입력" defaultValue="Input primary error" />
                            <DDS.input.default className="dds input primary rounded" placeholder="텍스트 입력" defaultValue="Input primary rounded" />
                            <DDS.input.default className="dds input primary" placeholder="텍스트 입력" defaultValue="Input primary prefix" prefix={<DDS.icons.magnifyingGlass />} />
                            <DDS.input.default className="dds input primary" placeholder="텍스트 입력" defaultValue="Input primary suffix" suffix={<DDS.icons.magnifyingGlass />} />
                        </div>
                        <div className="part">
                            <DDS.input.default className="dds input secondary" placeholder="텍스트 입력" defaultValue="Input secondary" />
                            <DDS.input.default className="dds input secondary" disabled placeholder="텍스트 입력" defaultValue="Input secondary disabled" />
                            <DDS.input.default className="dds input secondary" status="error" placeholder="텍스트 입력" defaultValue="Input secondary error" />
                            <DDS.input.default className="dds input secondary rounded" placeholder="텍스트 입력" defaultValue="Input secondary rounded" />
                            <DDS.input.default className="dds input secondary" placeholder="텍스트 입력" defaultValue="Input secondary prefix" prefix={<DDS.icons.magnifyingGlass />} />
                            <DDS.input.default className="dds input secondary" placeholder="텍스트 입력" defaultValue="Input secondary suffix" suffix={<DDS.icons.magnifyingGlass />} />
                        </div>
                    </div>
                    <h4>크기</h4>
                    <div className="dds style-guide-inner">
                        <DDS.input.default className="dds input primary large" placeholder="텍스트 입력" defaultValue="Input primary large" />
                        <DDS.input.default className="dds input primary" placeholder="텍스트 입력" defaultValue="Input primary" />
                        <DDS.input.default className="dds input primary small" placeholder="텍스트 입력" defaultValue="Input primary small" />
                    </div>
                </div>
            </DDS.layout.container>
        </>
    );
});

export default Home;
