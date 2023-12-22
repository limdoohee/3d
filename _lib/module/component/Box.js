import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { ArcballControls } from "three/addons/controls/ArcballControls.js";

import DDS from "../../component/dds";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import gsap from "gsap";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import styles from "./box.module.css";

const Box = observer((props) => {
    let renderer, controls;
    let camera;
    const scene = new THREE.Scene();
    let mixer = new THREE.AnimationMixer();
    let clock = new THREE.Clock();
    const loader = new GLTFLoader();

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
        camera.position.set(5, 4, 10);

        controls = new OrbitControls(camera, renderer.domElement);
        // controls.autoRotate = true;
        controls.autoRotateSpeed = -0.75;
        controls.enableDamping = true;
        controls.minDistance = 5;
        controls.maxDistance = 10;
        controls.target.set(0, 0.1, 0);
        controls.update();

        // controls.addEventListener("change", function () {
        //     renderer.render(scene, camera);
        // });

        // DirectionalLight
        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(-3, 5, 3);
        light.castShadow = true;
        light.shadow.mapSize.width = 1042;
        light.shadow.mapSize.height = 1042;
        scene.add(light);
        // scene.add(new THREE.DirectionalLightHelper(light, 0.5, "red"));
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));

        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.1 }));
        shadow.position.y = -1;
        shadow.position.z = 2;
        shadow.material.transparent = true;
        shadow.receiveShadow = true;
        shadow.rotateX(-Math.PI / 2);
        shadow.name = "shadow";
        scene.add(shadow);

        const ground = new THREE.Mesh(new THREE.CircleGeometry(8, 100), new THREE.MeshBasicMaterial({ color: 0xeeeeee }));
        ground.position.y = -1.1;
        ground.rotateX(-Math.PI / 2);
        scene.add(ground);

        const a = loader.load(
            "../../static/3d/dropBox/dropbox__locked_shaking.glb",
            function (gltf) {
                console.log(gltf);
                model = gltf.scene;
                model.scale.set(30, 30, 30);
                // model.rotation.set(0.2, -0.5, 0);
                model.position.y = -1;
                // model.position.z = 3;

                mixer = new THREE.AnimationMixer(model);

                mixer.clipAction(gltf.animations[0]).play();

                model.traverse(function (object) {
                    if (object.isMesh) object.castShadow = true;
                });
                scene.add(model);

                loader.load("../../static/3d/dropBox/dropbox_open2disappear.glb", (gltf) => {
                    model = gltf.scene;
                    model.position.y = 2;
                    model.position.z = 3;

                    const animationAction = mixer.clipAction(gltf.animations[0]);
                    animationActions.push(animationAction);
                    // mixer.clipAction(gltf.animations[0]).play();
                    activeAction = animationActions[0];
                });
            },
            undefined,
            // called when loading has errors
            function (error) {
                console.log("An error happened");
            },
        );
    }

    function spaceRender() {
        requestAnimationFrame(spaceRender);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        controls.update();

        renderer.render(scene, camera);
    }

    useEffect(() => {
        setSpace();
        spaceRender();
    }, []);

    const boxClickHandler = () => {
        console.log("click");
    };

    return (
        <>
            <canvas id="space" className=""></canvas>
            <button className={styles.button} onClick={boxClickHandler}>
                상자열기
            </button>
        </>
    );
});

export default Box;
