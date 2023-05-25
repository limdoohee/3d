import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const MisteryBox = ({ dropStatus }) => {
    useEffect(() => {
        let renderer,
            camera = null;
        const scene = new THREE.Scene();
        let mixer = new THREE.AnimationMixer();
        let clock = new THREE.Clock();
        const loader = new FBXLoader();

        init();
        render();

        function init() {
            const canvas = document.getElementById("box");
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
            scene.add(new THREE.AmbientLight(0xffffff, 1));

            loader.load("../../static/3d/CuteBox.fbx", (object) => {
                // before:예정, ing:진행
                if (dropStatus === "before") {
                    object.scale.multiplyScalar(0.1);
                    object.position.x = 20;
                    object.position.y = -50;
                    object.position.z = -30;

                    camera.position.x = 0;
                    camera.position.y = 30;
                    camera.position.z = 150;
                    camera.lookAt(0, 0, 0);
                }

                if (dropStatus === "ing") {
                    object.scale.multiplyScalar(0.2);
                    object.position.x = 0;
                    object.position.y = -30;
                    object.position.z = -40;

                    camera.position.x = -10;
                    camera.position.y = 80;
                    camera.position.z = 160;
                    camera.lookAt(0, 0, 0);
                }

                object.rotation.set(0, Math.PI * 0.15, 0);

                scene.add(object);
                clock = new THREE.Clock();
            });

            // event
            canvas.addEventListener("click", onTouchBox);
            window.addEventListener("resize", onWindowResize);
        }

        function onWindowResize() {
            const aspect = window.innerWidth / window.innerHeight;
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
    }, []);

    return (
        <>
            <canvas id="box"></canvas>
        </>
    );
};

export default MisteryBox;
