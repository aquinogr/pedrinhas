/* Plantas e 3D dos estudos preliminares; coordenadas compartilhadas em projetos.json. */
(async()=>{
const $=s=>document.querySelector(s), data=window.DADOS_PROJETOS || await (await fetch('assets/revisadas/projetos.json')).json();
let key=new URLSearchParams(location.search).get('projeto')==='patio'?'patio':'edicula', floor='T', scene,renderer,camera,controls,groups,renderPending=false;
const assets={},libraryDir='assets/revisadas/modelos/';
async function readAsset(name){if(window.MODELOS_3D&&window.MODELOS_3D[name])return window.MODELOS_3D[name];let r=await fetch(libraryDir+name);if(!r.ok)throw Error(name+' HTTP '+r.status);return r.text()}
async function prepareAssets(){
 const gltfs=['sofa_02','wooden_table_02','dining_chair_02','modern_arm_chair_01','old_bed_frame','potted_plant_01'];
 const cars=['suv2','carSegmentA'];
 const jobs=gltfs.map(async n=>{const text=await readAsset(n+'.gltf');const model=await new Promise((resolve,reject)=>new THREE.GLTFLoader().parse(text,'',resolve,reject));assets[n]=model.scene});
 for(const n of cars)jobs.push((async()=>{let [obj,mtl]=await Promise.all([readAsset(n+'.obj'),readAsset(n+'.mtl')]);let materials=new THREE.MTLLoader().parse(mtl,'');materials.preload();assets[n]=new THREE.OBJLoader().setMaterials(materials).parse(obj)})());
 const result=await Promise.allSettled(jobs);let failures=result.filter(x=>x.status==='rejected');if(failures.length)console.warn('Modelos indisponíveis:',failures.map(x=>x.reason));
 let status=$('#model-status');if(status)status.textContent=failures.length?`Acervo 3D carregado parcialmente (${jobs.length-failures.length}/${jobs.length}).`:'Móveis e carros detalhados carregados.';if(renderer)build3d();
}
function detailed(group,name,x,z,width,depth,y=0,angle=0){
 if(!assets[name])return false;
 let item=assets[name].clone(true);item.traverse(o=>{if(o.isMesh){o.castShadow=name!=='potted_plant_01'&&name!=='dining_chair_02';o.receiveShadow=true}});
 const bounds=new THREE.Box3().setFromObject(item),size=new THREE.Vector3(),center=new THREE.Vector3();bounds.getSize(size);bounds.getCenter(center);
 if(!size.x||!size.z||!size.y)return false;
 // Centraliza e assenta o modelo no piso, mantendo as proporções originais.
 item.position.set(-center.x,-bounds.min.y,-center.z);const wrapper=new THREE.Group();wrapper.add(item);
 let scale=Math.min(width/size.x,depth/size.z);wrapper.scale.setScalar(scale);wrapper.position.set(x,y,z);wrapper.rotation.y=angle;group.add(wrapper);return true;
}
const colors={bed:'#dfc8a7',office:'#e4d6bd',living:'#efe3cd',bath:'#d3e6e4',service:'#e5e4da',closet:'#ddc9aa',stair:'#c9aa87',varanda:'#dba981',gourmet:'#d5a57f',pavilion:'#d0a07d',pool:'#6ecad4',courtyard:'#b7d39e',deck:'#b58c69',kitchen:'#eee5d3',hall:'#f2eadb',void:'#e0e8d3'};
const S='http://www.w3.org/2000/svg';
function el(tag,attrs={},parent){let n=document.createElementNS(S,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,v);if(parent)parent.appendChild(n);return n}
function txt(parent,x,y,value,size=0.20,opts={}){let t=el('text',{x,y,'font-family':'Arial, sans-serif','font-size':size,'text-anchor':'middle',fill:'#293b31',...opts},parent);t.textContent=value;return t}
function rect(parent,x,y,w,h,fill,extra={}){return el('rect',{x,y,width:w,height:h,fill,...extra},parent)}
function floorplan(){
 let d=data[key], rooms=floor==='T'?d.ground:d.upper, svg=el('svg',{viewBox:'-1 -3.1 14 40.4',role:'img','aria-label':`${d.name}, planta ${floor==='T'?'térrea':'superior'}`});
 let defs=el('defs',{},svg), pat=el('pattern',{id:'deckpat',width:.35,height:.35,patternUnits:'userSpaceOnUse'},defs);rect(pat,0,0,.35,.35,'#d5a57f');el('path',{d:'M0 0 H.35 M0 0 V.35',stroke:'#c08b69','stroke-width':.012},pat);
 rect(svg,-1,-3.1,14,40.4,'#f8f6ef');rect(svg,0,0,12,35,'#c3d6a8',{stroke:'#52684d','stroke-width':.04});rect(svg,0,0,12,5,'#dddcd3');
 txt(svg,6,-1.7,'RUA · ÁREA DE LAZER E RIO ~100 m',.23,{'font-weight':'bold'});txt(svg,6,-.55,'FRENTE ESE 115° · VENTO SE',.19);
 if(floor==='T'){for(let i=0;i<3;i++){rect(svg,1.7+i*2.5,.05,2.5,5,'none',{stroke:'#ffffff','stroke-width':.03,'stroke-dasharray':'.12 .08'});rect(svg,2.05+i*2.5,.75,1.7,3.7,'#a9a99f',{rx:.2,stroke:'#777a76','stroke-width':.025});txt(svg,2.95+i*2.5,4.7,`VAGA ${i+1}`,.15)}}
 for(const c of rooms){if(c.kind==='void')continue;rect(svg,c.x,c.y,c.w,c.h,c.kind==='gourmet'||c.kind==='varanda'?'url(#deckpat)':colors[c.kind],{stroke:'#aaa493','stroke-width':.018});if(c.kind==='pool'){rect(svg,c.x+.08,c.y+.08,c.w-.16,c.h-.16,'#78d1da',{stroke:'#eff9f4','stroke-width':.09});for(let y=c.y+.5;y<c.y+c.h;y+=.6)el('path',{d:`M${c.x+.3} ${y} q .3 -.13 .6 0 t .6 0`,stroke:'#d4f1ee','stroke-width':.025,fill:'none'},svg)} }
 // Paredes e aberturas: intervalo cortado como no modelo 3D.
 for(const wall of d.walls.filter(w=>w.level===floor)){let ops=d.openings.filter(o=>o.level===floor&&o.axis===wall.axis&&Math.abs(o.fixed-wall.fixed)<.005&&o.center+o.width/2>wall.start&&o.center-o.width/2<wall.end).sort((a,b)=>a.center-b.center);let cur=wall.start;for(const o of ops){let a=Math.max(cur,o.center-o.width/2),b=Math.min(wall.end,o.center+o.width/2);lineWall(svg,wall,cur,a);if(o.kind==='window'){let x1=wall.axis==='h'?a:wall.fixed,y1=wall.axis==='h'?wall.fixed:a,x2=wall.axis==='h'?b:wall.fixed,y2=wall.axis==='h'?wall.fixed:b;el('line',{x1,y1,x2,y2,stroke:'#6eacb5','stroke-width':.12},svg)}else{let x=wall.axis==='h'?a:wall.fixed,y=wall.axis==='h'?wall.fixed:a;el('path',{d:wall.axis==='h'?`M${x} ${y} l0 ${Math.min(.8,b-a)} M${x} ${y+.7} Q${x+.7} ${y+.7} ${x+.7} ${y}`:`M${x} ${y} l${Math.min(.8,b-a)} 0 M${x+.7} ${y} Q${x+.7} ${y+.7} ${x} ${y+.7}`,stroke:'#aa876a','stroke-width':.025,fill:'none'},svg)}cur=Math.max(cur,b)}lineWall(svg,wall,cur,wall.end)}
 for(const item of d.furniture.filter(o=>o.level===floor)){let {x,y,w,d:dep,kind}=item;let fc=kind==='bed'?'#f8f5ec':kind==='sofa'?'#a6b6aa':kind==='table'?'#9b7357':kind==='counter'?'#ddd3bf':kind==='wardrobe'?'#bc9c75':'#f6f6f0';rect(svg,x-w/2,y-dep/2,w,dep,fc,{stroke:'#938776','stroke-width':.025,rx:.04});if(kind==='bed')rect(svg,x-w/2+.07,y-dep/2+.07,w-.14,.3,'#fff',{rx:.06});if(kind==='table'){for(let a=0;a<4;a++){let xx=x-w*.38+a*w*.25;rect(svg,xx-.13,y-dep/2-.25,.26,.20,'#be9273',{rx:.04});rect(svg,xx-.13,y+dep/2+.05,.26,.20,'#be9273',{rx:.04})}}}
 let [sx,sy,sw,sh]=d.stair; if(floor==='T'||floor==='S'){rect(svg,sx+.15,sy+.15,sw-.3,sh-.3,'#d5bc9e',{stroke:'#967e61','stroke-width':.03});for(let i=0;i<8;i++){let yy=sy+.25+i*.29;el('line',{x1:sx+.22,y1:yy,x2:sx+sw-.22,y2:yy,stroke:'#a68a6e','stroke-width':.025},svg)}txt(svg,sx+sw/2,sy+3.4,'ESCADA EM U',.17,{'font-weight':'bold'})}
 for(const c of rooms){if(c.kind==='void'||c.kind==='stair'||c.kind==='hall')continue;let words=c.name.split(' '),lines=[],a='';for(const word of words){let z=(a+' '+word).trim();if(z.length>Math.max(12,Math.floor(c.w*8))&&a){lines.push(a);a=word}else a=z}if(a)lines.push(a);let yy=c.y+c.h*.68;lines.forEach((s,i)=>txt(svg,c.x+c.w/2,yy+i*.18,s,c.w<2?.12:.16,{'font-weight':'bold'}));if(c.kind!=='pool'&&c.kind!=='courtyard'&&c.w*c.h>5)txt(svg,c.x+c.w/2,yy+lines.length*.18,`${(c.w*c.h).toFixed(1)} m² brutos`,.125)}
 // Landscape + dimensioning.
 for(const t of [[.7,10],[11.2,24],[.7,31]]){el('circle',{cx:t[0],cy:t[1],r:.65,fill:'#739b63',opacity:.85},svg);el('circle',{cx:t[0]-.25,cy:t[1]-.15,r:.45,fill:'#86ad72',opacity:.8},svg)}
 txt(svg,6,36.0,'12,00 m × 35,00 m · lote de 420 m²',.22,{'font-weight':'bold'});txt(svg,6,36.45,'Recuos adotados como hipótese: 5,00 m frente / 1,50 m laterais e fundos',.16);txt(svg,1.4,1.0,'N ↙',.25,{'font-weight':'bold'});
 let area=$('#plan');area.replaceChildren(svg);$('#plan-label').textContent=(floor==='T'?'Pavimento térreo':'Pavimento superior')+' · toque para ampliar';
}
function lineWall(svg,w,a,b){if(b-a<.01)return;let x1=w.axis==='h'?a:w.fixed,y1=w.axis==='h'?w.fixed:a,x2=w.axis==='h'?b:w.fixed,y2=w.axis==='h'?w.fixed:b;el('line',{x1,y1,x2,y2,stroke:'#51483f','stroke-width':.15,'stroke-linecap':'square'},svg)}

function init3d(){
 scene=new THREE.Scene();scene.background=new THREE.Color('#d9e7e1');camera=new THREE.PerspectiveCamera(43,1,.1,220);camera.position.set(18,21,-13);
 renderer=new THREE.WebGLRenderer({canvas:$('#canvas3d'),antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 controls=new THREE.OrbitControls(camera,renderer.domElement);controls.target.set(6,1,17);controls.enableDamping=false;controls.maxPolarAngle=Math.PI*.48;controls.addEventListener('change',requestRender);controls.update();
 scene.add(new THREE.HemisphereLight(0xffffff,0x6c775e,.65));let sun=new THREE.DirectionalLight(0xffefd7,.8);sun.position.set(-15,35,-5);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:100});scene.add(sun);scene.add(new THREE.AmbientLight(0xffffff,.15));
 new ResizeObserver(resize).observe($('#canvas3d'));build3d();resize();prepareAssets();
}
function requestRender(){if(!renderer||renderPending)return;renderPending=true;requestAnimationFrame(()=>{renderPending=false;renderer.render(scene,camera)})}
function resize(){let c=$('#canvas3d'),w=c.clientWidth,h=c.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();requestRender()}
function mesh(group,w,h,d,x,y,z,color,op=1){let material=color&&color.isMaterial?color:new THREE.MeshStandardMaterial({color,roughness:.85,transparent:op<1,opacity:op});let m=new THREE.Mesh(new THREE.BoxGeometry(Math.max(.001,w),Math.max(.001,h),Math.max(.001,d)),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;group.add(m);return m}
function floorMat(kind,w,d){
 const cv=document.createElement('canvas');cv.width=cv.height=256;let c=cv.getContext('2d'),wood=['bed','office','closet','stair'].includes(kind),tile=['gourmet','varanda','pavilion','deck'].includes(kind),grass=kind==='courtyard';
 c.fillStyle=wood?'#c8ae87':tile?'#c79b7b':grass?'#a4c48f':colors[kind]||'#e8dfcf';c.fillRect(0,0,256,256);
 if(wood){for(let y=0;y<256;y+=26){c.strokeStyle='#9b805d';c.lineWidth=1;c.beginPath();c.moveTo(0,y);c.lineTo(256,y);c.stroke();for(let x=(y%52?65:5);x<256;x+=100){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+26);c.stroke()}}}
 else if(tile){c.strokeStyle='#a7755f';c.lineWidth=2;for(let i=0;i<=256;i+=64){c.beginPath();c.moveTo(i,0);c.lineTo(i,256);c.moveTo(0,i);c.lineTo(256,i);c.stroke()}}
 else if(grass){for(let i=0;i<900;i++){let x=(i*71)%256,y=(i*109)%256;c.fillStyle=i%3?'#97b77f':'#b2cda0';c.fillRect(x,y,2,1)}}
 const tex=new THREE.CanvasTexture(cv);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(Math.max(1,w/2.5),Math.max(1,d/2.5));tex.encoding=THREE.sRGBEncoding;return new THREE.MeshStandardMaterial({map:tex,roughness:1});
}
function build3d(){
 if(groups)Object.values(groups).forEach(g=>scene.remove(g));groups={T:new THREE.Group(),S:new THREE.Group(),roof:new THREE.Group(),site:new THREE.Group()};Object.values(groups).forEach(g=>scene.add(g));let d=data[key];
 mesh(groups.site,12,.15,35,6,-.1,17.5,'#aac794');mesh(groups.site,18,.07,6,6,-.02,-3,'#b9b7a9');mesh(groups.site,12,.03,5,6,.01,2.5,'#d1cfc5');
 for(let i=0;i<3;i++){let x=2.95+i*2.5;if(!detailed(groups.site,['suv2','carSegmentA','suv2'][i],x,2.55,1.9,4.1,.04)){mesh(groups.site,1.75,.52,3.8,x,.3,2.55,['#dad6cb','#929b98','#596969'][i]);mesh(groups.site,1.48,.43,1.9,x,.72,2.5,'#88a9ae')}}
 for(const lv of ['T','S']){let yy=lv==='S'?d.floor:0,group=groups[lv],rooms=lv==='T'?d.ground:d.upper;
  for(const c of rooms){if(c.kind==='void'||(lv==='S'&&c.kind==='stair'))continue;let col=floorMat(c.kind,c.w,c.h);mesh(group,c.w,.08,c.h,c.x+c.w/2,yy+.02,c.y+c.h/2,col);if(c.kind==='pool'){mesh(group,c.w-.16,.03,c.h-.16,c.x+c.w/2,yy+.07,c.y+c.h/2,'#3fb9c9');mesh(group,c.w,.10,.10,c.x+c.w/2,yy+.10,c.y,'#e4d8be');mesh(group,c.w,.10,.10,c.x+c.w/2,yy+.10,c.y+c.h,'#e4d8be');}}
  for(const wall of d.walls.filter(w=>w.level===lv)){let ops=d.openings.filter(o=>o.level===lv&&o.axis===wall.axis&&Math.abs(o.fixed-wall.fixed)<.005&&o.center+o.width/2>wall.start&&o.center-o.width/2<wall.end).sort((a,b)=>a.center-b.center),cur=wall.start;
   const wallbox=(a,b,bottom,top)=>{if(b-a<.01)return;let w=wall.axis==='h'?b-a:.15,dep=wall.axis==='h'?.15:b-a,x=wall.axis==='h'?(a+b)/2:wall.fixed,z=wall.axis==='h'?wall.fixed:(a+b)/2;mesh(group,w,top-bottom,dep,x,yy+(top+bottom)/2,z,'#f3ebd9')};
   for(const o of ops){let a=Math.max(cur,o.center-o.width/2),b=Math.min(wall.end,o.center+o.width/2);wallbox(cur,a,0,2.9);if(o.kind==='window'){wallbox(a,b,0,.95);wallbox(a,b,2.2,2.9);let x=wall.axis==='h'?(a+b)/2:wall.fixed,z=wall.axis==='h'?wall.fixed:(a+b)/2;mesh(group,wall.axis==='h'?b-a:.04,1.25,wall.axis==='h'?.04:b-a,x,yy+1.575,z,'#80bcc6',.55);let frame='#806b54';if(wall.axis==='h'){for(const xx of [a,(a+b)/2,b])mesh(group,.04,1.25,.08,xx,yy+1.575,z,frame);for(const h of [.95,2.2])mesh(group,b-a,.04,.08,x,yy+h,z,frame)}else{for(const zz of [a,(a+b)/2,b])mesh(group,.08,1.25,.04,x,yy+1.575,zz,frame);for(const h of [.95,2.2])mesh(group,.08,.04,b-a,x,yy+h,z,frame)}}else wallbox(a,b,2.1,2.9);cur=Math.max(cur,b)}wallbox(cur,wall.end,0,2.9);
  }
  for(const o of d.furniture.filter(o=>o.level===lv)){let h={bed:.45,wardrobe:1.9,sofa:.75,coffee:.35,table:.75,desk:.75,chair:.8,counter:.9,toilet:.45,sink:.75}[o.kind]||.7,col={bed:'#f4eee3',wardrobe:'#a78665',sofa:'#97aca2',coffee:'#977051',table:'#977051',desk:'#c39c76',chair:'#857565',counter:'#ddd6c4',toilet:'#f6f5ef',sink:'#f6f5ef',grill:'#5b5047'}[o.kind]||'#c9b8a2';let model={sofa:'sofa_02',table:'wooden_table_02',coffee:'wooden_table_02',chair:'modern_arm_chair_01',bed:'old_bed_frame'}[o.kind],has=model&&detailed(group,model,o.x,o.y,o.w,o.d,yy+.08);if(!has)mesh(group,o.w,h,o.d,o.x,yy+h/2+.07,o.y,col);if(o.kind==='bed'){mesh(group,o.w-.12,.22,o.d-.1,o.x,yy+.48,o.y,'#f5f0e7');mesh(group,o.w-.25,.09,.35,o.x,yy+.64,o.y-o.d*.35,'#ffffff')}if(o.kind==='table'&&o.w>2){for(let i=0;i<4;i++)for(const side of [-1,1])detailed(group,'dining_chair_02',o.x-o.w*.35+i*o.w*.23,o.y+side*(o.d/2+.35),.45,.48,yy+.08,side<0?0:Math.PI)}}
 }
 // 17 espelhos: 3,02 / 17 = 17,76 cm; dois lances de 8 e 9 espelhos.
 let [x,z,w,dep]=d.stair,first=key==='patio'?.74:.26,second=key==='patio'?.26:.74;for(let i=0;i<8;i++){let h=(i+1)*d.floor/17;mesh(groups.T,w*.42,h,.28,x+w*first,h/2,z+.14+i*.28,'#b89775')}
 let landing=8*d.floor/17;mesh(groups.T,w-.15,landing,1.60,x+w/2,landing/2,z+3.02,'#b89775');
 for(let i=0;i<8;i++){let h=(i+9)*d.floor/17;mesh(groups.T,w*.42,h,.28,x+w*second,h/2,z+2.10-i*.28,'#b89775')}
 // Cobertura de referência sobre o bloco frontal, desativável para inspecionar.
 let slope=Math.atan2(.85,4.5),roofWidth=Math.hypot(4.5,.85);let rl=mesh(groups.roof,roofWidth,.15,10.6,3.75,6.47,10.5,'#a85f40');rl.rotation.z=slope;let rr=mesh(groups.roof,roofWidth,.15,10.6,8.25,6.47,10.5,'#a85f40');rr.rotation.z=-slope;
 for(const c of d.ground.filter(c=>c.kind==='pavilion'||c.kind==='gourmet')){mesh(groups.roof,c.w+.2,.12,c.h+.2,c.x+c.w/2,2.95,c.y+c.h/2,'#b8815e');for(const dx of [.12,c.w-.12])for(const dz of [.12,c.h-.12])mesh(groups.roof,.12,2.85,.12,c.x+dx,1.43,c.y+dz,'#9d7651')}
 if(key==='patio'){mesh(groups.site,.16,2.6,.16,6,1.3,19,'#8e6d4c');for(const [dx,dy,dz] of [[0,0,0],[.35,.2,.15],[-.35,.3,-.2]]){let leaf=new THREE.Mesh(new THREE.IcosahedronGeometry(.62,2),new THREE.MeshStandardMaterial({color:'#708c5c',roughness:1}));leaf.position.set(6+dx,2.8+dy,19+dz);groups.site.add(leaf)}}
 for(const [x,z] of [[.6,10],[11.3,24],[.7,31],[10.8,31]]){mesh(groups.site,.22,2.6,.22,x,1.3,z,'#8e6d4c');for(const [dx,dy,dz] of [[0,0,0],[.65,.2,.1],[-.55,.3,-.25],[.2,.4,.5]]){let crown=new THREE.Mesh(new THREE.IcosahedronGeometry(.9,2),new THREE.MeshStandardMaterial({color:dx<0?'#78955f':'#648552',roughness:1}));crown.position.set(x+dx,3.1+dy,z+dz);groups.site.add(crown)}}
 detailed(groups.site,'potted_plant_01',9.8,29,.55,.55,.08);
 // Guarda-corpo da varanda frontal, para leitura da fachada em escala.
 mesh(groups.S,8.6,.07,.08,6,d.floor+1.10,5.2,'#715b46');for(let x=1.8;x<10.3;x+=1.05)mesh(groups.S,.045,1.05,.045,x,d.floor+.55,5.2,'#796957');
 setLayers();requestRender();
}
function setLayers(){if(!groups)return;groups.S.visible=$('#levels').value!=='T';groups.roof.visible=$('#roof').checked&&$('#levels').value!=='T';requestRender()}
function update(){floorplan();if(renderer)build3d();$('#title3d').textContent=data[key].name;$('#project').value=key;$('#floor').value=floor}
$('#project').onchange=e=>{key=e.target.value;update()};$('#floor').onchange=e=>{floor=e.target.value;floorplan()};$('#levels').onchange=setLayers;$('#roof').onchange=setLayers;
$('#view-front').onclick=()=>{camera.position.set(10,8,-17);controls.target.set(6,1.5,14);controls.update()};$('#view-aerial').onclick=()=>{camera.position.set(18,21,-13);controls.target.set(6,1,17);controls.update()};$('#view-back').onclick=()=>{camera.position.set(-12,15,49);controls.target.set(6,1,18);controls.update()};
$('#view-leisure').onclick=()=>{let p=data[key].pool,cx=p[0]+p[2]/2,cz=p[1]+p[3]/2;camera.position.set(cx+9,10,cz+12);controls.target.set(cx,1,cz+2);controls.update()};
$('#download-plan').onclick=()=>{let svg=$('#plan svg');if(!svg)return;let file=new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}),url=URL.createObjectURL(file),a=document.createElement('a');a.href=url;a.download=`${key}-${floor==='T'?'terreo':'superior'}.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
$('#project').value=key;$('#title3d').textContent=data[key].name;$('#plan').onclick=()=>$('#plan').classList.toggle('zoom');floorplan();try{init3d();if(new URLSearchParams(location.search).get('vista')==='lazer')$('#view-leisure').click()}catch(err){$('#fallback3d').textContent='Não foi possível iniciar o 3D neste navegador: '+err.message;console.error(err)}
})().catch(e=>{document.querySelector('#fallback3d').textContent='Não foi possível carregar os dados: '+e.message;console.error(e)});
