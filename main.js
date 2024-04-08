import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import { XRHandModelFactory } from "three/examples/jsm/webxr/XRHandModelFactory.js";
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"; // VRボタンをインポート

console.log(THREE);

const handModelFactory = new XRHandModelFactory();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,0,500);
camera.lookAt(0,0,0);


// レンダラーの追加
const renderer = new THREE.WebGLRenderer({
  alpha: true,
});
// サイズ調整
renderer.setSize(window.innerWidth, window.innerHeight);
// レンダリングしたいDOM要素と紐付け
document.body.appendChild(renderer.domElement);

renderer.xr.enabled = true; // レンダラーのXRを有効化
document.body.appendChild(VRButton.createButton(renderer));

// ジオメトリ作成
const ballGeometry = new THREE.SphereGeometry(100, 64, 32);

// マテリアル作成
const ballMaterial = new THREE.MeshPhysicalMaterial();


// メッシュ化
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);

// scene.add(ballMesh);

// ハンドの追加
const hand = renderer.xr.getHand();
hand.add(handModelFactory.createHandModel(hand));
scene.add(hand);
// controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
// 平行光源の追加
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
// 光の当たる位置調整
directionalLight.position.set(1, 1, 1); 

// AmbientLightを追加
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // カラー、明るさを指定
scene.add(ambientLight);

const loader = new GLTFLoader();
// Await the result instead of using callbacks
// const model = await loader.loadAsync('glb/cup.glb')
loader.load( 'glb/coffee_pot.glb', function ( gltf ) {
  gltf.scene.scale.set(100,100,100);
  gltf.scene.position.set(0,0,0);
  gltf.scene.rotation.z=0.3;
  gltf.scene.traverse(function (child) {
    if (child.isMesh) {
        console.log(child.material); // メッシュのマテリアルをコンソールに表示
    }
});
	scene.add( gltf.scene );
  

}, undefined, function ( error ) {

	console.error( error );

} );
// シーンに追加
scene.add(directionalLight);
scene.add(ambientLight);

const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();