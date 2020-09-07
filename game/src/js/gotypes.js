var mkgot = (ty) => {
  switch (ty) {
    case 'B':
      return { //Bolt
        prepTurn: function() {
            this.pose = this.pos + 150 * (this.team ? -1 : 1);
        },
        doTurn: function() {
          if ((this.pos > 1250) || (this.pos < -50)) gs.remove(this); //kill me if I'm off screen
          //consider if I hit any enemy objects
          let hits = gs.go.reduce((hits, go) => {
            if (go.team == this.team) return hits; //no an enemy
            if (!go.hit) return hits; //not a hitable thing
            //resolve the time the paths cross horizontally
            let t = (this.pos - go.pos) * 1000 / (go.pose - go.pos - this.pose + this.pos);
            if ((t <= 0) || (t >= 1000)) return hits; //not hapening this turn
            if (go.ty == 'A') { //check if vpos matches (avatar)
              console.log("vpos",go.vpos,"vpose",go.vpose);
              let vp = li(t/1000, go.vpos, go.vpose);
              console.log("vp",vp,"vpos",this.vpos);
              if (!((this.vpos < vp + .5) && (this.vpos > vp - go.vlen - .5))) return hits;
              console.log("seems iem we hit");
            } else { //check if vpos matches for narrow things
              if (this.vpos != go.vpos) return hits;
            }
            //we hit it
            hits.push({
              t: t,
              go: go,
            });
            return hits;
          }, []).sort((a, b) => a.t - b.t);
          if (hits) console.log(hits);
          if (hits.length) { //we got an earlies hit
            hits[0].go.hit(hits[0].t, this);
            this.explodeTime = hits[0].t;
          }
        },
        impTurn: function() {
          this.aQ.push({
            st: 0,
            et: 500,
            curve: [2],
            pos: this.pos + 75 * (this.team ? -1 : 1)
          });
          this.aQ.push({
            st: 500,
            et: 1000,
            curve: [1],
            pos: this.pos + 150 * (this.team ? -1 : 1)
          });
          if (this.explodeTime) {
            console.log("explodeAt",this.explodeTime)
            this.aQ.push({
              st: this.explodeTime,
              et: this.explodeTime + 400,
              curve: [3],
            });
            gs.remove(this);
          }
        },
        init: function() {
          this.curve=[curves.B[0].curve];
          this.aQ.push({st:0, et:1000, curve: [1]});
        },
        aQ: []
      };
    case 'S':
      return { //Shield
        life: 5,
          prepTurn: function() {
            this.pose = this.pos + 10 * (this.team ? -1 : 1);
          },
          doTurn: function() {
            this.life -= 1;
            if (this.life <= 0) gs.remove(this); //I'm over
          },
          impTurn: function() {
            this.aQ.push({
              st: 0,
              et: 500,
              curve: [2],
              pos: this.pos + 5 * (this.team ? -1 : 1)
            });
            this.aQ.push({
              st: 500,
              et: 1000,
              curve: [1],
              pos: this.pos + 10 * (this.team ? -1 : 1)
            });
            if (this.knockTime) {
              this.aQ.push({
                st: this.knockTime,
                et: this.knockTime+200,
                curve: [3],
              });
              this.aQ.push({
                st: this.knockTime+200,
                et: this.knockTime+400,
                curve: [2],
                pos: this.pos - 20 * (this.team ? -1 : 1)
              });
              this.knockTime=0;
            }
          },
          init: function() {
            this.curve=[curves.S[0].curve];
            this.aQ.push({
              st: 0,
              et: 1000,
              curve: [1],
              pos: this.pos + 20 * (this.team ? -1 : 1)
            });
          },
          hit: function(t) {
            this.knockTime=t;
            this.life -= 1;
          },
          aQ: []
      };

    case 'A':
      return { //Avatar
        len: 5,
        vlen: 1,
        vpos: 2,
        sret: -1,
        nextAct: null, //selected next action
        init: function() {
          this.curve=[curves.A[1].curve,curves.A[101].curve,curves.A[201].curve];
          //this.aQ.push({st:0, et:1000, curve: [1]});
        },
        hit: function(t, bullet) {
          this.hitTime = t;
        },
        prepTurn: function() {
          //just figure out where we are going to be
          let fS = (this.sret == 1);
          switch (this.nextAct) {
            case 'J':
              this.vpose = 4;
              this.pose = this.pos + 20 * (this.team ? -1 : 1);
              break;
            case 'D':
              this.vpose = 1;
              this.pose = this.pos + 20 * (this.team ? -1 : 1);
              break;
            case 'F':
              this.vpose = fS ? 2 : this.vpos
              this.pose = this.pos + 50 * (this.team ? -1 : 1);
              break;
            case 'B':
            case 'S':
              this.vpose = fS ? 2 : this.vpos
              this.pose = this.pos + 20 * (this.team ? -1 : 1);
              break;
            case 'X':
              this.vpose = fS ? 2 : this.vpos
              this.pose = this.pos;
              break;
          }
        },
        doTurn: function() {
          this.sret -= 1;
        },
        impTurn: function() {
          let fS = (this.sret == 0);
          //action by action type
          switch (this.nextAct) {
            case 'J':
              this.aQ.push({
                st: 0,
                et: 900,
                pos: this.pos + 15 * (this.team ? -1 : 1),
                vpos: 4.1
              });
              this.aQ.push({
                st: 900,
                et: 1000,
                pos: this.pos + 20 * (this.team ? -1 : 1),
                vpos: 4
              });
              this.sret = 2;
              break;
            case 'D':
              this.aQ.push({
                st: 0,
                et: 1000,
                pos: this.pos + 20 * (this.team ? -1 : 1),
                curve: [3],
                vpos: 1
              });
              this.sret = 2;
              break;
            case 'F':
              this.aQ.push({
                st: 0,
                et: 250,
                curve: [2],
                pos: this.pos + 12 * (this.team ? -1 : 1),
              });
              this.aQ.push({
                st: 250,
                et: 500,
                curve: [1],
                pos: this.pos + 24 * (this.team ? -1 : 1),
              });
              this.aQ.push({
                st: 500,
                et: 750,
                curve: [2],
                pos: this.pos + 36 * (this.team ? -1 : 1),
                vpos: fS ? 2 : this.vpos
              });
              this.aQ.push({
                st: 750,
                et: 1000,
                curve: [1],
                pos: this.pos + 48 * (this.team ? -1 : 1),
              });
            break;
            case 'X':
              this.aQ.push({
                st: 0,
                et: 500,
                curve: [2],
                pos: this.pos + 10 * (this.team ? -1 : 1),
              });
              this.aQ.push({
                st: 500,
                et: 1000,
                curve: [1],
                vpos: fS ? 2 : this.vpos,
                pos: this.pos + 20 * (this.team ? -1 : 1),
              });
              break;
            case 'B':
            case 'S':
              if (!this.hitTime)
                gs.add(this.nextAct, this.team, this.pos + 40 * (this.team ? -1 : 1), this.vpos);
                this.aQ.push({
                  st: 0,
                  et: 200,
                  curve: [0, 102],
                  pos: this.pos + 20 * (this.team ? -1 : 1)
                });
                this.aQ.push({
                  st: 200,
                  et: 500,
                  curve: [0, 101],
                  pos: this.pos + 20 * (this.team ? -1 : 1)
                });
                this.aQ.push({
                st: 500,
                et: 800,
                pos: this.pos+5,
                curve: [0, 102],
                vpos: fS ? 2 : this.vpos
              });
              this.aQ.push({
                st: 800,
                et: 1000,
                curve: [0, 101],
                pos: this.pos + 10 * (this.team ? -1 : 1)
              });
              break;
          }
          if (this.hitTime) {
            this.aQ.push({
              st: this.hitTime,
              et: this.hitTime + 500,
              pos: this.pos - 80 * (this.team ? -1 : 1),
              vpos: 2,
            });
            this.hitTime = 0;
          }
        },
        aQ: []
      };
    default:
      return null; //unknown obejct type
  }
}


var mkGOEl = (go) => {
  let df = document.importNode(document.querySelector('#' + go.ty + '_tem').content, true);
  go.el = df.querySelector('g');
  go.pels = df.querySelectorAll('path');
  console.log(go.pels)
  go.el.classList.add('team' + go.team, 'type' + go.ty);
}

var mkgo = (ty, team, pos, vpos) => {
  var go = mkgot(ty);
  go.pos = pos;
  go.team = team;
  go.ty = ty;
  if (vpos) go.vpos = vpos;
  mkGOEl(go); //create the avatars as a DOM object
  return go;
}
