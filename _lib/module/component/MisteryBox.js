import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Router, { useRouter } from "next/router";
import assets from "./assets.json";

import DDS from "../../component/dds";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import gsap from "gsap";

const MisteryBox = observer((props) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { drop, lang, common, auth } = props.store;

    let renderer, renderer2;
    let camera;
    const scene = new THREE.Scene();
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();
    const loader = new GLTFLoader();
    let dropSeq, dropRound;
    const boxName = ["box", "BoxBpdy", "BoxLid", "BoxBodyTp", "BoxLidLock"];

    const messageData = {
        key: "upcoming",
        icon: <DDS.icons.circleExclamation />,
        className: "orgMessage",
        content: "드롭을 준비중이에요, 잠시만 기다려주세요!",
    };

    let model;
    const animationActions = [];
    let activeAction;
    let lastAction;

    const setAction = (toAction) => {
        // if (toAction != activeAction) {

        // }
        if (!toAction) {
            lastAction = activeAction;
            activeAction.reset();
            // activeAction.fadeIn(1);
            activeAction.setLoop(THREE.LoopOnce);
            activeAction.play();
        } else {
            lastAction = activeAction;
            activeAction = toAction;
            //     //lastAction.stop()
            // lastAction.fadeOut(1);
            activeAction.reset();
            // activeAction.fadeIn(1);
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
        shadow.position.y = -1;
        shadow.position.z = 2;
        shadow.material.transparent = true;
        shadow.receiveShadow = true;
        shadow.rotateX(-Math.PI / 2);
        shadow.name = "shadow";
        scene.add(shadow);

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
        console.log(common.ui.gnbOpen, drop.data.curr.coachMark);
        if (intersects.length > 0 && !common.ui.gnbOpen && drop.data.curr.coachMark === "hidden") {
            if (drop.data.curr.status === "processing") {
                const shadow = scene.getObjectByName("shadow");
                const space = scene.getObjectByName("space");

                if (boxName.includes(intersects[0].object.parent.name)) {
                    drop.dropArt({ dropSeq: drop.data.curr.dropSeq }, (e) => {
                        if (e.id === "ok") {
                            setAction(animationActions[1]);
                            gsap.to(intersects[0].object.parent, { visible: false, duration: 1 });
                            gsap.to(shadow.material, { opacity: 0, duration: 1 });
                            gsap.to(space, { receiveShadow: true, duration: 1, delay: 0.5 });

                            setTimeout(() => {
                                loader.load(
                                    drop.data.curr.contentUrl,
                                    function (gltf) {
                                        model = gltf.scene;
                                        model.position.z = 3;
                                        model.position.y = 1;

                                        switch (drop.data.curr.dropSeq) {
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
                                                model.scale.multiplyScalar(10);
                                                break;
                                        }

                                        scene.add(model);
                                        model.traverse(function (object) {
                                            if (object.isMesh) object.castShadow = true;
                                        });
                                        // mixer = new THREE.AnimationMixer(model);
                                        // mixer.clipAction(gltf.animations[0]).play();
                                        model.name = "drop";
                                        setTimeout(() => {
                                            setOpen(true);
                                        }, 1000);
                                    },
                                    undefined,
                                    function (error) {
                                        console.log("An error happened");
                                    },
                                );
                            }, 1000);

                            setTimeout(() => {
                                const geometry = new THREE.BoxGeometry(3, 3, 0.5);
                                const material = new THREE.MeshBasicMaterial({
                                    color: 0xffff00,
                                    side: THREE.DoubleSide,
                                    transparent: true,
                                    opacity: 0,
                                });
                                const plane = new THREE.Mesh(geometry, material);
                                plane.position.z = 5;
                                plane.position.y = 4;
                                plane.name = "dropDetail" + drop.data.curr.dropSeq;
                                scene.add(plane);

                                switch (drop.data.curr.dropSeq) {
                                    case 1:
                                        break;
                                    case 2:
                                        plane.position.y = 3.5;
                                        break;
                                    case 3:
                                        plane.position.y = 3;
                                        break;
                                    case 4:
                                        plane.position.y = 3;
                                        break;
                                    case 5:
                                        plane.position.y = 2.5;
                                        break;
                                    default:
                                        break;
                                }
                            }, 2000);
                        }
                    });
                } else if (intersects[0].object.name.includes("dropDetail")) {
                    window.location.href = "native://drop_detail?dropSeq=" + drop.data.curr.dropSeq;
                }
            } else {
                if (boxName.includes(intersects[0].object.parent.name)) {
                    common.messageApi.open(messageData);
                    // setAction(animationActions[1]);
                }
            }
        }
    }

    function spaceRender() {
        requestAnimationFrame(spaceRender);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        // if (scene.getObjectByName("drop")) scene.getObjectByName("drop").rotation.y += 0.005;
        renderer.render(scene, camera);
    }

    useEffect(() => {
        setSpace();
        spaceRender();
    }, []);

    useEffect(() => {
        // dropSeq = drop.data.curr.dropSeq;
        // dropRound = drop.data.curr.dropRound;

        // if (drop.data.curr.dropOwnFlag) {
        //     const geometry = new THREE.BoxGeometry(3, 3, 0.5);
        //     const material = new THREE.MeshBasicMaterial({
        //         color: 0xffff00,
        //         side: THREE.DoubleSide,
        //         transparent: true,
        //         opacity: 0,
        //     });
        //     const plane = new THREE.Mesh(geometry, material);
        //     plane.position.z = 5;
        //     plane.position.y = 4;
        //     plane.name = "dropDetail" + drop.data.curr.dropSeq;
        //     scene.add(plane);

        //     loader.load(
        //         // resource URL
        //         drop.data.curr.contentUrl,
        //         function (gltf) {
        //             model = gltf.scene;
        //             model.position.z = 3;
        //             model.position.y = 1;
        //             // model.scale.multiplyScalar(10);

        //             switch (drop.data.curr.dropSeq) {
        //                 case 1:
        //                     model.scale.multiplyScalar(14);
        //                     break;
        //                 case 2:
        //                     plane.position.y = 3.5;
        //                     model.scale.multiplyScalar(20);
        //                     break;
        //                 case 3:
        //                     plane.position.y = 3;
        //                     model.scale.multiplyScalar(1.5);
        //                     break;
        //                 case 4:
        //                     plane.position.y = 3;
        //                     model.scale.multiplyScalar(15);
        //                     break;
        //                 case 5:
        //                     plane.position.y = 2.5;
        //                     model.scale.multiplyScalar(15);
        //                     break;
        //                 default:
        //                     model.scale.multiplyScalar(10);
        //                     break;
        //             }

        //             scene.add(model);

        //             model.traverse(function (object) {
        //                 if (object.isMesh) object.castShadow = true;
        //             });

        //             // mixer = new THREE.AnimationMixer(model);
        //             // mixer.clipAction(gltf.animations[0]).play();

        //             model.name = "drop";
        //         },
        //         undefined,
        //         function (error) {
        //             console.log("An error happened");
        //         },
        //     );
        // } else {
        let dropBox;
        // if (drop.data.curr.status === "ready") {
        loader.load(
            // resource URL
            "../../static/3d/dropBox/dropbox__locked_shaking.glb",
            // called when the resource is loaded
            function (gltf) {
                model = gltf.scene;
                model.scale.set(25, 25, 25);
                model.rotation.set(0.2, -0.5, 0);
                model.position.y = 2;
                model.position.z = 3;
                scene.add(model);

                // model.traverse(function (object) {
                //     if (object.isMesh) {
                //         object.castShadow = true;
                //         object.material = new THREE.MeshPhongMaterial({
                //             map: new THREE.TextureLoader().load("../../static/3d/dropBox/texture/" + drop.data.curr.dropSeq + ".jpg"),
                //             transparent: true,
                //         });
                //     }
                // });
                mixer = new THREE.AnimationMixer(model);
                model.name = "box";

                mixer.clipAction(gltf.animations[0]).play();

                loader.load("../../static/3d/dropBox/dropbox__unlocked_loop.glb", (gltf) => {
                    model = gltf.scene;
                    model.position.y = 2;
                    model.position.z = 3;

                    const animationAction = mixer.clipAction(gltf.animations[0]);
                    animationActions.push(animationAction);
                    // mixer.clipAction(gltf.animations[0]).play();
                    activeAction = animationActions[0];

                    // add an animation from another file
                    loader.load("../../static/3d/dropBox/dropbox__locked_shaking.glb", (object) => {
                        model = gltf.scene;
                        model.position.y = 2;
                        model.position.z = 3;

                        const animationAction = mixer.clipAction(gltf.animations[0]);
                        animationActions.push(animationAction);

                        //     //add an animation from another file
                        //     fbxLoader.load("../../static/3d/dropBox/DROPBOX_Open2Disappear.fbx", (object) => {
                        //         object.rotation.set(0.2, -0.5, 0);
                        //         object.name = "box";
                        //         const animationAction = mixer.clipAction(object.animations[0]);
                        //         animationActions.push(animationAction);

                        // modelReady = true;
                        //     });
                    });
                });
            },
            undefined,
            // called when loading has errors
            function (error) {
                console.log("An error happened");
            },
        );
        // }
        if (drop.data.curr.status === "processing") {
            loader.load(
                // resource URL
                "../../static/3d/dropBox/dropbox__unlocked_loop.glb",
                // called when the resource is loaded
                function (gltf) {
                    model = gltf.scene;
                    model.scale.set(25, 25, 25);
                    model.rotation.set(0.2, -0.5, 0);
                    model.position.y = 2;
                    model.position.z = 3;
                    scene.add(model);

                    model.traverse(function (object) {
                        if (object.isMesh) {
                            object.castShadow = true;
                            object.material = new THREE.MeshPhongMaterial({
                                map: new THREE.TextureLoader().load("../../static/3d/dropBox/texture/" + drop.data.curr.dropSeq + ".jpg"),
                                transparent: true,
                            });
                        }
                    });

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
        }
        // }
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
                location.href = "/userGallery?memberSeq=" + auth.loginResult.seq;
            },
        },
        cancel: {
            label: lang.t("misteryBox.modal.close"),
            action: () => {},
        },
    };

    return (
        <>
            <canvas id="space" className="dropSpace"></canvas>
            <DDS.modal.bottom {...modalData} />
        </>
    );
});

export default MisteryBox;
