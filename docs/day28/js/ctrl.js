function mkCtl(go, dm) {
  //local controller
  ctl = {
    go: go,
    init: function() {
      let df = document.importNode(document.querySelector('#Ctl_tem').content, true);
      this.el = df.querySelector('div.ctltop');
      this.crdsel = df.querySelector('div.crds');
      this.el.classList.add("team" + go.team);
      document.getElementById('full').appendChild(this.el);
      this.deck = shuffle(stdDeck, 2) + shuffle(stdDeck, 2) + shuffle(stdDeck, 2);
      this.drawCard();
      this.drawCard();
      this.drawCard();
      this.drawCard();
      this.drawCard();
      this.drawCard();
      this.drawCard();
    },
    drawCard: function() {
      this.addCard(this.deck.charAt(0));
      this.deck = this.deck.substring(1);
    },
    addCard: function(cc) {
      let cd = cds[cc];
      let df = document.importNode(document.querySelector('#Card_tem').content, true);
      let e = df.querySelector('div.card');
      e.gameAction = cc;
      let n = df.querySelector('span.name');
      if (curves[cc]) {
        let p = df.querySelector('path');
        p.setAttribute('d', decodeCurve(curves[cc][1].curve));
      }
      n.innerHTML = cd.t;
      e.onclick = () => {
        if (dm.activeRes) {
          dm.activeRes(e);
        }
      }
      this.crdsel.appendChild(e);
    },
    req: function(responder) { //game asks you for a move
      this.setCs();
      if (this.cardOut) {
        this.cardOut.remove();
        this.drawCard();
        this.cardOut = null;
      }
      this.el.classList.add('active');
      let ops = Array.from(this.el.querySelectorAll('div.card')).slice(0, 3);
      console.log(ops);
      dm.choose(ops, (e) => {
        e.classList.add("used");
        this.cardOut = e;
        this.el.classList.remove('active');
        responder(e.gameAction);
      });
    },
    setCs: function() { //set variables for controls
      this.el.style.setProperty("--hth", this.go.health + '%')
    }
  };
  ctl.init();
  return ctl;
}

function mkUserDm() {
  return {
    choose: function(ops, res) {
      this.activeRes = (e) => {
        this.activeRes = null
        res(e);
      }
    },
    activeRes: null,
  }
}

function mkAIDm(air, aif, ais, aia) {
  return {
    choose: function(ops, res) {
      setTimeout(() => {
        res(this.think(ops, res));
      }, Math.random() * 600);
    },
    think: function(ops, res) {
      let list = ops.map(o => ({
        o: o,
        a: o.gameAction,
        sc: this.evalOp(o.gameAction)
      })).sort((a, b) => (b.sc - a.sc));
      console.log(list);
      return list[0].o;
    },
    evalOp: function(ga) {
      let sc = Math.random() * air; //we have some random thinking
      let p = this.go.pos;
      let v = this.go.vpos;
      let p2 = gs.p1.go.pos;
      let d = p - p2;

      console.log(d,v);
      switch (ga) {
        case 'F':
          sc += aif + (p > 700 ? 2 + 5 * ais : 0) + (p2 < 400 ? 3 * aif + 3 * aia : 0) +(d > 500 ? 3 * aif: 0) ;
          break;
        case 'B':
          sc += aia + (d > 350 ? aia : 0);
          sc -= this.countGOs('S', 300, v, v) * 5 + this.countGOs('S', 1000, v, v) * 2;
          break;
        case 'C':
          sc += (d < 300 ? aia * 2 + aif : 0) + (d < 250 ? aia * 5 + aif : 0);
          sc -= this.countGOs('S', 300, v, v) * 5;
          break;
        case 'J':
          sc += aif + this.countGOs('B', 500, 1, 2) * ais * 2 + this.countGOs('C', 300, 1, 1) * ais * 4;
          sc -= this.countGOs('B', 300, 4, 4) * ais * 2;
          break;
        case 'D':
          sc += aif + this.countGOs('B', 500, 2, 2) * ais * 2 + this.countGOs('C', 300, 4, 4) * ais * 4;
          sc -= this.countGOs('B', 300, 1, 1) * ais * 2;
          break;
        case 'S':
          sc += ais * 2 + this.countGOs('B', 800, v, v) * ais + this.countGOs('B', 500, v, v) * ais * 3 + this.countGOs('C', 400, v, v) * ais * 5;
          break;
      }
      return sc;
    },
    countGOs:function (ty,dist,vs,ve) {
      let c=0;
      gs.go.forEach(go=>{
        if (go.team) return; //not p2 side
        if (go.ty!=ty) return; //not the rigth kind
        if (dist<(this.go.pos-go.pos)) return;
        if (vs>go.vpos) return;
        if (ve<go.vpos) return;
        c+=1;
      })
      return c;
    },

    activeRes: null,
  }
}
