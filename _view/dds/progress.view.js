import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DDS_Button from "../../_lib/component/button";
import DDS_Icons from "../../_lib/component/icons";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    return (
        <>
            <DDS.layout.container>
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
                    <h1>Progress bar</h1>
                    <h4>유형</h4>
                    <p>Progress Bar는 UI를 불러오거나 사용자가 취한 액션을 처리할 경우 사용하며, 그 처리 과정이 진행 중임을 유저에게 알려줍니다. 또한 Progress Bar는 로딩 처리 시간을 예측 할 수 있을 때 사용합니다. </p>
                    <div className="dds style-guide-inner">
                        <div className="part">
                            <DDS.progress.default percent={50} showInfo={false} />
                        </div>
                    </div>
                </div>
            </DDS.layout.container>
        </>
    );
});

export default Home;
