const W=[
[1,'CPU',[3],'O cérebro do computador: é nele que tudo é pensado.','Também chamado de processador. Lê as instruções dos programas e as executa.'],
[2,'ULA',[3],'O “matemático” que mora dentro do processador.','Faz as contas (somar, subtrair) e compara valores: este é maior, menor ou igual?'],
[3,'UC',[2],'O maestro do processador: diz a cada parte quando entrar em ação.','Lê cada instrução e manda as outras partes trabalharem na ordem certa. Tem só duas letras.'],
[4,'REGISTRADORES',[13],'Os post-its na mão do processador, para anotações rápidas.','Pequenos espaços dentro da CPU que guardam os valores usados agora. A palavra está no plural.'],
[5,'RAM',[3],'A mesa de trabalho do computador: o que está em uso fica aqui e some ao desligar.','Memória rápida e temporária. Quando falta energia, perde tudo.'],
[6,'ROM',[3],'O manual gravado de fábrica: dá para ler, mas não para mudar.','Guarda os programas básicos, como o que liga a máquina. Não esquece sem energia.'],
[7,'EEPROM',[6],'Como um caderno a lápis: dá para apagar e reescrever, e nada some ao desligar.','Parente da ROM que pode ser apagada e regravada por sinais elétricos. Começa com duas letras iguais.'],
[8,'FLASH',[5],'A memória que existe no pendrive e no cartão SD.','Não tem peças que se mexem, guarda dados sem energia e é bem rápida. Também está nos celulares.'],
[9,'CACHE',[5],'O atalho do processador: guarda o que ele usa toda hora, para não ir buscar longe.','Memória pequena e muito veloz que fica entre a CPU e a RAM. Lê-se “cáche”.'],
[10,'MEMORIADEMASSA',[7,2,5],'O armário grande do computador, onde ficam fotos, jogos e documentos para sempre.','É onde ficam o HD e o SSD. Começa com a palavra “memória”. Escreva tudo junto.'],
[11,'DMA',[3],'O entregador que leva dados de um lugar a outro sem incomodar o processador.','Permite que o disco, por exemplo, copie dados para a memória sem ocupar a CPU. Termina em A.'],
[12,'ADDRESSBUS',[7,3],'A rua com os números das casas: diz em qual endereço da memória mexer.','Caminho de mão única que leva só o endereço. “Address” é “endereço” em inglês.'],
[13,'DATABUS',[4,3],'A estrada de mão dupla por onde vão e voltam as informações.','Leva o conteúdo em si, não o endereço. “Data” é “dados” e “bus” é “barramento”.'],
[14,'MICROCONTROLADOR',[16],'Um mini computador completo em um único chip, escondido no micro-ondas e na máquina de lavar.','Reúne processador, memória e entradas e saídas em um só chip. É o que há dentro de uma placa Arduino.'],
[15,'DUALCORE',[4,4],'Um processador com dois “cérebros” trabalhando em equipe.','Em inglês, “dual” é dois e “core” é núcleo. Duas palavras juntas.'],
[16,'QUADCORE',[4,4],'Um processador com quatro “cérebros” trabalhando em equipe.','Em inglês, “quad” é quatro e “core” é núcleo. Duas palavras juntas.']
].map(([n,a,p,t,e])=>({n,a,p,t,e}));

/* ---------- Geração do layout (determinística) ---------- */
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function fits(g,a,r,c,d){
  const dr=d,dc=1-d,L=a.length;
  if(g.has((r-dr)+','+(c-dc))||g.has((r+dr*L)+','+(c+dc*L)))return -1;
  let x=0;
  for(let i=0;i<L;i++){
    const R=r+dr*i,C=c+dc*i,e=g.get(R+','+C);
    if(e){if(e.ch!==a[i]||(e.o&(d+1)))return -1;x++}
    else if(g.has((R+dc)+','+(C+dr))||g.has((R-dc)+','+(C-dr)))return -1;
  }
  return x;
}
function layout(seed){
  const rnd=rng(seed),g=new Map(),pl=[];
  const ws=[...W].sort((x,y)=>y.a.length-x.a.length+(rnd()-.5)*6);
  let b;
  const put=(w,r,c,d)=>{
    for(let i=0;i<w.a.length;i++){const k=(r+d*i)+','+(c+(1-d)*i),e=g.get(k);if(e)e.o|=d+1;else g.set(k,{ch:w.a[i],o:d+1})}
    pl.push({...w,r,c,d});
    const er=r+d*(w.a.length-1),ec=c+(1-d)*(w.a.length-1);
    b=b?{r0:Math.min(b.r0,r),r1:Math.max(b.r1,er),c0:Math.min(b.c0,c),c1:Math.max(b.c1,ec)}:{r0:r,r1:er,c0:c,c1:ec};
  };
  put(ws[0],0,0,0);
  for(const w of ws.slice(1)){
    let best=null,bs=-1e9;
    for(const [k,e] of g){
      if(e.o===3)continue;
      const [r0,c0]=k.split(',').map(Number),d=e.o===1?1:0;
      for(let i=0;i<w.a.length;i++){
        if(w.a[i]!==e.ch)continue;
        const r=r0-d*i,c=c0-(1-d)*i,x=fits(g,w.a,r,c,d);
        if(x<1)continue;
        const er=r+d*(w.a.length-1),ec=c+(1-d)*(w.a.length-1);
        const nh=Math.max(b.r1,er)-Math.min(b.r0,r)+1,nw=Math.max(b.c1,ec)-Math.min(b.c0,c)+1;
        const s=x*4-Math.max(nw,nh)*.6-nw*nh/40+rnd();
        if(s>bs){bs=s;best=[r,c,d]}
      }
    }
    if(!best)return null;
    put(w,...best);
  }
  return{pl,g,b,w:b.c1-b.c0+1,h:b.r1-b.r0+1};
}
let L=null;
for(let s=1,ok=0;ok<25&&s<4000;s++){
  const t=layout(s);if(!t)continue;ok++;
  const sc=Math.max(t.w,t.h)*1000+t.w*t.h;
  if(!L||sc<L.sc){t.sc=sc;L=t}
}

/* ---------- Construção da interface ---------- */
const $=id=>document.getElementById(id);
const G=$('grid'),CL=$('clues'),NOW=$('now'),wide=matchMedia('(min-width:901px)');
const lenOf=w=>w.a.length+' letras'+(w.p.length>1?' ('+w.p.join('+')+')':'');
const inp=new Map(),own=new Map(),cells=new Map();
const words=L.pl.sort((x,y)=>x.n-y.n);
let act=null,solvedN=0,wasCur=false;
const key=(r,c)=>r+','+c;
const nums=new Map();
words.forEach(w=>{
  w.cells=[];
  for(let i=0;i<w.a.length;i++){const k=key(w.r+w.d*i,w.c+(1-w.d)*i);w.cells.push(k);(own.get(k)||own.set(k,[]).get(k)).push(w)}
  const s=w.cells[0];(nums.get(s)||nums.set(s,[]).get(s)).push(w.n);
});
G.style.gridTemplateColumns='repeat('+L.w+',var(--cs))';
G.style.gridTemplateRows='repeat('+L.h+',var(--cs))';
function fit(){const w=document.querySelector('.gridwrap').clientWidth-30;document.documentElement.style.setProperty('--cs',Math.max(28,Math.min(42,Math.floor((w-(L.w-1)*3)/L.w)))+'px')}
fit();addEventListener('resize',fit);
for(const k of L.g.keys()){
  const [r,c]=k.split(',').map(Number);
  const d=document.createElement('div');d.className='cell';
  d.style.gridRow=r-L.b.r0+1;d.style.gridColumn=c-L.b.c0+1;
  const i=document.createElement('input');
  i.maxLength=2;i.autocomplete='off';i.autocapitalize='characters';i.spellcheck=false;
  i.setAttribute('aria-label','Linha '+(r-L.b.r0+1)+', coluna '+(c-L.b.c0+1));
  d.appendChild(i);
  if(nums.has(k)){const n=document.createElement('span');n.className='n';n.textContent=nums.get(k).join('/');d.appendChild(n)}
  G.appendChild(d);inp.set(k,i);cells.set(k,d);
  i.addEventListener('mousedown',()=>{wasCur=document.activeElement===i});
  i.addEventListener('click',()=>{const ws=own.get(k);if(wasCur&&ws.length>1){act=ws.find(x=>x!==act)||act;mark()}});
  i.addEventListener('focus',()=>{const ws=own.get(k);if(!act||!ws.includes(act))act=ws.find(x=>!x.solved)||ws[0];mark()});
  i.addEventListener('input',()=>{
    const v=i.value.normalize('NFD').replace(/[^A-Za-z]/g,'').toUpperCase().slice(-1);
    i.value=v;
    if(v)step(k,1);
    own.get(k).forEach(check);
  });
  i.addEventListener('keydown',e=>{
    if(e.key==='Backspace'&&i.value===''){e.preventDefault();step(k,-1,true)}
    const m={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]}[e.key];
    if(m){e.preventDefault();const nk=key(r+m[0],c+m[1]);if(inp.has(nk)){inp.get(nk).focus();const ws=own.get(nk),dd=m[0]?1:0,w=ws.find(x=>x.d===dd);if(w){act=w;mark()}}}
  });
}
function step(k,dir,clear){
  if(!act||!act.cells.includes(k))act=own.get(k)[0];
  let j=act.cells.indexOf(k)+dir;
  while(j>=0&&j<act.cells.length){
    const t=inp.get(act.cells[j]);
    if(!t.readOnly){if(clear)t.value='';t.focus();own.get(act.cells[j]).forEach(check);return}
    j+=dir;
  }
}
function mark(){
  cells.forEach(c=>c.classList.remove('act'));
  CL.querySelectorAll('.clue').forEach(c=>c.classList.remove('act'));
  if(!act){NOW.hidden=true;return}
  act.cells.forEach(k=>cells.get(k).classList.add('act'));
  const li=$('c'+act.n);li.classList.add('act');
  NOW.hidden=false;
  NOW.innerHTML='<span class="num">'+act.n+'</span><span class="nowtxt"><small>'+(act.d?'↓ vertical':'→ horizontal')+' · '+lenOf(act)+'</small>'+act.t+'</span>';
  if(wide.matches)li.scrollIntoView({block:'nearest',behavior:'smooth'});
}
function check(w){
  const li=$('c'+w.n);
  const s=w.cells.map(k=>inp.get(k).value).join('');
  li.querySelector('.msg').hidden=true;
  if(w.solved||s.length<w.a.length)return;
  if(s===w.a)solve(w);
  else{
    w.cells.forEach(k=>{if(!inp.get(k).readOnly){const c=cells.get(k);c.classList.remove('bad');void c.offsetWidth;c.classList.add('bad');setTimeout(()=>c.classList.remove('bad'),600)}});
    li.classList.remove('wrong');void li.offsetWidth;li.classList.add('wrong');
    const m=li.querySelector('.msg');m.hidden=false;
  }
}
function solve(w){
  w.solved=true;solvedN++;
  w.cells.forEach((k,i)=>{const c=cells.get(k);c.classList.remove('bad');c.classList.add('ok');c.style.animationDelay=i*50+'ms';inp.get(k).readOnly=true});
  const li=$('c'+w.n);li.classList.add('solved');li.classList.remove('wrong');li.querySelector('.extra').hidden=true;
  $('prog').textContent=solvedN+' de '+words.length;
  $('fill').style.width=solvedN/words.length*100+'%';
  if(solvedN===words.length)setTimeout(win,900);
}
function win(){
  $('modal').hidden=false;$('close').focus();
  const cols=['#3b5bdb','#2f9e44','#f59f00','#e03131','#ae3ec9','#1098ad'];
  for(let i=0;i<50;i++){
    const c=document.createElement('i');c.className='conf';
    c.style.left=Math.random()*100+'vw';c.style.background=cols[i%cols.length];
    c.style.animationDuration=2+Math.random()*2+'s';c.style.animationDelay=Math.random()*.8+'s';
    document.body.appendChild(c);setTimeout(()=>c.remove(),5000);
  }
}
words.forEach(w=>{
  const li=document.createElement('li');li.className='clue';li.id='c'+w.n;li.tabIndex=0;
  const len=lenOf(w);
  li.innerHTML='<div class="top"><span class="num">'+w.n+'</span><span>'+(w.d?'↓ vertical':'→ horizontal')+'</span><span>·</span><span>'+len+'</span></div>'
   +'<p>'+w.t+'</p><button class="hint">Dica extra</button><p class="extra" hidden>'+w.e+'</p><p class="msg" hidden>Ainda não é essa. Confira as letras que cruzam com outras palavras ou abra a dica extra.</p>';
  li.addEventListener('click',e=>{
    if(e.target.classList.contains('hint')){
      const x=li.querySelector('.extra');x.hidden=!x.hidden;e.target.textContent=x.hidden?'Dica extra':'Esconder dica extra';return;
    }
    act=w;mark();
    const free=w.cells.find(k=>!inp.get(k).value&&!inp.get(k).readOnly)||w.cells.find(k=>!inp.get(k).readOnly);
    if(free){const t=inp.get(free);t.focus({preventScroll:true});cells.get(free).scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'})}
  });
  li.addEventListener('keydown',e=>{if(e.target===li&&(e.key==='Enter'||e.key===' ')){e.preventDefault();li.click()}});
  CL.appendChild(li);
});
const shut=()=>{$('modal').hidden=true};
$('close').onclick=shut;
addEventListener('keydown',e=>{if(e.key==='Escape')shut()});
$('modal').addEventListener('click',e=>{if(e.target.id==='modal')shut()});
$('reset').onclick=()=>{
  words.forEach(w=>{w.solved=false;const li=$('c'+w.n);li.className='clue';li.querySelector('.extra').hidden=true;li.querySelector('.msg').hidden=true;li.querySelector('.hint').textContent='Dica extra'});
  inp.forEach((i,k)=>{i.value='';i.readOnly=false;const c=cells.get(k);c.className='cell';c.style.animationDelay=''});
  solvedN=0;act=null;$('prog').textContent='0 de '+words.length;$('fill').style.width='0';$('modal').hidden=true;
};

const TB=$('theme'),dm=matchMedia('(prefers-color-scheme:dark)');
TB.textContent=dm.matches?'☀️':'🌙';
TB.onclick=()=>{const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==='dark':dm.matches;r.dataset.theme=dark?'light':'dark';TB.textContent=dark?'🌙':'☀️'};
