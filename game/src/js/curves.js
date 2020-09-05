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
  }
}

let curves={

}

function preProcessCurves() {
  let ppce=(el)=>{
    let r={};
    Object.keys(el).forEach(key=>{r[key]={ curve:encodeCurve(el[key])};})
    return r;
  }
  Object.keys(bcurves).forEach(key=> curves[key]=ppce(bcurves[key]));
}

preProcessCurves();
console.log(curves)

function setCurve(go,c) {
  go.pels[0].setAttribute('d', decodeCurve(c));
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
