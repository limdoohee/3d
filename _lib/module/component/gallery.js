import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import gsap from "gsap";

const Gallery = forwardRef(function Gallery(props, ref) {
    const gallery = props.data;
    // const dropData = gallery.collection;

    const dropData = [
        {
            id: 1,
            url: "../../static/3d/KominJeong/KominJeong_LinearSpin.fbx",
            bumpMap: "../../static/3d/KominJeong/DSP_KominJeong.jpg", // 바깥쪽
            colorMap: "../../static/3d/KominJeong/D_KominJeong.jpg", // 안쪽
            specularMap: "",
        },
        {
            id: 3,
            url: "../../static/3d/DoCoin/DoCoin_LinearSpin.fbx",
            bumpMap: "../../static/3d/DoCoin/DSP_DoCoin.png",
            colorMap: "../../static/3d/DoCoin/D_DoCoin.png",
            specularMap: "../../static/3d/DoCoin/SPC_DoCoin.png",
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
            url: "../../static/3d/275C/275C_LinearSpin.fbx",
            colorMap: "../../static/3d/275C/D_275C.png",
        },
        {
            id: 6,
            url: "../../static/3d/275C/275C_LinearSpin.fbx",
            colorMap: "../../static/3d/275C/D_275C.png",
        },
        {
            id: 8,
            url: "../../static/3d/KominJeong/KominJeong_LinearSpin.fbx",
            bumpMap: "../../static/3d/KominJeong/DSP_KominJeong.jpg", // 바깥쪽
            colorMap: "../../static/3d/KominJeong/D_KominJeong.jpg", // 안쪽
        },
        {
            id: 10,
            url: "../../static/3d/275C/275C_LinearSpin.fbx",
            colorMap: "../../static/3d/275C/D_275C.png",
        },
    ];

    const { back, setBack } = props;

    const scene = new THREE.Scene();
    let camera, renderer, controls;

    const fbx = new FBXLoader();
    const mixers = [];
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();

    let profileArea, detailArea, btnArea;

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
                    detailArea.style.bottom = "-100vh";
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
        detailArea = document.querySelector(".detail");
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
                setBack(true);
                detailArea.style.bottom = 0;
                profileArea.style.opacity = 0;
                btnArea.style.opacity = 0;
                column = scene.getObjectByName("column" + parent.name.replace(/[^0-9]/g, ""));

                // 에셋
                gsap.to(parent.children[0].position, {
                    duration: 1,
                    y: 20,
                    ease: "power3.inOut",
                });

                hiddenIndex = dropData
                    .map((e, i) => {
                        return i !== parseInt(parent.name.replace(/[^0-9]/g, "")) && i;
                    })
                    .filter((e) => Number.isInteger(e));

                hiddenIndex.forEach((e) => {
                    // 에셋
                    gsap.to(scene.getObjectByName("drop" + e).children[0].material, {
                        duration: 1,
                        opacity: 0,
                        ease: "power3.inOut",
                    });
                });

                for (let i = 0; i < dropData.length; i++) {
                    // 포디움
                    gsap.to(scene.getObjectByName("column" + i).children[0].material, {
                        duration: 1,
                        opacity: 0,
                        ease: "power3.inOut",
                    });
                }

                for (let i = 1; i <= 5; i++) {
                    // 배경
                    scene.getObjectByName("space" + i) &&
                        gsap.to(scene.getObjectByName("space" + i).children[0].material, {
                            duration: 1,
                            opacity: 0,
                            ease: "power3.inOut",
                        });
                }

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
                    fov: 30,
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

                beforePosition = parent.position.x;
                controls.touches = {
                    ONE: THREE.TOUCH.ROTATE,
                };
                controls.enablePan = false;
                controls.enableRotate = true;
                controls.update();

                maxX = parent.position.x + 50;
                minX = -10;
                maxZ = parent.position.x + 50;
                minZ = -10;
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
        // fbx.load("../../static/3d/gallery/gallery1.fbx", (obj) => {
        //     obj.scale.multiplyScalar(0.3);
        //     obj.position.z = 10;
        //     obj.traverse(function (child) {
        //         if (child.isMesh) {
        //             child.castShadow = true;
        //             child.receiveShadow = true;
        //         }
        //     });
        //     scene.add(obj);
        // });
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
                        obj.scale.multiplyScalar(0.05);
                        obj.position.set(i * 2.5, -0.8, 0);
                        obj.traverse(function (child) {
                            if (child.isMesh) {
                                let colorMap,
                                    bumpMap,
                                    specularMap = null;
                                if (dropData[i].colorMap) colorMap = new THREE.TextureLoader().load(dropData[i].colorMap);
                                if (dropData[i].bumpMap) bumpMap = new THREE.TextureLoader().load(dropData[i].bumpMap);
                                if (dropData[i].specularMap) specularMap = new THREE.TextureLoader().load(dropData[i].specularMap);

                                const material = new THREE.MeshPhongMaterial({
                                    map: colorMap,
                                    bumpMap,
                                    specularMap,
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
        // fbx.load("../../static/3d/275C/275C_LinearSpin.fbx", (obj) => {
        //     obj.scale.multiplyScalar(0.05);
        //     obj.position.set(2.5, 0, 0);
        //     obj.traverse(function (child) {
        //         if (child.isMesh) {
        //             let colorMap,
        //                 bumpMap,
        //                 specularMap = null;
        //             colorMap = new THREE.TextureLoader().load("../../static/3d/275C/D_275C.png");

        //             const material = new THREE.MeshPhongMaterial({
        //                 map: colorMap,
        //                 bumpMap,
        //                 specularMap,
        //             });

        //             child.material = material;
        //             child.castShadow = true;
        //             child.receiveShadow = true;
        //         }
        //     });
        //     obj.name = "drop1";

        //     mixer = new THREE.AnimationMixer(obj);
        //     mixer.clipAction(obj.animations[0]).play();
        //     mixers.push(mixer);

        //     scene.add(obj);
        // });
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
