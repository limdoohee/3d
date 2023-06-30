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
    const { common, chat, drop } = store;
    const router = useRouter();

    const actibateAR = () => {
        model.activateAR();
    };

    const [model, setmodel] = useState();

    //------------------------------------------------- Init Load
    const initLoad = ({ callback }) => {
        var params = {
            dropSeq: router.query.pid,
        };
        drop.getDetail(params, (e) => {
            console.log(e);
            callback && callback();
        });
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/ar/[pid]") {
            var broswerInfo = navigator.userAgent;
            var webViewCheck = broswerInfo.indexOf(";;;aos;") !== -1 ? true : false;
            initLoad({
                callback: async () => {
                    if (webViewCheck === false) {
                        location.href = drop.data.dropLink;
                    } else {
                        console.log("model", document.querySelector("#model"));
                        setmodel(document.querySelector("#model"));
                        setinit(true);
                    }
                },
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    // document.addEventListener("DOMContentLoaded", () => {
    //     setmodel(document.querySelector("#model"));
    //     console.log("DOMContentLoaded", document.querySelector("#model"));
    // });

    const [init, setinit] = useState(false);

    return (
        <>
            <DDS.layout.container className={"fluid"} store={store}>
                <DDS.layout.content>
                    <div className="dk ar" style={{ opacity: init ? "1" : "0" }}>
                        <model-viewer src={drop.data.detail.contentUrl} id="model" ar ar-modes="webxr scene-viewer quick-look" camera-controls shadow-intensity="1" autoplay></model-viewer>
                        <DDS.button.default onClick={actibateAR}>View in your space</DDS.button.default>
                    </div>
                </DDS.layout.content>
            </DDS.layout.container>
        </>
    );
});

export default Home;
