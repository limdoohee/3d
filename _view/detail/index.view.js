import React, { useEffect, useState, useRef } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";

import DDS from "../../_lib/component/dds";
import DK_template_header from "../../_lib/template/header";
import DK_template_GNB from "../../_lib/template/gnb";
import AlarmTemplate from "../../_lib/template/alarm";

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { ArcballControls } from "three/addons/controls/ArcballControls.js";

const Home = observer((props) => {
    const router = useRouter();
    const { store } = props;
    const { drop, common, auth } = store;

    // const [count, setCount] = useState(1024);
    const [more, setMore] = useState(false);
    const [like, setLike] = useState(false);
    const [height, setHeight] = useState(0);
    const nameInput = useRef();
    const ref = useRef(null);

    const moreClick = () => {
        setMore(!more);
        more ? setHeight(0) : window.innerHeight - 260 < nameInput.current.scrollHeight ? setHeight(window.innerHeight - 260) : setHeight(nameInput.current.scrollHeight);
    };

    const likeClick = () => {
        const params = { artSeq: drop.data.detail.dropSeq };
        drop.updateLike(params, (e) => {
            setLike(!like);
        });
    };

    //------------------------------------------------- Init Load
    const initLoad = ({ initCheck, callback }) => {
        drop.getDetail({ dropSeq: router.query.seq }, (e) => {
            common.debug(e);
            setLike(drop.data.detail.artLikeFlag);
        });
    };
    //------------------------------------------------- Init Load

    //------------------------------------------------- Router isReady
    useEffect(() => {
        if (router.isReady && router.pathname == "/detail/[seq]") {
            setMore(false);
            initLoad({
                callback: (e) => {},
            });
        }
    }, [router.isReady, router.asPath]);
    //------------------------------------------------- Router isReady

    const scene = new THREE.Scene();
    let camera, renderer, controls;

    const fbx = new FBXLoader();
    const mixers = [];
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();

    function init() {
        const canvas = document.getElementById("space");

        // render hive
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        renderer.toneMapping = THREE.ReinhardToneMapping;
        renderer.toneMappingExposure = 3;
        // renderer.domElement.style.background = "linear-gradient( 180deg, rgba( 0,0,0,1 ) 0%, rgba( 128,128,255,1 ) 100% )";
        renderer.domElement.style.background = "#f5f5f5";

        // camera
        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        // dropData.length === 0 ? camera.position.set(0, 0, 10) : camera.position.set((dropData.length - 1) * 2.5, 0, 10);
        // camera.position.set((dropData.length - 1) * 2.5, 0, 10);
        camera.position.set(0, 0, 5);

        scene.add(new THREE.HemisphereLight(0x443333, 0x222233, 4));

        // controls
        // controls = new OrbitControls(camera, renderer.domElement);
        // controls.enableDamping = true;
        // controls.dampingFactor = 0.1;
        // controls.target.set(0, -0.4, 0);

        controls = new ArcballControls(camera, renderer.domElement, scene);
        // controls.addEventListener("change", render);
        // controls.setGizmosVisible(false);
        controls.minDistance = 2.5;
        // controls.maxDistance = 5;
        controls.minZoom = 2.5;
        // controls.maxZoom = 4.5;
        controls.update();
    }

    const setDrop = () => {
        // 드롭
        fbx.load("../../static/3d/1/Popup.fbx", (obj) => {
            obj.scale.multiplyScalar(0.06);
            obj.position.y = -0.35;
            obj.traverse(function (child) {
                if (child.isMesh) {
                    let colorMap,
                        bumpMap,
                        specularMap,
                        normalMap = null;
                    // if (dropData[i].colorMap) colorMap = new THREE.TextureLoader().load(dropData[i].colorMap);
                    // if (dropData[i].bumpMap) bumpMap = new THREE.TextureLoader().load(dropData[i].bumpMap);
                    // if (dropData[i].specularMap) specularMap = new THREE.TextureLoader().load(dropData[i].specularMap);
                    // if (dropData[i].normalMap) normalMap = new THREE.TextureLoader().load(dropData[i].normalMap);

                    const material = new THREE.MeshPhongMaterial({
                        map: colorMap,
                        bumpMap,
                        specularMap,
                        normalMap,
                        transparent: true,
                    });

                    child.material = material;
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            // mixer = new THREE.AnimationMixer(obj);
            // mixer.clipAction(obj.animations[0]).play();
            // mixers.push(mixer);

            scene.add(obj);
        });
    };

    function animate() {
        const delta = clock.getDelta();
        for (const mixer of mixers) mixer.update(delta);
    }

    function render() {
        animate();
        controls.update();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    useEffect(() => {
        init();
        setDrop();
        render();
    }, []);

    const headerRight = [
        () => (
            <DDS.button.default
                className="dds button none gallery badge"
                icon={<DDS.icons.myGalleryBlackOn />}
                onClick={() => {
                    location.href = "/userGallery?memberSeq=" + auth.loginResult.seq;
                }}
            />
        ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.shareNode />}
                onClick={() => {
                    common.uiChange("gnbOpen", true);
                }}
            />
        ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.bell />}
                onClick={() => {
                    common.uiChange("alarmOpen", true);
                }}
            />
        ),
        () => (
            <DDS.button.default
                className="dds button none"
                icon={<DDS.icons.bars />}
                onClick={() => {
                    common.uiChange("gnbOpen", true);
                }}
            />
        ),
    ];

    const messageData = {
        icon: <DDS.icons.circleExclamation />,
        className: "arMessage",
        content: "해당 드롭 보유 후 사용 가능합니다.",
    };

    const arClick = () => {
        if (drop.data.detail.dropOwnFlag) {
            // ar 이동
        } else {
            common.messageApi.open(messageData);
        }
    };

    return (
        <>
            <DDS.layout.container store={store} className={`detailWrapper ${more ? "more" : ""}`}>
                <DK_template_header.default store={store} className="top" right={headerRight} />
                <DK_template_GNB.default store={store} />
                <DDS.layout.content>
                    <div className="detail" style={{ height: more ? "calc(100vh - 50px)" : "0" }}>
                        <h6 className="dropNo">Drop #{drop.data.detail.dropRound}</h6>
                        <div className="wrapper">
                            {/* <div> */}
                            <div className="info">
                                <div className="artist">
                                    <span className="name">{drop.data.detail.artistName}</span>
                                    {more && <DDS.icons.circleChevronDown className="dds icons" onClick={moreClick} />}
                                </div>
                                <h4 className="artName">{drop.data.detail.artName}</h4>
                                <div className="desc" style={{ height }} ref={nameInput}>
                                    {drop.data.detail.artDescription}
                                </div>
                                {!more && (
                                    <div className="more" onClick={moreClick}>
                                        MORE INFO
                                        <DDS.icons.angleRight className="dds icons small" style={{ marginLeft: "8px" }} />
                                    </div>
                                )}
                            </div>
                            <ul className={`iconWrapper ${more ? "more" : ""}`}>
                                <li className="profileWrapper">
                                    {/* 작가 프로필 사진 */}
                                    <DDS.profile.default icon={<UserOutlined />} src="https://picsum.photos/id/237/200/300" />
                                    <DDS.icons.circlePlusFill />
                                </li>
                                <li className="likeWrapper">
                                    {/* 좋아요 */}
                                    {like ? <DDS.icons.heartFill onClick={likeClick} /> : <DDS.icons.heart onClick={likeClick} />}
                                    <p>123</p>
                                </li>
                                <li className="ownerWrapper">
                                    {/* owner 수 */}
                                    <DDS.icons.userGroup />
                                    {common.numberFormat(`${drop.data.detail.ownerCnt}`)}
                                </li>
                                <li>
                                    {/* 채팅 */}
                                    <DDS.icons.chat />
                                </li>
                                <li>
                                    {/* 매거진 */}
                                    <DDS.icons.bookFilled
                                        onClick={() => {
                                            location.href = `/magazine/?keyword=${drop.data.detail.artistName}`;
                                        }}
                                    />
                                </li>
                            </ul>
                            {/* </div> */}
                            <DDS.button.default className="dds button primary large ar" onClick={arClick} icon={<DDS.icons.ar />}>
                                View in AR
                            </DDS.button.default>
                        </div>
                    </div>
                    <canvas id="space"></canvas>
                    <AlarmTemplate.default store={props.store} />
                </DDS.layout.content>
            </DDS.layout.container>
        </>
    );
});

export default Home;
