var mainmenu=[
  {
    t:"MAGE - 404 ",
  },
  {
    t:"Advanced Elemental Combat---------a game by elementalsystems",
  },
  {
    t:"Learn to Duel",
    cmd: ()=> showMenu(smenu),
  },
  {
    t:"Duel with the Masters",
    cmd: ()=> gs.start(),
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
    t:"Learn how to duel using the fundimental magical forces with Master Zenita",
  },
  {
    t:"Basic Dueling",
  },
  {
    t:"Close Quarters Combat",
  },
  {
    t:"",
  },
  {
    t:"back to MAIN MENU",
    cmd: ()=> showMenu(mainmenu),
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
  },
  {
    t:"PvP - Close Quarters Deck",
  },
  {
    t:"PvP - Advanced Deck",
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
    if (r>1) r=1;
    e.setAttribute("startOffset",(1-r)*len);
    if (r<1)
      requestAnimationFrame(al)
  }
  requestAnimationFrame(al)
}


function showMenu(m)
{
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
