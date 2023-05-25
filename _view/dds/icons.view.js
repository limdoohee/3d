import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS_Button from "../../_lib/component/button";
import DDS_Icons from "../../_lib/component/icons";
//------------------------------------------------------------------------------- Component

const Home = observer((props) => {
    const {} = props;
    const router = useRouter();

    return (
        <>
            <div className="dds container">
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
                    <h1>Icons</h1>
                    <p>모바일에서 아이콘을 단독으로 사용할 경우, 터치를 위한 아이콘 최소 사이즈를 만족시키기 위해 패딩 영역이 필요한데, 패딩 영역을 포함한 아이콘의 최소 사이즈는 48px을 사용. 데스크탑에서는 40px을 사용.</p>
                    <div className="dds style-guide-inner">
                        <IconsComponent />
                    </div>
                </div>
            </div>
        </>
    );
});

export default Home;

var IconsComponent = () => {
    let Print = [];
    for (const key in DDS_Icons) {
        Print.push(DDS_Icons[key]);
    }
    return (
        <>
            {Print.map((Item, key) => {
                return <Item className="dds icons" key={key} />;
            })}
        </>
    );
};
