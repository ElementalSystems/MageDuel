
var gs={
  go: [],
  killgo:[],
  add: function(type,team,pos,vpos)  {
    let v=mkgo(type,team,pos,vpos);
    this.go.push(v);
    this.wel.appendChild(v.el);
    if (v.init) v.init();
    return v;
  },
  remove: function(go) {
    this.killgo.push(go);
  },
  start: function(p1dm,p2dm,p1d,p2d,p1t,p2t) {
    this.wel=document.getElementById('lines');
    this.wel.innerHTML="";
    this.go=[];
    this.killgo=[];
    setTh(p1t,0);
    setTh(p2t,1);
    this.add('P',0,425,-1); //platforms
    this.add('P',1,675,-1);
    //select a bg type
    let bgt=["U","M","T","MMT","UUM"][Math.floor(Math.random()*5)];
    for (i=0;i<10;i+=1) {
       this.add(bgt.charAt(Math.floor(Math.random()*bgt.length)),0,280+i*50+Math.random()*40,Math.random()*3-5);
    }
    this.p1=this.addPlayer(0,p1dm,p1d,p1t);
    this.p2=this.addPlayer(1,p2dm,p2d,p2t);

    this.setPos();
    this.setCamera();
    msg('Ready',500,'info');
    //run the initial set up of the frames
    this.runFrames(()=>{
      this.setCamera();
      msg('Engage',1000,'info');
      this.turn(); //start the first turn
    })
  },
  addPlayer: function(team,dm,dck,th) {
    let go=this.add('A',team,team?600:500,10);
    dm.go=go;
    return {
      go:go,
      ctl: mkCtl(go,dm,dck,th)
    }
  },
  turn: function() {
    let p1d=false;
    let p2d=false;
    document.getElementById('full').focus();
    this.p1.ctl.req((ac)=>{
      this.p1.go.nextAct=ac;
      p1d=true;
      if (p2d) this.doTurn();
    })
    this.p2.ctl.req((ac)=>{
      this.p2.go.nextAct=ac;
      p2d=true;
      if (p1d) this.doTurn();
    })
  },
  doTurn: function() {
    this.go.forEach(o=>o.prepTurn?o.prepTurn():0);
    this.go.forEach(o=>o.doTurn?o.doTurn():0);
    this.go.forEach(o=>o.impTurn?o.impTurn():0);
    this.runFrames(()=>{
      this.judgeTurn();
    });
  },
  judgeTurn:function () {
    //first distancing rules
    let d=this.p2.go.pos-this.p1.go.pos;
    if (d<200) {
      let s=(200-d)/2;
      this.p1.go.aQ.push({ st:0, et:400, pos:this.p1.go.pos-s})
      this.p2.go.aQ.push({ st:0, et:400, pos:this.p2.go.pos+s})
      msg("Keep Distance",500,"info");
    }
    //re-establish the distance
    this.runFrames(()=>{
      this.endTurn();
      if (!this.checkWin()) this.turn(); //do the next turn
    });
  },
  checkWin: function() {
    let winner=null
    let tko=false;
    if (this.p2.go.pos>800) {
      winner=this.p1;
    } else if (this.p2.go.health<0) {
      winner=this.p1;
      tko=true;
    } else if (this.p1.go.pos<300) {
      winner=this.p2;
    } else  if (this.p1.go.health<0) {
      winner=this.p2;
      tko=true;
    }
    if (this.p1.ctl.deck.length<7) { //finished your deck
      winner=this.p1;
    }
    if (!winner) return false;
    let loser=(winner==this.p1)?this.p2:this.p1;
    //death animation for loser
    msg("Victory Awarded",2000,"vic");
    if (tko) {
      loser.go.aQ.push({st:0, et:200, curve: [8,108,208,1008,1108,1208]});
      loser.go.aQ.push({st:200, et:400, curve: [8,104,201]});
      loser.go.aQ.push({st:350, et:800, curve: [1,108,202]});
      loser.go.aQ.push({st:700, et:1000, curve: [8,108,208,1008,1108,1208]});
    } else {
      loser.go.aQ.push({st:0, et:200, curve: [1,102,208,1008,1108,1208]});
      loser.go.aQ.push({st:200, et:500, curve: [8,104,201]});
      loser.go.aQ.push({st:400, et:700, curve: [3,108,208], vpos:-2});
      loser.go.aQ.push({st:600, et:1000, curve: [8,108,208], vpos:-5});
    }
    //vicortu animation for winner
    winner.go.aQ.push({st:0, et:150, curve: [4,102,203,1004,1102,1203], vpos:2});
    winner.go.aQ.push({st:200, et:350, curve: [4,104,201,1004,1104,1201], vpos:3});
    winner.go.aQ.push({st:400, et:600, curve: [4,102,202,1004,1102,1202]});
    winner.go.aQ.push({st:600, et:1000, curve: [1,103,201,1001,1103,1201], vpos:2});
    this.runFrames(()=>{
      this.p1.ctl.kill();
      this.p2.ctl.kill();
      moveCam(550,800,820,500);
      //do the victory thing
      winner.go.aQ.push({st:0, et:1000, curve: [1,102,203,1001,1102,1203], pos: 550-50*(winner.go.team?-1:1), vpos:2});
      winner.go.aQ.push({st:1200, et:1350, curve: [4,104,201,1004,1104,1201], vpos:3});
      winner.go.aQ.push({st:1400, et:1600, curve: [4,102,202,1004,1102,1202]});
      winner.go.aQ.push({st:1600, et:3000, curve: [1,103,201,1001,1103,1201], vpos:5});
      loser.go.aQ.push({st:0, et:1000, curve: [1,101,208,1008,1108,1208], pos: 550-50*(loser.go.team?-1:1),vpos:2 });
      loser.go.aQ.push({st:1200, et:1500, curve: [3,104,201],vpos:1});
      loser.go.aQ.push({st:1400, et:1700, curve: [3,108,202]});
      loser.go.aQ.push({st:1600, et:2000, curve: [3,108,208]});
      loser.go.aQ.push({st:2000, et:3000, vpos:-4});
      this.runFrames(()=>{
        showMenu();
      });

    });
    return true;
  },
  endTurn: function() {
    this.setCamera();
    //remove  dead go
    this.killgo.forEach(go => {
      let i=this.go.indexOf(go);
      if (i>=0) {
        this.go[i].el.remove();
        this.go.splice(i,1);
      }
    });
    this.killgo=[]; //clear the list
  },
  setPos: function() {
    this.go.forEach((o)=>{
      o.el.style.transform='translate('+o.pos+'px,'+this.calcVP(o.vpos)+'px)';
      if (o.curve) {
        o.curve.forEach((c,i)=>{
            if ((!o.lcurve)||(c!=o.lcurve[i])) setCurve(o,i,c);
        });
        o.lcurve=o.curve.map(o=>o);
      }
    });
  },
  calcVP:function(vp) {
    return (830-(vp-1)*35);
  },
  runFrames:function (after) {
    let st=0;
    let al=(ts)=>{
      if (!st) st=ts-1;
      let t=ts-st;
      let going=false;
      this.go.forEach(go=>{ going=this.doAnimate(go,t*.5)||going;});
      this.setPos();
      if (!going) {
        after();
      } else
        requestAnimationFrame(al)
    }
    requestAnimationFrame(al);
  },
  doAnimate: function(go,t) {
    if (go.aQ&&go.aQ.length) {
      //take a look at the head of the cue
      let a=go.aQ[0];
      if (t<a.st) {
        return true; //not happening yet
      }
      if (t>=a.et) { //we done
        //so set the end conditions
        if (a.pos) go.pos=a.pos;
        if (a.vpos) go.vpos=a.vpos;
        go.aQ.shift(); //and kill me from the queue
        return this.doAnimate(go,t); //we should start on the next bit of the sequence if it exists
      }
      if (!a.ipos) a.ipos=go.pos;
      if (!a.ivpos) a.ivpos=go.vpos;
      if (!a.icurve) a.icurve=go.curve.map(o=>o);

      let r=(t-a.st)/(a.et-a.st);
      if (a.pos) go.pos=li(r,a.ipos,a.pos);
      if (a.vpos) go.vpos=li(r,a.ivpos,a.vpos);
      if (a.curve) //curves changing
        a.curve.forEach((c,i)=>{
          if (c) go.curve[i]=iCurve(r,a.icurve[i],curves[go.ty][c].curve)
        })
      //check for an interrupting item on the sequence
      for (let i=1;i<go.aQ.length;i+=1)
        if (go.aQ[i].st<t) {//it should have started
          //kill everyone below us
          go.aQ=go.aQ.slice(i);
          return this.doAnimate(go,t); //redo this step
        }
      return true;
    }
    return false;
  },
  setCamera: function() {
    //consider the center point
    let cp=(this.p1.go.pos+this.p2.go.pos)/2;
    //consider this zoom factor
    let we=Math.abs(this.p1.go.pos-this.p2.go.pos)+400;
    if (we>1200) we=1200;
    moveCam(cp,we,820,1000);
  }
};

function li(r,x1,x2)
{
  return (x1*(1-r)+x2*r);
}

let cam_w=1000,cam_cp=500,cam_ycp=200;

function moveCam(cpe,we,ycpe,mt) {
  let cpi=cam_cp;
  let ycpi=cam_ycp;
  let wi=cam_w;
  let cam=document.getElementById('wld');
  let ar=cam.clientHeight/cam.clientWidth;


  let st=0;
  let al=(ts)=>{
    if (!st) st=ts-1;
    let t=ts-st;
    let r=t/mt;
    if (r>1) r=1;
    let w=li(r,wi,we);
    let cp=li(r,cpi,cpe);
    let ycp=li(r,ycpi,ycpe);
    let h=w*ar;
    cam.setAttribute("viewBox",(cp-w/2)+" "+(ycp-h/2)+" "+w+" "+h);
    if (r<1)
      requestAnimationFrame(al)
  }
  requestAnimationFrame(al)
  cam_cp=cpe;
  cam_w=we;
  cam_ycp=ycpe;
}

function start()
{
  if (!detectMobile()) { //swicth ont he filters and the keyboard
    document.getElementById('full').classList.add('hi');
    document.getElementById('full').focus();
    document.getElementById('full').onkeydown=(e)=>{
      switch (e.key) {
        case '1': return gs.p1.ctl.dm.activeKey?gs.p1.ctl.dm.activeKey(0):0;
        case 'q': return gs.p1.ctl.dm.activeKey?gs.p1.ctl.dm.activeKey(1):0;
        case 'a': return gs.p1.ctl.dm.activeKey?gs.p1.ctl.dm.activeKey(2):0;
        case 'z': return gs.p1.ctl.dm.activeKey?gs.p1.ctl.dm.activeKey(3):0;
        case '9': return gs.p2.ctl.dm.activeKey?gs.p2.ctl.dm.activeKey(0):0;
        case 'i': return gs.p2.ctl.dm.activeKey?gs.p2.ctl.dm.activeKey(1):0;
        case 'j': return gs.p2.ctl.dm.activeKey?gs.p2.ctl.dm.activeKey(2):0;
        case 'n': return gs.p2.ctl.dm.activeKey?gs.p2.ctl.dm.activeKey(3):0;
      }
    };
  }

  //gs.start(mkMZDm(6),mkMZDm(6),"JBDFFSJBDFFSJBDFFS","BSCJD1F1C1DC1C1FDCSJCDCSJCDCSJCDCSJCDCSJC","p1","mz");
  showMenu(startmenu);
}

function detectMobile() {
  let isMobile = RegExp(/Android|webOS|iPhone|iPod|iPad/i)
   .test(navigator.userAgent);

  if (!isMobile) {
    const isMac = RegExp(/Macintosh/i).test(navigator.userAgent);

    if (isMac && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
      isMobile = true;
    }
  }
  return isMobile;
}
