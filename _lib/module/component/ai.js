import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

const Ai = ({ dropStatus }) => {
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
            const canvas = document.getElementById("ai");
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

            renderer.shadowMap.enabled = true;

            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
            camera.position.set(0, 6, 10);

            scene.add(new THREE.AmbientLight(0xffffff, 1));

            loader.load("../../static/3d/StandingGreeting.fbx", (object) => {
                object.scale.multiplyScalar(0.07);
                // object.position.set(0, -15, -10);

                mixer = new THREE.AnimationMixer(object);
                const action = mixer.clipAction(object.animations[0]);
                action.play();

                scene.add(object);
                clock = new THREE.Clock();
            });

            // before:예정, ing:진행
            if (dropStatus === "before") {
                renderer.setSize(window.innerWidth, window.innerHeight * 0.5);
                canvas.style.bottom = `calc(50% - ${window.innerHeight * 0.25}px)`;
                canvas.style.left = "-25px";
            }

            if (dropStatus === "ing") {
                renderer.setSize(100, 100);
            }

            // event
            canvas.addEventListener("touchstart", onTouchAI);
        }

        function onTouchAI() {
            console.log("onTouchAI");
        }

        function animate() {
            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);
        }

        function render() {
            animate();
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
    }, []);

    return (
        <>
            <canvas id="ai"></canvas>
        </>
    );
};

export default Ai;
