import * as T from '../three.module.js';
const gold='#d3ae80',sea='#6fa59a',stone='#758982',ivory='#e6d8be';
export class Sculpture{
constructor(canvas,kind='vessel'){this.canvas=canvas;this.kind=kind;this.live=true;try{this.renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'})}catch(e){canvas.replaceWith(Object.assign(document.createElement('div'),{style:'height:100%;display:grid;place-items:center;color:#c9ab82',textContent:'3D недоступно в этом браузере'}));this.live=false;return}this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.6));this.renderer.setClearColor(0x101b1c,0);this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.5;this.scene=new T.Scene();this.camera=new T.PerspectiveCamera(35,1,.1,100);this.camera.position.set(0,0,8);this.scene.add(new T.HemisphereLight(0xf1dfc4,0x28564e,2.8));let l=new T.DirectionalLight(0xffe6bb,4);l.position.set(-3,5,5);this.scene.add(l);l=new T.DirectionalLight(0x77b3a6,3);l.position.set(4,-2,3);this.scene.add(l);this.group=new T.Group();this.scene.add(this.group);this.zoneMeshes=[];this.make(kind);this.resize();this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(canvas);this.animate(0)}
mat(c,metal=.22,rough=.32){return new T.MeshPhysicalMaterial({color:c,metalness:metal,roughness:rough,clearcoat:.8,clearcoatRoughness:.2})}
add(g,m,x=0,y=0,z=0,parent=this.group){let o=new T.Mesh(g,m);o.position.set(x,y,z);parent.add(o);return o}
orb(x,y,z,r,c){return this.add(new T.SphereGeometry(r,40,28),this.mat(c),x,y,z)}
tube(points,r,c){return this.add(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),120,r,12,false),this.mat(c))}
make(k){const M=(c)=>this.mat(c);if(k==='body'){
this.camera.position.set(0,0,9.2);this.group.position.y=-.08;
const skin=this.mat('#b6b9a8',.18,.52),goldMat=this.mat(gold,.5,.24);
const bodypart=(name,geometry,x,y,z=0,scale=[1,1,1],rotation=0)=>{
const o=this.add(geometry,skin.clone(),x,y,z);o.scale.set(...scale);o.rotation.z=rotation;o.userData.zone=name;this.zoneMeshes.push(o);return o};
bodypart('Голова',new T.SphereGeometry(.36,32,24),0,1.78,0,[.85,1.2,.78]);
bodypart('Шея',new T.CylinderGeometry(.17,.2,.38,32),0,1.30,0);
bodypart('Грудь и плечи',new T.SphereGeometry(.65,36,24),0,.79,0,[1.35,.65,.62]);
bodypart('Живот',new T.SphereGeometry(.52,36,24),0,.13,0,[.94,.93,.66]);
bodypart('Поясница и спина',new T.SphereGeometry(.52,36,24),0,.18,-.38,[.93,.98,.38]);
bodypart('Таз',new T.SphereGeometry(.56,36,24),0,-.48,0,[1.05,.55,.68]);
for(const side of [-1,1]){
bodypart(side<0?'Левая рука':'Правая рука',new T.CapsuleGeometry(.19,1.06,8,20),side*.88,.27,0,[1,1,1],side*.17);
bodypart(side<0?'Левая кисть':'Правая кисть',new T.SphereGeometry(.2,24,16),side*1.03,-.56,.02,[.72,1.2,.52]);
bodypart(side<0?'Левое бедро':'Правое бедро',new T.CapsuleGeometry(.28,.84,8,20),side*.34,-1.30,0,[1,1,1],side*.04);
bodypart(side<0?'Левая голень':'Правая голень',new T.CapsuleGeometry(.21,.84,8,20),side*.36,-2.38,.03,[1,1,1]);
}
const halo=this.add(new T.TorusGeometry(2.1,.014,8,120),goldMat,0,-.25,-.8);halo.rotation.y=.4;
this.group.scale.setScalar(.82);
}
else if(k==='hero'){let p=[];for(let i=0;i<=150;i++){let t=i/150,a=t*Math.PI*5;p.push([Math.sin(a)*(.5+t*.9),(t-.5)*3.1,Math.cos(a)*(.5+t*.9)])}this.tube(p,.115,gold);this.orb(0,0,0,.68,sea);this.add(new T.IcosahedronGeometry(.52,2),M(ivory,.65,.18),0,0,0);this.group.scale.setScalar(.88)}
else if(k==='stone'||k==='flow'||k==='restore'||k==='deep'){for(let i=0;i<4;i++){let o=this.add(new T.IcosahedronGeometry(.62-i*.08,3),M([stone,sea,gold,ivory][i],.22,.48),(i-1.5)*.34,(i-1.5)*.46,(i%2)*.2);o.scale.set(1.4,.55,1)}if(k==='flow')this.add(new T.TorusGeometry(1.15,.065,12,100),M(gold)).rotation.x=1.2;if(k==='restore')this.orb(0,1.1,.4,.3,ivory);if(k==='deep')this.add(new T.TorusGeometry(1.0,.13,16,100),M(gold)).rotation.y=.5}
else if(k==='vessel'||k==='oil'||k==='aroma'){let body=this.add(new T.CylinderGeometry(.6,.78,1.6,48,1),M(k==='aroma'?sea:stone,.45,.24));body.scale.z=.7;this.add(new T.CylinderGeometry(.32,.32,.32,32),M(gold,.7,.2),0,.95,0);this.add(new T.CylinderGeometry(.19,.19,.38,32),M(ivory,.7,.12),0,1.28,0);this.add(new T.TorusGeometry(.6,.045,12,80),M(gold),0,-.68,0).rotation.x=Math.PI/2}
else if(k==='sound'){for(let i=0;i<9;i++){let h=.4+1.8*Math.abs(Math.sin(i*.78));this.add(new T.CapsuleGeometry(.085,h,8,12),M(i%2?gold:sea),(i-4)*.29,0,0)}}
else if(k==='light'){this.orb(0,0,0,.85,ivory);for(let i=0;i<3;i++){let ring=this.add(new T.TorusGeometry(1.18+i*.22,.04,12,90),M(i===1?gold:sea));ring.rotation.set(.5+i*.3,i*.4,i*.6)}}
else if(k==='tea'||k==='water'){let cup=this.add(new T.CylinderGeometry(.72,.55,1.15,48,1,true),M(stone,.2,.18));cup.material.side=T.DoubleSide;this.add(new T.CylinderGeometry(.65,.52,.07,48),M(k==='tea'?gold:sea),0,.52,0);this.add(new T.TorusGeometry(.36,.09,12,70),M(ivory),.72,.1,0).rotation.y=Math.PI/2}
else if(k==='warm'){for(let i=0;i<3;i++){let o=this.add(new T.IcosahedronGeometry(.6,3),M([stone,ivory,gold][i]),(i-1)*.52,(i-1)*.48,0);o.scale.set(1.2,.6,.85)}}
else if(k==='eye'){for(let i of [-1,1]){let o=this.orb(i*.47,0,0,.52,ivory);o.scale.set(1,.55,.25)}}
else if(k==='hand'){this.orb(0,0,0,.68,sea);for(let i=0;i<5;i++){let o=this.add(new T.CapsuleGeometry(.11,.45+(i%3)*.12,8,12),M(ivory),(i-2)*.25,.65,0);o.rotation.z=(i-2)*-.12}}
else{this.add(new T.TorusKnotGeometry(.85,.26,150,24,2,3),M(gold))}}
resize(){if(!this.live)return;let w=Math.max(1,this.canvas.clientWidth),h=Math.max(1,this.canvas.clientHeight);this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix()}
animate(t){if(!this.live)return;if(this.kind==='body'){this.group.rotation.y=this.manualRotation||0;this.group.rotation.x=0;this.group.position.y=-.08}else{this.group.rotation.y=t*.00032;this.group.rotation.x=.12+Math.sin(t*.0005)*.13;this.group.position.y=Math.sin(t*.0009)*.07;}this.renderer.render(this.scene,this.camera);this.frame=requestAnimationFrame(x=>this.animate(x))}
enableBodyInteraction(state,mode){if(!this.live||this.kind!=='body')return;this.zoneState=state;this.zoneMode=mode;const ray=new T.Raycaster(),pointer=new T.Vector2();let startX=0,startY=0,drag=false,base=0;const down=e=>{startX=e.clientX;startY=e.clientY;drag=false;base=this.manualRotation||0;this.canvas.setPointerCapture(e.pointerId)};const move=e=>{if(!this.canvas.hasPointerCapture(e.pointerId))return;let dx=e.clientX-startX;if(Math.abs(dx)>6)drag=true;this.manualRotation=base+dx*.009};const up=e=>{if(!drag){let rect=this.canvas.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;ray.setFromCamera(pointer,this.camera);let hit=ray.intersectObjects(this.zoneMeshes,false)[0];if(hit){const name=hit.object.userData.zone;state[name]=state[name]===this.zoneMode.value?null:this.zoneMode.value;this.refreshBody()}}if(this.canvas.hasPointerCapture(e.pointerId))this.canvas.releasePointerCapture(e.pointerId)};this.canvas.addEventListener('pointerdown',down);this.canvas.addEventListener('pointermove',move);this.canvas.addEventListener('pointerup',up);this.canvas.addEventListener('pointercancel',up);this.refreshBody()}
refreshBody(){if(!this.zoneMeshes)return;this.zoneMeshes.forEach(o=>{let v=this.zoneState?.[o.userData.zone];o.material.color.set(v==='focus'?'#d5ad79':v==='avoid'?'#a96b60':'#b6b9a8')})}
destroy(){this.live=false;cancelAnimationFrame(this.frame);this.ro?.disconnect();this.group?.traverse(x=>{x.geometry?.dispose();if(x.material)x.material.dispose()});this.renderer?.dispose()}}
