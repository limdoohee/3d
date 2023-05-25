import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import Ai from "../../_lib/module/component/ai";

import * as THREE from "three";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { MapControls } from "three/addons/controls/MapControls.js";
import { Reflector } from "three/addons/objects/Reflector.js";

const Home = observer((props) => {
    useEffect(() => {
        const scene = new THREE.Scene();
        let camera,
            renderer,
            controls = null;
        const loader = new FBXLoader();
        const group = new THREE.Group();
        var targetRotationX = -0.01;

        var mouseX = 0;
        var mouseXOnMouseDown = 0;

        var windowHalfX = window.innerWidth / 2;

        var slowingFactor = 0.1;
        // let autoRotate = true;

        init();
        ground();
        setCircle();
        setDrop();
        render();

        function init() {
            const canvas = document.getElementById("drop");

            // render hive
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.shadowMap.enabled = true;
            //
            // camera
            camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.01, 10000);
            // camera.position.set(0, 20, 0);
            camera.position.set(0, 8, 11);

            // light
            let light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(-5, 10, -5);
            light.castShadow = true;
            light.shadow.mapSize.width = 1042;
            light.shadow.mapSize.height = 1042;
            scene.add(light);
            scene.add(new THREE.DirectionalLightHelper(light, 1, "red"));

            const mainLight = new THREE.PointLight(0xffffff, 1.5, 250);
            mainLight.position.y = 60;
            scene.add(mainLight);
            const pointLightHelper1 = new THREE.PointLightHelper(mainLight, 10, "red");
            scene.add(pointLightHelper1);

            scene.add(new THREE.AmbientLight(0xaaaaaa, 0.7));

            // controls
            controls = new MapControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.enablePan = false;
            controls.enableZoom = false;
            controls.target.set(22, 0, -2);

            // event
            canvas.addEventListener("touchstart", onDocumentMouseDown);
        }

        let timer;
        function onDocumentMouseDown(event) {
            event.preventDefault();

            // autoRotate = false;
            // if (timer) {
            //     clearTimeout(timer);
            // }
            // timer = setTimeout(() => {
            //     autoRotate = true;
            // }, 3000);

            document.addEventListener("touchmove", onDocumentMouseMove);
            document.addEventListener("touchend", onDocumentMouseUp);
            mouseXOnMouseDown = event.touches[0].clientX - windowHalfX;
        }

        function onDocumentMouseMove(event) {
            mouseX = event.touches[0].clientX - windowHalfX;
            targetRotationX = -(mouseX - mouseXOnMouseDown) * 0.00005;
            // console.log(targetRotationX);
        }

        function onDocumentMouseUp() {
            document.removeEventListener("touchmove", onDocumentMouseMove);
            document.removeEventListener("touchend", onDocumentMouseUp);
            // console.log(group.quaternion.y);
            console.log(group.rotation.y);
        }

        function ground() {
            const geo = new THREE.SphereGeometry(30, 30);
            const mat = new THREE.ShaderMaterial({
                side: THREE.DoubleSide,
                uniforms: {
                    color1: { value: new THREE.Color("white") },
                    color2: { value: new THREE.Color(0xc3cffc) },
                },
                vertexShader: `
                                varying vec2 vUv;
                                void main() {
                                    vUv = uv;
                                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                                }
                            `,
                fragmentShader: `
                                uniform vec3 color1;
                                uniform vec3 color2;
                                varying vec2 vUv;
                                void main() {
                                    gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                                }
                            `,
            });
            const mesh = new THREE.Mesh(geo, mat);
            scene.add(mesh);
        }

        function setCircle() {
            const geometry = new THREE.RingGeometry(14, 18, 70);
            const groundMirror = new Reflector(geometry, {
                clipBias: 0.003,
                textureWidth: window.innerWidth * window.devicePixelRatio,
                textureHeight: window.innerHeight * window.devicePixelRatio,
                color: 0xb5b5b5,
            });
            groundMirror.position.y = 0.06;
            groundMirror.rotateX(-Math.PI / 2);
            scene.add(groundMirror);

            const circleGeo = new THREE.RingGeometry(14, 18, 70);
            const circleMat = new THREE.MeshBasicMaterial({ color: 0xececec });
            const circle = new THREE.Mesh(circleGeo, circleMat);
            circle.position.y = -0.04;
            circle.rotateX(-Math.PI / 2);
            scene.add(circle);

            // let outerR = 18;
            // let innerR = 14;
            // let h = 0.1;
            // let g = cylinderLathe(outerR, innerR, h);
            // let m = new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true, metalness: 0.2, opacity: 0.7, transparent: true });
            // circle = new THREE.Mesh(g, m);
            // circle.receiveShadow = true;
            // circle.castShadow = true;
            // scene.add(circle);
            // function cylinderLathe(R, r, h) {
            //     let halfH = h * 0.5;
            //     let points = [new THREE.Vector2(r, -halfH), new THREE.Vector2(R, -halfH), new THREE.Vector2(R, halfH), new THREE.Vector2(r, halfH), new THREE.Vector2(r, -halfH)];
            //     let circle = new THREE.LatheGeometry(points, 72);

            //     return circle;
            // }
        }

        async function setDrop() {
            function toRadians(degrees) {
                return degrees * (Math.PI / 180);
            }

            // drop
            const radius = 16;
            let dropInGallery = [
                {
                    id: 1,
                    url: "../../static/3d/Tree low.fbx",
                },
                {
                    id: 3,
                    url: "../../static/3d/low-poly-mill.fbx",
                },
                {
                    id: 4,
                    url: "../../static/3d/Tree low.fbx",
                },
            ];

            // 마지막 받은 에셋 index 취득 후, 초기 화면 렌더링 시 마지막 에셋 조회
            for (let i = -dropInGallery.length + 1; i <= 0; i++) {
                console.log(i + dropInGallery.length - 1);
                loader.load(dropInGallery[i + dropInGallery.length - 1].url, (object) => {
                    object.scale.multiplyScalar(0.02);
                    object.position.set(radius * Math.cos(toRadians(i * 12)), 0, radius * Math.sin(toRadians(i * 12)));
                    group.add(object);
                });
            }

            scene.add(group);
        }

        function animate() {
            // if (autoRotate) targetRotationX = 0.0005; // autoRotate Speed
            rotateAroundWorldAxis(group, new THREE.Vector3(0, 1, 0), targetRotationX);
            targetRotationX = targetRotationX * (1 - slowingFactor);
        }

        function render() {
            animate();
            requestAnimationFrame(render);

            controls.update();
            renderer.render(scene, camera);
        }

        function rotateAroundWorldAxis(object, axis, radians) {
            var rotationMatrix = new THREE.Matrix4();

            rotationMatrix.makeRotationAxis(axis.normalize(), radians);
            rotationMatrix.multiply(object.matrix);
            object.matrix = rotationMatrix;
            object.rotation.setFromRotationMatrix(object.matrix);
        }
    }, []);

    return (
        <>
            <div className="userInfo">
                <button
                    onClick={() => {
                        console.log("userInfo Button click");
                    }}
                >
                    button test
                </button>
            </div>
            <canvas id="drop"></canvas>
            <Ai></Ai>
        </>
    );
});

export default Home;
