
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
  start: function() {
    this.wel=document.getElementById('lines');
    this.cam=document.getElementById('wld');
    this.add('P',0,400,-1); //platforms
    this.add('P',1,700,-1);
    //select a bg type
    let bgt=["U","M","T","MMT","UUM"][Math.floor(Math.random()*5)];
    for (i=0;i<10;i+=1) {
       this.add(bgt.charAt(Math.floor(Math.random()*bgt.length)),0,280+i*50+Math.random()*40,Math.random()*3-5);
    }
    this.p1=this.addPlayer(0,mkUserDm());
    this.p2=this.addPlayer(1,mkAIDm(0,2,.5,3));

    this.setPos();
    this.setCamera();
    //run the initial set up of the frames
    this.runFrames(()=>{
      this.setCamera();
      this.turn(); //start the first turn
    })
  },
  addPlayer: function(team,dm) {
    let go=this.add('A',team,team?600:500,10);
    dm.go=go;
    return {
      go:go,
      ctl: mkCtl(go,dm)
    }
  },
  turn: function() {
    let p1d=false;
    let p2d=false;
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
    }
    //re-establish the distance
    this.runFrames(()=>{
      this.endTurn();
      if (!this.checkWin()) this.turn(); //do the next turn
    });
  },
  checkWin: function() {
    let winner=null
    if ((this.p1.go.health<0)||(this.p1.go.pos<300)) {
      winner=this.p1;
    }
    if ((this.p2.go.health<0)||(this.p2.go.pos>800)) {
      winner=this.p2;
    }
    if (!winner) return false;
    winner.go.aQ.push({st:0, et:200, curve: [8,108,208]});
    winner.go.aQ.push({st:200, et:400, curve: [8,104,201]});
    winner.go.aQ.push({st:400, et:600, curve: [8,103,208]});
    winner.go.aQ.push({st:600, et:1000, curve: [1,102,202], vpos:-1});
    this.runFrames(()=>{alert('over')});
    return false;
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
  cam_w:1200,
  cam_cp:600,
  setCamera: function() {
    //consider the center point
    let cpi=this.cam_cp;
    let cpe=(this.p1.go.pos+this.p2.go.pos)/2;

    //consider this zoom factor
    let wi=this.cam_w;
    let we=Math.abs(this.p1.go.pos-this.p2.go.pos)+400;
    if (we>1200) we=1200;
    let ar=this.cam.clientHeight/this.cam.clientWidth;

    let st=0;
    let al=(ts)=>{
      if (!st) st=ts-1;
      let t=ts-st;
      let r=t/1000;
      if (r>1) r=1;
      let w=li(r,wi,we);
      let cp=li(r,cpi,cpe);
      let h=w*ar;
      this.cam.setAttribute("viewBox",(cp-w/2)+" "+(980-h)+" "+w+" "+h);
      if (r<1)
        requestAnimationFrame(al)
    }
    requestAnimationFrame(al)
    this.cam_cp=cpe;
    this.cam_w=we;

  }
};

function start()
{
  let mobile=( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
  if (!mobile)  //swicth ont he filters
    document.getElementById('full').classList.add('hi');
  
  //gs.start();
  showMenu(mainmenu)
}


function li(r,x1,x2)
{
  return (x1*(1-r)+x2*r);
}
