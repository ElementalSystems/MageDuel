let cds={
  J: {
    t:'JUMP',
  },
  F: {
    t:'FORWARD',
  },
  D: {
    t:'DUCK',
  },
  B: {
    t:'BOLT',
  },
  S: {
    t:'SHIELD',
  },
  C: {
    t:'BLAST',
  },
  X: {
    t:'STEP',
  },
  1: {
    t:'ORATE',
  }
};

let decks={
  basic: ()=> shuffle("JJDDFBBBSC",10),
  qq:()=> shuffle("FFFFFJDBBSSSCCCC",10),
  full: ()=> shuffle("JJDDFFFBBBCSSSC",10),
}

function shuffle(str,rep)
{ let dck='';
  for (let i=0;i<rep;i+=1)
     dck+=str.split('').sort(()=>(Math.random()-0.5)).join('');
  return dck;
}

let tth={
  p1: { n: 'Player 1',
        pr: 128, pg: 0, pb: 0,
        br: 192, bg: 64, bb: 32,
        dr: 64,  dg: 0, db: 0,
      },
  p2: { n: 'Player 2',
        pr: 0, pg: 0, pb: 128,
        br: 64, bg: 64, bb: 255,
        dr: 0,  dg: 0, db: 64,
      },
  mz: { n: 'Master Zendaro',
        pr: 64, pg: 0, pb: 128,
        br: 128, bg: 0, bb: 255,
        dr: 0,  dg: 0, db: 0,
      },
  aj: { n: 'Admiral Jamie Ent',
        pr: 255, pg: 192, pb: 0,
        br: 255, bg: 255, bb: 0,
        dr: 64,  dg: 32, db: 0,
      },
  ck: { n: 'Crazy K',
        pr: 192, pg: 192, pb: 0,
        br: 64, bg: 64, bb: 0,
        dr: 0,  dg: 0, db: 0,
      },
  mx: { n: 'Marcus X',
        pr: 32, pg: 128, pb: 32,
        br: 128, bg: 255, bb: 128,
        dr: 0,  dg: 128, db: 0,
      },
  dd: { n: 'Daft Darius',
        pr: 0, pg: 192, pb: 128,
        br: 0, bg: 255, bb: 0,
        dr: 0,  dg: 128, db: 64,
      },
  ww: { n: 'Warlock Wilson',
        pr: 255, pg: 0, pb: 64,
        br: 255, bg: 128, bb: 128,
        dr: 64,  dg: 0, db: 32,
      },
  ka: { n: 'Killer Adams',
        pr: 64, pg: 0, pb: 0,
        br: 192, bg: 0, bb: 0,
        dr: 0,  dg: 0, db: 0,
      },
  zz: { n: 'Master Zi',
        pr: 192, pg: 192, pb: 255,
        br: 0, bg: 64, bb: 255,
        dr: 0,  dg: 0, db: 128,
      },
  tj: { n: 'Timid Jay',
        pr: 192, pg: 255, pb: 192,
        br: 64, bg: 255, bb: 64,
        dr: 0,  dg: 192, db: 0,
      },


};

function setTh(t,team)
{
  let ls=team?'--p2':'--p1';
  let e=document.getElementById('full');
  console.log(team,t,ls);
  let o=tth[t];
  Object.keys(o).forEach(k=>e.style.setProperty(ls+k,o[k]));
}
