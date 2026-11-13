/* Novo estudo: coordenadas compartilhadas, cobertura por volume e rotas auditáveis. */
(async()=>{
const $=s=>document.querySelector(s),D=window.PROJETOS||await(await fetch('assets/recomeco/projetos.json')).json(),params=new URLSearchParams(location.search);
let key=D[params.get('projeto')]?params.get('projeto'):(window.DEFAULT_PROJECT||'edicula'),mode='exterior',scene,renderer,camera,controls,building,queued=false;
const models={},old='assets/revisadas/',colors={bed:'#d9c5a5',office:'#ddd0b4',bath:'#ccdedb',wc:'#ccdedb',closet:'#d6c09e',vest:'#e9dfcb',living:'#e9dfcb',kitchen:'#e9dfcb',gourmet:'#d8b89b',porch:'#d8b89b',hall:'#eee4d2',stair:'#c8ab87',pavilion:'#d8b89b',support:'#d8b89b',service:'#dce0d5',court:'#b0c698'};
const ns='http://www.w3.org/2000/svg';
function e(tag,a={},parent){let n=document.createElementNS(ns,tag);for(let[k,v]of Object.entries(a))n.setAttribute(k,v);if(parent)parent.appendChild(n);return n}
function text(g,x,y,s,size=.18,a={}){let n=e('text',{x,y,'font-size':size,'font-family':'Arial,sans-serif',fill:'#263c32','text-anchor':'middle',...a},g);n.textContent=s;return n}
function rect(g,x,y,w,h,fill,a={}){return e('rect',{x,y,width:w,height:h,fill,...a},g)}
function path(g,d,color,width=.03,a={}){return e('path',{d,stroke:color,'stroke-width':width,fill:'none',...a},g)}
function cuts(w,p){return p.openings.filter(o=>o.level===w.level&&o.axis===w.axis&&Math.abs(o.fixed-w.fixed)<.001&&o.center>w.start&&o.center<w.end).sort((a,b)=>a.center-b.center)}
function wallLine(g,w,a,b){if(b-a<.005)return;path(g,w.axis==='h'?`M${a} ${w.fixed}H${b}`:`M${w.fixed} ${a}V${b}`,'#3c433b',.15)}
function plan(lv){
 const p=D[key],svg=e('svg',{viewBox:'-1.1 -3.2 14.3 40.5',role:'img','aria-label':p.name+' '+(lv==='T'?'térreo':'superior')});
 const defs=e('defs',{},svg),pat=e('pattern',{id:'tiles'+lv,width:.6,height:.6,patternUnits:'userSpaceOnUse'},defs);rect(pat,0,0,.6,.6,'#d9bda0');path(pat,'M0 .6V0H.6','#b99676',.012);
 const marker=e('marker',{id:'arrow'+lv,viewBox:'0 0 10 10',refX:8,refY:5,markerWidth:4,markerHeight:4,orient:'auto-start-reverse'},defs);e('path',{d:'M0 0L10 5L0 10Z',fill:'#087e8b'},marker);
 rect(svg,-1.1,-3.2,14.3,40.5,'#f8f5ec');rect(svg,0,0,12,35,'#c4d3b4',{stroke:'#526748','stroke-width':.04});
 text(svg,6,-2.3,p.name,.32,{'font-weight':'bold'});text(svg,6,-1.72,lv==='T'?'PAVIMENTO TÉRREO':'PAVIMENTO SUPERIOR',.22);text(svg,6,-.75,'RUA · LAZER DO CONDOMÍNIO · RIO ~100 m',.19);text(svg,6,-.35,'Frente ESE 115° · vento SE 135°',.16);
 rect(svg,1.5,5,9,28.5,'none',{stroke:'#7e8974','stroke-width':.025,'stroke-dasharray':'.15 .12'});
 if(lv==='S'){let ghost=e('g',{opacity:.13},svg);for(const c of p.rooms.filter(c=>c.level==='T'))rect(ghost,c.x,c.y,c.w,c.h,colors[c.kind]||'#d5d0bc',{stroke:'#5f705d','stroke-width':.04});let q=p.pool;rect(ghost,q.x,q.y,q.w,q.h,'#399ba9');text(svg,6,34,'Implantação do térreo em projeção',.17);}
 if(lv==='T'){
  for(const r of [...p.hardscape,...p.parkingTracks])rect(svg,r.x,r.y,r.w,r.h,'#dedac9');
  for(const m of (p.boundaryWalls||[]))rect(svg,m.x,m.y,m.w,m.h,'#5d584d');if(p.boundaryWalls)text(svg,6,36.05,'Muro de divisa h = 2,50 m nas laterais e no fundo',.17);
  for(let i=0;i<3;i++){let x=1.65+2.5*i;rect(svg,x,0,2.5,5,'none',{stroke:'#7b896f','stroke-width':.025,'stroke-dasharray':'.12 .10'});rect(svg,x+.325,.025,1.85,4.1,['#dfded6','#91a5a3','#657774'][i],{rx:.28,stroke:'#59665a','stroke-width':.035});rect(svg,x+.48,1.1,1.54,1.5,'#68888c',{rx:.12});text(svg,x+1.25,4.84,'2,50 × 5,00',.14)}
  let q=p.pool;rect(svg,q.x-.15,q.y-.15,q.w+.3,q.h+.3,'#f0e2ca');rect(svg,q.x,q.y,q.w,q.h,'#75bec5',{stroke:'#368b94','stroke-width':.03});for(let y=q.y+.3;y<q.y+q.h;y+=.45)path(svg,`M${q.x+.18} ${y}q.35 -.13 .7 0t.7 0t.7 0`,'#bfe6e4',.02);text(svg,q.x+q.w/2,q.y+q.h*.45,'PISCINA',.18,{'font-weight':'bold'});text(svg,q.x+q.w/2,q.y+q.h*.45+.35,q.w.toFixed(2)+' × '+q.h.toFixed(2)+' m',.17);
 }
 for(const c of p.rooms.filter(c=>c.level===lv&&!['stair','court'].includes(c.kind)))rect(svg,c.x,c.y,c.w,c.h,['porch','gourmet','pavilion'].includes(c.kind)?'url(#tiles'+lv+')':colors[c.kind],{stroke:'#a4a58f','stroke-width':.01});
 for(const w of p.walls.filter(w=>w.level===lv)){
  let cur=w.start;for(const o of cuts(w,p)){let a=o.center-o.width/2,b=o.center+o.width/2;wallLine(svg,w,cur,a);cur=b;
   const x=w.axis==='h'?o.center:w.fixed,y=w.axis==='h'?w.fixed:o.center;
   if(o.kind==='window'){path(svg,w.axis==='h'?`M${a} ${y}H${b}`:`M${x} ${a}V${b}`,'#72a6af',.10);}
   else if(o.kind==='door'){let hinge=o.hingeEnd?b:a,tip=o.hingeEnd?a:b,sign=o.inward||1;
    if(w.axis==='h')path(svg,`M${hinge} ${y}v${sign*o.width}M${hinge} ${y+sign*o.width}Q${tip} ${y+sign*o.width} ${tip} ${y}`,'#9e7952',.022);
    else path(svg,`M${x} ${hinge}h${sign*o.width}M${x+sign*o.width} ${hinge}Q${x+sign*o.width} ${tip} ${x} ${tip}`,'#9e7952',.022);
   }
   else if(o.kind==='slide'){for(let start of [a,b-o.width/4])for(let off of [-.03,.03])path(svg,w.axis==='h'?`M${start} ${y+off}h${o.width/4}`:`M${x+off} ${start}v${o.width/4}`,'#9b7451',.025);}
  }wallLine(svg,w,cur,w.end);
 }
 for(const f of p.windowLeaves.filter(f=>f.level===lv))path(svg,`M${f.hinge.join(' ')}L${f.tip.join(' ')}`,'#378e9b',.045);
 for(const c of p.columns.filter(c=>c.level===lv))rect(svg,c.x-c.w/2,c.y-c.d/2,c.w,c.d,'#72573b');
 if(lv==='S')path(svg,'M1.65 7.35V5.15H10.35V7.35','#766248',.04);
 for(const f of p.furniture.filter(f=>f.level===lv)){
  let g=e('g',{transform:`translate(${f.x},${f.y}) rotate(${f.angle})`},svg),col={bed:'#faf7ed',sofa:'#92a69a',table:'#a98560',coffee:'#ad8c67',wardrobe:'#bba27b',counter:'#a7aaa0',grill:'#5b6258',shower:'#b8d7d6',tv:'#58655c'}[f.kind]||'#f3f0e6';
  rect(g,-f.w/2,-f.d/2,f.w,f.d,col,{rx:.04,stroke:'#8f8c78','stroke-width':.025});
  if(f.kind==='bed'){rect(g,-f.w/2+.07,-f.d/2+.07,f.w-.14,.35,'#fff',{rx:.07});rect(g,-f.w/2+.05,-.1,f.w-.1,.75,'#b5c2ad');}
  if(f.kind==='toilet')e('ellipse',{cx:0,cy:.06,rx:.14,ry:.21,fill:'#fff',stroke:'#a2afa5','stroke-width':.02},g);
  if(f.kind==='shower')path(g,`M${-f.w/2} ${-f.d/2}L${f.w/2} ${f.d/2}M${f.w/2} ${-f.d/2}L${-f.w/2} ${f.d/2}`,'#7dacab',.02);
  if(f.sink||f.kind==='sink'){let sx=f.sinkOffset||0;rect(g,sx-Math.min(.48,f.w-.1)/2,-.18,Math.min(.48,f.w-.1),.36,'#778d89',{rx:.04});}
  if(f.cooktop){rect(g,-.26,-.20,.52,.40,'#394a41');for(let xx of [-.13,.13])for(let yy of [-.1,.1])e('circle',{cx:xx,cy:yy,r:.065,fill:'none',stroke:'#b4b9a6','stroke-width':.015},g);}
  if(f.kind==='grill')for(let yy=-.16;yy<.18;yy+=.06)path(g,`M${-f.w/2+.06} ${yy}h${f.w-.12}`,'#c6c9b5',.018);
 }
 const s=p.stair,x=s.x+.075,y=s.y+.075;rect(svg,x,y,2.45,3.5,'#d5bc98');rect(svg,x+1.1,y,.25,2.24,'#f8f5ec');for(let i=0;i<9;i++){let z=y+i*.28;path(svg,`M${x} ${z}h1.1M${x+1.35} ${z}h1.1`,'#917857',.025)}path(svg,`M${x} ${y+2.24}h2.45`,'#917857',.03);
 const a=s.mirror?x+1.9:x+.55,b=s.mirror?x+.55:x+1.9;path(svg,`M${a} ${y+.2}V${y+2.8}H${b}V${y+.2}`,'#087e8b',.045,{'marker-end':'url(#arrow'+lv+')'});text(svg,x+1.225,y+3.2,'18 × 17,5 cm',.16);text(svg,x+1.225,y+3.43,'pisos 28 cm · U',.13);
 for(const c of p.rooms.filter(c=>c.level===lv&&!['stair','hall','vest'].includes(c.kind))){let max=c.w<2?12:Math.floor(c.w*7),words=c.name.split(' '),lines=[],line='';for(let word of words){if((line+' '+word).length>max&&line){lines.push(line);line=word}else line=(line+' '+word).trim()}if(line)lines.push(line);let small=['bath','wc'].includes(c.kind),yy=small?c.y+.54:c.y+c.h*.68,xx=small&&c.kind==='bath'?c.x+c.w*.64:c.x+c.w/2;lines.forEach((v,i)=>text(svg,xx,yy+i*.18,v,small?.12:c.w<2?.125:.17,{'font-weight':'bold','paint-order':'stroke',stroke:'#f9f6ec','stroke-width':.045}));text(svg,xx,yy+lines.length*.18,c.area.toFixed(2).replace('.',',')+' m²',.125,{'paint-order':'stroke',stroke:'#f9f6ec','stroke-width':.045});}
 if(lv==='T'){
  for(const [tx,ty]of p.trees){e('circle',{cx:tx,cy:ty,r:.65,fill:'#7d9b68',opacity:.8},svg);e('circle',{cx:tx-.17,cy:ty-.16,r:.43,fill:'#92ad7b',opacity:.8},svg)}
  path(svg,`M${key==='jardim'?1.5:6.1} 35H10.5`,'#ba6841',.07);text(svg,key==='jardim'?6:8.3,35.35,'DIVISA CEGA · IMPLANTAÇÃO CONDICIONADA',.12,{fill:'#9a4d2e'});
  if($('#routes').checked)for(const r of p.routes)path(svg,r.points.map((v,i)=>(i?'L':'M')+v.join(' ')).join(' '),r.color,.065,{'stroke-dasharray':'.13 .11','marker-end':'url(#arrow'+lv+')'});
 }
 // Norte: a direção exterior da frente é azimute 115°, logo N aponta para esquerda/baixo.
 path(svg,'M.95 3.2L.24 3.53','#283f31',.045);text(svg,.32,3.9,'N',.23,{'font-weight':'bold'});
 path(svg,'M-.5 0V35M-.65 0h.3M-.65 35h.3','#626b59',.025);text(svg,-.65,17.5,'35,00 m',.17,{transform:'rotate(-90 -.65 17.5)'});
 path(svg,'M0 35.65H12M0 35.5v.3M12 35.5v.3','#626b59',.025);text(svg,6,36,'12,00 m',.19);
 for(let i=0;i<5;i++)rect(svg,3.5+i,36.5,1,.13,i%2?'#f8f5ec':'#374e3e',{stroke:'#374e3e','stroke-width':.015});text(svg,3.5,36.95,'0',.13);text(svg,8.5,36.95,'5 m',.13);
 return svg;
}
function showPlans(){for(const lv of ['T','S'])$('#plan'+lv).replaceChildren(plan(lv));$('#leisure').textContent=key==='edicula'?'Lazer revisado: piscina lateral de 2,50 × 5,00 m, quiosque de 4,00 × 4,10 m e mesa de 2,50 m para oito pessoas. O apoio e o lavabo foram levados ao fundo, liberando a área da mesa. O lavabo abre para o percurso lateral; lavanderia e depósito passaram para a frente.':'Lazer revisado: piscina de 2,50 × 5,00 m ao lado do quiosque, mesa de 2,60 m para oito pessoas e faixa de 1,20 m junto à piscina. Apoio e lavabo ocupam os fundos; um acesso pela lateral da piscina leva ao apoio e ao anteparo do lavabo, sem atravessar os ambientes íntimos.';
 const third=key==='jardim';$('#third-notes').hidden=!third;const pt=$('#plantas-text'),rs=$('#rooms-summary');if(pt){pt.dataset.base??=pt.textContent;pt.textContent=third?'Os quartos 1 e 2 compartilham um banheiro reversível com janela exterior (acesso direto pelo quarto 1 e pelo hall para o quarto 2); o quarto 3 é suíte. No superior, a master tem closet e banheiro; a quinta suíte também tem banheiro próprio. Áreas dos ambientes fechados descontam 15 cm das dimensões entre eixos. Toque na planta para ampliar.':pt.dataset.base}if(rs){rs.dataset.base??=rs.textContent;rs.textContent=third?'3 suítes, 2 quartos com banho reversível e lavabo externo':rs.dataset.base}
 if(third){$('#description').textContent='Três quartos térreos em paralelo: os quartos 1 e 2 usam um banho reversível com janela exterior; o quarto 3 mantém banheiro privativo. O quarto 1 tem acesso direto ao banho e o quarto 2 chega pelo hall, sem atravessar outro dormitório. O antigo banheiro interno virou closet do quarto 2. Entrada lateral, área social posterior, duas suítes superiores e telhado de quatro águas preservados.';$('#leisure').textContent='A piscina transversal mede 5,00 × 2,50 m. Entre sua borda de água e o quiosque há 2,10 m; a mesa externa de 2,80 m recebe oito pessoas. Apoio, lavanderia, depósito e lavabo ficam no anexo cego dos fundos. Acesso ao lazer também pela lateral, sem passar pelos quartos.';}
}
function section(){const s=e('svg',{viewBox:'0 0 900 330',role:'img','aria-label':'Corte desenvolvido da escada e patamar'});rect(s,0,0,900,330,'#f8f5ec');const scale=62,base=275,x=95;path(s,`M${x-45} ${base}H${x}M${x+8*.28*scale} ${base-1.575*scale}h${1.1*scale}M${x+2*8*.28*scale+1.1*scale} ${base-3.15*scale}h120`,'#384c3d',4);let d=`M${x} ${base}`;for(let i=0;i<8;i++)d+=`v${-.175*scale}h${.28*scale}`;d+=`v${-.175*scale}h${1.1*scale}`;for(let i=0;i<8;i++)d+=`v${-.175*scale}h${.28*scale}`;d+=`v${-.175*scale}h70`;path(s,d,'#997453',3);text(s,450,25,'CORTE DESENVOLVIDO · OS DOIS LANCES ESTÃO ABERTOS NO MESMO PLANO',12);text(s,425,60,'18 espelhos × 17,5 cm = 3,15 m  |  2 × 17,5 + 28 = 63 cm',15);text(s,207,304,'1º lance: 9 espelhos',13);text(s,440,304,'2º lance: 9 espelhos',13);text(s,325,161,'Patamar 1,10 m',12);text(s,715,109,'Hall livre 1,55 m',13);text(s,715,137,'Chegada sem parede frontal',13);text(s,715,165,'Vão de laje: 2,45 × 3,50 m',13);text(s,715,193,'Lances úteis: 1,10 m',13);text(s,715,221,'Guarda-corpo: 1,10 m',13);text(s,715,250,'Pé-direito superior: 2,95 m',13);return s;}
function materials(color,opacity=1){return new THREE.MeshStandardMaterial({color,roughness:.78,metalness:0,transparent:opacity<1,opacity,side:THREE.DoubleSide})}
function box(g,w,h,d,x,y,z,col){let m=new THREE.Mesh(new THREE.BoxGeometry(Math.max(.001,w),Math.max(.001,h),Math.max(.001,d)),col.isMaterial?col:materials(col));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function model(g,name,x,z,w,d,y=0,angle=0,height=null){if(!models[name])return false;let item=models[name].clone(true),bound=new THREE.Box3().setFromObject(item),sz=new THREE.Vector3(),ct=new THREE.Vector3();bound.getSize(sz);bound.getCenter(ct);item.position.set(-ct.x,-bound.min.y,-ct.z);let wrap=new THREE.Group();wrap.add(item);if(height)wrap.scale.set(w/sz.x,height/sz.y,d/sz.z);else wrap.scale.setScalar(Math.min(w/sz.x,d/sz.z));wrap.rotation.y=angle;wrap.position.set(x,y,z);wrap.traverse(m=>{if(m.isMesh){m.receiveShadow=true;m.castShadow=name!=='potted_plant_01'}});g.add(wrap);return true;}
function tile(kind,w,d){let c=document.createElement('canvas');c.width=c.height=256;let a=c.getContext('2d'),wood=['bed','closet','office'].includes(kind);a.fillStyle=colors[kind]||'#d9cbb2';a.fillRect(0,0,256,256);a.strokeStyle=wood?'#bca685':'#c3b494';a.lineWidth=.6;for(let i=0;i<256;i+=wood?32:64){a.beginPath();a.moveTo(0,i);a.lineTo(256,i);a.stroke();if(!wood){a.beginPath();a.moveTo(i,0);a.lineTo(i,256);a.stroke()}}let tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.repeat.set(w/2,d/2);tex.encoding=THREE.sRGBEncoding;return new THREE.MeshStandardMaterial({map:tex,roughness:.9});}
function rail(g,x1,z1,x2,z2,base,height=1.1){let len=Math.hypot(x2-x1,z2-z1);for(let i=0;i<=Math.ceil(len/.12);i++){let f=i/Math.ceil(len/.12);box(g,.025,height,.025,x1+(x2-x1)*f,base+height/2,z1+(z2-z1)*f,'#705d45')}let b=box(g,len,.045,.045,(x1+x2)/2,base+height,(z1+z2)/2,'#705d45');b.rotation.y=-Math.atan2(z2-z1,x2-x1);}
function bar(g,a,b,r=.023){let va=new THREE.Vector3(...a),vb=new THREE.Vector3(...b),delta=vb.clone().sub(va),m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,delta.length(),8),materials('#705d45'));m.position.copy(va.clone().add(vb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());g.add(m);}
function hipRoof(g,r){
 const q=Math.min(r.w/2,r.d/2),v=[[r.x,r.base,r.y],[r.x+r.w,r.base,r.y],[r.x+r.w,r.base,r.y+r.d],[r.x,r.base,r.y+r.d],[r.x+r.w/2,r.base+r.rise,r.y+q],[r.x+r.w/2,r.base+r.rise,r.y+r.d-q]],faces=[[0,1,4],[1,2,5],[1,5,4],[2,3,5],[3,0,4],[3,4,5]],pos=[],uv=[];
 for(const face of faces)for(const i of face){pos.push(...v[i]);uv.push((v[i][0]-r.x)/.35,(v[i][2]-r.y)/.28)}
 const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const ctx=canvas.getContext('2d');ctx.fillStyle='#ac7351';ctx.fillRect(0,0,64,64);ctx.strokeStyle='#8e593e';ctx.lineWidth=2;ctx.strokeRect(1,1,62,62);ctx.beginPath();ctx.moveTo(10,0);ctx.quadraticCurveTo(26,36,10,64);ctx.stroke();const tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.encoding=THREE.sRGBEncoding;
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:tex,roughness:.9,side:THREE.DoubleSide}));mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);
 box(g,r.w,.16,r.d,r.x+r.w/2,r.base-.08,r.y+r.d/2,'#ede2cb');
 for(const xx of [r.x,r.x+r.w]){box(g,.12,.09,r.d,xx,r.base,r.y+r.d/2,'#777d6c');box(g,.085,r.base,.085,xx,r.base/2,r.y+r.d-.12,'#777d6c')}
 for(const zz of [r.y,r.y+r.d])box(g,r.w,.09,.12,r.x+r.w/2,r.base,zz,'#777d6c');
}
function roofing(g,r,idx){if(r.hip){hipRoof(g,r);return}let points=[],us=r.gable?[0,.5,1]:[0,1],h=(u,v)=>r.base+r.rise*(r.gable?1-Math.abs(2*u-1):r.reverse?(r.axis==='x'?u:v):1-(r.axis==='x'?u:v));for(let i=0;i<us.length-1;i++){let a=us[i],b=us[i+1];for(const uv of [[a,0],[a,1],[b,1],[a,0],[b,1],[b,0]])points.push(r.x+uv[0]*r.w,h(...uv),r.y+uv[1]*r.d)}let geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geo.computeVertexNormals();let m=new THREE.Mesh(geo,materials(key==='edicula'?'#aa7152':'#d8d5c5'));m.castShadow=true;m.receiveShadow=true;g.add(m);
 // Forro/fechamento contínuo: nenhuma cobertura flutua acima do volume.
 box(g,r.w,.16,r.d,r.x+r.w/2,r.base-.08,r.y+r.d/2,'#eee3cc');
 for(let z=r.y+.12;z<r.y+r.d;z+=r.gable?.28:.65){for(let i=0;i<us.length-1;i++){let a=us[i],b=us[i+1],aH=h(a,(z-r.y)/r.d),bH=h(b,(z-r.y)/r.d);let line=box(g,Math.hypot((b-a)*r.w,bH-aH),.018,.022,r.x+(a+b)*r.w/2,(aH+bH)/2+.012,z,key==='edicula'?'#965f43':'#bdbbac');line.rotation.z=Math.atan2(bH-aH,(b-a)*r.w);}}
 if(r.gable){for(const z of [r.y,r.y+r.d]){let gg=new THREE.BufferGeometry();gg.setAttribute('position',new THREE.Float32BufferAttribute([r.x,r.base,z,r.x+r.w/2,r.base+r.rise,z,r.x+r.w,r.base,z],3));gg.computeVertexNormals();g.add(new THREE.Mesh(gg,materials('#ede3cf')))}}
 else {for(const [a,b] of [[[0,0],[1,0]],[[1,0],[1,1]],[[1,1],[0,1]],[[0,1],[0,0]]]){let ax=r.x+a[0]*r.w,az=r.y+a[1]*r.d,bx=r.x+b[0]*r.w,bz=r.y+b[1]*r.d,ah=h(...a),bh=h(...b);let face=new THREE.BufferGeometry();face.setAttribute('position',new THREE.Float32BufferAttribute([ax,r.base,az,ax,ah,az,bx,bh,bz,ax,r.base,az,bx,bh,bz,bx,r.base,bz],3));face.computeVertexNormals();g.add(new THREE.Mesh(face,materials('#e1d7c2')))}}
 const gx=r.axis==='x'?(r.reverse?r.x:r.x+r.w):r.x+r.w-.1,gz=r.axis==='y'?(r.reverse?r.y:r.y+r.d):r.y+r.d-.1;box(g,.085,r.base,.085,gx,r.base/2,gz,'#8c9080');
 if(r.axis==='x')box(g,.13,.09,r.d,gx,r.base+.015,r.y+r.d/2,'#8c9080');else box(g,r.w,.09,.13,r.x+r.w/2,r.base+.015,gz,'#8c9080');
 if(r.gable){box(g,.13,.09,r.d,r.x,r.base+.015,r.y+r.d/2,'#8c9080');box(g,.085,r.base,.085,r.x,r.base/2,r.y+r.d-.1,'#8c9080')}
}
function build(){
 if(building){scene.remove(building);building.traverse(o=>{if(o.geometry&&!o.userData.asset)o.geometry.dispose()})}building=new THREE.Group();scene.add(building);let p=D[key],ex=mode==='exterior';
 box(building,12,.15,35,6,-.12,17.5,'#859d71');box(building,18,.08,5,6,-.1,-2.5,'#a4a495');
 for(const r of [...p.hardscape,...p.parkingTracks])box(building,r.w,.035,r.h,r.x+r.w/2,.01,r.y+r.h/2,'#d7d2bd');
 for(const m of (p.boundaryWalls||[])){const hh=m.height||2.5;box(building,m.w,hh,m.h,m.x+m.w/2,hh/2-.05,m.y+m.h/2,'#e3dccb');box(building,m.w+.04,.05,m.h+.04,m.x+m.w/2,hh-.03,m.y+m.h/2,'#d2c9b5');}
 for(let i=0;i<3;i++)model(building,i===1?'carSegmentA':'suv2',2.9+i*2.5,2.075,1.85,4.1,.03);
 let q=p.pool;box(building,q.w+.3,.10,q.h+.3,q.x+q.w/2,.01,q.y+q.h/2,'#e9ddc5');box(building,q.w,.035,q.h,q.x+q.w/2,.071,q.y+q.h/2,new THREE.MeshPhysicalMaterial({color:'#55aeb9',roughness:.35,metalness:.02,clearcoat:.2}));
 // Acesso por escada inox; partes submersas não simulam uma falsa escada rasa.
 for(let xx of [q.x+.8,q.x+1.35]){let pts=[new THREE.Vector3(xx,.08,q.y+q.h+.10),new THREE.Vector3(xx,.65,q.y+q.h+.10),new THREE.Vector3(xx,.72,q.y+q.h-.20),new THREE.Vector3(xx,.08,q.y+q.h-.35)];let mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,.025,8,false),new THREE.MeshStandardMaterial({color:'#a8b6b7',metalness:.8,roughness:.23}));building.add(mesh);}
 for(let lv of ['T','S']){if(!ex&&mode!==lv)continue;let y=lv==='S'?3.15:0,wh=ex?2.95:1.08;
  for(let c of p.rooms.filter(c=>c.level===lv&&!['stair','court'].includes(c.kind)))box(building,c.w,.18,c.h,c.x+c.w/2,y-.09,c.y+c.h/2,tile(c.kind,c.w,c.h));
  for(let w of p.walls.filter(w=>w.level===lv)){let cur=w.start;const draw=(a,b,bot,top)=>{top=Math.min(top,wh);if(b-a<.005||bot>=top)return;box(building,w.axis==='h'?b-a:.15,top-bot,w.axis==='h'?.15:b-a,w.axis==='h'?(a+b)/2:w.fixed,y+(top+bot)/2,w.axis==='h'?w.fixed:(a+b)/2,'#f0e6d2')};
   for(let o of cuts(w,p)){let a=o.center-o.width/2,b=o.center+o.width/2;draw(cur,a,0,2.95);cur=b;draw(a,b,o.sill+o.height,2.95);if(o.sill)draw(a,b,0,o.sill);let x=w.axis==='h'?o.center:w.fixed,z=w.axis==='h'?w.fixed:o.center;
    if(ex&&(o.kind==='window'||o.kind==='slide'&&!o.private)){for(let v of [a,b])box(building,w.axis==='h'?.04:.07,o.height,w.axis==='h'?.07:.04,w.axis==='h'?v:x,y+o.sill+o.height/2,w.axis==='h'?z:v,'#74644f');for(let h of [o.sill,o.sill+o.height])box(building,w.axis==='h'?o.width:.07,.045,w.axis==='h'?.07:o.width,x,y+h,z,'#74644f');}
    if(o.kind==='slide'&&!o.private){for(let pos of [a+o.width/8,b-o.width/8])for(let off of [-.025,.025]){let hh=ex?o.height:1.02;box(building,w.axis==='h'?o.width/4:.025,hh,w.axis==='h'?.025:o.width/4,w.axis==='h'?pos:x+off,y+hh/2,w.axis==='h'?z+off:pos,materials('#96b7b9',.4));}}
    if(o.kind==='door'){let hinge=o.hingeEnd?b:a,sign=o.inward||1;box(building,w.axis==='h'?.04:o.width,ex?2.2:1.02,w.axis==='h'?o.width:.04,w.axis==='h'?hinge:x+sign*o.width/2,y+(ex?1.1:.51),w.axis==='h'?z+sign*o.width/2:hinge,'#b69a73')}
    if(o.kind==='slide'&&o.private)box(building,w.axis==='h'?o.width:.035,ex?2.2:1.02,w.axis==='h'?.035:o.width,w.axis==='h'?x+o.width:x-.04,y+(ex?1.1:.51),w.axis==='h'?z-.04:z+o.width,'#b69a73');
    if(ex&&o.kind==='window'){box(building,w.axis==='h'?o.width+.4:.55,.10,w.axis==='h'?.55:o.width+.4,x,y+o.sill+o.height+.16,z,'#d2b88e')}
   }draw(cur,w.end,0,2.95);
  }
  if(ex)for(const f of p.windowLeaves.filter(f=>f.level===lv)){let g=new THREE.Group();g.position.set(f.x,y+f.z,f.y);g.rotation.y=-f.angle*Math.PI/180;building.add(g);box(g,f.w,f.h,.025,0,f.h/2,0,materials('#96b7b9',.35));for(let xx of [-f.w/2,f.w/2])box(g,.035,f.h,.04,xx,f.h/2,0,'#74644f');for(let yy of [0,f.h])box(g,f.w,.035,.04,0,yy,0,'#74644f');}
  for(let f of p.furniture.filter(f=>f.level===lv)){let modelname={bed:'old_bed_frame',sofa:'sofa_02',table:'wooden_table_02',coffee:'wooden_table_02',diningchair:'dining_chair_02',chair:'modern_arm_chair_01'}[f.kind],g=new THREE.Group();building.add(g);g.position.set(f.x,y,f.y);g.rotation.y=-f.angle*Math.PI/180;
   if(!modelname||!model(g,modelname,0,0,f.w,f.d,.02,0,f.h)){
    if(f.kind==='toilet'){box(g,.36,.34,.53,0,.17,0,'#f8f6ed');let bowl=new THREE.Mesh(new THREE.SphereGeometry(.22,20,12),materials('#f8f6ed'));bowl.scale.set(.8,.5,1.25);bowl.position.set(0,.36,.06);g.add(bowl);box(g,.34,.35,.14,0,.46,-.22,'#f8f6ed')}
    else if(f.kind==='shower'){box(g,f.w,.045,f.d,0,.02,0,'#e7e9dc');if(ex){box(g,f.w,2,.015,0,1,.45,materials('#b4d8d6',.25));box(g,.015,2,f.d,.45,1,0,materials('#b4d8d6',.25));}box(g,.03,1.4,.03,-.35,1.15,-.35,'#9caaa7');box(g,.18,.025,.18,-.28,1.91,-.25,'#9caaa7')}
    else if(f.kind==='sink'){box(g,f.w,.12,f.d,0,.82,0,'#f5f0e4');box(g,f.w-.1,.55,f.d-.05,0,.48,0,'#b79a73');}
    else if(f.kind==='desk'){box(g,f.w,.06,f.d,0,.75,0,'#bb9970');for(let x of [-f.w/2+.07,f.w/2-.07])box(g,.05,.72,.5,x,.36,0,'#716650');}
    else box(g,f.w,f.h,f.d,0,f.h/2,0,{wardrobe:'#b9a17d',counter:'#c7c6b3',grill:'#746a59',fridge:'#c0c5bd',tv:'#3c4e46'}[f.kind]||'#d0baa0');
   }
   if(f.kind==='bed'){box(g,f.w-.08,.23,f.d-.07,0,.48,0,'#f1ede1');box(g,f.w-.18,.10,.36,0,.64,-.65,'#fffaf0');box(g,f.w-.05,.045,.75,0,.62,.4,'#9cac95')}
   if(f.sink||f.kind==='sink'){let xx=f.sinkOffset||0,hh=f.kind==='sink'?.89:f.h+.02;box(g,Math.min(.48,f.w-.1),.02,.36,xx,hh,0,'#6e8681');bar(g,[xx,hh,-.21],[xx,hh+.26,-.21],.015);bar(g,[xx,hh+.26,-.21],[xx,hh+.26,0],.015);}
   if(f.cooktop){box(g,.55,.035,.42,0,f.h+.02,0,'#303b35');for(let xx of [-.14,.14])for(let zz of [-.1,.1]){let burner=new THREE.Mesh(new THREE.TorusGeometry(.065,.008,6,16),materials('#abb1a6'));burner.rotation.x=Math.PI/2;burner.position.set(xx,f.h+.045,zz);g.add(burner);}}
   if(f.kind==='grill'){box(g,f.w-.12,.18,f.d-.10,0,f.h+.09,0,'#303b35');for(let xx=-f.w/2+.1;xx<f.w/2;xx+=.07)box(g,.012,.015,f.d-.12,xx,f.h+.19,0,'#a6ada2');}
   if(f.kind==='wardrobe'){for(let xx of [-f.w/4,f.w/4])box(g,.025,.22,.025,xx,1.1,f.d/2+.015,'#766851');box(g,.012,f.h,.012,0,f.h/2,f.d/2+.01,'#927b59');}
  }
 }
 if(mode!=='S'){
  let s=p.stair,x=s.x+.075,z=s.y+.075,first=s.mirror?x+1.9:x+.55,second=s.mirror?x+.55:x+1.9;
  for(let i=0;i<8;i++){let h=(i+1)*.175;box(building,1.1,h,.28,first,h/2,z+(i+.5)*.28,'#b49b76')}box(building,2.45,1.575,1.1,x+1.225,.7875,z+2.79,'#b49b76');for(let i=0;i<8;i++){let h=(i+10)*.175;box(building,1.1,h,.28,second,h/2,z+2.24-(i+.5)*.28,'#b49b76')}
  for(let [xx,riser,reverse] of [[x+1.08,1,false],[x+1.37,10,true]]){if(s.mirror)xx=2*(x+1.225)-xx;let firstPt,lastPt;for(let i=0;i<8;i++){let yy=(riser+i)*.175,zz=z+(reverse?2.24-(i+.5)*.28:(i+.5)*.28);for(let delta of [-.09,0,.09])bar(building,[xx,yy,zz+delta],[xx,yy+1.1,zz+delta],.0125);if(!i)firstPt=[xx,yy+.9,zz];lastPt=[xx,yy+.9,zz]}bar(building,firstPt,lastPt);bar(building,[firstPt[0],firstPt[1]+.2,firstPt[2]],[lastPt[0],lastPt[1]+.2,lastPt[2]])}
 }
 if(ex||mode==='S'){rail(building,1.65,5.15,10.35,5.15,3.15);rail(building,1.65,5.15,1.65,7.35,3.15);rail(building,10.35,5.15,10.35,7.35,3.15);let s=p.stair,x=s.x+.075,first=s.mirror?x+1.35:x;rail(building,first,s.y+.075,first+1.1,s.y+.075,3.15);let b=p.stairBridge;box(building,b.w,.2,b.h,b.x+b.w/2,3.05,b.y+b.h/2,'#e8deca');}
 if(ex)p.roofs.forEach((r,i)=>roofing(building,r,i));
 if(ex)for(const s of p.technicalStacks||[]){box(building,s.w,s.top-s.base,s.d,s.x,(s.top+s.base)/2,s.y,'#8e8c7f');box(building,s.w+.12,.04,s.d+.12,s.x,s.top+.04,s.y,'#8e8c7f');}
 for(let c of p.columns.filter(c=>ex||c.level===mode)){let elev=c.level==='S'?3.15:0,hh=ex?c.h:1.08;box(building,c.w,hh,c.d,c.x,elev+hh/2,c.y,'#aa8b60');}
 if(ex)box(building,8.88,.20,.18,6,6,5.15,'#aa8b60');
 for(const [x,z]of p.trees){box(building,.12,2.2,.12,x,1.1,z,'#8d7957');for(let i=0;i<5;i++){let m=new THREE.Mesh(new THREE.SphereGeometry(.55,10,8),materials(i%2?'#78915c':'#91a477'));m.scale.set(1,.65,1);m.position.set(x+Math.sin(i*2.4)*.32,2.4+Math.cos(i)*.18,z+Math.cos(i*2.4)*.32);building.add(m)}}
 model(building,'potted_plant_01',key==='edicula'?9.9:4.5,key==='edicula'?16.6:19.9,.55,.55,0);
 request();
}
function request(){if(!renderer||queued)return;queued=true;requestAnimationFrame(()=>{queued=false;renderer.render(scene,camera)})}
function view(which){const p=D[key];if(which==='front'){camera.position.set(17,11,-13);controls.target.set(6,2,12)}else if(which==='pool'){let q=p.pool,pav=p.rooms.find(c=>c.id==='pavilion');camera.position.set(22,17,45);controls.target.set(6,.8,(Math.min(q.y,pav.y)+35)/2)}else if(which==='stair'){let s=p.stair;camera.position.set(s.x+5,10,s.y-7);controls.target.set(s.x+1.3,1.6,s.y+1.8)}else{if(key==='patio')camera.position.set(-24,28,42);else camera.position.set(29,28,-14);controls.target.set(6,1.2,17)}controls.update();request();}
async function assets(){
 let names=['sofa_02','wooden_table_02','dining_chair_02','modern_arm_chair_01','old_bed_frame','potted_plant_01'];
 async function read(n){if(window.MODELOS?.[n])return window.MODELOS[n];let last;for(let i=0;i<3;i++){try{let r=await fetch(old+'modelos/'+n);if(!r.ok)throw Error(n+' HTTP '+r.status);return await r.text()}catch(e){last=e;await new Promise(r=>setTimeout(r,250*(i+1)))}}throw last}
 const jobs=names.map(async n=>{let raw=await read(n+'.gltf'),gl=await new Promise((resolve,reject)=>new THREE.GLTFLoader().parse(raw,'',resolve,reject));models[n]=gl.scene});let result=await Promise.allSettled(jobs);
 for(let n of ['suv2','carSegmentA']){try{let a=await read(n+'.obj'),b=await read(n+'.mtl'),mat=new THREE.MTLLoader().parse(b,'');mat.preload();models[n]=new THREE.OBJLoader().setMaterials(mat).parse(a);result.push({status:'fulfilled'})}catch(reason){result.push({status:'rejected',reason})}}
 window.ASSET_FAILURES=result.filter(r=>r.status==='rejected').map(r=>String(r.reason));$('#status').textContent=window.ASSET_FAILURES.length?'Parte do acervo não carregou; geometria disponível':'Acervo 3D carregado · arraste para girar';window.ASSETS_READY=true;build();
}
function init(){scene=new THREE.Scene();scene.background=new THREE.Color('#e8e5d9');camera=new THREE.PerspectiveCamera(38,1,.1,200);renderer=new THREE.WebGLRenderer({canvas:$('#model'),antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputEncoding=THREE.sRGBEncoding;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=.82;scene.add(new THREE.HemisphereLight(0xfffbef,0x6b785b,.5));let sun=new THREE.DirectionalLight(0xfff0d1,.85);sun.position.set(-12,28,-8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-30,right:30,top:30,bottom:-30,near:1,far:100});sun.shadow.bias=-.0004;sun.shadow.normalBias=.025;scene.add(sun);scene.add(sun.target);sun.target.position.set(6,0,17);controls=new THREE.OrbitControls(camera,renderer.domElement);controls.maxPolarAngle=Math.PI*.48;controls.minDistance=4;controls.maxDistance=90;controls.addEventListener('change',request);const resize=()=>{const c=$('#model');renderer.setSize(c.clientWidth,c.clientHeight,false);camera.aspect=c.clientWidth/c.clientHeight;camera.updateProjectionMatrix();request()};new ResizeObserver(resize).observe($('#model'));resize();view('aerial');build();assets();}
function update(){const p=D[key];$('#name').textContent=p.name;$('#subtitle').textContent=p.subtitle;for(let b of document.querySelectorAll('[data-project]'))b.setAttribute('aria-pressed',b.dataset.project===key);$('#areas').innerHTML=[['Térreo',p.areas.ground+' m²'],['Superior¹',p.areas.upper+' m²'],['Solo natural²',p.areas.permeable+' m² · '+p.areas.natural+'%'],['Projeção',p.areas.projection+' m² · '+p.areas.occupancy+'%']].map(([a,b])=>`<div><span>${a}</span><strong>${b}</strong></div>`).join('');$('#room-table').innerHTML=p.rooms.filter(c=>!['hall','vest','stair','court','porch'].includes(c.kind)).map(c=>{let target={bed:c.id==='master'?16:12,bath:3.5,wc:2,living:18,kitchen:10,gourmet:30,pavilion:12,office:9,closet:5,service:c.id==='laundry'?4:0}[c.kind]||0;return `<tr><td>${c.level==='T'?'Térreo':'Superior'}</td><td>${c.name}</td><td>${c.area.toFixed(2)} m²</td><td>${target?target+' m²':'—'}</td><td>${c.area>=target?'Dentro da referência':'Abaixo da faixa confortável'}</td></tr>`}).join('');$('#description').textContent=key==='edicula'?'A vida social ocupa a frente. A galeria coberta leva a três suítes independentes na lateral, ao jardim e ao quiosque. Os banheiros ficam entre os quartos, ajudando a separar as áreas de dormir. No alto, a suíte master e o escritório abrem para a varanda voltada ao rio.':'A ala íntima térrea ocupa a frente; o pátio descoberto ilumina o centro da casa. O estar se abre para esse jardim e conduz ao gourmet dos fundos. Cozinha, mesa principal, piscina e quiosque formam uma sequência curta. A escada e a ala superior estão espelhadas em relação à edícula.';$('#sh3d').href='assets/recomeco/'+key+'.sh3d';$('#section').replaceChildren(section());showPlans();window.RENDER_GALLERY?.show(key);if(renderer)build();document.title=p.name+' · Pedrinhas';}
for(let b of document.querySelectorAll('[data-project]'))b.onclick=()=>{key=b.dataset.project;history.replaceState(null,'','?projeto='+key+location.hash);update();view('aerial')};
$('#mode').onchange=e=>{mode=e.target.value;build()};$('#routes').onchange=showPlans;for(let b of document.querySelectorAll('[data-view]'))b.onclick=()=>view(b.dataset.view);
for(let b of document.querySelectorAll('[data-download]'))b.onclick=()=>{let svg=plan(b.dataset.download),url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'})),a=document.createElement('a');a.href=url;a.download=key+'-'+b.dataset.download+'.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
for(let id of ['planT','planS'])$('#'+id).onclick=()=>$('#'+id).classList.toggle('zoom');
update();try{init()}catch(err){$('#status').textContent='3D indisponível neste navegador: '+err.message;console.error(err)}window.PROJECT_UI={setProject:k=>{key=k;update()},setMode:m=>{mode=m;$('#mode').value=m;build()},view,plan};
})().catch(e=>{document.querySelector('#status').textContent=e.message;console.error(e)});
