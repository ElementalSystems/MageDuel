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
  X: {
    t:'STEP',
  }
};

//let stdDeck="FFJJDDBBBBSS";
let stdDeck="JJDDFFBBSSBBBXXX";

function shuffle(str,rep)
{
  return str.repeat(rep).split('').sort(()=>(Math.random()-0.5)).join('');
}
