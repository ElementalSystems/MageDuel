var startmenu=[
  {
    t:"MAGIK - 404 ",
  },
  {
    t:"----a tactical turn game of magical duels by elementalsystems-------",
  },
  {
    t:"",
  },
  {
    t:"",
  },
  {
    t:"Enter the MAGIK UNIVERSITY",
    cmd: ()=> {
      fullScreen();
      setTimeout(()=>showMenu(mainmenu),100);
    }
  },
];


var mainmenu=[
  {
    t:"MAGIK - 404 ",
  },
  {
    t:"The Advanced Martial Use of Unnatural Energies",
  },
  {
    t:"Classroom: Learn to Duel",
    cmd: ()=> showMenu(smenu),
  },
  {
    t:"Duel with the Faculty Members",
    cmd: ()=> showMenu(fmenu),
  },
  {
    t:"Duel with another Player",
    cmd: ()=> showMenu(pmenu),
  },
];

var smenu=[
  {
    t:"Classroom Learning 404",
  },
  {
    t:"Discover the fundimental magical forces with Master Zenita",

  },
  {
    t:"Basic Dueling",
    cmd: ()=> gs.start(mkUserDm(),mkMZDm(0),"JDJDFJDFSDSSDBSBSSJDSSS","111B1DBJ1BB1BDBJBJB1SDSJ",'p1','mz')
  },
  {
    t:"Close Quarters Combat",
    cmd: ()=> gs.start(mkUserDm(),mkMZDm(6),"FFDJFDJSSCCJCDCCCSSSSSS","1F1C1DC1C1FDCSJCDCSJCDCSJCDCSJCDCSJC",'p1','mz'),
  },
  {
    t:"",
  },
  {
    t:"back to MAIN MENU",
    cmd: ()=> showMenu(mainmenu),
  },
];

var fmenu=[
  {
    t:"Practice Halls",
  },
  {
    t:"Challenge students and staff for single player dueling",
  },
  {
    t:"Students in the Class",
    cmd: ()=> showMenu(fmenu1),

  },
  {
    t:"Teachers and Assistants",
    cmd: ()=> showMenu(fmenu2),
  },
  {
    t:"The Master Magi",
    cmd: ()=> showMenu(fmenu3),
  },
  {
    t:"back to MAIN MENU",
    cmd: ()=> showMenu(mainmenu),
  },
];

var fmenu1=[
  {
    t:"The Students Rooms",
  },
  {
    t:"Not the happiest bunch but they're the only classmates you have.",
  },
  {
    t:"Daft Darius * Basic",
    cmd: ()=>{
      gs.start(mkUserDm(),mkAIDm(6,1,0,1),decks.basic(),decks.basic(),'p1','dd');
    }
  },
  {
    t:"Crazy K * Close Quarters",
    cmd: ()=>{
      gs.start(mkUserDm(),mkAIDm(2,1,0,2),decks.qq(),decks.qq(),"p1","ck");
    }
  },
  {
    t:"Timid Jay * Basic",
    cmd: ()=>{
      gs.start(mkUserDm(),mkAIDm(2,0,5,0),decks.basic(),decks.basic(),'p1','tj');
    }
  },
  {
    t:"back to the PRACTICE HALLS",
    cmd: ()=> showMenu(fmenu),
  },
];

var fmenu2=[
  {
    t:"Learning Experiences",
  },
  {
    t:"Take on some more experienced wizards in a fearsome duel.",
  },
  {
    t:"Marcus X * Basic",
    cmd: ()=>{
      gs.start(mkUserDm(),mkAIDm(1,1,2,3),decks.basic(),decks.basic(),'p1','mx');
    }
  },
  {
    t:"'Killer' Adams * Close Quarters",
    cmd: ()=>{
      gs.start(mkUserDm(),mkAIDm(1,5,1,5),decks.qq(),decks.qq(),'p1','ka');
    }
  },
  {
    t:"Warlock Wilson * Full",
    cmd: ()=>{
      gs.start(mkUserDm(),mkAIDm(1,0,5,1),decks.full(),decks.full(),'p1','ww');
    }
  },
  {
    t:"back to the PRACTICE HALLS",
    cmd: ()=> showMenu(fmenu),
  },
];


var fmenu3=[
  {
    t:"Meet the Masters",
  },
  {
    t:"Prove yourself against some skilled duelists.",
  },
  {
    t:"Master Zendaro * Full",
    cmd: ()=>{
      gs.start(mkUserDm(),mkAIDm(0,2,5,3),decks.full(),decks.full(),'p1','mz');
    }
  },
  {
    t:"Admiral Jamie Ent * Close Quarters",
    cmd: ()=>{
      gs.start(mkUserDm(),mkAIDm(0,6,3,3),decks.qq(),decks.qq(),'p1','aj');
    }
  },
  {
    t:"Master Zi * Full",
    cmd: ()=>{
      gs.start(mkUserDm(),mkAIDm(0,2,5,2),decks.full(),decks.full(),'p1','zz');
    }
  },
  {
    t:"back to the PRACTICE HALLS",
    cmd: ()=> showMenu(fmenu),
  },
];


var pmenu=[
  {
    t:"The Duelling Courtyard",
  },
  {
    t:"Two players duel on one device",
  },
  {
    t:"PvP - Basic Deck",
    cmd: ()=>{
      gs.start(mkUserDm(),mkUserDm(),decks.basic(),decks.basic(),'p1','p2');
    }
  },
  {
    t:"PvP - Close Quarters Deck",
    cmd: ()=>{
      gs.start(mkUserDm(),mkUserDm(),decks.qq(),decks.qq(),'p1','p2');
    }
  },
  {
    t:"PvP - Advanced Deck",
    cmd: ()=>{
      gs.start(mkUserDm(),mkUserDm(),decks.full(),decks.full(),'p1','p2');
    }
  },
  {
    t:"back to MAIN MENU",
    cmd: ()=> showMenu(mainmenu),
  },
];


function animateOffset(e,len,off)
{
  let st=0;
  let al=(ts)=>{
    if (!st) st=ts-1;
    let t=ts-st-off;
    let r=t/1000;
    if (r<0) r=0;
    if (r>1) r=1;
    e.setAttribute("startOffset",(1-r)*len);
    if (r<1)
      requestAnimationFrame(al)
  }
  requestAnimationFrame(al)
}

let lMenu=null;

function showMenu(m)
{
  if (!m) m=lMenu;
  lMenu=m;
  moveCam(500,1000,200,1000);
  //find the menu
  let me=document.getElementById("menu");
  me.innerHTML="";
  m.forEach((mi,i)=>{
    //clone and add a menu item from the template
    let df = document.importNode(document.querySelector('#Menu_tem').content, true);
    let tp = df.querySelector('textPath');
    let e = df.querySelector('text');
    tp.innerHTML=mi.t;
    tp.setAttribute("href","#tp"+i);
    tp.onclick=()=>{
      mi.cmd();
    }
    me.appendChild(e);
    animateOffset(tp,1000,(i>1)?(i*200+500):0);
  })
}


let msgto=0;
function msg(txt,tm,cls)
{
  let d=document.getElementById('msg');

  if (msgto) {
    clearTimeout(msgto);
    d.classList.remove('act');
  }
  setTimeout(()=>{
    d.innerHTML=txt;
    d.classList.add('act',cls);
  },10);
  msgto=setTimeout(()=>{
    d.classList.remove('act',cls);
  },tm);
}


var _fullScreenAttempt=0
function fullScreen() {
  if (_fullScreenAttempt) return;
  var docEl = window.document.documentElement;
  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  requestFullScreen.call(docEl);
  _fullScreenAttempt+=1;
}
