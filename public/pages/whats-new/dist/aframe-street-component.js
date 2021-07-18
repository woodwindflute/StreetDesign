!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var i=e();for(var a in i)("object"==typeof exports?exports:t)[a]=i[a]}}(self,(function(){return t={631:t=>{var e=[new THREE.Vector2,new THREE.Vector2,new THREE.Vector2,new THREE.Vector2];function i(t,i,a,n){const s=1/n,r=1/a;return e[0].set(s*i,r*t+r),e[1].set(s*i,r*t),e[2].set(s*i+s,r*t),e[3].set(s*i+s,r*t+r),e}AFRAME.registerComponent("atlas-uvs",{dependencies:["geometry"],schema:{totalColumns:{type:"int",default:1},totalRows:{type:"int",default:1},column:{type:"int",default:1},row:{type:"int",default:1}},update:function(){const t=this.data,e=i(t.row-1,t.column-1,t.totalRows,t.totalColumns),a=this.el.getObject3D("mesh").geometry;var n=new Float32Array([e[0].x,e[0].y,e[3].x,e[3].y,e[1].x,e[1].y,e[2].x,e[2].y]);a.setAttribute("uv",new THREE.BufferAttribute(n,2)),a.uvsNeedUpdate=!0}}),AFRAME.registerComponent("dynamic-texture-atlas",{schema:{canvasId:{default:"dynamicAtlas"},canvasHeight:{default:1024},canvasWidth:{default:1024},debug:{default:!1},numColumns:{default:8},numRows:{default:8}},multiple:!0,init:function(){const t=this.canvas=document.createElement("canvas");t.id=this.data.canvasId,t.height=this.data.canvasHeight,t.width=this.data.canvasWidth,this.ctx=t.getContext("2d"),document.body.appendChild(t),this.data.debug&&(t.style.left=0,t.style.top=0,t.style.position="fixed",t.style.zIndex=9999999999)},drawTexture:function(t,e,a,n,s){const r=this.canvas,o=this.data;t.complete||(t.onload=()=>{this.drawTexture(t,e,a)});const l=s||r.height/o.numRows,d=n||r.width/o.numColumns;return this.ctx.drawImage(t,d*e,d*a,d,l),i(e,a,o.numRows,o.numColumns)}}),t.exports.getGridUvs=i},485:()=>{if("undefined"==typeof AFRAME)throw new Error("Component attempted to register before AFRAME was available.");var t={},e={};AFRAME.registerComponent("gltf-part-plus",{schema:{buffer:{default:!0},part:{type:"string"},src:{type:"asset"},resetPosition:{default:!1}},init:function(){this.dracoLoader=document.querySelector("a-scene").systems["gltf-model"].getDRACOLoader()},update:function(){var t=this.el,e=this.data;!this.data.part&&this.data.src||this.getModel((function(i){i&&(e.resetPosition&&(t.setAttribute("position",i.position.x+" "+i.position.y+" "+i.position.z),i.position.set(0,0,0)),t.setObject3D("mesh",i),t.emit("model-loaded",{format:"gltf",part:this.modelPart}))}))},getModel:function(i){var a=this;if(!e[this.data.src])return t[this.data.src]?t[this.data.src].then((function(t){i(a.selectFromModel(t))})):void(t[this.data.src]=new Promise((function(n){var s=new THREE.GLTFLoader;a.dracoLoader&&s.setDRACOLoader(a.dracoLoader),s.load(a.data.src,(function(s){var r=s.scene||s.scenes[0];e[a.data.src]=r,delete t[a.data.src],i(a.selectFromModel(r)),n(r)}),(function(){}),console.error)})));i(this.selectFromModel(e[this.data.src]))},selectFromModel:function(t){var e,i;if(i=t.getObjectByName(this.data.part))return e=i.getObjectByProperty("type","Mesh").clone(!0),this.data.buffer?(e.geometry=e.geometry.toNonIndexed(),e):(e.geometry=(new THREE.Geometry).fromBufferGeometry(e.geometry),e);console.error("[gltf-part] `"+this.data.part+"` not found in model.")}}),AFRAME.registerComponent("model-center",{schema:{bottomAlign:{default:!1}},init:function(){this.el.addEventListener("model-loaded",(t=>{var e=this.el.getObject3D("mesh");if(e.position.set(0,0,0),e.geometry.center(),this.data.bottomAlign){var i=(new THREE.Box3).setFromObject(e),a=i.max.sub(i.min).y;e.position.y=a/2}}))}}),AFRAME.registerComponent("anisotropy",{schema:{default:0},dependencies:["material","geometry"],init:function(){this.maxAnisotropy=this.el.sceneEl.renderer.capabilities.getMaxAnisotropy(),["model-loaded","materialtextureloaded"].forEach((t=>this.el.addEventListener(t,(()=>{const t=this.el.getObject3D("mesh");var e=this.data;0===(e=+e||0)&&(e=this.maxAnisotropy),t.traverse((t=>{!0===t.isMesh&&null!==t.material.map&&(t.material.map.anisotropy=e,t.material.map.needsUpdate=!0)}))}),!1)))}}),AFRAME.registerComponent("instancedmesh",{schema:{retainParent:{default:!1},retainChildren:{default:!1},inheritMat:{default:!0},mergeInstances:{default:!1},frustumCulled:{default:!0}},init:function(){},update:function(){var t,e,i,a,n=this.el,s=this.el.children,r=0,o=(t=new THREE.Vector3,e=new THREE.Euler,i=new THREE.Vector3,a=new THREE.Quaternion,function(s,r){t.x=n.children[s].object3D.position.x,t.y=n.children[s].object3D.position.y,t.z=n.children[s].object3D.position.z,e.x=n.children[s].object3D.rotation.x,e.y=n.children[s].object3D.rotation.y,e.z=n.children[s].object3D.rotation.z,a.setFromEuler(e),i.x=n.children[s].object3D.scale.x,i.y=n.children[s].object3D.scale.y,i.z=n.children[s].object3D.scale.z,r.compose(t,a,i)});for(var l of s)r+=1;var d=this.el.getObject3D("mesh");if(d){var c=d.material.clone(),m=null;d.traverse((function(t){!0===t.isMesh&&(m=t.geometry)}));for(var u=new THREE.InstancedMesh(m,c,r),p=0;p<r;p++){var h=new THREE.Matrix4;o(p,h),u.setMatrixAt(p,h)}u.frustumCulled=this.data.frustumCulled,this.el.object3D.add(u),this.data.retainParent||this.el.object3D.remove(d),this.data.inheritMat&&(this.el.components.material.material=c)}else this.el.addEventListener("model-loaded",(t=>{this.update(this.data)}))}})},844:(t,e,i)=>{var a=i(199),n=i(394),s={suffix:"-t1"},r={"bike-lane":1.8,"drive-lane":3,divider:.3,"parking-lane":3,sidewalk:3,"sidewalk-tree":3,"turn-lane":3,"bus-lane":3,"light-rail":3,streetcar:3,"sidewalk-wayfinding":3,"sidewalk-lamp":3,"sidewalk-bike-rack":3,"sidewalk-bench":3,"scooter-drop-zone":3,scooter:1.8,bikeshare:3,"flex-zone-curb":3,"transit-shelter":3};function o(t){for(var e=t.objectMixinId,i=void 0===e?"":e,a=t.parentEl,n=void 0===a?null:a,s=t.step,r=void 0===s?15:s,o=t.radius,l=void 0===o?60:o,d=t.rotation,c=void 0===d?"0 0 0":d,m=t.positionXYString,u=void 0===m?"0 0":m,p=t.randomY,h=void 0!==p&&p,g=-1*l;g<=l;g+=r){var f=document.createElement("a-entity");f.setAttribute("class",i),f.setAttribute("position",u+" "+g),f.setAttribute("mixin",i),h?f.setAttribute("rotation","0 "+Math.floor(361*Math.random())+" 0"):f.setAttribute("rotation",c),n.append(f)}}function l(t){var e=document.createElement("a-entity");return e.setAttribute("class","stencils-parent"),e.setAttribute("position",t),e}function d(t){var e=document.createElement("a-entity");return e.setAttribute("class","track-parent"),e.setAttribute("position",t+" -0.2 0"),e}function c(t){var e=document.createElement("a-entity");return e.setAttribute("class","safehit-parent"),e.setAttribute("position",t+" 0 0"),e}function m(t){return"colored"===t?"surface-red bus-lane":"grass"===t?"surface-green bus-lane":"bus-lane"}function u(t,e,i){var a="inbound"===t[0]?0:180,n=document.createElement("a-entity");return n.setAttribute("class",e),n.setAttribute("position",i+" 0 0"),n.setAttribute("rotation","0 "+a+" 0"),n.setAttribute("mixin",e),n}function p(t,e){var i=document.createElement("a-entity"),a=90*t,n=document.createElement("a-entity");n.setAttribute("class","bus"),n.setAttribute("position",e+" 1.4 0"),n.setAttribute("rotation","0 "+a+" 0"),n.setAttribute("mixin","bus"),i.append(n);var s=document.createElement("a-entity");return s.setAttribute("class","bus-shadow"),s.setAttribute("position",e+" 0.01 0"),s.setAttribute("rotation","-90 "+a+" 0"),s.setAttribute("mixin","bus-shadow"),i.append(s),i}function h(t,e,i){var a,n,s=document.createElement("a-entity");return n=document.createElement("a-entity"),a="inbound"===t[0]?0:180,n.setAttribute("class","car"),n.setAttribute("position",e+" 0 0"),n.setAttribute("rotation","0 "+a+" 0"),n.setAttribute("mixin","car"),s.append(n),n=document.createElement("a-entity"),a="inbound"===t[0]?-90:90,(n=document.createElement("a-entity")).setAttribute("class","car-shadow"),n.setAttribute("position",e+" 0.01 0"),n.setAttribute("rotation","-90 "+a+" 0"),n.setAttribute("mixin","car-shadow"),s.append(n),s}function g(t){var e,i=document.createElement("a-entity");return(e=document.createElement("a-entity")).setAttribute("position",t+" 1 0"),e.setAttribute("mixin","wayfinding-box"),i.append(e),(e=document.createElement("a-entity")).setAttribute("position",t+" 1.2 0.06"),e.setAttribute("geometry","primitive: plane; width: 0.8; height: 1.6"),e.setAttribute("material","src:#wayfinding-map"),i.append(e),(e=document.createElement("a-entity")).setAttribute("position",t+" 1.2 -0.06"),e.setAttribute("rotation","0 180 0"),e.setAttribute("geometry","primitive: plane; width: 0.8; height: 1.6"),e.setAttribute("material","src:#wayfinding-map"),i.append(e),i}function f(t){var e=document.createElement("a-entity");return e.setAttribute("class","bench-parent"),e.setAttribute("position",t+" 0 3.5"),e}function b(t){var e=document.createElement("a-entity");return e.setAttribute("class","bikerack-parent"),e.setAttribute("position",t+" 0 -3.5"),e}function x(t,e){var i=document.createElement("a-entity");i.setAttribute("class","bikeshare"),i.setAttribute("position",t+" 0 0"),i.setAttribute("mixin","bikeshare");var a="left"===e[0]?90:270;return i.setAttribute("rotation","0 "+a+" 0"),i}function y(t){var e=document.createElement("a-entity");return e.setAttribute("class","tree-parent"),e.setAttribute("position",t+" 0 7"),e}function v(t){var e=document.createElement("a-entity");return e.setAttribute("class","lamp-parent"),e.setAttribute("position",t+" 0 0"),e}function w(t,e,i){var a=document.createElement("a-entity");return a.setAttribute("class","bus-stop"),a.setAttribute("position",t+.75*e+" 0 0"),a.setAttribute("rotation","-90 "+i+" 0"),a.setAttribute("mixin","bus-stop"),a}function A(t,e,i,a,n){var r=document.createElement("a-entity");return r.setAttribute("scale",t+" 1 1"),r.setAttribute("position",e+" "+i+" 0"),r.setAttribute("rotation","270 "+a+" 0"),r.setAttribute("mixin",n+s.suffix),r}t.exports.processSegments=function(t,e){e&&(t=function(t){function e(t){return"lane"===t.slice(t.length-4)||"light-rail"===t||"streetcar"===t}return t.reduce((function(t,i,a,n){if(0===a)return t.concat(i);var s=n[a-1];if(e(i.type)&&e(s.type)){var r="solid";i.type===s.type&&(r="dashed"),("drive-lane"===i.type&&"turn-lane"===s.type||"drive-lane"===s.type&&"turn-lane"===i.type)&&(r="dashed"),i.variantString.split("|")[0]!==s.variantString.split("|")[0]&&(r="doubleyellow","bike-lane"===i.type&&"bike-lane"===s.type&&(r="shortdashedyellow")),"turn-lane"===i.type&&"shared"===i.variantString.split("|")[1]?r="soliddashedyellow":"turn-lane"===s.type&&"shared"===s.variantString.split("|")[1]&&(r="soliddashedyellowinverted"),t.push({type:"separator",variantString:r,width:0})}return(e(i.type)&&"divider"===s.type||e(s.type)&&"divider"===i.type)&&t.push({type:"separator",variantString:"solid",width:0}),t.push(i),t}),[])}(t));var i=function(t){var e=document.createElement("a-entity"),i=0-n.calcStreetWidth(t)/2;return e.setAttribute("position",i+" 0 0"),e}(t);i.classList.add("street-parent");for(var s,_=0,E=0;E<t.length;E++){var S=document.createElement("a-entity");S.classList.add("segment-parent-"+E);var M=t[E].type,k=.3048*t[E].width,j=k/r[M],R=(_+=k)-.5*k,C=0,I=t[E].variantString.split("|"),L="inbound"===I[0]?180:0,B="outbound"===I[0]?1:-1,T=t[E].type;if("drive-lane"===t[E].type&&"sharrow"===I[1]){var D=l(R+" 0.015 0");o({objectMixinId:"stencils sharrow",parentEl:D,rotation:"-90 "+L+" 0",step:10,radius:70}),S.append(D)}else if("bike-lane"===t[E].type||"scooter"===t[E].type){var O=l(R+" 0.015 0");T="red"===(s=I[1])?"surface-red bike-lane":"green"===s?"surface-green bike-lane":"bike-lane",o({objectMixinId:"stencils bike-lane",parentEl:O,rotation:"-90 "+L+" 0",step:20,radius:70}),S.append(O)}else if("light-rail"===t[E].type||"streetcar"===t[E].type){T=m(I[1]);var F="streetcar"===t[E].type?"trolley":"tram";S.append(u(I,F,R));var P=d(R);o({objectMixinId:"track",parentEl:P,step:20.25,radius:80}),S.append(P)}else if("turn-lane"===t[E].type){T="drive-lane";var H=I[1];"inbound"===I[0]&&(H=H.replace(/left|right/g,(function(t){return"left"===t?"right":"left"}))),"shared"===I[1]&&(H="left"),"left-right-straight"===I[1]&&(H="all");var N="stencils "+H,U=l(R+" 0.015 0");if(o({objectMixinId:N,parentEl:U,rotation:"-90 "+L+" 0",step:15,radius:70}),S.append(U),"shared"===I[1]){var J=l(R+" 0.015 "+-3*B);o({objectMixinId:N,parentEl:J,rotation:"-90 "+(L+180)+" 0",step:15,radius:70}),S.append(J)}}else if("divider"===t[E].type&&"bollard"===I[0]){T="divider";var z=c(R);o({objectMixinId:"safehit",parentEl:z,step:4,radius:70}),S.append(z)}else if("bus-lane"===t[E].type){T=m(I[1]),S.append(p(B,R));var G=void 0;o({objectMixinId:"stencils word-bus",parentEl:G=l(R+" 0.015 0"),rotation:"-90 "+L+" 0",step:50,radius:70}),S.append(G),o({objectMixinId:"stencils word-taxi",parentEl:G=l(R+" 0.015 10"),rotation:"-90 "+L+" 0",step:50,radius:70}),S.append(G),o({objectMixinId:"stencils word-only",parentEl:G=l(R+" 0.015 20"),rotation:"-90 "+L+" 0",step:50,radius:70}),S.append(G)}else if("drive-lane"===t[E].type)S.append(h(I,R));else if("sidewalk-wayfinding"===t[E].type)S.append(g(R));else if("sidewalk-bench"===t[E].type){var V=f(R),W="right"===I[0]?-90:90;"center"===I[0]||(o({objectMixinId:"bench",parentEl:V,rotation:"0 "+W+" 0"}),S.append(V))}else if("sidewalk-bike-rack"===t[E].type){var q=b(R);o({objectMixinId:"bikerack",parentEl:q,rotation:"0 "+("sidewalk-parallel"===I[1]?90:0)+" 0"}),S.append(q)}else if("bikeshare"===t[E].type)S.append(x(R,I));else if("sidewalk-tree"===t[E].type){var Y=y(R);o({objectMixinId:F="palm-tree"===I[0]?"palm-tree":"tree3",parentEl:Y,randomY:!0}),S.append(Y)}else if("sidewalk-lamp"!==t[E].type||"modern"!==I[1]&&"pride"!==I[1])if("sidewalk-lamp"===t[E].type&&"traditional"===I[1]){var X=v(R);o({objectMixinId:"lamp-traditional",parentEl:X}),S.append(X)}else if("transit-shelter"===t[E].type){var K="right"===I[0]?0:180,Q="right"===I[0]?1:-1;S.append(w(R,Q,K))}else"separator"===t[E].type&&"dashed"===I[0]?(T="markings dashed-stripe",C+=.01,j=1):"separator"===t[E].type&&"solid"===I[0]?(T="markings solid-stripe",C+=.01,j=1):"separator"===t[E].type&&"doubleyellow"===I[0]?(T="markings solid-doubleyellow",C+=.01,j=1):"separator"===t[E].type&&"shortdashedyellow"===I[0]?(T="markings yellow short-dashed-stripe",C+=.01,j=1):"separator"===t[E].type&&"soliddashedyellow"===I[0]?(T="markings yellow solid-dashed",C+=.01,j=1):"separator"===t[E].type&&"soliddashedyellowinverted"===I[0]?(T="markings yellow solid-dashed",C+=.01,j=1,L="180"):"parking-lane"===t[E].type&&(T="drive-lane");else{var $=v(R);o({objectMixinId:"lamp-modern",parentEl:$,rotation:"0 "+("right"===I[0]?-90:90)+" 0"}),S.append($),"both"===I[0]&&o({objectMixinId:"lamp-modern",parentEl:$,rotation:"0 -90 0"}),"pride"!==I[1]||"right"!==I[0]&&"both"!==I[0]||o({objectMixinId:"pride-flag",parentEl:$,positionXYString:"0.409 3.345"}),"pride"!==I[1]||"left"!==I[0]&&"both"!==I[0]||o({objectMixinId:"pride-flag",parentEl:$,rotation:"0 -180 0",positionXYString:"-0.409 3.345"})}a.isSidewalk(t[E].type)&&(T="sidewalk"),S.append(A(j,R,C,L,T)),i.append(S)}return i},t.exports.processBuildings=function(t,e,i,n){var s=document.createElement("a-entity");s.classList.add("buildings-parent");var r=150;return[t,e].forEach((function(t,e){if(0!==t.length){var l=0===e?"left":"right",d="left"===l?-1:1,c=(75+i/2)*d;if(n){var m=JSON.stringify(a.createGroundArray(t)),u=document.createElement("a-entity");u.setAttribute("create-from-json","jsonString",m),u.setAttribute("position",c+" 0 0"),u.classList.add("ground-"+l),s.appendChild(u)}if("narrow"===t||"wide"===t){var p=a.createBuildingsArray(r),h=JSON.stringify(p),g=document.createElement("a-entity");g.setAttribute("position",c+-72*d+" 0 "+75*d),g.setAttribute("rotation","0 "+90*d+" 0"),g.setAttribute("create-from-json","jsonString",h),g.classList.add("block-"+l),s.append(g)}if("residential"===t){var f=a.createBuildingsArray(r,"residential"),b=JSON.stringify(f),x=document.createElement("a-entity");x.setAttribute("position",c+-64*d+" -0.75 "+75*d),x.setAttribute("rotation","0 "+90*d+" 0"),x.setAttribute("create-from-json","jsonString",b),x.classList.add("suburbia-"+l),s.append(x)}if("waterfront"===t){var y=c-d*r/2,v=document.createElement("a-entity");v.setAttribute("class","seawall-parent"),v.setAttribute("position",y+" 0 10"),v.classList.add("seawall-parent-"+l),s.appendChild(v),o({objectMixinId:"seawall",parentEl:v,rotation:"-90 "+("right"===l?-90:90)+" 0",step:15,radius:70})}if("fence"===t||"parking-lot"===t){var w=c-d*r/2,A=document.createElement("a-entity");A.setAttribute("class","fence-parent"),A.setAttribute("position",w+" 0 0"),A.classList.add("fence-parent-"+c),o({objectMixinId:"fence",parentEl:A,rotation:"0 "+("right"===l?-90:90)+" 0",step:9.25,radius:70}),s.appendChild(A)}}})),s}},234:()=>{var t,e;t=!1,e=new THREE.FileLoader,window.AFRAME.registerElement("streetmix-assets",{prototype:Object.create(window.AFRAME.ANode.prototype,{createdCallback:{value:function(){this.setAttribute("src",""),this.isAssetItem=!0,this.isAssets=!0,this.fileLoader=e,this.timeout=null}},attachedCallback:{value:function(){if(!t){var e;this.parentNode&&this.parentNode.hasLoaded&&console.warn("Assets have already loaded. streetmix-assets may have problems"),t=!0,this.innerHTML=((e=this.getAttribute("url"))||(e="https://github.3d.st/"),console.log("[street]","Using street assets from",e),'\n          \x3c!-- audio --\x3e\n          <audio id="ambientmp3" src="'.concat(e,'assets/audio/SSL_16_11_AMB_EXT_SF_ALAMO_SQ.mp3" preload="none" crossorigin="anonymous"></audio>\n          <audio id="tram-pass-mp3" src="').concat(e,'assets/audio/Tram-Pass-By-Fast-shortened.mp3" preload="auto" crossorigin="anonymous"></audio>\n          <audio id="trolley-pass-mp3" src="').concat(e,'assets/audio/Streetcar-passing.mp3" preload="auto" crossorigin="anonymous"></audio>\n          <audio id="suburbs-mp3" src="').concat(e,'assets/audio/AMB_Suburbs_Afternoon_Woods_Spring_Small_ST_MKH8050-30shortened_amplified.mp3" preload="none" crossorigin="anonymous"></audio>\n          <audio id="parking-lot-mp3" src="').concat(e,'assets/audio/Parking_lot_ambience_looping.mp3" preload="none" crossorigin="anonymous"></audio>\n          <audio id="waterfront-mp3" src="').concat(e,'assets/audio/combined_UKdock4_and_water_pier_underneath_ambience.mp3" preload="none" crossorigin="anonymous"></audio>\n          <audio id="suburbs2-mp3" src="').concat(e,'assets/audio/AMB_Suburbs_Spring_Day_Lawnmowers_Birds_MS_ST_MKH8050-30shortened.mp3" preload="none" crossorigin="anonymous"></audio>\n  \n          \x3c!-- sidewalk props --\x3e\n          <a-asset-item id="treemodel3" src="').concat(e,'assets/objects/SM_Env_Tree_03.gltf"></a-asset-item>\n          <a-asset-item id="palmtreemodel" src="').concat(e,'assets/objects/PalmTree.gltf"></a-asset-item>\n          <a-asset-item id="benchmodel" src="').concat(e,'assets/objects/SM_Prop_ParkBench_02.gltf"></a-asset-item>\n          <a-asset-item id="bikerackmodel" src="').concat(e,'assets/objects/bikerack.glb"></a-asset-item>\n          <a-asset-item id="bikesharemodel" src="').concat(e,'assets/objects/bikeshare.glb"></a-asset-item>\n          <a-asset-item id="lamp-modern-glb" src="').concat(e,'assets/objects/lamp-post-modern-centered.glb"></a-asset-item>\n          <a-asset-item id="lamp-traditional-glb" src="').concat(e,'assets/objects/lamp-post-traditional.glb"></a-asset-item>\n          <a-asset-item id="bus-stop-glb" src="').concat(e,'assets/objects/ccFO2EGGIq9-bus-stop.glb"></a-asset-item>\n          <img id="wayfinding-map" src="').concat(e,'assets/objects/wayfinding.jpg" crossorigin="anonymous" />\n  \n          \x3c!-- vehicles --\x3e\n          <a-asset-item id="trammodel" src="').concat(e,'assets/objects/tram_siemens_avenio.gltf"></a-asset-item>\n          <a-asset-item id="trolleymodel" src="').concat(e,'assets/objects/godarvilletram.gltf"></a-asset-item>\n          <a-asset-item id="xd40" src="').concat(e,'assets/objects/bus/xd40-draco.glb"></a-asset-item>\n          <a-asset-item id="carmodel" src="').concat(e,'assets/objects/SM_Veh_Car_Sedan_01.gltf"></a-asset-item>\n  \n          \x3c!-- blocks --\x3e\n          <a-asset-item id="blockmodel" src="').concat(e,'assets/objects/buildings.glb"></a-asset-item>\n          <a-asset-item id="suburbiamodel" src="').concat(e,'assets/objects/suburbia/suburbia-fixwindowuvs-only3-draco.glb"></a-asset-item>\n  \n          <a-asset-item id="fence-model" src="').concat(e,'assets/objects/fence4/fence4.gltf"></a-asset-item>\n          <a-asset-item id="seawall-model" src="').concat(e,'assets/objects/seawall.gltf"></a-asset-item>\n  \n          \x3c!-- lane objects --\x3e\n          <a-asset-item id="trackmodel" src="').concat(e,'assets/objects/track.gltf"></a-asset-item>\n          <a-asset-item id="flexiguide-glb" src="').concat(e,'assets/objects/flexiguide300.glb"></a-asset-item>\n          <img id="stencils-atlas" src="').concat(e,'assets/materials/stencils-atlas_2048.png" crossorigin="anonymous" />\n          <img id="markings-atlas" src="').concat(e,'assets/materials/lane-markings-atlas_1024.png" crossorigin="anonymous" />\n  \n          \x3c!-- optimized textures - used by default --\x3e\n          <img id="seamless-road" src="').concat(e,'assets/materials/TexturesCom_Roads0086_1_seamless_S_rotate.jpg" crossorigin="anonymous">\n          <img id="hatched-base" src="').concat(e,'assets/materials/hatched_Base_Color.jpg" crossorigin="anonymous">\n          <img id="hatched-normal" src="').concat(e,'assets/materials/hatched_Normal.jpg" crossorigin="anonymous">\n          <img id="seamless-sidewalk" src="').concat(e,'assets/materials/TexturesCom_FloorsRegular0301_1_seamless_S.jpg" crossorigin="anonymous">\n          <a-mixin id="drive-lane-t1" geometry="width:3;height:150;primitive:plane" material="repeat:0.3 25;offset:0.55 0;src:#seamless-road;"></a-mixin>\n          <a-mixin id="bike-lane-t1" geometry="width:1.8;height:150;primitive:plane" material="repeat:0.3 25;offset:0.55 0;roughness:1;metalness:0;src:#seamless-road;"></a-mixin>\n          <a-mixin id="sidewalk-t1" anisotropy geometry="width:3;height:150;primitive:plane" material="repeat:1.5 75;src:#seamless-sidewalk;"></a-mixin>\n          <a-mixin id="bus-lane-t1" geometry="width:3;height:150;primitive:plane" material="repeat:0.3 25;offset:0.55 0;src:#seamless-road;"></a-mixin>\n          <a-mixin id="divider-t1" geometry="width:0.3;height:150;primitive:plane" material="repeat:1 150;offset:0.415 0;normalTextureOffset:0.415 0;src:#hatched-base;normalTextureRepeat:0.21 150;normalMap:#hatched-normal"></a-mixin>\n          <a-mixin id="safehit" gltf-model="#flexiguide-glb" scale="1 1 1"></a-mixin>\n  \n          \x3c!-- lane separator markings atlas --\x3e\n          <a-mixin id="markings" anisotropy atlas-uvs="totalRows: 1; totalColumns: 8; row: 1" scale="1 1 1" material="src: #markings-atlas;alphaTest: 0;transparent:true;repeat:1 25;" geometry="primitive: plane; buffer: false; skipCache: true; width:0.2; height:150;"></a-mixin>\n          <a-mixin id="solid-stripe-t1" atlas-uvs="column: 3"></a-mixin>\n          <a-mixin id="dashed-stripe-t1" atlas-uvs="column: 4"></a-mixin>\n          <a-mixin id="short-dashed-stripe-t1" atlas-uvs="column: 4" material="repeat:1 50;"></a-mixin>\n          <a-mixin id="solid-doubleyellow-t1" atlas-uvs="totalColumns: 4; column: 3" geometry="width: 0.5"></a-mixin>\n          <a-mixin id="solid-dashed-t1" atlas-uvs="totalColumns: 4; column: 2" geometry="width: 0.4"></a-mixin>\n  \n          \x3c!-- color modifier mixins --\x3e\n          <a-mixin id="yellow" material="color:#f7d117"></a-mixin>\n          <a-mixin id="surface-green" material="color:#adff83"></a-mixin>\n          <a-mixin id="surface-red" material="color:#ff9393"></a-mixin>\n  \n          \x3c!-- stencils atlas --\x3e\n          <a-mixin id="stencils" anisotropy atlas-uvs="totalRows: 4; totalColumns: 4" scale="2 2 2" material="src: #stencils-atlas;alphaTest: 0;transparent:true;" geometry="primitive: plane; buffer: false; skipCache: true"></a-mixin>\n          <a-mixin id="right" atlas-uvs="column: 3; row: 2"></a-mixin>\n          <a-mixin id="left" atlas-uvs="column: 3; row: 3"></a-mixin>\n          <a-mixin id="both" atlas-uvs="column: 2; row: 1"></a-mixin>\n          <a-mixin id="all" atlas-uvs="column: 3; row: 1"></a-mixin>\n          <a-mixin id="left-straight" atlas-uvs="column: 2; row: 3"></a-mixin>\n          <a-mixin id="right-straight" atlas-uvs="column: 2; row: 2"></a-mixin>\n          <a-mixin id="straight" atlas-uvs="column: 2; row: 4"></a-mixin>\n          <a-mixin id="sharrow" atlas-uvs="totalRows: 4; totalColumns: 8; column: 2; row: 3" scale="1.5 3 1"></a-mixin>\n          <a-mixin id="bike-lane" atlas-uvs="totalRows: 2; totalColumns: 8; column: 1; row: 2" scale="1 4 1"></a-mixin>\n          <a-mixin id="word-bus" atlas-uvs="totalRows: 8; totalColumns: 8; column: 1; row: 4" scale="3 3 3"></a-mixin>\n          <a-mixin id="word-lane" atlas-uvs="totalRows: 8; totalColumns: 8; column: 2; row: 4" scale="3 3 3"></a-mixin>\n          <a-mixin id="word-taxi" atlas-uvs="totalRows: 8; totalColumns: 8; column: 1; row: 3" scale="3 3 3"></a-mixin>\n          <a-mixin id="word-only" atlas-uvs="totalRows: 8; totalColumns: 8; column: 2; row: 3" scale="3 3 3"></a-mixin>\n          <a-mixin id="word-yield" atlas-uvs="totalRows: 8; totalColumns: 8; column: 1; row: 2" scale="3 3 3"></a-mixin>\n          <a-mixin id="word-slow" atlas-uvs="totalRows: 8; totalColumns: 8; column: 2; row: 2" scale="3 3 3"></a-mixin>\n          <a-mixin id="word-xing" atlas-uvs="totalRows: 8; totalColumns: 8; column: 1; row: 1" scale="3 3 3"></a-mixin>\n          <a-mixin id="word-stop" atlas-uvs="totalRows: 8; totalColumns: 8; column: 2; row: 1" scale="3 3 3"></a-mixin>\n          <a-mixin id="perpendicular-stalls" atlas-uvs="totalRows: 4; totalColumns: 8; column: 5; row: 4" scale="5 10 5"></a-mixin>\n          <a-mixin id="parking-delimiter" atlas-uvs="totalRows: 8; totalColumns: 8; column: 2; row: 7" scale="1.8 1.8 1.8"></a-mixin>\n  \n          \x3c!-- vehicles --\x3e\n          <a-mixin id="bus" anisotropy gltf-model="#xd40" scale="1.55 1.55 1.55"></a-mixin>\n          <a-mixin id="car" gltf-model="#carmodel"></a-mixin>\n          <a-mixin id="tram" anisotropy gltf-model="#trammodel" sound="src: #tram-pass-mp3;positional:false;volume: 0.4"></a-mixin>\n          <a-mixin id="trolley" gltf-model="#trolleymodel" sound="src: #trolley-pass-mp3;positional:false;volume: 0.4"scale="1 1 1"></a-mixin>\n\n          <img id="shadow-texture" src="').concat(e,'assets/materials/bus-shadow.png" crossorigin="anonymous">\n          <a-mixin id="bus-shadow" geometry="width: 12; height: 3; primitive: plane"  material="src: #shadow-texture; alphaTest: 0;transparent:true; roughness: 1;" ></a-mixin>\n          <a-mixin id="car-shadow" geometry="width: 4.7; height: 2.5; primitive: plane"  material="src: #shadow-texture; alphaTest: 0;transparent:true; roughness: 1;" ></a-mixin>\n  \n          \x3c!-- street props --\x3e\n          <a-mixin id="tree3" gltf-model="#treemodel3" scale="1.25 1.25 1.25"></a-mixin>\n          <a-mixin id="palm-tree" gltf-model="#palmtreemodel" scale="1 1.5 1"></a-mixin>\n          <a-mixin id="bench" gltf-model="#benchmodel" scale="1 1 1"></a-mixin>\n          <a-mixin id="track" gltf-model="#trackmodel" scale="1 1 1"></a-mixin>\n          <a-mixin id="bikerack" gltf-model="#bikerackmodel" scale="0.25 0.25 0.25"></a-mixin>\n          <a-mixin id="bikeshare" gltf-model="#bikesharemodel" scale="1 1 1"></a-mixin>\n          <a-mixin id="lamp-modern" gltf-model="#lamp-modern-glb" scale="0.5 0.5 0.5"></a-mixin>\n          <a-mixin id="lamp-traditional" gltf-model="#lamp-traditional-glb" scale="0.2 0.2 0.2" ></a-mixin>\n          <a-mixin id="pride-flag" position="0.409 3.345 0" rotation="0 0 0" scale="0.5 0.75 0" geometry="width:2;height:2;primitive:plane" material="side:double; src:').concat(e,'assets/materials/rainbow-flag-poles_512.png;transparent: true;"></a-mixin>\n          <a-mixin id="bus-stop" gltf-model="#bus-stop-glb" rotation="-90 0 0" scale="0.001 0.001 0.001" ></a-mixin>\n          <a-mixin id="wayfinding-box" geometry="primitive: box; height: 2; width: 0.84; depth: 0.1" material="color: gray"></a-mixin>\n  \n          \x3c!-- buildings and blocks --\x3e\n          <a-mixin id="block" gltf-model="#blockmodel" scale="1 1 1"></a-mixin>\n          <a-mixin id="suburbia" gltf-model="#suburbiamodel" scale="1 1 1"></a-mixin>\n  \n          <a-mixin id="SM3D_Bld_Mixed_Corner_4fl" scale="1 1 1" rotation="0 0 0" gltf-part-plus="src: #blockmodel; part: SM3D_Bld_Mixed_Corner_4fl" model-center="bottomAlign: true"></a-mixin>\n          <a-mixin id="SM3D_Bld_Mixed_Double_5fl" scale="1 1 1" rotation="0 0 0" gltf-part-plus="src: #blockmodel; part: SM3D_Bld_Mixed_Double_5fl" model-center="bottomAlign: true"></a-mixin>\n          <a-mixin id="SM3D_Bld_Mixed_4fl_2" scale="1 1 1" rotation="0 0 0" gltf-part-plus="src: #blockmodel; part: SM3D_Bld_Mixed_4fl_2" model-center="bottomAlign: true"></a-mixin>\n          <a-mixin id="SM3D_Bld_Mixed_5fl" scale="1 1 1" rotation="0 0 0" gltf-part-plus="src: #blockmodel; part: SM3D_Bld_Mixed_5fl" model-center="bottomAlign: true"></a-mixin>\n          <a-mixin id="SM3D_Bld_Mixed_4fl" scale="1 1 1" rotation="0 0 0" gltf-part-plus="src: #blockmodel; part: SM3D_Bld_Mixed_4fl" model-center="bottomAlign: true"></a-mixin>\n  \n          <a-mixin id="SM_Bld_House_Preset_03_1800" scale="1 1 1" rotation="0 0 0" gltf-part-plus="src: #suburbiamodel; part: SM_Bld_House_Preset_03_1800" model-center="bottomAlign: true"></a-mixin>\n          <a-mixin id="SM_Bld_House_Preset_08_1809" scale="1 1 1" rotation="0 0 0" gltf-part-plus="src: #suburbiamodel; part: SM_Bld_House_Preset_08_1809" model-center="bottomAlign: true"></a-mixin>\n          <a-mixin id="SM_Bld_House_Preset_09_1845" scale="1 1 1" rotation="0 0 0" gltf-part-plus="src: #suburbiamodel; part: SM_Bld_House_Preset_09_1845" model-center="bottomAlign: true"></a-mixin>\n  \n          <a-mixin id="seawall" gltf-model="#seawall-model" scale="1 1 1" rotation="0 0 0"></a-mixin>\n          <a-mixin id="fence" gltf-model="#fence-model" scale="0.1 0.1 0.1"></a-mixin>\n  \n          \x3c!-- grounds --\x3e\n          <img id="grass-texture" src="').concat(e,'assets/materials/TexturesCom_Grass0052_1_seamless_S.jpg" crossorigin="anonymous">\n          <img id="parking-lot-texture" src="').concat(e,'assets/materials/TexturesCom_Roads0111_1_seamless_S.jpg" crossorigin="anonymous">\n          <img id="asphalt-texture" src="').concat(e,'assets/materials/TexturesCom_AsphaltDamaged0057_1_seamless_S.jpg" crossorigin="anonymous">\n\n          <a-mixin id="ground-grass" rotation="-90 0 0" geometry="primitive:plane;height:150;width:150" material="src:#grass-texture;repeat:5 5;roughness:1"></a-mixin>\n          <a-mixin id="ground-parking-lot" rotation="-90 0 0" geometry="primitive:plane;height:150;width:150" material="src:#parking-lot-texture;repeat:2 4;roughness:1"></a-mixin>\n          <a-mixin id="ground-asphalt" rotation="-90 0 0" geometry="primitive:plane;height:150;width:150" material="src:#asphalt-texture;repeat:5 5;roughness:1"></a-mixin>\n  \n          \x3c!-- ui / future use --\x3e\n          <img id="subtitle" src="').concat(e,'assets/materials/subtitle.png" crossorigin="anonymous" />\n  '));var i=this.parentNode;this.setAttribute("timeout",i.getAttribute("timeout")),this.parentNode.isScene=!0,Object.getPrototypeOf(i).attachedCallback.call(this),this.parentNode.isScene=!1}}},load:{value:function(){AFRAME.ANode.prototype.load.call(this,null,(function(t){return t.isAssetItem&&t.hasAttribute("src")}))}}})}),window.addEventListener("DOMContentLoaded",(function(e){if(!t){var i=document.querySelector("a-assets");i||(i=document.createElement("a-assets")),i.hasLoaded&&console.warn("Assets already loaded. May lead to bugs");var a=document.createElement("streetmix-assets");i.append(a),document.querySelector("a-scene").append(i)}})),document.addEventListener("DOMSubtreeModified",(function t(e){if("A-SCENE"===e.target.nodeName){var i=e.target.querySelector("a-assets");if(i||(i=document.createElement("a-assets"),e.target.append(i)),i.querySelector("streetmix-assets"))document.removeEventListener("DOMSubtreeModified",t);else{var a=document.createElement("streetmix-assets");i.append(a),document.removeEventListener("DOMSubtreeModified",t)}}}),!1)},391:(t,e,i)=>{var a=i(334);AFRAME.registerComponent("create-from-json",{schema:{jsonString:{type:"string",default:""}},update:function(t){var e=this.data,i=this.el;if(t.string&&e.string!==t.string)for(;i.firstChild;)i.removeChild(i.lastChild);a.appendChildElementsFromArray(JSON.parse(e.jsonString),i)}})},579:(t,e,i)=>{var a=i(844),n=i(394);i(234),i(391),i(631),i(485),AFRAME.registerComponent("street",{schema:{JSON:{type:"string"},type:{default:"streetmixSegmentsFeet"},left:{default:""},right:{default:""},showGround:{default:!0},showStriping:{default:!0}},update:function(t){var e=this.data;if(0!==e.JSON.length){var i=JSON.parse(e.JSON),s=a.processSegments(i.streetmixSegmentsFeet,e.showStriping);if(this.el.append(s),e.left||e.right){var r=n.calcStreetWidth(i.streetmixSegmentsFeet,e.autoStriping),o=a.processBuildings(e.left,e.right,r,e.showGround);this.el.append(o)}}else{if(void 0!==t.JSON&&0===t.JSON.length)return;console.log("[street]","No JSON provided yet, but it might be set at runtime")}}}),AFRAME.registerComponent("streetmix-loader",{dependencies:["street"],schema:{streetmixStreetURL:{type:"string"},streetmixAPIURL:{type:"string"}},update:function(t){var e=this.data,i=this.el;if(0!==e.streetmixAPIURL.length){var a=new XMLHttpRequest;console.log("[streetmix-loader]","GET "+e.streetmixAPIURL),a.open("GET",e.streetmixAPIURL,!0),a.onload=function(){if(this.status>=200&&this.status<400){var t=JSON.parse(this.response),e=t.data.street.segments;i.setAttribute("street","right",t.data.street.rightBuildingVariant),i.setAttribute("street","left",t.data.street.leftBuildingVariant),i.setAttribute("street","type","streetmixSegmentsFeet"),i.setAttribute("street","JSON",JSON.stringify({streetmixSegmentsFeet:e}))}else console.log("[streetmix-loader]","Loading Error: We reached the target server, but it returned an error")},a.onerror=function(){console.log("[streetmix-loader]","Loading Error: There was a connection error of some sort")},a.send()}else{if(e.streetmixStreetURL.length>0){var s=n.streetmixUserToAPI(e.streetmixStreetURL);return console.log("[streetmix-loader]","setting `streetmixAPIURL` to",s),void i.setAttribute("streetmix-loader","streetmixAPIURL",s)}console.log("[streetmix-loader]","Neither `streetmixAPIURL` nor `streetmixStreetURL` properties provided, please provide at least one.")}}})},199:t=>{t.exports.isSidewalk=function(t){return t.startsWith("sidewalk")||["scooter-drop-zone","bikeshare","flex-zone-curb","transit-shelter"].includes(t)},t.exports.createBuildingsArray=function(){var t,e,i=arguments.length>0&&void 0!==arguments[0]?arguments[0]:150,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"narrow";"narrow"===a||"wide"===a?(t=[{id:"SM3D_Bld_Mixed_4fl",width:5.25221},{id:"SM3D_Bld_Mixed_Double_5fl",width:10.9041},{id:"SM3D_Bld_Mixed_4fl_2",width:5.58889},{id:"SM3D_Bld_Mixed_5fl",width:6.47593},{id:"SM3D_Bld_Mixed_Corner_4fl",width:6.94809}],e="41431323432402434130303230234102402341"):"residential"===a&&(t=[{id:"SM_Bld_House_Preset_03_1800",width:20},{id:"SM_Bld_House_Preset_08_1809",width:20},{id:"SM_Bld_House_Preset_09_1845",width:20}],e="12021201210101212021201012012021201210");for(var n=0,s=0,r=[];s<i;){var o=t[parseInt(e[n])],l={tag:"a-entity",mixin:o.id,position:s+o.width/2+" 0 0"};r.push(l),s+=o.width,n++}return r},t.exports.filterBuildingsArrayByMixin=function(t,e){var i=[];return t.forEach((function(t,a){t.mixin===e&&i.push(t)})),i},t.exports.removePropertyFromArray=function(t,e){return t.forEach((function(t,i){delete t[e]})),t},t.exports.createClonedEntitiesArray=function(t){for(var e=t.mixin,i=void 0===e?"":e,a=t.step,n=void 0===a?15:a,s=t.radius,r=void 0===s?60:s,o=t.rotation,l=void 0===o?"0 0 0":o,d=t.positionXYString,c=void 0===d?"0 0":d,m=t.randomY,u=void 0!==m&&m,p=[],h=-1*r;h<=r;h+=n){var g={tag:"a-entity",position:c+" "+h};i&&(g.class=i,g.mixin=i),g.rotation=u?"0 "+Math.floor(361*randomTestable())+" 0":l,p.push(g)}return p},t.exports.getAmbientSoundJSON=function(t){var e={fence:"#suburbs-mp3",grass:"#suburbs-mp3","parking-lot":"#parking-lot-mp3",waterfront:"#waterfront",residential:"#suburbs2-mp3",narrow:"#ambientmp3",wide:"#ambientmp3"},i=[],a=null;return t.forEach((function(t,n){if(!a||a!==e[t]){var s={tag:"a-entity",class:"playme",sound:"src: "+e[t]+"; positional: false; loop: true"};i.push(s),a=e[t]}})),i},t.exports.createGroundArray=function(t){var e=[],i="ground-grass";if("waterfront"===t)return e;["narrow","wide"].includes(t)&&(i="ground-asphalt"),"parking-lot"===t&&(i="ground-parking-lot");var a={tag:"a-entity",position:"0 -0.2 0",mixin:i};return e.push(a),e}},334:t=>{function e(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var i=[],a=!0,n=!1,s=void 0;try{for(var r,o=t[Symbol.iterator]();!(a=(r=o.next()).done)&&(i.push(r.value),!e||i.length!==e);a=!0);}catch(t){n=!0,s=t}finally{try{a||null==o.return||o.return()}finally{if(n)throw s}}return i}}(t,e)||function(t,e){if(t){if("string"==typeof t)return i(t,e);var a=Object.prototype.toString.call(t).slice(8,-1);return"Object"===a&&t.constructor&&(a=t.constructor.name),"Map"===a||"Set"===a?Array.from(t):"Arguments"===a||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?i(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var i=0,a=new Array(e);i<e;i++)a[i]=t[i];return a}function a(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=document.createElement(t.tag);delete t.tag;for(var a=0,n=Object.entries(t);a<n.length;a++){var s=e(n[a],2),r=s[0],o=s[1];i.setAttribute(r,o)}return i}t.exports.createElementFromObject=a,t.exports.appendChildElementsFromArray=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],e=arguments.length>1?arguments[1]:void 0;return t.forEach((function(t,i){e.appendChild(a(t))})),e}},394:t=>{t.exports.streetmixUserToAPI=function(t){var e=new URL(t).pathname.split("/"),i=e[1],a=e[2];return"-"===i?"https://streetmix.net/api/v1/streets?namespacedId="+a:"https://streetmix.net/api/v1/streets?namespacedId="+a+"&creatorId="+i},t.exports.pathStartsWithAPI=function(t){var e=document.createElement("a");return e.href=t,"api"===e.pathname.split("/")[1]},t.exports.streetmixAPIToUser=function(t){function e(t,e){for(var i=t.split("&"),a=0;a<i.length;a++){var n=i[a].split("=");if(decodeURIComponent(n[0])===e)return decodeURIComponent(n[1])}console.log("Query variable %s not found",e)}var i=new URL(t).search.substring(1),a=e(i,"namespacedId"),n=e(i,"creatorId");return void 0===n&&(n="-"),"https://streetmix.net/"+n+"/"+a},t.exports.calcStreetWidth=function(t){var e=0;return t.forEach((function(t){var i=t.width;e+=.3048*i})),e}}},e={},function i(a){if(e[a])return e[a].exports;var n=e[a]={exports:{}};return t[a](n,n.exports,i),n.exports}(579);var t,e}));