import * as THREE from 'https://unpkg.com/three@0.121.1/build/three.module.js';
import {OrbitControls} from 'https://unpkg.com/three@0.121.1/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/GLTFLoader.js';
import {FBXLoader} from 'https://unpkg.com/three@0.121.1/examples/jsm/loaders/FBXLoader.js';

let scene,camera, renderer, cloudParticles = [], flash, rain, rainGeo, rainCount = 15000,rainDrop,rainMaterial;
    function main() {

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(60,window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 1;
      camera.rotation.x = 1.16;
      camera.rotation.y = -0.12;
      camera.rotation.z = 0.27;

      let ambient = new THREE.AmbientLight(0x555555);
      scene.add(ambient);

      let directionalLight = new THREE.DirectionalLight(0xffeedd);
      directionalLight.position.set(0,0,1);
      scene.add(directionalLight);

      flash = new THREE.PointLight(0xffffff, 30, 500 ,1.7);
      flash.position.set(200,300,100);
      scene.add(flash);

      renderer = new THREE.WebGLRenderer();
      scene.fog = new THREE.FogExp2(0x11111f, 0.002);
      renderer.setClearColor(scene.fog.color);
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      rainGeo = new THREE.Geometry();//For latest releases this wont work
      for(let i=0;i<rainCount;i++) {
        rainDrop = new THREE.Vector3(
          Math.random() * 400 -200,
          Math.random() * 500 - 250,
          Math.random() * 400 - 200
        );
        rainDrop.velocity = {};
        rainDrop.velocity = 0;
        rainGeo.vertices.push(rainDrop);
      }
      rainMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa,
        size: 0.2,
        transparent: true
      });
      rain = new THREE.Points(rainGeo,rainMaterial);
      scene.add(rain);
      let loader = new THREE.TextureLoader();
      loader.load("cloud3.png", function(texture){

        let cloudGeo = new THREE.PlaneBufferGeometry(500,500);
        let cloudMaterial = new THREE.MeshLambertMaterial({
          map: texture,
          transparent: true
        });

        for(let p=0; p<35; p++) {//Increasing this value will increase the number of Clouds and will make it more dense
          let cloud = new THREE.Mesh(cloudGeo,cloudMaterial);
          cloud.position.set(
            Math.random()*800 -400,//If Clouds are made more dense it could be helpful in spreading them for more expanded view and clarity
            500,
            Math.random()*500 - 450
          );
          cloud.rotation.x = 1.16;
          cloud.rotation.y = -0.12;
          cloud.rotation.z = Math.random()*360;
          cloud.material.opacity = 0.6;
          cloudParticles.push(cloud);
          scene.add(cloud);
        }
        animate();
      });
    }
    function animate() {
      cloudParticles.forEach(p => {
        p.rotation.z -=0.002;
      });
      rainGeo.vertices.forEach(p => {
        p.velocity -= 0.1 + Math.random() * 0.1;
        p.y += p.velocity;
        if (p.y < -200) {
          p.y = 200;
          p.velocity = 0;
        }
      });
      rainGeo.verticesNeedUpdate = true;
      rain.rotation.y +=0.002;
      if(Math.random() > 0.93 || flash.power > 100) {//First condition specifies the frequency and second one specifies the Intensity of the Flashlight
        if(flash.power < 100) 
          flash.position.set(
            Math.random()*400,
            300 + Math.random() *200,
            100
          );
        flash.power = 50 + Math.random() * 500;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    main();

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth,window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
   });
