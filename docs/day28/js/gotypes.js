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
              let vp = li(t/1000, go.vpos, go.vpose);
              if (!((this.vpos < vp + .5) && (this.vpos > vp - go.vlen - .5))) return hits;
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
            hits[0].go.hit(hits[0].t, this,30,80);
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
    case 'C':
      return { //Cone
        action: 0,
        prepTurn: function() {
            this.pose = this.pos + 80 * (this.team ? -1 : 1);
        },
        doTurn: function() {
          this.action+=1;
          //consider if I hit any enemy objects
          let hits = gs.go.reduce((hits, go) => {
            if (go.team == this.team) return hits; //no an enemy
            if (!go.hit) return hits; //not a hitable thing
            //resolve the time the paths cross horizontally
            let t = (this.pos - go.pos) * 1000 / (go.pose - go.pos - this.pose + this.pos);
            if ((t <= 0) || (t >= 1000)) return hits; //not hapening this turn
            if (go.ty == 'A') { //check if vpos matches (avatar)
              let vp = li(t/1000, go.vpos, go.vpose);
              if (Math.abs(this.vpos - vp)>2.1) return hits;
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
          if (hits.length) { //we got an earlies hit
            hits[0].go.hit(hits[0].t, this,45,40);
            this.explodeTime = hits[0].t;
          }
        },
        impTurn: function() {
          if (this.action==1)
            this.aQ.push({
              st: 0,
              et: 1000,
              curve: [1],
              pos: this.pos + 80 * (this.team ? -1 : 1)
            });
          else {
            this.aQ.push({
              st: 0,
              et: 800,
              curve: [2],
              pos: this.pos + 70 * (this.team ? -1 : 1)
            });
            this.aQ.push({
              st:800,
              et: 1000,
              curve: [3],
              pos: this.pos + 80 * (this.team ? -1 : 1)
            });
          }
          if (this.explodeTime) {
            this.aQ.push({
              st: this.explodeTime,
              et: this.explodeTime + 100,
              curve: [3],
            });
            gs.remove(this);
          } else if (this.action==2) gs.remove(this);

        },
        init: function() {
          this.curve=[curves.C[0].curve];
          this.aQ.push({st:0, et:1000, pos:this.pos+20 * (this.team ? -1 : 1)});
        },
        aQ: []
      };
    case 'S':
      return { //Shield
          life: 3,
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
                pos: this.pos + 5 * (this.team ? -1 : 1)
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
              pos: this.pos + 2 * (this.team ? -1 : 1)
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
          this.curve=[curves.A[1].curve,curves.A[101].curve,curves.A[203].curve];
          this.aQ.push({st:0, et:800, curve: [4,102,201], vpos: 1});
          this.aQ.push({st:800, et:1000, curve: [2,102,203], vpos: 2});
          this.aQ.push({st:1000, et:1500, curve: [3,101,201], vpos: 1});
          this.aQ.push({st:1500, et:2000, curve: [1,101,202], vpos: 2});
          this.aQ.push({st:2000, et:3000, pos: this.pos-120 * (this.team ? -1 : 1)});
        },
        hit: function(t, bullet,hurt,dist) {
          this.hitTime = t;
          this.bDist=dist;
          this.health-=hurt;
        },
        prepTurn: function() {
          //just figure out where we are going to be
          let fS = (this.sret == 1);
          switch (this.nextAct) {
            case 'J':
              this.vpose = fS?2:4;
              this.pose = this.pos + 20 * (this.team ? -1 : 1);
              break;
            case 'D':
              this.vpose = 1;
              this.pose = this.pos + 10 * (this.team ? -1 : 1);
              break;
            case 'F':
              this.vpose = fS ? 2 : this.vpos
              this.pose = this.pos + 50 * (this.team ? -1 : 1);
              break;
            case 'B':
            case 'S':
            case 'C':
              this.vpose = fS ? 2 : this.vpos
              this.pose = this.pos
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
          //action by action type
          switch (this.nextAct) {
            case 'J':
              this.aQ.push({
                st: 0,
                et: 100,
                pos: this.pos + 5 * (this.team ? -1 : 1),
                curve:[4],
                vpos: 1.2
              });
              this.aQ.push({
                st: 100,
                et: 400,
                pos: this.pos + 10 * (this.team ? -1 : 1),
                curve:[2],
                vpos: 3
              });
              this.aQ.push({
                st: 400,
                et: 700,
                pos: this.pos + 15 * (this.team ? -1 : 1),
                curve:[4],
                vpos: 4.2
              });
              this.aQ.push({
                st: 700,
                et: 1000,
                pos: this.pos + 20 * (this.team ? -1 : 1),
                vpos: 4
              });
              this.sret = 1;
              break;
            case 'D':
              this.aQ.push({
                st: 0,
                et: 700,
                pos: this.pos + 6 * (this.team ? -1 : 1),
                curve: [4,0,203],
                vpos: .9
              });
              this.aQ.push({
                st: 700,
                et: 1000,
                pos: this.pos + 10 * (this.team ? -1 : 1),
                curve: [3,0,201],
                vpos: 1
              });
              this.sret = 1;
              break;
            case 'F':
              let bf=(this.vpos==2)?1:3
              this.aQ.push({
                st: 0,
                et: 250,
                curve: [bf+1],
                pos: this.pos + 12 * (this.team ? -1 : 1),
              });
              this.aQ.push({
                st: 250,
                et: 500,
                curve: [bf],
                pos: this.pos + 24 * (this.team ? -1 : 1),
              });
              this.aQ.push({
                st: 500,
                et: 750,
                curve: [bf+1],
                pos: this.pos + 36 * (this.team ? -1 : 1),
              });
              this.aQ.push({
                st: 750,
                et: 1000,
                curve: [bf],
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
                pos: this.pos + 20 * (this.team ? -1 : 1),
              });
              break;
            case 'B':
            case 'C':
            case 'S':
              if ((!this.hitTime)||(this.hitTime>800))
                gs.add(this.nextAct, this.team, this.pos + 40 * (this.team ? -1 : 1), this.vpos);
              this.aQ.push({
                st: 0,
                et: 200,
                curve: [0, 102,202],
              });
              this.aQ.push({
                st: 300,
                et: 500,
                curve: [0, 104,203],
              });
              this.aQ.push({
                st: 500,
                et: 700,
                curve: [0, 103,202],
              });
              this.aQ.push({
                st: 800,
                et: 1000,
                curve: [0, 104,201],
              });
              break;
          }
          let fS = (this.sret == 0);
          if (fS) { //we are going back to normal at the end
            this.aQ.push({
              st:800,
              et:1000,
              curve: [1],
              vpos: 2,
            });
          }
          if (this.hitTime) {
            this.aQ.push({
              st: this.hitTime,
              et: this.hitTime + 300,
              curve: [8,108,208]
            });
            this.aQ.push({
              st: this.hitTime+ 300,
              et: this.hitTime + 600,
              pos: this.pos - 80 * (this.team ? -1 : 1),
              vpos: 2,
              curve: [0,108,208]
            });
            this.aQ.push({
              st: this.hitTime + 600,
              et: this.hitTime + 700,
              curve: [1,101,202]
            });
            this.hitTime = 0;
          }
        },
        aQ: [],
        health: 100,
      };
    case 'P': //background stuff
        return {
            init: function() {
              this.curve=[curves.P[1].curve];
            },
        };
    default: //background stuff
      return {
          init: function() {
            this.curve=[curves[ty][0].curve];
            //we're a bakground randomise our scale
            let xs=.5+Math.random();
            let ys=xs*(1+Math.random());
            this.pels[0].style.transform="scale("+xs+","+ys+")";
            this.aQ=[{st:0, et:1000,  vpos: this.vpos+5, curve:[Math.floor(Math.random()*3+1)]},
                     {st:1000, et:2000, vpos: this.vpos+10, curve:[Math.floor(Math.random()*3+1)]}];
          },
      };
  }
}


var mkGOEl = (go) => {
  let df = document.importNode(document.querySelector('#' + go.ty + '_tem').content, true);
  go.el = df.querySelector('g');
  go.pels = df.querySelectorAll('path');
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
