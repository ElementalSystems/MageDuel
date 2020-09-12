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
