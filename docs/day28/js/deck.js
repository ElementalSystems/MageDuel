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
  }
};

//let stdDeck="FFJJDDBBBBSS";
let stdDeck="JDCSSFFBB";
//let stdDeck="BBBSSS";

function shuffle(str,rep)
{
  return str.repeat(rep).split('').sort(()=>(Math.random()-0.5)).join('');
}
