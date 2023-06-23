import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Router, { useRouter } from "next/router";
import assets from "./assets.json";

import DDS from "../../component/dds";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import gsap from "gsap";

const MisteryBox = observer((props) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { drop, lang, common, auth } = props.store;

    let renderer, renderer2;
    let camera;
    const scene = new THREE.Scene();
    const scene2 = new THREE.Scene();
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();
    const loader = new FBXLoader();
    let dropSeq, dropRound;
    let a;

    const messageData = {
        icon: <DDS.icons.circleExclamation />,
        className: "orgMessage",
        content: "드롭을 준비중이에요, 잠시만 기다려주세요!",
    };

    let modelReady = false;
    const animationActions = [];
    let activeAction;
    let lastAction;
    const fbxLoader = new FBXLoader();

    const setAction = (toAction) => {
        // console.log(toAction);
        if (toAction != activeAction) {
            lastAction = activeAction;
            activeAction = toAction;
            //lastAction.stop()
            lastAction.fadeOut(1);
            activeAction.reset();
            activeAction.fadeIn(1);
            activeAction.setLoop(THREE.LoopOnce);
            activeAction.play();
        }
    };

    function setSpace() {
        const canvas = document.getElementById("space");
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(0, 4, 10);

        const controls = new MapControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.enableRotate = false;
        controls.enableZoom = false;
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

        // loader.load("../../static/3d/MainPage.fbx", (object) => {
        //     object.scale.set(0.7, 0.7, 0.7);
        //     object.position.y = 3;
        //     // object.position.z = 20;
        //     // object.rotation.set(0.4, 0.5, 0);
        //     // object.traverse((child) => {
        //     //     if (child instanceof THREE.Mesh) {
        //     //         child.material.transparent = true;
        //     //         child.castShadow = true;
        //     //     }
        //     // });

        //     scene.add(object);
        // });

        // console.log(canvas.clientWidth, canvas.clientHeight, window.innerWidth / window.innerHeight);
        const geometry = new THREE.PlaneGeometry(9, 16);
        const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load("../../static/3d/MainPage.jpg") });
        const plane = new THREE.Mesh(geometry, material);
        plane.position.y = 4;
        // plane.position.z = -2;
        scene.add(plane);

        // event
        window.addEventListener("click", onTouchBox);
    }

    function onTouchBox(event) {
        let parentName;
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0 && drop.data.curr.status === "processing") {
            // parentName = intersects[0].object.parent.name;
            const shadow = scene.getObjectByName("shadow");
            const space = scene.getObjectByName("space");

            console.log(intersects[0].object.name, intersects[0].object.parent.name);
            if (intersects[0].object.parent.name === "box" || intersects[0].object.parent.name === "BoxBpdy" || intersects[0].object.parent.name === "BoxLid") {
                setAction(animationActions[1]);
                // gsap.to(intersects[0].object.position, {
                //     x: -3,
                //     ease: "power3.inOut",
                //     duration: 1.2,
                // });

                gsap.to(intersects[0].object.parent, { visible: false, duration: 0.5, delay: 0.5 });
                gsap.to(intersects[0].object.parent.material, { opacity: 0, duration: 1, ease: "power3.inOut" });
                gsap.to(shadow.material, { opacity: 0, duration: 1 });
                gsap.to(space, { receiveShadow: true, duration: 1, delay: 0.5 });

                dropSeq = drop.data.curr.dropSeq;
                dropRound = drop.data.curr.dropRound;

                a = assets.filter((e) => e.id === dropRound);
                setTimeout(() => {
                    loader.load(a[0].popupUrl, (object) => {
                        // setCurr(object);
                        object.scale.multiplyScalar(0.12);
                        object.position.y = 2;
                        object.position.z = 3;
                        mixer = new THREE.AnimationMixer(object);
                        const action = mixer.clipAction(object.animations[0]);
                        action.clampWhenFinished = true;
                        action.loop = THREE.LoopOnce;
                        action.play();

                        object.traverse(function (child) {
                            if (child.isMesh) {
                                let colorMap,
                                    bumpMap,
                                    specularMap,
                                    normalMap = null;
                                if (a[0].colorMap) colorMap = new THREE.TextureLoader().load(a[0].colorMap);
                                if (a[0].bumpMap) bumpMap = new THREE.TextureLoader().load(a[0].bumpMap);
                                if (a[0].specularMap) specularMap = new THREE.TextureLoader().load(a[0].specularMap);
                                if (a[0].normalMap) normalMap = new THREE.TextureLoader().load(a[0].normalMap);

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
                        object.name = "drop";

                        scene.add(object);
                        setTimeout(() => {
                            drop.dropArt({ dropSeq }, (e) => {
                                setOpen(true);
                            });
                        }, 1000);
                        clock = new THREE.Clock();
                    });
                }, 1000);
            }
        } else {
            common.messageApi.open(messageData);
        }
    }

    function spaceRender() {
        requestAnimationFrame(spaceRender);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
    }

    useEffect(() => {
        setSpace();
        spaceRender();
    }, []);

    useEffect(() => {
        dropSeq = drop.data.curr.dropSeq;
        dropRound = drop.data.curr.dropRound;
        a = assets.filter((e) => e.id === dropRound);
        if (drop.data.curr.status) {
            if (drop.data.curr.status === "closed") {
                // 페이지 리로딩
                console.log("읻오");
                window.location.replace("/main");
            } else {
                if (drop.data.curr.dropOwnFlag) {
                    // 받은 드롭 파일
                    loader.load(a[0].url, (object) => {
                        // setCurr(object);
                        object.scale.multiplyScalar(0.12);
                        object.position.y = 2;
                        object.position.z = 3;

                        object.traverse(function (child) {
                            if (child.isMesh) {
                                let colorMap,
                                    bumpMap,
                                    specularMap,
                                    normalMap = null;
                                if (a[0].colorMap) colorMap = new THREE.TextureLoader().load(a[0].colorMap);
                                if (a[0].bumpMap) bumpMap = new THREE.TextureLoader().load(a[0].bumpMap);
                                if (a[0].specularMap) specularMap = new THREE.TextureLoader().load(a[0].specularMap);
                                if (a[0].normalMap) normalMap = new THREE.TextureLoader().load(a[0].normalMap);

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
                        object.name = "drop";

                        mixer = new THREE.AnimationMixer(object);
                        const action = mixer.clipAction(object.animations[0]);
                        action.clampWhenFinished = true;
                        action.loop = THREE.LoopOnce;
                        action.play();

                        scene.add(object);
                    });
                } else {
                    // 미스터리 박스 파일
                    // loader.load("../../static/3d/dropBox/DROPBOX_UnlockedLoop.fbx", (object) => {
                    //     object.scale.multiplyScalar(0.25);
                    //     object.position.y = 3;
                    //     object.position.z = 3;
                    //     object.rotation.set(0.2, -0.5, 0);
                    //     // object.traverse((child) => {
                    //     // if (child instanceof THREE.Mesh) {
                    //     //     child.castShadow = true;
                    //     //     child.material = new THREE.MeshPhongMaterial({
                    //     //         map: new THREE.TextureLoader().load("../../static/3d/dropBox/texture/" + drop.data.curr.dropRound + ".jpg"),
                    //     //         transparent: true,
                    //     //     });
                    //     //     // child.rotation.set(0.3, 0.5, 0);
                    //     // }
                    //     // });

                    //     mixer = new THREE.AnimationMixer(object);
                    //     mixer.clipAction(object.animations[0]).play();

                    //     object.name = "box";
                    //     scene.add(object);
                    // });

                    let dropBox;
                    if (drop.data.curr.status === "ready") {
                        fbxLoader.load("../../static/3d/dropBox/DROPBOX_LockedStatic.fbx", (object) => {
                            object.scale.multiplyScalar(0.25);
                            object.position.y = 3;
                            object.position.z = 3;
                            // object.rotation.set(0.2, -0.5, 0);

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

                            scene.add(object);
                            object.name = "box";

                            fbxLoader.load("../../static/3d/dropBox/DROPBOX_UnlockedLoop.fbx", (object) => {
                                object.scale.multiplyScalar(0.25);
                                object.position.y = 3;
                                object.position.z = 3;
                                // object.rotation.set(0.2, -0.5, 0);
                                mixer = new THREE.AnimationMixer(object);

                                const animationAction = mixer.clipAction(object.animations[0]);
                                console.log("Loop", object.animations);
                                animationActions.push(animationAction);
                                activeAction = animationActions[0];

                                //add an animation from another file
                                fbxLoader.load("../../static/3d/dropBox/DROPBOX_Locked2Unlocking.fbx", (object) => {
                                    object.rotation.set(0.2, -0.5, 0);

                                    const animationAction = mixer.clipAction(object.animations[0]);
                                    console.log("Unlocking", object.animations);
                                    animationActions.push(animationAction);

                                    //add an animation from another file
                                    fbxLoader.load("../../static/3d/dropBox/DROPBOX_LockedShaking.fbx", (object) => {
                                        object.rotation.set(0.2, -0.5, 0);
                                        console.log("LockedShaking", object.animations);
                                        const animationAction = mixer.clipAction(object.animations[0]);
                                        animationActions.push(animationAction);

                                        //add an animation from another file
                                        fbxLoader.load("../../static/3d/dropBox/DROPBOX_Open2Disappear.fbx", (object) => {
                                            object.rotation.set(0.2, -0.5, 0);
                                            console.log("Disappear", object.animations);
                                            const animationAction = mixer.clipAction(object.animations[0]);
                                            animationActions.push(animationAction);

                                            modelReady = true;
                                        });
                                    });
                                });
                            });
                        });
                    }
                    if (drop.data.curr.status === "processing") {
                        fbxLoader.load("../../static/3d/dropBox/DROPBOX_UnlockedLoop.fbx", (object) => {
                            object.scale.multiplyScalar(0.25);
                            object.position.y = 3;
                            object.position.z = 3;
                            // object.rotation.set(0.2, -0.5, 0);

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

                            mixer = new THREE.AnimationMixer(object);
                            animationActions.push(mixer.clipAction(object.animations[0]));
                            mixer.clipAction(object.animations[0]).play();
                            activeAction = animationActions[0];

                            scene.add(object);
                            object.name = "box";

                            //add an animation from another file
                            fbxLoader.load("../../static/3d/dropBox/DROPBOX_Locked2Unlocking.fbx", (object) => {
                                object.rotation.set(0.2, -0.5, 0);
                                object.name = "box";
                                const animationAction = mixer.clipAction(object.animations[0]);
                                console.log("Unlocking", object.animations);
                                animationActions.push(animationAction);

                                //add an animation from another file
                                fbxLoader.load("../../static/3d/dropBox/DROPBOX_LockedShaking.fbx", (object) => {
                                    object.rotation.set(0.2, -0.5, 0);
                                    object.name = "box";
                                    console.log("LockedShaking", object.animations);
                                    const animationAction = mixer.clipAction(object.animations[0]);
                                    animationActions.push(animationAction);

                                    //add an animation from another file
                                    fbxLoader.load("../../static/3d/dropBox/DROPBOX_Open2Disappear.fbx", (object) => {
                                        object.rotation.set(0.2, -0.5, 0);
                                        object.name = "box";
                                        console.log("Disappear", object.animations);
                                        const animationAction = mixer.clipAction(object.animations[0]);
                                        animationActions.push(animationAction);

                                        modelReady = true;
                                    });
                                });
                            });
                        });
                    }
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
