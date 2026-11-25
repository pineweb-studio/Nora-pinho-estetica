const AREAS=[["Buço",50,50],["Maçã do rosto",60,60],["Pescoço",50,50],["Barba completa",120,120],["Axilas",85,140],["Braço ou antebraço",80,100],["Peitoral",80,80],["Abdômen",80,150],["Costas",100,270],["Virilha",150,180],["Glúteo",80,130],["Região anal",50,50],["Coxa",110,180],["Perna",100,150]];
const sel=new Set();
const $=id=>document.getElementById(id);
const fmt=v=>"R$ "+v.toLocaleString("pt-BR");
const faixa=(a,b)=>a===b?fmt(a):fmt(a)+" a "+fmt(b);
const zonas=[...document.querySelectorAll(".figura .z")];
const reduz=matchMedia("(prefers-reduced-motion: reduce)").matches;
zonas.forEach(z=>{
  const i=+z.dataset.a;
  z.setAttribute("tabindex","0");z.setAttribute("role","button");
  z.setAttribute("aria-label",AREAS[i][0]+", "+faixa(AREAS[i][1],AREAS[i][2]));
  z.addEventListener("click",()=>toggle(i,z));
  z.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();toggle(i,z)}});
  z.addEventListener("mouseenter",()=>dica(i));
  z.addEventListener("focus",()=>dica(i));
});
function dica(i){$("dica").innerHTML="<b>"+AREAS[i][0]+"</b> · "+faixa(AREAS[i][1],AREAS[i][2])}
function scan(z){
  if(reduz)return;
  const b=z.getBBox(),sc=$("scan");
  sc.setAttribute("x",b.x-4);sc.setAttribute("width",b.width+8);sc.setAttribute("y",b.y);
  sc.style.setProperty("--dy",b.height+"px");
  sc.classList.remove("go");void sc.getBBox();sc.classList.add("go");
}
function toggle(i,z){
  sel.has(i)?sel.delete(i):sel.add(i);
  $("erro").textContent="";dica(i);
  if(sel.has(i)){scan(z);zonas.filter(x=>+x.dataset.a===i).forEach(x=>{x.classList.remove("zap");void x.getBBox();x.classList.add("zap")})}
  upd();
}
function calc(){let lo=0,hi=0,n=[];[...sel].sort((x,y)=>x-y).forEach(i=>{lo+=AREAS[i][1];hi+=AREAS[i][2];n.push(AREAS[i][0])});return{lo,hi,n}}
function upd(){
  zonas.forEach(z=>{const on=sel.has(+z.dataset.a);z.classList.toggle("on",on);z.setAttribute("aria-pressed",on)});
  const {lo,hi,n}=calc();
  $("qtd").textContent=sel.size?sel.size+(sel.size>1?" áreas escolhidas":" área escolhida"):"Nenhuma área escolhida";
  const ul=$("lista");ul.innerHTML="";
  [...sel].sort((x,y)=>x-y).forEach(i=>{
    const li=document.createElement("li");
    li.innerHTML="<span>"+AREAS[i][0]+"</span><span>"+faixa(AREAS[i][1],AREAS[i][2])+'<button type="button" aria-label="Tirar '+AREAS[i][0]+'">×</button></span>';
    li.querySelector("button").addEventListener("click",()=>{sel.delete(i);upd()});
    ul.appendChild(li);
  });
  $("tot").textContent=sel.size?faixa(lo,hi):"R$ 0";
  $("gratis").textContent=n.some(x=>x==="Braço ou antebraço"||x==="Perna")?"Mãos, pés e dedos saem grátis com braço ou perna":"";
}
function lado(costas){
  const fig=$("figura");
  const troca=()=>{$("frente").style.display=costas?"none":"";$("costas").style.display=costas?"":"none"};
  if(reduz){troca()}else{fig.classList.add("vira");setTimeout(()=>{troca();fig.classList.remove("vira")},180)}
  $("dica").textContent=costas?"Vista de costas: costas, glúteo, região anal, braços e pernas":"Vista de frente: rosto, peito, abdômen, virilha, braços e pernas";
  $("ver-frente").setAttribute("aria-pressed",!costas);$("ver-costas").setAttribute("aria-pressed",costas);
}
$("ver-frente").addEventListener("click",()=>lado(false));
$("ver-costas").addEventListener("click",()=>lado(true));
$("enviar").addEventListener("click",()=>{
  if(!sel.size){$("erro").textContent="Escolha pelo menos uma área no corpo para agendar.";return}
  const {lo,hi,n}=calc();
  const msg="Olá, Nora! Quero agendar uma avaliação para depilação a laser: "+n.join(", ")+". Valor estimado: "+faixa(lo,hi)+".";
  const a=document.createElement("a");a.href="https://wa.me/5532984865813?text="+encodeURIComponent(msg);a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove();
});
[4,9].forEach(i=>sel.add(i));
$("feixe").style.setProperty("--h",$("hero").offsetHeight+"px");
upd();
