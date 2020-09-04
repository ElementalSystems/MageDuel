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
    t:'skip',
  }
};

//let stdDeck="FFJJDDBBBBSS";
let stdDeck="BBSSXXXXXXXX";

function shuffle(str,rep)
{
  return str.repeat(rep).split('').sort(()=>(Math.random()-0.5)).join('');
}
