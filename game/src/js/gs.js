
var gs={
  go: [],

  add: function(type,team,pos,vpos)  {
    let v=mkgo(type,team,pos,vpos);
    this.go.push(v);
    this.wel.appendChild(v.el);
    return v;
  },
  start: function() {
    this.wel=document.getElementById('lines');
    this.p1=this.addPlayer(0);
    this.p2=this.addPlayer(1);
    this.setPos();
    this.turn();
  },
  addPlayer: function(team) {
    let go=this.add('A',team,team?900:200);
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
    /*
    let s=this.go.map(o=>({ go:o, r:o.reqRnd()})); //list of areas
    s.forEach(s1=>{ //for each area check overlaps
      let cols=s.filter(s2=>(s1!=s2)&&(chkCol(s1.r,s2.r)));
      if (cols) s1.go.onCol(cols);
    });*/
    this.go.forEach(o=>o.doTurn());
    this.runFrames()
  },
  setPos: function() {
    this.go.forEach((o)=>{
      o.el.style.transform='translate('+o.pos+'px,'+o.vpos+'px)';
    })
  },
  runFrames:function () {
    let st=0;
    let al=(ts)=>{
      if (!st) st=ts-1;
      let t=ts-st;
      console.log("frame time: t"+t);
      if (t>=1000) {
        t=1000;
        this.turn();
      } else
        requestAnimationFrame(al); //stil more to run
      this.go.forEach(go=>this.doAnimate(go,t));
      this.setPos();
    }
    console.log("starting");
    requestAnimationFrame(al);
  },
  doAnimate: function(go,t) {
    if (go.aQ&&go.aQ.length) {
      //take a look at the head of the cue
      let a=go.aQ[0];
      console.log("got a queue",a,t);
      if (t<a.st) {
        console.log("waiting to start");
        return true; //not happening yet
      }
      if (t>=a.et) { //we done
        console.log("completed");

        //so set the end conditions
        if (a.pos) go.pos=a.pos;
        if (a.vpos) go.vpos=a.vpos;
        go.aQ.pop(); //and kill me from the queue
        return this.doAnimate(go,t); //we should start on the next bit of the sequence if it exists
      }
      console.log("working it");
      if (!a.ipos) a.ipos=go.pos;
      if (!a.ivpos) a.ivpos=go.vpos;
      let r=(t-a.st)/(a.et-a.st);
      console.log("animatung struff",a,r);
      if (a.pos) go.pos=li(r,a.ipos,a.pos);
      if (a.vpos) go.vpos=li(r,a.ivpos,a.vpos);
      return true;
    }
    return false;
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
