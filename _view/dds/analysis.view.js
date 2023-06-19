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
    const { common, chat } = store;
    const router = useRouter();

    const onClick = () => {
        common.analysisSubmit({
            component: "button",
            componentId: "button_complete",
            action: "click",
        });
    };

    const [state, setstate] = useState({
        component: "button",
        componentId: "button_complete",
        action: "click",
    });

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
                    <h1>Analysis</h1>
                    <h4>component : </h4>
                    <DDS.input.default
                        onChange={(e) => {
                            setstate((p) => ({ ...p, component: e.target.value }));
                        }}
                        value={state.component}
                    />
                    <h4>componentId : </h4>
                    <DDS.input.default
                        onChange={(e) => {
                            setstate((p) => ({ ...p, componentId: e.target.value }));
                        }}
                        value={state.componentId}
                    />
                    <h4>action : </h4>
                    <DDS.input.default
                        onChange={(e) => {
                            setstate((p) => ({ ...p, action: e.target.value }));
                        }}
                        value={state.action}
                    />
                    <DDS.button.default onClick={onClick}>Back</DDS.button.default>
                </div>
            </DDS.layout.container>
        </>
    );
});

export default Home;
