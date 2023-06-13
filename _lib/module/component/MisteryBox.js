import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import gsap from "gsap";

const MisteryBox = observer((props) => {
    const { drop } = props.store;

    let renderer1, renderer2;
    let camera;
    const scene1 = new THREE.Scene();
    const scene2 = new THREE.Scene();
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();
    const loader = new FBXLoader();
    const group = new THREE.Group();
    const [curr, setCurr] = useState(); //현재드롭
    const [next, setNext] = useState(); //다음드롭
    // scene1.add(new THREE.GridHelper(20, 20, 0x737373));

    function setSpace() {
        // scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);

        const canvas = document.getElementById("space");
        renderer1 = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer1.setPixelRatio(window.devicePixelRatio);
        renderer1.setSize(window.innerWidth, window.innerHeight);
        renderer1.shadowMap.enabled = true;
        renderer1.shadowMap.type = THREE.PCFSoftShadowMap;
        // document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);
        camera.position.set(0, 4, 10);
        // camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);

        const controls = new MapControls(camera, renderer1.domElement);
        // controls.enablePan = false;
        // controls.enableZoom = false;
        controls.target.set(0, 4, 0);
        controls.update();

        // light
        let light = new THREE.DirectionalLight(0xffffff, 0.4);
        light.position.set(0, 5, 1);
        light.castShadow = true;
        // light.shadow.mapSize.width = 1042;
        // light.shadow.mapSize.height = 1042;
        scene1.add(light);
        // scene.add(new THREE.DirectionalLightHelper(light, 0.5, "red"));
        scene1.add(new THREE.AmbientLight(0xffffff, 0.6));

        const pointLight = new THREE.PointLight(0xffffff, 0.3, 100);
        pointLight.position.set(0, 4, 3);
        // pointLight.castShadow = true;
        scene1.add(pointLight);
        const sphereSize = 1;
        // scene.add(new THREE.PointLightHelper(pointLight, sphereSize, "blue"));

        const geo = new THREE.BoxGeometry(4, 7, 10);
        const mat = new THREE.MeshStandardMaterial({
            color: "#f5f5f5",
            side: THREE.BackSide,
        });
        const space = new THREE.Mesh(geo, mat);
        space.position.y = 3.6;
        space.name = "space";
        scene1.add(space);

        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.1 }));
        shadow.position.y = 0.11;
        shadow.material.transparent = true;
        shadow.receiveShadow = true;
        shadow.rotateX(-Math.PI / 2);
        shadow.name = "shadow";
        scene1.add(shadow);

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

        const intersects = raycaster.intersectObjects(scene1.children);
        if (intersects.length > 0 && drop.data.status === "open") {
            // parentName = intersects[0].object.parent.name;
            const shadow = scene1.getObjectByName("shadow");
            const space = scene1.getObjectByName("space");

            // 데이터에 myDrop true 로 변경될 수 있도록 drop ID랑 mydrop:true 값 보내주기

            if (intersects[0].object.name === "Cover") {
                gsap.to(intersects[0].object.position, {
                    x: -3,
                    ease: "power3.inOut",
                    duration: 1.2,
                });
                console.log(intersects[0].object.parent);
                gsap.to(intersects[0].object.parent, { visible: false, duration: 0.5 });
                gsap.to(intersects[0].object.parent.material, { opacity: 0, duration: 1, ease: "power3.inOut" });
                gsap.to(shadow.material, { opacity: 0, duration: 1 });
                gsap.to(space, { receiveShadow: true, duration: 1, delay: 0.5 });

                loader.load(drop.data.url, (object) => {
                    drop.dataChange("myDrop", true);
                    setCurr(object);
                    object.scale.set(0.15, 0.15, 0.15);
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

                    scene1.add(object);

                    clock = new THREE.Clock();
                });
            }
        }
    }

    function spaceRender() {
        requestAnimationFrame(spaceRender);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer1.render(scene1, camera);
    }

    function setDrop() {
        const canvas = document.getElementById("drop1");
        renderer2 = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer2.setPixelRatio(window.devicePixelRatio);
        renderer2.setSize(window.innerWidth, window.innerHeight);
        renderer2.shadowMap.enabled = true;
        renderer2.shadowMap.type = THREE.PCFSoftShadowMap;

        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(0, 4, 10);

        const controls = new MapControls(camera, renderer2.domElement);
        // controls.enablePan = false;
        // controls.enableZoom = false;
        controls.target.set(0, 4, 0);
        controls.update();

        // light
        let light = new THREE.DirectionalLight(0xffffff, 0.4);
        light.position.set(0, 5, 1);
        light.castShadow = true;
        // light.shadow.mapSize.width = 1042;
        // light.shadow.mapSize.height = 1042;
        scene2.add(light);
        // scene.add(new THREE.DirectionalLightHelper(light, 0.5, "red"));
        // scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        const pointLight = new THREE.PointLight(0xffffff, 0.3, 100);
        pointLight.position.set(0, 4, 3);
        // pointLight.castShadow = true;
        // scene.add(pointLight);
        const sphereSize = 1;
        // scene.add(new THREE.PointLightHelper(pointLight, sphereSize, "blue"));

        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.1 }));
        shadow.position.y = 0.01;
        shadow.material.transparent = true;
        shadow.receiveShadow = true;
        shadow.rotateX(-Math.PI / 2);
        shadow.name = "shadow";
        scene2.add(shadow);

        // event
        window.addEventListener("click", onTouchBox);
        // window.addEventListener("resize", onWindowResize);

        // loader.load("../../static/3d/CuteBox.fbx", (object) => {
        //     object.scale.set(0.006, 0.006, 0.006);
        //     object.position.y = 0;
        //     object.rotation.set(0.4, 0.5, 0);
        //     object.traverse((child) => {
        //         if (child instanceof THREE.Mesh) {
        //             child.material.transparent = true;
        //             child.castShadow = true;
        //         }
        //     });

        //     scene2.add(object);
        // });
    }

    function dropRender() {
        requestAnimationFrame(dropRender);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer2.render(scene2, camera);
    }

    useEffect(() => {
        // space render
        setSpace();
        spaceRender();

        // file render
        // setDrop();
        // dropRender();

        setTimeout(() => {}, 2000);
    }, []);

    useEffect(() => {
        console.log(drop.data.status);
        // 다음 드롭
        loader.load("../../static/3d/CuteBox.fbx", (object) => {
            setNext(object);
            object.scale.set(0.006, 0.006, 0.006);
            object.position.y = 9;
            object.rotation.set(0.4, 0.5, 0);
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material.transparent = true;
                    child.castShadow = true;
                }
            });

            scene1.add(object);
        });
        if (drop.data.status === "close") {
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

            drop.dataChange("status", "next");
        } else {
            if (drop.data.myDrop) {
                // 받은 드롭 파일
                loader.load(drop.data.url, (object) => {
                    setCurr(object);
                    object.scale.set(0.15, 0.15, 0.15);
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

                    scene1.add(object);
                });
            } else {
                console.log("ddd");
                // 미스터리 박스 파일
                loader.load("../../static/3d/CuteBox.fbx", (object) => {
                    setCurr(object);
                    object.scale.set(0.006, 0.006, 0.006);
                    object.position.y = 3;
                    object.rotation.set(0.4, 0.5, 0);
                    object.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.material.transparent = true;
                            child.castShadow = true;
                        }
                    });

                    scene1.add(object);
                });
            }
        }
    }, [drop.data.status]);

    return (
        <>
            <canvas id="space"></canvas>
            {/* <canvas id="drop1"></canvas> */}
        </>
    );
});

export default MisteryBox;