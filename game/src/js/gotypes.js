


var mkgot=(ty)=>{
  switch (ty) {
    case 'X': return { //sample type
      len: 5, //horizontal space
      vpos: 600,
      reqRnd: () => ({ //called to express what bits you need this round.
        st: 0,
        end: 0,
        vpos: 0
      }),
      onCol: (ob) => { }, //called for every collision with ob
      doTurn: () => {  },  //called after req and collision to evaluate actions
                          //object should set it's turn animation queue
    };
    case 'A': return { //Avatar
      len: 5,
      vpos: 800,
      nextAct: null, //selected next action
      finalAct: null,
      reqRnd: () => ({}),  //figure out requested actions changes to areas
      onCol: (ob) => { }, //don't really care about collisions
      doTurn: function() {
        console.log("avatar doTurn");

        //action by action type
        switch (this.nextAct) {
          case 'J':
            console.log("we fucking jumping");
            this.aQ.push({st:0, et:1000, pos:this.pos+20, vpos: 500});
            break;
        }
      },
      aQ:[]
    };
    default:
     return null; //unknown obejct type
  }
}


var mkGOEl=(go)=>
{
  let df=document.importNode(document.querySelector('#'+go.ty+'_tem').content, true);
  go.el=df.querySelector('g');
  go.el.classList.add('team'+go.team,'type'+go.ty);
}

var mkgo=(ty,team,pos,vpos)=>
{
  var go=mkgot(ty);
  go.pos=pos;
  go.team=team;
  go.ty=ty;
  if (vpos) go.vpos=vpos;
  mkGOEl(go); //create the avatars as a DOM object
  return go;
}
