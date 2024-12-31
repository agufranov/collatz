import { useEffect } from "react";
import cn from "classnames";
import "./App.css";
import { BigNumber } from "bignumber.js";

const assert = console.assert.bind(console);

Array.prototype.sum = function () {
  return this.reduce((a, b) => a + b, 0);
};

Array.prototype.isEqual = function (arr) {
  return this.length === arr.length && this.every((v, i) => v === arr[i]);
};

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.toObject = function () {
  return Object.fromEntries(this);
};

Array.prototype.mapToObject = function (fn) {
  return Object.fromEntries(this.map((n) => [n, fn(n)]));
};

assert([1, 2, 3].isEqual([1, 2, 3]));

const r = (n) => [...Array(n).keys()];
const r1 = (n) => r(n).map((n) => n + 1);

const s3 = (k) =>
  r(k + 1)
    .map((i) => 3 ** i)
    .sum();
assert(s3(0) === 1);
assert(s3(1) === 4);
assert(s3(2) === 13);

const dn = (n) => {
  let i = 0;
  let r = [];
  let v;
  do {
    v = (n - s3(i)) / 3 ** (i - 1);
    if (v <= 0) break;
    r.push(v);
    i++;
  } while (true);
  return r.filter((x) => Math.abs(x - Math.round(x)) < Number.EPSILON);
};

const ps = (n) => r(n).map((i) => 2 ** i);

const divide = (a, b) => {
  let f = [];
  let i = 0;
  while (a[i] === b[i]) {
    f.push(a[i]);
    i++;
  }
  return [f, [a.slice(i), b.slice(i)]];
};

console.log(divide([1, 2, 3, 4, 5, 1, 1, 2], [1, 2, 3, 4, 5, 2, 1, 2]));

const f = (n) => {
  const numbers = new Set();
  const r = [1, 2, 4, 8];
  r.forEach((x) => numbers.add(x));

  const add = (x) => {
    if (isNaN(x)) {
      debugger;
    }
    r.push(x);
    // console.log(r);
    numbers.add(x);
  };

  for (let i = 0; i < n; i++) {
    let l = r.last();
    const next = (l - 1) / 3;
    // console.log(l, next);

    if (next % 1 === 0) {
      if (!numbers.has(next)) {
        add(next);
      } else {
        add(l * 2);
      }
      if (next % 3 === 0) {
        add(l * 2);
      }
    } else {
      add(l * 2);
    }
  }
  return { r, numbers };
};

const coll = (n) => {
  if (n === 0) return [];
  if (n === 1) return [0];

  const r = [n];
  let d;
  const coords = [];
  let coord = 0;

  do {
    let l = r.last();
    if (l % 2 === 0) {
      d = l / 2;
      r.push(d);
      coord++;
      if (d === 1) {
        coords.push(coord);
        break;
      }
    } else {
      d = 3 * l + 1;
      r.push(d);
      coords.push(coord);
      coord = 0;
    }
  } while (true);

  coords.reverse();
  return [...coords];
};

// const d = r(1000)
//   .map(coll)
//   .map((t, i) => ({
//     val: i,
//     data: t.map((z) => ({ num: z })),
//     c2: [t.sum(), t.length - 1],
//     steps: t.sum() + t.length - 1,
//   }));
// console.log(d);

const lastcmp = (a, b) => {
  if (a.length !== b.length) return false;
  let i = 0;
  while (a[i] === b[i]) i++;
};

// assert(lastcmp([1, 2, 3], [1, 5, 0]));

// d.sort((a, b) => a.steps - b.steps);

// for (let i = 2; i < d.length; i++) {
//   const prev = d[i - 1];
//   const curr = d[i];
//   // if (prev.data.length !== curr.data.length) continue;
//   for (let j = 0; j < Math.min(curr.data.length, prev.data.length); j++) {
//     if (curr.data[j].num === prev.data[j].num) curr.data[j].same = true;
//     else break;
//   }
// }

const ord = (n) => {
  if (n === 0) return 0;
  let x = n;
  let i = 0;
  while (x % 2 === 0) {
    x = x / 2;
    i++;
  }
  return i;
};

const bord = (n) => {
  if (n.isEqualTo(0)) return 0;
  let x = n;
  let i = 0;
  while (x.mod(2).isEqualTo(0)) {
    x = x.dividedBy(2);
    i++;
  }
  return BigNumber(i);
};

const base = (n) => n / 2 ** ord(n);

const bbase = (n) => n.dividedBy(BigNumber(2).pow(bord(n)));

const makeChain = (n) => {
  if (n === 0) return [];
  const a = [2 * n - 1];

  do {
    // console.log(a);
    a.push((3 * a.last() + 1) / 2);
  } while (a.last() % 2 !== 0);

  a.push(base(a.last()));

  return a;
};

const sub = (n) => {
  if (n % 2 === 0) throw new Error();
  let c = n;
  do {
    c = (3 * c + 1) / 2;
  } while (c % 2 !== 0);
  return base(c);
};

const path = (n) => {
  const a = [n];
  while (a.last() !== 1) {
    a.push(sub(a.last()));
  }
  return a;
};

const chains = r(1500).map(makeChain);

const t3 = (n) => base(n) * 3 ** (ord(n) + 1);

const bt3 = (n) => bbase(n).times(BigNumber(3).pow(bord(n).plus(1)));

const m = (n) => (base(t3(n) - 1) + 1) / 2;
const bm = n => bbase(bt3(n).minus(1)).plus(1).dividedBy(2)

// const o = r1(1000).mapToObject(m)
// const o = r1(1000).mapToObject(t3);
// console.log(o);

// const s23 = r(300)
//   .map((x) => BigNumber(3).pow(x).minus(1))
//   .map(bord)
  // .filter((x, i) => i % 2)
// console.log(s23);

const rrs = r(140).map(x => BigNumber(2).pow(x))
console.log('xxx', rrs.map(x => {
  const r = [x]
  while(!r.last().isEqualTo(1)) {
    r.push(bm(r.last()))
  }
  return r.map(Number)
}))

Object.assign(window, {
  r,
  r1,
  dn,
  ps,
  f,
  coll,
  makeChain,
  ord,
  base,
  t3,
  m,
  sub,
  path,
  BigNumber,
  bord,
  bbase,
  bt3,
  bm
});

function Chains() {
  return (
    <div>
      {/* <div>
        {r(1000).map((n) =>
          n < 2 ? null : (
            <div className="row">
              <div className="cell info ord">{ord(n)}</div>
              <div className="cell info l">{down2(n)}</div>
              <div className="cell value">{n}</div>
              {path(2 * n - 1).map((x) => (
                <div className="cell">
                  {x}
                  <div className="cellHint">
                    #{(x + 1) / 2}
                    <div className="red">{ord((x + 1) / 2)}</div>
                    <div className="blue">{down2((x + 1) / 2)}</div>
                    <div className="green">{6 * ((x + 1) / 2) - 2}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div> */}
      {chains.map((chain, n) =>
        n === 0 ? null : (
          <div className="row" id={`chain_${chain[0]}`}>
            <div className="cell info l">{chain.length - 2}</div>
            <div className="cell info ord">{ord(n)}</div>
            <div className="cell">#{n}</div>
            {chain.map((x, i) => (
              <div className={cn("cell", { value: i === 0 })}>{x}</div>
            ))}
            <a
              className="cell tail value pointer"
              href={`#chain_${base(chain.last())}`}
            >
              {base(chain.last())}
            </a>
            <div className="cell info ord">{ord(chain.last())}</div>
          </div>
        )
      )}
    </div>
  );
}

// function App() {
//   return (
//     <div>
//       {d.map((v, i) => (
//         <div className="row" key={i}>
//           <div className="cell value">{v.val}</div>
//           <div className="cell steps">{v.steps}</div>
//           <div className="cell c2">{JSON.stringify(v.c2)}</div>
//           {v.data.map((n, j) => (
//             <div
//             className={cn("cell", {
//                 cellSame: n.same,
//               })}
//               key={j}
//             >
//               {n.num}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>
//   );
// }

export default Chains;
