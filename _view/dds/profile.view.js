import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Layout from "../../_lib/component/layout";
import DDS_Button from "../../_lib/component/button";
import DDS_Profile from "../../_lib/component/profile";
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
                    <h1>Profile</h1>
                    <h4>유형</h4>
                    <p>Profile은 화면상에서 사용자를 의미하는 원형의 컴포넌트를 의미합니다. 사용자가 설정한 사진이나 그래픽 등이 원형태로 적용되어 dropkitchen앱 내 필요한 영역에 노출됩니다.</p>
                    <div className="dds style-guide-inner">
                        <DDS_Profile.default src="" />
                        <DDS_Profile.default src="https://picsum.photos/id/237/200/300" cert={true} />
                    </div>
                </div>
            </DDS_Layout.container>
        </>
    );
});

export default Home;
