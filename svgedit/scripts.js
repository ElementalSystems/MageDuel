let l1;
let l2;
const pathRegex = /([M TZL]+)(\d+),(\d+)/g;

function start() {
  console.log("Start");
  l1 = encodePath("M22,95 L31,92 L32,73 L49,69 L56,70 L65,74 L68,87 L68,92 L78,95 L73,88 L76,85 L74,61 L58,50 L58,39 L60,37 L68,41 L74,37 L74,31 L77,25 L77,16 L74,16 L74,22 L72,27 L66,32 L64,27 L59,25 L52,23 L54,22 L55,17 L54,8 L50,5 L46,9 L46,17 L45,22 L37,27 L36,38 L38,44 L37,52 L24,62 L22,86 L26,88 L21,93 Z");
  l2 = encodePath("M22,95 L31,92 L32,73 L49,69 L56,70 L65,74 L68,87 L68,92 L78,95 L73,88 L76,85 L74,61 L58,50 L58,39 L60,37 L68,41 L74,40 L78,41 L85,42 L90,44 L90,40 L80,38 L72,35 L66,32 L64,27 L59,25 L52,23 L54,22 L55,17 L54,8 L50,5 L46,9 L46,17 L45,22 L37,27 L36,38 L38,44 L37,52 L24,62 L22,86 L26,88 L21,93 Z");
  loop();
}

let st = 0;

function loop(t) {
  let diff = Math.round(1 / ((t - st) / 1000));
  st = t;
  document.getElementById('path1').setAttribute('d', interpolatePath(l1, l2, (t % 10000) / 10000));
  document.getElementById('path2').setAttribute('d', interpolatePath(l1, l2, (t % 10000) / 10000));
  document.getElementById('fps').innerHTML = diff;
  requestAnimationFrame(loop);
}



//loop();

function encodePath(path) {
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

function interpolatePath(s, e, r) {
  let ir = 1 - r;
  p = s.map((p, i) =>
    (p.l + (p.x * ir + e[i].x * r) + ',' + (p.y * ir + e[i].y * r))
  );
  //output a SVG path between l1 and l2
  return p.join('');
}

matchStart = -1;
matchLead = '';
matchEnd = -1;

function eSelect() {
  let tb = document.getElementById('curve');
  let v = tb.value;
  let st = tb.selectionStart < 5 ? 0 : (tb.selectionStart - 5);
  let next = v.substring(st);
  console.log(next);
  let result = next.match(/([MQ TZL]+)(\d+),(\d+)/);
  if (!result) {
    matchStart = -1;
    document.getElementById('marker').setAttribute("cx", -10);
    document.getElementById('marker').setAttribute("cy", -10);

    return;
  }
  matchStart = st + result.index;
  matchEnd = matchStart + result[0].length;
  matchLead = result[1];
  edit();
  document.getElementById('marker').setAttribute("cx", +result[2]);
  document.getElementById('marker').setAttribute("cy", +result[3]);
  return false;
}

function edit() {
  let v = document.getElementById('curve').value;
  let p = document.getElementById('pathedit').setAttribute('d', v);
}


function clicked(e) {
  let rect = document.getElementById('win').getBoundingClientRect();
  let x = Math.round((e.pageX - rect.left) * 100 / (rect.right - rect.left));
  let y = Math.round((e.pageY - rect.top) * 100 / (rect.bottom - rect.top));
  document.getElementById('marker').setAttribute("cx", x);
  document.getElementById('marker').setAttribute("cy", y);

  document.getElementById('posdisplay').innerHTML = x + ',' + y;

  let v = document.getElementById('curve').value;
  let nb = matchLead + x + "," + y;
  if (matchStart < 0) {
    v = v + nb;
  } else {
    v = v.substring(0, matchStart) + nb + v.substring(matchEnd);
    matchEnd = matchStart + nb.length;
  }
  document.getElementById('curve').value = v;
  edit();
}
