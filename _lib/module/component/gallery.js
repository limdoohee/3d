import React, { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import assets from "./assets.json";

import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

const Gallery = observer((props) => {
    const router = useRouter();
    const { gallery } = props.store;

    let dropData = gallery.data.collection;
    const map = new Map();
    assets.forEach((e) => map.set(e.id, e));
    dropData.forEach((e) => map.set(e.dropRound, { ...map.get(e.dropRound), ...e }));
    dropData = gallery.data.myDropCnt === 0 ? [] : Array.from(map.values()).filter((e) => e.dropSeq);
    console.log(dropData);
    const { back, setBack } = props;

    const scene = new THREE.Scene();
    let camera, renderer, controls;

    const fbx = new FBXLoader();
    const mixers = [];
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();

    let beforePosition = -1;
    let column, parent, space, hiddenIndex;
    let dropLength;

    // Limits;
    let maxX = dropData.length - 1 < 1 ? 2.5 : (dropData.length - 1) * 2.5;
    let minX = 0;
    let maxZ = 4;
    let minZ = 0;

    // // State
    let positionX = dropData.length - 1 < 1 ? 2.5 : (dropData.length - 1) * 2.5;
    let positionZ = 10;
    let phi;
    let theta;

    function init() {
        const canvas = document.getElementById("space");
        // render hive
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // camera
        camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        dropData.length === 0 ? camera.position.set(0, 0, 10) : camera.position.set((dropData.length - 1) * 2.5, 0, 10);

        // light
        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 7, 0);
        scene.add(new THREE.AmbientLight(0xffffff, 0.2));

        const pointLight1 = new THREE.PointLight(0xffffff, 0.4, 100);
        pointLight1.position.set(1, 3, -5);
        scene.add(pointLight1);
        // const pointLightHelper1 = new THREE.PointLightHelper(pointLight1, 1, "red");
        // scene.add(pointLightHelper1);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.4, 100);
        pointLight2.position.set(45, 3, -5);
        scene.add(pointLight2);
        // const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, 1, "red");
        // scene.add(pointLightHelper2);

        const pointLight3 = new THREE.PointLight(0xffffff, 0.4, 100);
        pointLight3.position.set(100, 3, -5);
        scene.add(pointLight3);
        // const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, 1, "red");
        // scene.add(pointLightHelper3);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.6);
        scene.add(hemisphereLight);

        // controls
        controls = new MapControls(camera, renderer.domElement);
        dropData.length === 0 ? controls.target.set(0, 0, 0) : controls.target.set((dropData.length - 1) * 2.5, 0, 0);
        controls.touches = {
            ONE: THREE.TOUCH.PAN,
        };
        controls.minDistance = 5;
        controls.maxDistance = 15;
        controls.enableRotate = false;
        controls.update();

        window.addEventListener("click", clickDrop);

        // controls.addEventListener("change", () => {
        //     const x = controls.target.x;
        //     if (x < minX || x > maxX) {
        //         controls.target.setX(x < minX ? minX : maxX);
        //         camera.position.setX(positionX);
        //     }

        //     const z = controls.target.z;
        //     if (z < minZ || z > maxZ) {
        //         controls.target.setZ(z < minZ ? minZ : maxZ);
        //         camera.position.setZ(positionZ);
        //     }

        //     if (!isNaN(camera.position.x)) positionX = camera.position.x;
        //     if (!isNaN(camera.position.z)) positionZ = camera.position.z;
        // });

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

        if (intersects.length > 0) {
            parent = intersects[0].object.parent;

            if (parent.name.includes("drop")) {
                window.location.href = "native://drop_detail?dropSeq=" + dropData.filter((e) => e.id === String(parseInt(parent.name.replace(/[^0-9]/g, "")) + 1))[0].dropSeq;
            }
        }
    }

    function setSpace() {
        // const space = Math.ceil(dropData.length / 7) + 1;
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
            for (let i = 0; i < dropData.length; i++) {
                dropLength = i;
                if (dropData[i].url) {
                    // 포디움
                    fbx.load("../../static/3d/podium/Podium.fbx", (obj) => {
                        obj.scale.multiplyScalar(0.3);
                        obj.position.set(i * 2.5, 0, 0.8);
                        obj.traverse(function (child) {
                            if (child.isMesh) {
                                child.material = new THREE.MeshPhongMaterial({
                                    bumpMap: new THREE.TextureLoader().load("../../static/3d/podium/D_PDM" + dropData[i].id + ".jpg"),
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

                    // 드롭
                    fbx.load(dropData[i].url, (obj) => {
                        obj.scale.multiplyScalar(0.05);
                        obj.position.set(i * 2.5, -0.8, 0);
                        obj.traverse(function (child) {
                            if (child.isMesh) {
                                let colorMap,
                                    bumpMap,
                                    specularMap,
                                    normalMap = null;
                                if (dropData[i].colorMap) colorMap = new THREE.TextureLoader().load(dropData[i].colorMap);
                                if (dropData[i].bumpMap) bumpMap = new THREE.TextureLoader().load(dropData[i].bumpMap);
                                if (dropData[i].specularMap) specularMap = new THREE.TextureLoader().load(dropData[i].specularMap);
                                if (dropData[i].normalMap) normalMap = new THREE.TextureLoader().load(dropData[i].normalMap);

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
                        obj.name = "drop" + i;

                        // mixer = new THREE.AnimationMixer(obj);
                        // mixer.clipAction(obj.animations[0]).play();
                        // mixers.push(mixer);

                        scene.add(obj);
                    });
                }
            }
        }
    };

    function animate() {
        const delta = clock.getDelta();
        for (const mixer of mixers) mixer.update(delta);
    }

    function render() {
        // scene.getObjectByName(dropLength);
        for (let i = 0; i <= dropLength; i++) {
            if (scene.getObjectByName("drop" + i)) scene.getObjectByName("drop" + i).rotation.y += 0.01;
        }

        // animate();

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
