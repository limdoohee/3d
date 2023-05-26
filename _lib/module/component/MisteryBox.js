import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const MisteryBox = ({ dropStatus }) => {
    let renderer;
    let camera;
    const scene = new THREE.Scene();
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();
    const loader = new FBXLoader();
    const group = new THREE.Group();

    function init() {
        console.log("init");
        const canvas = document.getElementById("box");
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
        scene.add(new THREE.AmbientLight(0xffffff, 1));

        loader.load("../../static/3d/CuteBox.fbx", (object) => {
            // before:예정, ing:진행
            // if (dropStatus === "before") {
            //     object.scale.multiplyScalar(0.015);
            //     object.position.x = 3;
            //     object.position.y = -18;
            //     object.position.z = -30;
            // }

            // if (dropStatus === "ing") {
            //     object.scale.multiplyScalar(0.04);
            //     object.position.x = 0;
            //     object.position.y = -20;
            //     object.position.z = -45;
            // }

            // group.scale.multiplyScalar(0.015);
            // group.position.x = 3;
            // group.position.y = -18;
            // group.position.z = -30;

            object.rotation.set(0, Math.PI * 0.15, 0);

            group.add(object);
            scene.add(group);
            clock = new THREE.Clock();
        });

        // event
        canvas.addEventListener("click", onTouchBox);
        // window.addEventListener("click", test);
        window.addEventListener("resize", onWindowResize);
    }

    function test() {
        // group.scale.set(0.04, 0.04, 0.04);
        // group.position.x = 0;
        // group.position.y = -20;
        // group.position.z = -45;
    }

    function moveBox(status) {
        // before:예정, ing:진행
        if (status === "before") {
            group.scale.multiplyScalar(0.015);
            group.position.x = 3;
            group.position.y = -18;
            group.position.z = -30;
        }

        if (status === "ing") {
            console.log(status);
            group.scale.set(0.04, 0.04, 0.04);
            group.position.x = 0;
            group.position.y = -20;
            group.position.z = -45;
        }
    }

    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onTouchBox(event) {
        let parentName;
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);

        const intersects = raycaster.intersectObjects(scene.children);
        // console.log(intersects);
        // console.log(scene.children, intersects, intersects[0]);
        if (intersects.length > 0) {
            parentName = intersects[0].object.parent.name;
            if (intersects[0].object.name === "Cover") console.log("box");
        }
    }

    function animate() {
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
    }

    function render() {
        // animate();

        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    useEffect(() => {
        init();
        render();
    }, []);

    useEffect(() => {
        const canvas = document.getElementById("box");
        console.log(dropStatus);
        if (dropStatus === "before") {
            group.scale.multiplyScalar(0.015);
            group.position.x = 3;
            group.position.y = -18;
            group.position.z = -30;
        } else {
            test();
            // setTimeout(() => {
            //     console.log("실행");
            //     group.scale.set(0.04, 0.04, 0.04);
            //     group.position.x = 0;
            //     group.position.y = -20;
            //     group.position.z = -45;
            // }, 1000);
            canvas.style.left = "10px";
        }
    }, [dropStatus]);

    return (
        <>
            <canvas id="box"></canvas>
        </>
    );
};

export default MisteryBox;
