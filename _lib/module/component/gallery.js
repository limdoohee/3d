import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import Router, { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

const Gallery = forwardRef(function Gallery(props, ref) {
    const router = useRouter();
    const { store } = props;
    const { drop, common, lang, gallery } = store;
    // console.log(gallery.data.collection);

    // const dropData = gallery.data.collection;

    const dropData = [
        {
            id: 1,
            url: "../../static/3d/3/LinearSpin.fbx",
            bumpMap: "../../static/3d/3/DSP_KominJeong.jpg",
            colorMap: "../../static/3d/3/D_KominJeong.jpg",
            specularMap: "",
        },
        {
            id: 3,
            url: "../../static/3d/2/LinearSpin.fbx",
            bumpMap: "../../static/3d/2/DSP_DoCoin.png",
            colorMap: "../../static/3d/2/D_DoCoin.png",
            specularMap: "../../static/3d/2/SPC_DoCoin.png",
            alphaMap: "",
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
            id: 5,
            url: "../../static/3d/1/LinearSpin.fbx",
            colorMap: "../../static/3d/1/D_275C.png",
        },
        {
            id: 6,
            url: "../../static/3d/1/LinearSpin.fbx",
            colorMap: "../../static/3d/1/D_275C.png",
        },
        {
            id: 8,
            url: "../../static/3d/3/Popup.fbx",
            bumpMap: "../../static/3d/3/DSP_KominJeong.jpg",
            colorMap: "../../static/3d/3/D_KominJeong.jpg",
        },
        {
            id: 21,
            url: "../../static/3d/1/LinearSpin.fbx",
            colorMap: "../../static/3d/1/D_275C.png",
        },
        // {
        //     id: 11,
        //     url: "../../static/3d/ButterCup/ButterCup_Linear.fbx",
        //     bumpMap: "../../static/3d/ButterCup/DSP_ButterCup.jpg",
        //     colorMap: "../../static/3d/ButterCup/D_ButterCup.jpg",
        // },
        // {
        //     id: 12,
        //     url: "../../static/3d/JangaNo/JangaNo_Linear_V04.fbx",
        //     colorMap: "../../static/3d/JangaNo/D_JangaNo.jpg",
        //     normalMap: "../../static/3d/JangaNo/N_JangaNo.jpg",
        // },
    ];

    const { back, setBack } = props;

    const scene = new THREE.Scene();
    let camera, renderer, controls;

    const fbx = new FBXLoader();
    const mixers = [];
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();

    let profileArea, btnArea;

    let beforePosition = -1;
    let column, parent, space, hiddenIndex;

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

    // useImperativeHandle(ref, () => ({
    //     backOfDetail,
    // }));
    useImperativeHandle(
        ref,
        () => {
            return {
                back() {
                    setBack(false);
                    profileArea.style.opacity = 1;
                    btnArea.style.opacity = 1;

                    // 에셋
                    gsap.to(parent.children[0].position, {
                        duration: 1,
                        y: 0,
                        ease: "power3.inOut",
                    });

                    gsap.to(controls.target, {
                        duration: 1,
                        x: parent.position.x,
                        y: 0,
                        z: 0,
                        ease: "power3.inOut",
                        onUpdate: function () {
                            controls.update();
                        },
                    });

                    gsap.to(camera, {
                        fov: 50,
                        duration: 1,
                        ease: "power4.inOut",
                        onUpdate: function () {
                            camera.updateProjectionMatrix();
                        },
                    });

                    gsap.to(camera.position, {
                        duration: 1,
                        ease: "power3.inOut",
                        x: parent.position.x,
                        y: 0,
                        z: 10,
                        onUpdate: function () {
                            camera.updateProjectionMatrix();
                        },
                    });

                    setTimeout(() => {
                        hiddenIndex.forEach((e) => {
                            // 에셋
                            gsap.to(scene.getObjectByName("drop" + e).children[0].material, {
                                duration: 1,
                                opacity: 1,
                                ease: "power3.inOut",
                            });
                        });

                        for (let i = 0; i < dropData.length; i++) {
                            // 포디움
                            gsap.to(scene.getObjectByName("column" + i).children[0].material, {
                                duration: 1,
                                opacity: 1,
                                ease: "power3.inOut",
                            });
                        }

                        for (let i = 1; i <= 5; i++) {
                            // 배경
                            scene.getObjectByName("space" + i) &&
                                gsap.to(scene.getObjectByName("space" + i).children[0].material, {
                                    duration: 1,
                                    opacity: 1,
                                    ease: "power3.inOut",
                                });
                        }
                    }, 200);

                    beforePosition = -1;
                    controls.touches = {
                        ONE: THREE.TOUCH.PAN,
                    };
                    controls.enablePan = true;
                    controls.enableRotate = false;

                    maxX = dropData.length - 1 < 1 ? 2.5 : (dropData.length - 1) * 2.5;
                    minX = 0;
                    maxZ = 4;
                    minZ = 0;
                },
            };
        },
        [],
    );

    function init() {
        const canvas = document.getElementById("space");
        profileArea = document.querySelector(".userInfo");
        btnArea = document.querySelector(".btn");

        // render hive
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // camera
        camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        // dropData.length === 0 ? camera.position.set(0, 0, 10) : camera.position.set((dropData.length - 1) * 2.5, 0, 10);
        camera.position.set((dropData.length - 1) * 2.5, 0, 10);
        // camera.position.set(0, 1, 5);

        // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100);
        // camera.position.set(0, 0, 5);

        // light
        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(10, 7, 0);
        // light.castShadow = true;
        // scene.add(light);
        // scene.add(new THREE.DirectionalLightHelper(light, 1, "red"));
        scene.add(new THREE.AmbientLight(0xffffff, 0.2));

        const pointLight = new THREE.PointLight(0xffffff, 0.4, 100);
        pointLight.position.set(7, 3, -5);
        // pointLight.castShadow = true;
        // pointLight.shadow.mapSize.width = 2048;
        // pointLight.shadow.mapSize.height = 2048;
        scene.add(pointLight);
        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize, "red");
        scene.add(pointLightHelper);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 0.6);
        scene.add(hemisphereLight);
        // scene.add(new THREE.HemisphereLightHelper(hemisphereLight, 5));

        // controls
        controls = new MapControls(camera, renderer.domElement);
        // dropData.length === 0 ? controls.target.set(0, 0, 0) : controls.target.set((dropData.length - 1) * 2.5, 0, 0);
        controls.target.set((dropData.length - 1) * 2.5, 0, 0);
        controls.touches = {
            ONE: THREE.TOUCH.PAN,
        };
        controls.minDistance = 5;
        controls.maxDistance = 15;
        controls.enableRotate = false;
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.update();

        window.addEventListener("click", clickDrop);

        controls.addEventListener("change", () => {
            // let shallWeUpdateAngle = false;

            const x = controls.target.x;
            if (x < minX || x > maxX) {
                controls.target.setX(x < minX ? minX : maxX);
                camera.position.setX(positionX);
                // shallWeUpdateAngle = true;
            }

            const z = controls.target.z;
            if (z < minZ || z > maxZ) {
                controls.target.setZ(z < minZ ? minZ : maxZ);
                camera.position.setZ(positionZ);
                // shallWeUpdateAngle = true;
            }

            // if (shallWeUpdateAngle) {
            //     const distance = camera.position.distanceTo(controls.target);
            //     camera.position.set(distance * Math.sin(phi) * Math.sin(theta) + controls.target.x, distance * Math.cos(phi) + controls.target.y, distance * Math.sin(phi) * Math.cos(theta) + controls.target.z);
            // }

            // Updating state
            if (!isNaN(camera.position.x)) positionX = camera.position.x;
            if (!isNaN(camera.position.z)) positionZ = camera.position.z;
            // phi = controls.getPolarAngle();
            // theta = controls.getAzimuthalAngle();
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

        if (intersects.length > 0) {
            parent = intersects[0].object.parent;

            if (parent.name.includes("drop")) {
                drop.dataChange("selected", dropData[parent.name.replace(/[^0-9]/g, "")].id);
                router.push("/detail/" + dropData[parent.name.replace(/[^0-9]/g, "")].id);
            }
        }
    }

    function setSpace() {
        const space = Math.ceil(dropData.length / 7) + 1;
        for (let i = 1; i <= space; i++) {
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
                        obj.scale.set(0.05, 0.05, 0.05);
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

                        mixer = new THREE.AnimationMixer(obj);
                        mixer.clipAction(obj.animations[0]).play();
                        mixers.push(mixer);

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
        animate();
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    useEffect(() => {
        init();
        setSpace();
        setDrop();
        render();
    }, []);

    return (
        <>
            <canvas id="space"></canvas>
        </>
    );
});

export default Gallery;
