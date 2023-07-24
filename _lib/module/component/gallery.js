import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import assets from "./assets.json";

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

const Gallery = observer((props) => {
    const { gallery, common } = props.store;

    let dropData = gallery.data.collection;

    const scene = new THREE.Scene();
    let camera, renderer, controls;

    const fbx = new FBXLoader();
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("../draco/");
    loader.setDRACOLoader(dracoLoader);

    const mixers = [];
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();

    let beforePosition = -1;
    let column, parent, space, hiddenIndex, model;
    let dropLength;

    // Limits;
    let minX = -1;
    let maxX = dropData.length - 1 < 1 ? 2.5 : (dropData.length - 1) * 2.5;
    let minZ = 0;
    let maxZ = 4;
    // // State
    let positionX = dropData.length - 1 < 1 ? 2.5 : (dropData.length - 1) * 2.5;
    let positionZ = 10;

    let lastPos = (dropData.length - 1) * 2.5;
    let rendered = [];

    function init() {
        const canvas = document.getElementById("space");
        // render hive
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        dropData.length === 0 ? camera.position.set(0, 0, 10) : camera.position.set((dropData.length - 1) * 2.5, 0, 10);

        // light
        // scene.add(new THREE.AmbientLight(0xffffff, 0.35));

        // const pointLight1 = new THREE.PointLight(0xffffff, 0.3, 50);
        // pointLight1.position.set(0, 0, -6);
        // scene.add(pointLight1);

        // const pointLight2 = new THREE.PointLight(0xffffff, 0.3, 100);
        // pointLight2.position.set(37, 0, -7);
        // scene.add(pointLight2);

        // const pointLight3 = new THREE.PointLight(0xffffff, 0.3, 50);
        // pointLight3.position.set(70, 0, -7);
        // scene.add(pointLight3);

        scene.add(new THREE.AmbientLight(0xffffff, 0.25));

        const pointLight1 = new THREE.PointLight(0xffffff, 0.2, 50);
        pointLight1.position.set(0, 5, -6);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.1, 50);
        pointLight2.position.set(37, 5, -8);
        scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xffffff, 0.2, 50);
        pointLight3.position.set(70, 5, -7);
        scene.add(pointLight3);

        const pointLight4 = new THREE.PointLight(0xffffff, 0.25, 100);
        pointLight4.position.set(5, 1, 7);
        scene.add(pointLight4);

        const pointLight5 = new THREE.PointLight(0xffffff, 0.25, 100);
        pointLight5.position.set(35, 1, 7);
        scene.add(pointLight5);

        const pointLight6 = new THREE.PointLight(0xffffff, 0.25, 100);
        pointLight6.position.set(65, 1, 7);
        scene.add(pointLight6);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.55);
        scene.add(hemisphereLight);

        // controls
        controls = new MapControls(camera, renderer.domElement);
        dropData.length === 0 ? controls.target.set(0, 0, 0) : controls.target.set((dropData.length - 1) * 2.5, 0, 0);
        controls.minDistance = 5;
        controls.maxDistance = 15;
        controls.enableRotate = false;
        controls.update();

        window.addEventListener("click", clickDrop);

        controls.addEventListener("change", () => {
            const x = controls.target.x;
            if (x < minX || x > maxX) {
                controls.target.setX(x < minX ? minX : maxX);
                camera.position.setX(positionX);
            }
            const z = controls.target.z;
            if (z < minZ || z > maxZ) {
                controls.target.setZ(z < minZ ? minZ : maxZ);
                camera.position.setZ(positionZ);
            }

            if (!isNaN(camera.position.x)) positionX = camera.position.x;
            if (!isNaN(camera.position.z)) positionZ = camera.position.z;
            lastPos = controls.target.x > minX && controls.target.x;

            // 이미 렌더링 된 파일있는지 중복체크
            if (2 < parseInt(controls.target.x / 2.5) && !rendered.includes(parseInt(controls.target.x / 2.5) - 3)) {
                dynamicRender(dropData.length - parseInt(controls.target.x / 2.5) + 3, dropData.length - parseInt(controls.target.x / 2.5) + 3);
            }
        });

        // 첫 로딩시, 화면 줌인
        setTimeout(() => {
            controls.enabled = true;
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

    function clickDrop(event) {
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0 && !common.ui.gnbOpen) {
            parent = intersects[0].object.parent;

            if (intersects[0].object.name.includes("drop")) {
                window.location.href = "native://drop_detail?dropSeq=" + dropData[parseInt(intersects[0].object.name.replace(/[^0-9]/g, ""))].dropSeq;
            }
        }
    }

    function setSpace() {
        const space = Math.ceil(dropData.length / 7) + 1;
        for (let i = 1; i <= 5; i++) {
            fbx.load("../../static/3d/gallery/gallery" + i + ".fbx", (obj) => {
                obj.scale.multiplyScalar(0.3);
                obj.position.z = 10;
                obj.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.material = new THREE.MeshPhongMaterial({
                            transparent: true,
                        });
                    }
                });
                obj.name = "space" + i;
                scene.add(obj);
            });
        }
    }

    const dynamicRender = (start, end) => {
        if (start <= dropData.length && end <= dropData.length) {
            for (let i = dropData.length - start; dropData.length - end <= i; i--) {
                if (dropData[i].contentUrl) {
                    rendered.push(i);
                    // 포디움
                    fbx.load("../../static/3d/podium/Podium.fbx", (obj) => {
                        obj.scale.multiplyScalar(0.3);
                        obj.position.set(i * 2.5, 0, 0.8);
                        obj.traverse(function (child) {
                            if (child.isMesh) {
                                child.material = new THREE.MeshPhongMaterial({
                                    bumpMap: new THREE.TextureLoader().load("../../static/3d/podium/D_PDM" + dropData[i].dropSeq + ".jpg"),
                                    bumpScale: 0.1,
                                    transparent: true,
                                });
                                child.castShadow = true;
                                child.receiveShadow = true;
                            }
                        });
                        obj.name = "column" + i;
                        scene.add(obj);
                    });

                    // 가상 영역
                    const geometry = new THREE.BoxGeometry(1, 2, 0.1);
                    const material = new THREE.MeshPhongMaterial({
                        // color: 0xffff00,
                        side: THREE.DoubleSide,
                        transparent: true,
                        opacity: 0,
                        depthWrite: false,
                    });
                    const plane = new THREE.Mesh(geometry, material);
                    plane.position.set(i * 2.5, 0, 1);
                    plane.name = "drop" + i;
                    scene.add(plane);

                    // 드롭
                    loader.load(
                        dropData[i].lowContentUrl,
                        function (gltf) {
                            model = gltf.scene;
                            model.position.set(i * 2.5, -1.2, 0);

                            switch (dropData[i].dropSeq) {
                                case 1:
                                    model.scale.multiplyScalar(7);
                                    break;
                                case 2:
                                    model.scale.multiplyScalar(10);
                                    break;
                                case 3:
                                    model.scale.multiplyScalar(7);
                                    break;
                                case 4:
                                    model.position.y = -1;
                                    model.scale.multiplyScalar(6);
                                    break;
                                case 5:
                                    model.position.y = -1.1;
                                    model.scale.multiplyScalar(7);
                                    break;
                                case 7:
                                    model.position.y = -1.25;
                                    model.scale.multiplyScalar(4.8);
                                    break;
                                case 8:
                                    model.position.y = 0;
                                    model.scale.multiplyScalar(6.5);
                                    break;
                                case 9:
                                    model.position.y = -0.8;
                                    model.scale.multiplyScalar(0.15);
                                    break;
                                case 10:
                                    model.scale.multiplyScalar(5);
                                    break;
                                case 11:
                                    model.position.x = i * 2.5 + 0.2;
                                    model.position.y = -0.3;
                                    model.scale.multiplyScalar(0.04);
                                    break;
                                case 12:
                                    model.position.x = i * 2.5 + 0.1;
                                    model.position.y = -1;
                                    model.scale.multiplyScalar(0.47);
                                    break;
                                default:
                                    model.scale.multiplyScalar(6);
                                    break;
                            }
                            scene.add(model);
                            model.name = "model" + i;
                        },
                        undefined,
                        function (error) {
                            console.log("error", error);
                        },
                    );
                }
            }
        }
    };

    const setDrop = () => {
        if (dropData.length === 0) {
            fbx.load("../../static/3d/podium/Podium.fbx", (obj) => {
                obj.scale.multiplyScalar(0.3);
                obj.position.set(0, 0, 0.8);
                obj.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
                obj.name = "column0";
                scene.add(obj);
            });
        } else {
            let end;
            end = dropData.length < 5 ? dropData.length : 5;
            dynamicRender(1, end);
        }
    };

    function animate() {
        const delta = clock.getDelta();
        for (const mixer of mixers) mixer.update(delta);
    }

    function render() {
        // scene.getObjectByName(dropLength);
        // for (let i = 0; i <= dropLength; i++) {
        //     if (scene.getObjectByName("model" + i)) scene.getObjectByName("model" + i).rotation.y += 0.01;
        // }

        animate();

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    useEffect(() => {
        init();
        setSpace();
        setDrop();
        render();
    }, [dropData.length]);

    return (
        <>
            <canvas id="space"></canvas>
        </>
    );
});

export default Gallery;
