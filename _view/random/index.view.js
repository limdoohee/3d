import Head from "next/head";
import Router, { useRouter } from "next/router";
import React, { useState, useEffect, useRef, createRef, forwardRef } from "react";
import { observer } from "mobx-react-lite";
//------------------------------------------------------------------------------- Component
import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
//------------------------------------------------------------------------------- Component

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import gsap from "gsap";

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { common, lang, auth, gallery } = store;
    const [modalOpen, setModalOpen] = useState(false);
    const [amount, setAmount] = useState(1);
    const [buyingAmount, setBuyingAmount] = useState(0);
    const [descDisabled, setDescDisabled] = useState(false);
    const [incrDisabled, setIncrDisabled] = useState(false);
    const [helper, setHelper] = useState(false);
    const [boxOpen, setBoxOpen] = useState(false);

    let renderer, renderer2;
    let camera;
    const scene = new THREE.Scene();
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();
    const loader = new GLTFLoader();
    let dropSeq, dropRound;

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
        gallery.getLuckyBox("", (e) => {
            setBuyingAmount(gallery.luckyBox.length);
            callback && callback(e);
        });
        gallery.getData({ sendbirdId: "dropkitchen_member_" + auth.loginResult.seq }, (e) => {
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
            if (gallery.data.pointBalance <= (amount + 2) * 1500) {
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
                gallery.data.pointBalance >= 1500 &&
                    gallery.buyLuckyBox({ amount }, (e) => {
                        setBuyingAmount(gallery.luckyBox.length + amount);
                        common.messageApi.open({
                            className: "buyingMessage",
                            content: "랜덤박스 구매가 완료되었습니다.",
                        });
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

        loader.load(
            // resource URL
            "../../static/3d/dropBox/dropbox__unlocked_loop.glb",
            // called when the resource is loaded
            function (gltf) {
                model = gltf.scene;
                model.scale.multiplyScalar(20);
                model.rotation.set(0.4, -0.7, -0.1);
                model.position.y = 2;
                model.position.z = 3;
                scene.add(model);

                mixer = new THREE.AnimationMixer(model);
                animationActions.push(mixer.clipAction(gltf.animations[0]));
                mixer.clipAction(gltf.animations[0]).play();
                activeAction = animationActions[0];

                model.name = "box";

                loader.load("../../static/3d/dropBox/dropbox_open2disappear.glb", (gltf) => {
                    model = gltf.scene;
                    model.position.y = 2;
                    model.position.z = 3;

                    const animationAction = mixer.clipAction(gltf.animations[0]);
                    animationActions.push(animationAction);
                });
            },
            undefined,
            // called when loading has errors
            function (error) {
                console.log("An error happened");
            },
        );

        window.addEventListener("click", onTouchBox);
    }

    function spaceRender() {
        requestAnimationFrame(spaceRender);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
    }

    function onTouchBox(event) {
        if (event.target.innerText === "랜덤박스 열기") {
            if (gallery.data.totalDropCnt === gallery.data.myDropCnt) {
                common.messageApi.open({
                    icon: <DDS.icons.circleExclamation />,
                    className: "arMessage",
                    content: "이미 모든 드롭을 보유하고 있습니다.",
                });
            } else {
                if (gallery.luckyBox.length > 0) {
                    const box = scene.getObjectByName("box");

                    gallery.openLuckyBox({ luckyBoxSeq: gallery.luckyBox[0].seq }, (e) => {
                        setAction(animationActions[1]);
                        gsap.to(box, { visible: false, duration: 1 });

                        setTimeout(() => {
                            loader.load(
                                gallery.opendBox.contentUrl,
                                function (gltf) {
                                    model = gltf.scene;
                                    model.position.z = 3;
                                    model.position.y = 1;

                                    switch (gallery.opendBox.dropSeq) {
                                        case 1:
                                            model.scale.multiplyScalar(10);
                                            break;
                                        case 2:
                                            model.scale.multiplyScalar(20);
                                            break;
                                        case 3:
                                            model.scale.multiplyScalar(1.5);
                                            break;
                                        case 21:
                                            model.scale.multiplyScalar(15);
                                            break;
                                        case 22:
                                            model.scale.multiplyScalar(15);
                                            break;
                                        default:
                                            model.scale.multiplyScalar(1);
                                            break;
                                    }
                                    scene.add(model);

                                    mixer = new THREE.AnimationMixer(model);
                                    mixer.clipAction(gltf.animations[0]).play();
                                    model.name = "drop";
                                },
                                undefined,
                                function (error) {
                                    console.log("An error happened");
                                },
                            );

                            setBuyingAmount((prev) => prev - 1);
                            setBoxOpen(true);
                        }, 1000);
                    });
                }
            }
        }
        if (event.target.innerText === "확인") {
            // 페이지 리로딩
            window.location.replace("/random");
        }
    }

    useEffect(() => {
        setSpace();
        spaceRender();
    }, []);

    return (
        <DDS.layout.container store={store}>
            <DK_template_header.default store={store} title={lang.t("random.title")} />
            <DDS.layout.content>
                <div className="random">
                    <div className="voucher">
                        <img src={`../../static/img/randomBox.png`} alt="randomBox" />
                        <span>{buyingAmount}</span>
                        {gallery.data.unconfirmedLuckyBox && <div className="chips">N</div>}
                    </div>
                    <div className={`bottom ${boxOpen ? "open" : ""}`}>
                        <Text />
                        <div className="ddsBtnWrapper">
                            <DDS.button.default
                                className={`dds button ${gallery.luckyBox.length > 0 ? "secondary" : "primary"}`}
                                onClick={() => {
                                    boxOpen ? router.push("userGallery?memberSeq=" + auth.loginResult.seq) : setModalOpen(true);
                                }}
                            >
                                {boxOpen ? "받은 드롭 보기" : "구매하기"}
                            </DDS.button.default>
                            {gallery.luckyBox.length > 0 && <DDS.button.default className="dds button primary">{boxOpen ? "확인" : "랜덤박스 열기"}</DDS.button.default>}
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
