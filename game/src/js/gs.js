
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
    this.p1=this.addPlayer(0);
    this.p2=this.addPlayer(1);
    this.setPos();
    this.setCamera();
    this.turn();
  },
  addPlayer: function(team) {
    let go=this.add('A',team,team?750:350);
    return {
      go:go,
      ctl: mkCtl(go)
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
    this.go.forEach(o=>o.prepTurn());
    this.go.forEach(o=>o.doTurn());
    this.go.forEach(o=>o.impTurn());
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
    //test for end of game
    this.runFrames(()=>{
      this.endTurn();
      this.turn();
    });
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
      this.go.forEach(go=>{ going=this.doAnimate(go,t*.2)||going;});
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
  cam_w:1000,
  cam_cp:600,
  setCamera: function() {
    //consider the center point
    let cpi=this.cam_cp;
    let cpe=(this.p1.go.pos+this.p2.go.pos)/2;

    //consider this zoom factor
    let wi=this.cam_w;
    let we=Math.abs(this.p1.go.pos-this.p2.go.pos)+400;
    if (we>1200) we=1200;

    let st=0;
    let al=(ts)=>{
      if (!st) st=ts-1;
      let t=ts-st;
      let r=t/1000;
      if (r>1) r=1;
      this.cam.setAttribute("viewBox",(li(r,cpi,cpe)-li(r,wi,we)/2)+" "+(950-li(r,wi,we)*.83)+" "+li(r,wi,we)+" "+(li(r,wi,we)*.83));
      if (r<1)
        requestAnimationFrame(al)
    }
    requestAnimationFrame(al)
    this.cam_cp=cpe;
    this.cam_w=we;

  }
};

var chkCol=(a,b)=>{
  if (!(a.vpos&b.vpos)) return false; //no overlapping v-plane
  if (a.end<b.st) return false; // a is left of b
  if (a.st>b.end) return false; //b is left of a
  return true;    //they overlap
}

function start()
{
  gs.start();
}


function li(r,x1,x2)
{
  return (x1*(1-r)+x2*r);
}
