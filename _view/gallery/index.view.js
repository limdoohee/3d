import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
// import Ai from "../../_lib/module/component/ai";
import Detail from "../detail/index.view";

import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import gsap from "gsap";

import DDS_Icons from "../../_lib/component/icons";
import { message } from "antd";
import DDS_Modal from "../../_lib/component/modal";

const scene = new THREE.Scene();
let camera, renderer, controls;

const space = new THREE.Group();
const fbx = new FBXLoader();
const mixers = [];
let mixer = new THREE.AnimationMixer();
let clock = new THREE.Clock();

let profileArea;
let detailArea;

const dropData = [
    {
        id: 1,
        url: "../../static/3d/DoCoin_LinearSpin.fbx",
        bumpMap: "../../static/3d/DSP_DoCoin.png",
        colorMap: "../../static/3d/D_DoCoin.png",
        specularMap: "../../static/3d/SPC_DoCoin.png",
        my: false,
        detail: {
            artistImg: "../../static/3d/image_17.png",
            artistName: "abcdefghijklmnopqrst",
            artName: "A SWEET DAY",
            owner: 1024,
            artDesc:
                "작품설명  작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 작품설명 ",
        },
    },
    {
        id: 2,
        url: "../../static/3d/KominJeong_Popup.fbx",
        bumpMap: "../../static/3d/DSP_outside_KominJeong.png",
        colorMap: "../../static/3d/D_outside_KominJeong.png",
        my: true,
    },
    {
        id: 3,
        url: "../../static/3d/275C_LinearSpin.fbx",
        colorMap: "../../static/3d/D_275C.png",
        my: false,
    },
    {
        id: 6,
        url: "../../static/3d/275C_LinearSpin.fbx",
        colorMap: "../../static/3d/D_275C.png",
        my: false,
    },
];

const Home = observer((props) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [open, setOpen] = useState(false);

    const snackbar = () => {
        messageApi.open({
            type: "success",
            content: `This is a prompt message for success, and it will disappear in 10 seconds`,
            duration: 10,
        });
        // messageApi.info({ content: "Hello, Ant Design!", rtl: true });
    };

    function init() {
        const canvas = document.getElementById("drop");
        profileArea = document.querySelector(".userInfo");
        detailArea = document.querySelector(".detail");

        // render hive
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        // renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // document.querySelector(".wrapper").appendChild(renderer.domElement);

        // const lastDrop = dropData[dropData.length - 1];
        // console.log(lastDrop);

        // camera
        camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.01, 1000);
        camera.position.set((dropData.length - 1) * 2.5, 4, 10);
        // camera.position.set(0, 5, 0);

        // light
        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 7, 0);
        // light.castShadow = true;
        // scene.add(light);
        // scene.add(new THREE.DirectionalLightHelper(light, 1, "red"));
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(7, 10, 0);
        // pointLight.castShadow = true;
        // pointLight.shadow.mapSize.width = 2048;
        // pointLight.shadow.mapSize.height = 2048;
        scene.add(pointLight);
        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
        scene.add(pointLightHelper);

        // controls
        controls = new MapControls(camera, renderer.domElement);
        controls.target = new THREE.Vector3((dropData.length - 1) * 2.5, 3, 0);
        controls.touches = { ONE: THREE.TOUCH.PAN };
        controls.minDistance = 4;
        controls.maxDistance = 20;
        controls.enableRotate = false;
        controls.update();

        // Limits;
        const maxX = (dropData.length - 1) * 2.5;
        const minX = 0;
        const maxZ = 2;
        const minZ = 0;

        // State
        let positionX;
        let positionZ;
        let phi;
        let theta;

        controls.addEventListener("change", (e) => {
            const x = controls.target.x;
            const z = controls.target.z;
            let shallWeUpdateAngle = false;

            if (x < minX || x > maxX) {
                controls.target.setX(x < minX ? minX : maxX);
                camera.position.setX(positionX);
                shallWeUpdateAngle = true;
            }
            if (z < minZ || z > maxZ) {
                controls.target.setZ(z < minZ ? minZ : maxZ);
                camera.position.setZ(positionZ);
                shallWeUpdateAngle = true;
            }

            if (shallWeUpdateAngle) {
                const distance = camera.position.distanceTo(controls.target);
                camera.position.set(distance * Math.sin(phi) * Math.sin(theta) + controls.target.x, distance * Math.cos(phi) + controls.target.y, distance * Math.sin(phi) * Math.cos(theta) + controls.target.z);
            }

            // Updating state
            positionX = camera.position.x;
            positionZ = camera.position.z;
            phi = controls.getPolarAngle();
            theta = controls.getAzimuthalAngle();
        });

        window.addEventListener("click", clickEvent);

        // 첫 로딩시, 화면 줌인
        setTimeout(() => {
            gsap.to(camera, {
                fov: 50,
                duration: 1,
                ease: "power4.inOut",
                onUpdate: function () {
                    camera.updateProjectionMatrix();
                },
            });
        }, 300);
    }

    let beforePosition = -1;
    let column, dropNo;
    let clickDrop;
    function clickEvent(event) {
        let parent;
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(scene.children);
        // console.log(intersects);
        // console.log(intersects);
        if (intersects.length > 0) {
            parent = intersects[0].object.parent;
            // if (intersects[0].object.name === "button") alert("button");
            // console.log(intersects[0].object.position);

            // console.log(column);
            if (parent.name.includes("drop")) {
                clickDrop = intersects[0].object.material;

                detailArea.style.top = 0;
                profileArea.style.opacity = 0;
                column = scene.getObjectByName("column" + parent.name.replace(/[^0-9]/g, ""));
                dropNo = scene.getObjectByName("dropNo" + parent.name.replace(/[^0-9]/g, ""));
                gsap.to(column.material, {
                    duration: 1,
                    opacity: 0,
                    ease: "power3.inOut",
                });
                gsap.to(dropNo.material, {
                    duration: 1,
                    opacity: 0,
                    ease: "power3.inOut",
                });

                gsap.to(controls.target, {
                    duration: 1,
                    x: parent.position.x,
                    y: 3,
                    ease: "power3.inOut",
                    onUpdate: function () {
                        controls.update();
                    },
                });
                gsap.to(camera.position, {
                    // delay: 1,
                    duration: 1,
                    ease: "power3.inOut",
                    x: parent.position.x,
                    y: 3.3,
                    z: 3,
                    onUpdate: function () {
                        controls.update();
                    },
                });

                beforePosition = parent.position.x;
                controls.enabled = false;
            }

            // if (beforePosition > -1 && intersects[0].object.name === "") {
            //     detailArea.style.top = "120vh";
            //     profileArea.style.opacity = 1;
            //     gsap.to(column.material, {
            //         duration: 1,
            //         opacity: 1,
            //         ease: "power3.inOut",
            //     });
            //     gsap.to(dropNo.material, {
            //         duration: 1,
            //         opacity: 0.4,
            //         ease: "power3.inOut",
            //     });

            //     gsap.to(controls.target, {
            //         duration: 1,
            //         x: beforePosition,
            //         // y: 3,
            //         // z: 0,
            //         // ease: "power4.in",
            //         ease: "power3.inOut",
            //         onUpdate: function () {
            //             controls.update();
            //         },
            //     });
            //     gsap.to(camera.position, {
            //         // delay: 1,
            //         duration: 1,
            //         ease: "power3.inOut",
            //         x: beforePosition,
            //         y: 4,
            //         z: 10,
            //         onUpdate: function () {
            //             controls.update();
            //         },
            //     });

            //     beforePosition = -1;
            //     controls.enabled = true;
            // }
        }
    }

    function setSpace() {
        // 바닥
        const geo = new THREE.PlaneGeometry(40, 30);
        const mat = new THREE.MeshStandardMaterial({
            color: "#F5F5F5",
            side: THREE.DoubleSide,
        });
        // shadow blur
        //https://github.com/mrdoob/three.js/blob/master/examples/webgl_shadow_contact.html
        const ground = new THREE.Mesh(geo, mat);
        ground.position.z = 5;
        ground.rotation.x = Math.PI * 0.5;
        // ground.receiveShadow = true;

        // 벽
        const wall = new THREE.Mesh(geo, mat);
        wall.position.z = -5;

        // 천장
        const roof = new THREE.Mesh(geo, mat);
        roof.rotation.x = Math.PI * 0.5;
        roof.position.y = 8;

        space.add(ground);
        space.add(wall);
        space.add(roof);
        space.position.x = 15;
        scene.add(space);
    }

    function setDrop() {
        const geo = new THREE.BoxGeometry(1.5, 2, 1.5);
        const mat = new THREE.MeshStandardMaterial({
            color: "#ffffff",
            transparent: true,
        });

        const textLoader = new FontLoader();

        for (let i = 0; i < dropData.length; i++) {
            // column
            const column = new THREE.Mesh(geo, mat);
            column.receiveShadow = true;
            column.position.x = i * 2.5;
            column.position.y = 1;
            column.name = "column" + i;
            scene.add(column);

            textLoader.load("../../static/3d/test.json", function (font) {
                const matLite = new THREE.MeshBasicMaterial({
                    color: 0x006699,
                    transparent: true,
                    opacity: 0.4,
                    side: THREE.DoubleSide,
                });

                const message = "#" + dropData[i].id;
                const shapes = font.generateShapes(message, 0.3);

                const geometry = new THREE.ShapeGeometry(shapes);

                geometry.computeBoundingBox();

                const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

                geometry.translate(xMid, 0, 0);

                const dropNo = new THREE.Mesh(geometry, matLite);
                dropNo.position.x = i * 2.5;
                dropNo.position.y = 1.6;
                dropNo.position.z = 1;
                dropNo.name = "dropNo" + i;
                scene.add(dropNo);
            });

            if (dropData[i].url) {
                fbx.load(dropData[i].url, (obj) => {
                    obj.scale.multiplyScalar(0.05);
                    obj.position.x = i * 2.5;
                    obj.position.y = 2.5;
                    obj.traverse(function (child) {
                        if (child.isMesh) {
                            let colorMap,
                                bumpMap,
                                specularMap = null;
                            if (dropData[i].colorMap) colorMap = new THREE.TextureLoader().load(dropData[i].colorMap);
                            if (dropData[i].bumpMap) bumpMap = new THREE.TextureLoader().load(dropData[i].bumpMap);
                            if (dropData[i].specularMap) specularMap = new THREE.TextureLoader().load(dropData[i].specularMap);

                            const minigunMaterial = new THREE.MeshPhongMaterial({
                                map: colorMap,
                                bumpMap,
                                specularMap,
                            });

                            child.material = minigunMaterial;
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    obj.name = "drop" + i;

                    mixer = new THREE.AnimationMixer(obj);
                    const action = mixer.clipAction(obj.animations[0]).play();
                    mixers.push(mixer);

                    scene.add(obj);
                });
            }
        }
    }

    function animate() {
        const delta = clock.getDelta();
        for (const mixer of mixers) mixer.update(delta);
    }

    function render() {
        animate();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    useEffect(() => {
        init();
        setSpace();
        setDrop();
        render();
        snackbar();
        setTimeout(() => {
            document.querySelector(".invite").classList.add("iconOnly");
        }, 2000);
    }, []);

    const modalData = {
        open,
        title: "친구도 나도 둘 다 받는 혜택!\n친구를 초대하고 드롭키친의 선물을 받아보세요.",
        context: "아직 드롭키친 회원이 아닌 친구가 회원가입하면 드롭키친의 디지털 아트를 랜덤으로 지급받을 수 있어요.\n친구가 회원가입 할 때마다 나에게 300P가 주어져요.",
        button: "초대하고 선물받기",
        linkUrl: "/main",
        img: "../../static/3d/perspective_matte.png",
    };

    return (
        <>
            {/* <Drawer
                placement="bottom"
                closable={false}
                // onClose={onClose}
                open={true}
                height="bottom"
            >
                <h1>드롭 획득을 축하해요!</h1>
                <h2>1,000포인트가 지급되었어요.</h2>
                <h2>이제 갤러리로 이동해볼까요?</h2>
                <DDS_Button.default className="dds button primary large bigButton">갤러리로 이동</DDS_Button.default>
                <DDS_Button.default className="dds button text">나중에</DDS_Button.default>
            </Drawer> */}
            <div className="userInfo">
                {contextHolder}
                Collectorman
            </div>
            <div className="invite" onClick={() => setOpen(true)}>
                <div className="iconWrapper">
                    <DDS_Icons.envelopeOpenHeart />
                </div>
                <div className="text">
                    <h5>친구도 나도 둘 다 받는 혜택!</h5>
                    <h6>친구를 초대하고 포인트를 획득해보세요!</h6>
                </div>
                <div className="greyAngle">
                    <DDS_Icons.angleRight />
                </div>
            </div>
            <canvas id="drop"></canvas>
            <Detail />
            <DDS_Modal {...modalData} />
        </>
    );
});

export default Home;
