function mkCtl(go)
{
  //local controller
  ctl={
    go:go,
    init: function() {
      this.el=document.createElement('div');
      this.el.classList.add("team"+go.team,"ctltop");
      document.getElementById('full').appendChild(this.el);
      //add soem test buttons
      let e=document.createElement('div');
      e.classList.add('card');
      e.innerHTML='JUMP';
      e.onclick=()=>this.activeRes('J');
      this.el.appendChild(e);
    },
    activeRes: null,
    req: function (responder) { //game asks you for a move
      this.el.classList.add('active');
      this.activeRes=(res)=>{
        this.activeRes=null; //no more listening
        this.el.classList.remove('active');
        responder(res); //forward the response

      }
    },
  };
  //create the DOM elements for it
  ctl.init();
  return ctl;
}
