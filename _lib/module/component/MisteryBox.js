import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Router, { useRouter } from "next/router";

import DDS from "../../component/dds";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import gsap from "gsap";

const MisteryBox = observer((props) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { drop, lang, common, auth } = props.store;

    let renderer1, renderer2;
    let camera;
    const scene = new THREE.Scene();
    const scene2 = new THREE.Scene();
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();
    const loader = new FBXLoader();
    const [curr, setCurr] = useState(); //현재드롭
    const [next, setNext] = useState(); //다음드롭
    let dropSeq, dropRound;

    const messageData = {
        icon: <DDS.icons.circleExclamation />,
        className: "orgMessage",
        content: "드롭을 준비중이에요, 잠시만 기다려주세요!",
    };

    function setSpace() {
        const canvas = document.getElementById("space");
        renderer1 = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer1.setPixelRatio(window.devicePixelRatio);
        renderer1.setSize(window.innerWidth, window.innerHeight);
        renderer1.shadowMap.enabled = true;
        renderer1.shadowMap.type = THREE.PCFSoftShadowMap;

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(0, 4, 10);

        const controls = new MapControls(camera, renderer1.domElement);
        // controls.enablePan = false;
        // controls.enableZoom = false;
        controls.target.set(0, 4, 0);
        controls.update();

        // DirectionalLight
        let light = new THREE.DirectionalLight(0xffffff, 0.4);
        light.position.set(0, 5, 1);
        light.castShadow = true;
        light.shadow.mapSize.width = 1042;
        light.shadow.mapSize.height = 1042;
        scene.add(light);
        // scene.add(new THREE.DirectionalLightHelper(light, 0.5, "red"));
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        let light2 = new THREE.DirectionalLight(0xffffff, 0.05);
        light2.position.set(15, 5, -50);
        light2.castShadow = true;
        light2.shadow.mapSize.width = 1042;
        light2.shadow.mapSize.height = 1042;
        const targetObject1 = new THREE.Object3D();
        targetObject1.position.set(0, 5, -50);
        scene.add(targetObject1);
        light2.target = targetObject1;
        scene.add(light2);
        // scene.add(new THREE.DirectionalLightHelper(light2, 1, "green"));

        let light3 = new THREE.DirectionalLight(0xffffff, 0.05);
        light3.position.set(-15, 5, -50);
        light3.castShadow = true;
        light3.shadow.mapSize.width = 1042;
        light3.shadow.mapSize.height = 1042;
        const targetObject2 = new THREE.Object3D();
        targetObject2.position.set(0, 5, -50);
        scene.add(targetObject2);
        light3.target = targetObject2;
        scene.add(light3);
        // scene.add(new THREE.DirectionalLightHelper(light3, 1, "green"));

        // PointLight
        const pointLight = new THREE.PointLight(0xffffff, 0.1);
        pointLight.position.set(0, 4, 3);
        scene.add(pointLight);
        // scene.add(new THREE.PointLightHelper(pointLight, 1, "blue"));

        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.1 }));
        // const shadow = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshBasicMaterial({ color: "red" }));
        shadow.position.y = 0.11;
        shadow.material.transparent = true;
        shadow.receiveShadow = true;
        shadow.rotateX(-Math.PI / 2);
        shadow.name = "shadow";
        scene.add(shadow);

        loader.load("../../static/3d/MainPage.fbx", (object) => {
            object.scale.set(0.7, 0.7, 0.7);
            object.position.y = 3;
            // object.position.z = 20;
            // object.rotation.set(0.4, 0.5, 0);
            // object.traverse((child) => {
            //     if (child instanceof THREE.Mesh) {
            //         child.material.transparent = true;
            //         child.castShadow = true;
            //     }
            // });

            scene.add(object);
        });

        // event
        window.addEventListener("click", onTouchBox);
        // window.addEventListener("resize", onWindowResize);
    }

    // function onWindowResize() {
    //     renderer.setSize(window.innerWidth, window.innerHeight);
    // }

    function onTouchBox(event) {
        let parentName;
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0 && drop.data.curr.status !== "ready") {
            // parentName = intersects[0].object.parent.name;
            const shadow = scene.getObjectByName("shadow");
            const space = scene.getObjectByName("space");

            console.log(intersects);
            if (intersects[0].object.name === "Cover") {
                gsap.to(intersects[0].object.position, {
                    x: -3,
                    ease: "power3.inOut",
                    duration: 1.2,
                });

                gsap.to(intersects[0].object.parent, { visible: false, duration: 0.5 });
                gsap.to(intersects[0].object.parent.material, { opacity: 0, duration: 1, ease: "power3.inOut" });
                gsap.to(shadow.material, { opacity: 0, duration: 1 });
                gsap.to(space, { receiveShadow: true, duration: 1, delay: 0.5 });

                if (drop.data.curr.status === "closed") {
                    dropSeq = drop.data.next.dropSeq;
                    dropRound = drop.data.next.dropRound;
                } else {
                    dropSeq = drop.data.curr.dropSeq;
                    dropRound = drop.data.curr.dropRound;
                }
                loader.load(`../../static/3d/${dropRound}/Popup.fbx`, (object) => {
                    setCurr(object);
                    object.scale.multiplyScalar(0.12);
                    object.position.y = 2;
                    mixer = new THREE.AnimationMixer(object);
                    const action = mixer.clipAction(object.animations[0]);
                    // action.clampWhenFinished = true;
                    action.loop = THREE.LoopOnce;
                    action.play();
                    mixer.addEventListener("finished", function (e) {
                        console.log("finished");
                    });

                    object.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                        }
                    });

                    scene.add(object);
                    setTimeout(() => {
                        drop.dropArt({ dropSeq }, (e) => {
                            setOpen(true);
                        });
                    }, 1000);
                    clock = new THREE.Clock();
                });
            }
        } else {
            common.messageApi.open(messageData);
        }
    }

    function spaceRender() {
        requestAnimationFrame(spaceRender);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer1.render(scene, camera);
    }

    useEffect(() => {
        setSpace();
        spaceRender();
    }, []);

    useEffect(() => {
        if (drop.data.curr.status) {
            dropSeq = drop.data.curr.dropSeq;
            dropRound = drop.data.curr.dropRound;

            // 다음 드롭
            loader.load("../../static/3d/dropBox/DROPBOX_LockedStatic.fbx", (object) => {
                setNext(object);
                object.scale.multiplyScalar(0.25);
                object.position.y = 12;
                object.rotation.set(0.3, -0.5, 0);
                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material.transparent = true;
                        child.castShadow = true;
                        child.material = new THREE.MeshPhongMaterial({
                            map: new THREE.TextureLoader().load("../../static/3d/dropBox/texture/" + drop.data.next.dropRound + ".jpg"),
                            transparent: true,
                        });
                    }
                });
                object.name = "box";
                scene.add(object);
            });
            if (drop.data.curr.status === "closed") {
                // 현재 드롭 밑으로 떨어짐
                gsap.to(curr.position, {
                    y: -5,
                    ease: "power3.inOut",
                    duration: 3,
                });

                // 다음 드롭 위에서 떨어짐
                gsap.to(next.position, {
                    y: 3,
                    ease: "power3.inOut",
                    duration: 3,
                    delay: 1,
                });
            } else {
                if (drop.data.curr.dropOwnFlag) {
                    // 받은 드롭 파일
                    loader.load(`../../static/3d/${dropRound}/Popup.fbx`, (object) => {
                        setCurr(object);
                        object.scale.multiplyScalar(0.12);
                        object.position.y = 2;
                        mixer = new THREE.AnimationMixer(object);
                        const action = mixer.clipAction(object.animations[0]);
                        action.clampWhenFinished = true;
                        action.loop = THREE.LoopOnce;
                        action.play();

                        object.traverse((child) => {
                            if (child instanceof THREE.Mesh) {
                                child.castShadow = true;
                            }
                        });

                        scene.add(object);
                    });
                } else {
                    // 미스터리 박스 파일
                    loader.load("../../static/3d/dropBox/DROPBOX_LockedStatic.fbx", (object) => {
                        setCurr(object);
                        object.scale.multiplyScalar(0.25);
                        object.position.y = 3;
                        object.rotation.set(0.2, -0.5, 0);
                        object.traverse((child) => {
                            if (child instanceof THREE.Mesh) {
                                child.castShadow = true;
                                child.material = new THREE.MeshPhongMaterial({
                                    map: new THREE.TextureLoader().load("../../static/3d/dropBox/texture/" + drop.data.curr.dropRound + ".jpg"),
                                    transparent: true,
                                });
                                // child.rotation.set(0.3, 0.5, 0);
                            }
                        });

                        // mixer = new THREE.AnimationMixer(object);
                        // mixer.clipAction(object.animations[0]).play();

                        object.name = "box";
                        scene.add(object);
                    });
                }
            }
        }
    }, [drop.data.curr.status]);

    const modalData = {
        open: open,
        setOpen: setOpen,
        img: "../../static/img/party-horn.png",
        title: lang.t("misteryBox.modal.title"),
        context: lang.t("misteryBox.modal.context"),
        confirm: {
            label: lang.t("misteryBox.modal.confirm"),
            action: () => {
                router.push("/userGallery?memberSeq=" + auth.loginResult.seq);
            },
        },
        cancel: {
            label: lang.t("misteryBox.modal.close"),
            action: () => {},
        },
    };

    return (
        <>
            <canvas id="space"></canvas>
            <DDS.modal.bottom {...modalData} />
        </>
    );
});

export default MisteryBox;
