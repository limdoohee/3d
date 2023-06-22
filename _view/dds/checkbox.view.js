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
                            <DDS.checkbox.default onChange={() => {}}>체크박스</DDS.checkbox.default>
                        </div>
                    </div>
                </div>
            </DDS.layout.container>
        </>
    );
});

export default Home;
