
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
    this.p1=this.addPlayer(0);
    this.p2=this.addPlayer(1);
    this.setPos();
    this.turn();
  },
  addPlayer: function(team) {
    let go=this.add('A',team,team?850:250);
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
    this.runFrames();
  },
  endTurn: function() {
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
      o.el.style.transform='translate('+o.pos+'px,'+(900-o.vpos*50)+'px)';
    })
  },
  runFrames:function () {
    let st=0;
    let al=(ts)=>{
      if (!st) st=ts-1;
      let t=ts-st;
      let going=false;
      this.go.forEach(go=>{ going=this.doAnimate(go,t)||going;});
      this.setPos();
      if (!going) {
        this.endTurn();
        this.turn();
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
      let r=(t-a.st)/(a.et-a.st);
      if (a.pos) go.pos=li(r,a.ipos,a.pos);
      if (a.vpos) go.vpos=li(r,a.ivpos,a.vpos);
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
