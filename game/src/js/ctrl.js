function mkCtl(go)
{
  //local controller
  ctl={
    go:go,
    init: function() {
      this.el=document.createElement('div');
      this.el.classList.add("team"+go.team,"ctltop");
      document.getElementById('full').appendChild(this.el);
      this.deck=shuffle(stdDeck,2)+shuffle(stdDeck,2);
      //add soem test buttons
      this.drawCard();
      this.drawCard();
      this.drawCard();
      this.drawCard();
      this.drawCard();
      this.drawCard();
    },
    drawCard: function() {
      this.addCard(this.deck.charAt(0));
      this.deck=this.deck.substring(1);
    },
    addCard: function(cc)
    {
      let cd=cds[cc];
      let e=document.createElement('div');
      e.classList.add('card');
      e.innerHTML=cd.t;
      e.onclick=()=> {
        if (this.activeRes) {
          this.activeRes(cc);
          e.remove();//kill me
          this.drawCard();
        }
      }
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
  ctl.init();
  return ctl;
}
