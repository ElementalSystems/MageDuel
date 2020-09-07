let bcurves={
  B: {
    0: "M-3,20 Q0,10 2,20 M-2,20 Q0,20 2,20 M-2,20 Q0,30 3,20", //bolt start
    1: "M-22,16 Q-1,22 20,16 M-25,20 Q-1,19 25,20 M-23,24 Q-1,18 21,24", //bolt active 1
    2: "M-20,18 Q14,9 20,16 M-25,20 Q-16,9 25,20 M-24,24 Q-1,20 21,22", //bolt active 2
    3: "M-13,8 Q0,27 20,7 M-17,11 Q2,16 -4,28 M1,31 Q-1,6 21,11", //bolt exploded
  },
  S: {
    0: "M-5,20 Q-18,26 -5,30 M-10,20 Q-1,24 -10,30 M0,20 Q-15,24 0,30", //starting
    1: "M-5,11 Q30,30 -5,50 M-10,11 Q30,30 -10,50 M0,11 Q30,30 0,50", //shield settled 1
    2: "M-5,11 Q30,30 -5,50 M-10,11 Q30,30 -10,50 M0,11 Q30,30 0,50", //shield settled 2
    3: "M-5,11 Q10,38 -5,50 M-10,11 Q19,20 -10,50 M0,11 Q-4,22 0,50", //shield hit
  },
  A: {
    //bottoms
    1: "M1,76 Q10,74 17,82 M16,80 Q21,85 19,92  M22,93 Q21,99 27,98 M27,72 Q30,85 23,93 M10,64 Q17,64 28,74 M-11,64 Q-1,70 11,64 M-12,64 Q-17,70 -24,75 M-32,93 Q-25,85 -24,75 M-28,96 Q-31,96 -35,99 M-24,97 Q-21,88 -12,82 M-14,81 Q-7,76 1,76 ",//standing
    2: "M0,71 Q5,76 15,76 M16,75 Q19,83 15,92  M15,93 Q15,99 25,97 M24,72 Q25,83 19,93 M10,64 Q17,67 24,71 M-11,64 Q-1,70 11,64 M-12,64 Q-17,70 -22,77 M-41,89 Q-30,83 -22,77 M-44,93 Q-45,98 -38,97 M-36,94 Q-29,92 -14,81 M-14,81 Q-7,76 -1,70 ",//stepping
    3: "M0,51 Q5,53 15,56 M15,56 Q28,63 40,64  M42,59 Q47,60 47,65 M24,52 Q32,53 40,58 M10,44 Q17,47 24,51 M-11,44 Q-1,50 11,44 M-10,46 Q-19,50 -20,52 M-11,62 Q-24,58 -21,52 M-5,57 Q-4,62 -11,65 M-7,54 Q-9,54 -9,57 M-7,54 Q-7,56 -1,50 ",//down
    //torso
    101: "M-13,64 Q-9,53 -11,41 M-10,43 Q-15,47 -15,54 M-13,52 Q-9,56 -5,52 M-3,51 Q-1,50 2,51 M-2,54 Q-18,64 -21,57 M-20,55 Q-20,39 -10,35 M-11,35 Q2,36 8,41 M8,40 Q14,43 18,44 M17,43 Q20,45 29,40 M30,39 Q29,35 30,33 M30,42 Q26,47 18,48  M17,46 Q13,48 11,46  M9,46 Q4,54 7,61  M8,60 Q1,57 -11,62", //guard
    102: "M-13,64 Q-9,53 -11,41 M-13,40 Q-19,38 -23,33 M-24,32 Q-25,27 -32,24 M-34,24 Q-38,24 -37,29 M-32,22 Q-23,25 -18,31 M-19,30 Q-12,30 -6,37 M-6,35 Q2,36 8,41 M8,40 Q14,43 17,52 M17,53 Q22,56 27,61 M28,63 Q28,67 34,68 M26,62 Q21,63 15,56  M14,54 Q9,52 5,47  M3,45 Q4,54 7,61  M4,61 Q1,57 -11,62",//spread

    //hats
    201: "M-8,29 Q5,28 15,24 M15,23 Q9,23 7,21 M8,24 Q3,19 0,13 M0,13 Q-4,7 -9,5 M-5,15 Q-4,7 -9,5 M-5,15 Q-5,19 -4,25 M-2,22 Q-3,25 -9,28",//hat - idle


  },
  //cards
  J:{ 1: "M-13,97 Q-20,59 7,27 M11,24 Q12,41 27,53  M12,22 Q-6,39 -30,35" },
  F:{ 1: "M-35,60 Q-12,63 29,60 M41,60 Q9,53 7,41  M41,62 Q17,65 11,78 M21,60 Q-4,54 -13,41  M21,62 Q1,66 -9,78" },
  D:{ 1: "M-6,28 Q-12,63 4,88 M8,92 Q1,72 13,63  M3,91 Q-10,82 -21,79" },

}

let curves={

}

function preProcessCurves() {
  let ppce=(el)=>{
    let r={};
    Object.keys(el).forEach(key=>{r[key]={ curve:brushCurve(encodeCurve(el[key]))};})
    return r;
  }
  Object.keys(bcurves).forEach(key=> curves[key]=ppce(bcurves[key]));
}

preProcessCurves();

function setCurve(go,i,c) {
  go.pels[i].setAttribute('d', decodeCurve(c));
}

function brushCurve(c) //brushes curves by sets of three points
{
  let n=[];
  let xo=1.5,yo=3;
  for (let i=0;i<c.length;i+=3) {
    n.push(
           c[i],
           c[i+1],
           c[i+2],
           {l: 'L', x: c[i+2].x+xo, y: c[i+2].y+yo},
           {l: 'Q', x: c[i+1].x+xo*.8, y: c[i+1].y+yo*.8},
           {l: ' ', x: c[i].x, y: c[i].y},
         );

  }
  //n.push({l:'Z', x:0, y:0});
  return n;
}


function iCurve(r,s, e) {
  let ir = 1 - r;

  return s.map((p, i) => ({
    l: p.l,
    x: (p.x * ir + e[i].x * r),
    y: (p.y * ir + e[i].y * r)
  }));
}


const pathRegex = /([M QTZL]+)(-?\d+),(-?\d+)/g;

function decodeCurve(c)
{
  return c.map(e=>e.l+e.x+","+e.y).join('');
}

function encodeCurve(path) {
  const pathRegex = /([M QTZL]+)(-?\d+),(-?\d+)/g;
  //do the regex - dump into an array lead: x: y:
  let a;
  let r = [];
  while (a = pathRegex.exec(path)) {
    r.push({
      l: a[1],
      x: +a[2],
      y: +a[3]
    });
  }
  return r;
}
