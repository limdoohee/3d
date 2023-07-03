import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
//------------------------------------------------------------------------------- Component

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import gsap from "gsap";

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { common, lang, auth, gallery } = store;
    const [modalOpen, setModalOpen] = useState(false);
    const [amount, setAmount] = useState(1);
    const [boxCnt, setBoxCnt] = useState(0);
    const [descDisabled, setDescDisabled] = useState(false);
    const [incrDisabled, setIncrDisabled] = useState(false);
    const [helper, setHelper] = useState(false);
    const [boxOpen, setBoxOpen] = useState(false);
    const [artName, setArtName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [img, setImg] = useState("../../static/3d/luckyBox/LuckyBox_Loop.gif");
    let btnClick = false;

    let renderer;
    let camera;
    const scene = new THREE.Scene();
    let clock = new THREE.Clock();
    const loader = new GLTFLoader();

    let model;
    const animationActions = [];
    let activeAction;
    let lastAction;

    const setAction = (toAction) => {
        if (toAction != activeAction) {
            lastAction = activeAction;
            activeAction = toAction;
            activeAction.reset();
            activeAction.setLoop(THREE.LoopOnce);
            activeAction.play();
        }
    };

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {
        let s;
        switch (process.env.STAGE) {
            case "LOCAL":
                s = "mango";
                break;
            case "DEVELOPMENT":
                s = "mango";
                break;
            case "STAGING":
                s = "plum";
                break;
            case "PRODUCTION":
                s = "www";
                break;
            default:
                break;
        }
        gallery.getLuckyBox("", (e) => {
            setBoxCnt(gallery.luckyBox.length);
            callback && callback(e);
        });
        gallery.getData({ sendbirdId: `dropkitchen_${s}_member_` + auth.loginResult.seq }, (e) => {
            // common.debug(e);
            callback && callback(e);
        });
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/random") {
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    function decrementCount() {
        if (amount != 1) {
            setAmount(amount - 1);
            setIncrDisabled(false);
            setDescDisabled(false);
            if (amount - 2 === 0) {
                setDescDisabled(true);
            }
        } else {
            setDescDisabled(true);
        }
    }
    function incrementCount() {
        if ((amount + 1) * 1500 <= gallery.data.pointBalance) {
            setAmount(amount + 1);
            setDescDisabled(false);
            setIncrDisabled(false);
            if (gallery.data.pointBalance < (amount + 2) * 1500) {
                setIncrDisabled(true);
            }
        } else {
            setIncrDisabled(true);
        }
    }

    const buyingModal = () => {
        return (
            <ul className="buyRandomBox">
                <li>
                    <div className="box">
                        <img src={`../../static/img/randomBox.png`} alt="randomBox" />
                        <ul>
                            <h6>{lang.t("random.modal.boxName")}</h6>
                            <li className="boxPoint">
                                <DDS.icons.point />
                                1,500
                            </li>
                        </ul>
                    </div>
                    <div className="option">
                        <DDS.icons.minus onClick={decrementCount} className={descDisabled ? "disabled" : ""} />
                        <span className="amount">{amount}</span>
                        <DDS.icons.plus onClick={incrementCount} className={incrDisabled ? "disabled" : ""} />
                    </div>
                </li>
                <li className="point">
                    <h5>{lang.t("random.modal.point")}</h5>
                    <h6>{common.numberFormat(gallery.data.pointBalance)}P</h6>
                </li>
                <li className="payment">
                    <h5>{lang.t("random.modal.payment")}</h5>
                    <h6>{common.numberFormat(amount * 1500)}P</h6>
                </li>
                <li className={`helper ${helper ? "on" : ""}`}>
                    <DDS.icons.circleExclamation />
                    {lang.t("random.modal.helper")}
                </li>
            </ul>
        );
    };

    const messageData1 = {
        key: "luckyBox",
        icon: <DDS.icons.circleExclamation />,
        className: "arMessage",
        content: lang.t("random.message1"),
    };

    const messageData2 = {
        className: "buyingMessage",
        content: lang.t("random.message2"),
    };

    const modalData = {
        open: modalOpen,
        setOpen: setModalOpen,
        title: lang.t("random.modal.title"),
        context: buyingModal(),
        confirm: {
            label: lang.t("random.modal.confirm"),
            close:
                gallery.data.pointBalance < 1500 &&
                (() => {
                    setHelper(true);
                }),
            action: () => {
                1500 <= gallery.data.pointBalance &&
                    gallery.buyLuckyBox({ amount }, (e) => {
                        gallery.getLuckyBox("", (e) => {
                            setAmount(1);
                            setBoxCnt((prev) => prev + amount);
                        });

                        common.messageApi.open(messageData2);
                    });
            },
        },
        cancel: {
            label: lang.t("random.modal.close"),
            action: () => {},
        },
    };

    const Text = () => {
        return boxOpen ? (
            <>
                <h2>{lang.t("random.drop.title")}</h2>
                <h3>{lang.t("random.drop.desc")}</h3>
            </>
        ) : (
            <h2>{lang.t("random.desc")}</h2>
        );
    };

    function setSpace() {
        const canvas = document.getElementById("space");
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(0, 2.6, 10);

        const controls = new MapControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.target.set(0, 2.6, 0);
        controls.update();

        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        // PointLight
        const pointLight = new THREE.PointLight(0xffffff, 0.1);
        pointLight.position.set(0, 4, 3);
        scene.add(pointLight);

        window.addEventListener("click", onTouchBox);
    }

    function spaceRender() {
        requestAnimationFrame(spaceRender);
        renderer.render(scene, camera);
    }

    function onTouchBox(event) {
        if (event.target.tagName === "SPAN" || event.target.tagName === "BUTTON") {
            console.log("btnClick", btnClick);
            if ((event.target.className.includes("luckyBox") || event.target.parentNode?.className.includes("luckyBox")) && !btnClick) {
                gallery.openLuckyBox({ luckyBoxSeq: gallery.luckyBox[0].seq }, (e) => {
                    console.log("click");
                    if (e.id === "invalid_request") {
                        common.messageApi.open(messageData1);
                        setTimeout(() => {
                            btnClick = false;
                        }, 3000);
                    }
                    if (e.dropSeq) {
                        setImg("../../static/3d/luckyBox/LuckyBox_Open.gif");
                        setTimeout(() => {
                            document.querySelector(".box").classList.add("hidden");
                        }, 1200);
                        setArtName(e.artName);
                        setArtistName(e.artistName);
                        setBoxOpen(true);
                        setBoxCnt((prev) => prev - 1);
                        setAction(animationActions[1]);
                        setTimeout(() => {
                            loader.load(
                                e.contentUrl,
                                // "https://asset.dropkitchen.xyz/contents/drops/Drop02_KimYunA/scene.gltf",
                                function (gltf) {
                                    model = gltf.scene;
                                    model.position.z = 3;
                                    model.position.y = 1;

                                    switch (e.dropSeq) {
                                        case 1:
                                            model.scale.multiplyScalar(14);
                                            break;
                                        case 2:
                                            model.scale.multiplyScalar(20);
                                            break;
                                        case 3:
                                            model.scale.multiplyScalar(1.5);
                                            break;
                                        case 4:
                                            model.scale.multiplyScalar(15);
                                            break;
                                        case 5:
                                            model.scale.multiplyScalar(15);
                                            break;
                                        default:
                                            model.scale.multiplyScalar(1);
                                            break;
                                    }
                                    scene.add(model);
                                },
                                undefined,
                                function (error) {
                                    console.log("An error happened");
                                },
                            );

                            btnClick = false;
                        }, 1500);
                    }
                });
            }
        }
    }

    useEffect(() => {
        setSpace();
        spaceRender();
    }, []);

    const RightButton = () => {
        return boxCnt > 0 ? (
            <DDS.button.default
                className={`dds button primary ${!boxOpen ? "luckyBox" : "confirm"}`}
                onClick={() => {
                    boxOpen ? (location.href = "/userGallery?memberSeq=" + auth.loginResult.seq) : (btnClick = true);
                }}
            >
                {boxOpen ? lang.t("random.button.goGallery") : lang.t("random.button.open")}
            </DDS.button.default>
        ) : (
            boxOpen && (
                <DDS.button.default
                    className={`dds button primary ${!boxOpen ? "luckyBox" : "confirm"}`}
                    onClick={() => {
                        boxOpen && (location.href = "/userGallery?memberSeq=" + auth.loginResult.seq);
                    }}
                >
                    {lang.t("random.button.goGallery")}
                </DDS.button.default>
            )
        );
    };

    const LeftButton = () => {
        return boxCnt > 0 ? (
            <DDS.button.default
                className={`dds button secondary`}
                onClick={() => {
                    boxOpen ? window.location.replace("/random") : setModalOpen(true);
                }}
            >
                {boxOpen ? lang.t("random.button.confirm") : lang.t("random.button.buy")}
            </DDS.button.default>
        ) : (
            <DDS.button.default
                className={`dds button ${!boxOpen ? "primary" : "secondary"}`}
                onClick={() => {
                    boxOpen ? (location.href = "/random") : setModalOpen(true);
                }}
            >
                {boxOpen ? lang.t("random.button.confirm") : lang.t("random.button.buy")}
            </DDS.button.default>
        );
    };

    return (
        <DDS.layout.container store={store}>
            <DK_template_header.default store={store} title={lang.t("random.title")} />
            <DDS.layout.content>
                <div className="random">
                    {boxOpen ? (
                        <div className="top">
                            <h2>{artName}</h2>
                            <h3>{artistName}</h3>
                        </div>
                    ) : (
                        <div className="voucher">
                            <img src={`../../static/img/randomBox.png`} alt="randomBox" />
                            <span>{boxCnt}</span>
                            {gallery.data.unconfirmedLuckyBox && <div className="chips">N</div>}
                        </div>
                    )}
                    <div className="box">
                        <img src={img} alt="luckyBox" />
                    </div>
                    <div className={`bottom ${boxOpen ? "open" : ""}`}>
                        <Text />
                        <div className="ddsBtnWrapper">
                            <LeftButton />
                            <RightButton />
                        </div>
                    </div>
                </div>
                <canvas id="space"></canvas>
            </DDS.layout.content>
            <DDS.modal.bottom {...modalData} />
        </DDS.layout.container>
    );
});

export default Home;
