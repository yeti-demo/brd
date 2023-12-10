const { JSDOM } = require("jsdom");

const BOARD = "mymensingh";
const YEAR = 2023;
const EXAM = "hsc";

function calcu(curr, total) {
  return `${((curr / total) * 100).toFixed(2)}%`;
}

async function getEiinList() {
  const url = `https://eboardresults.com/v2/list?id=btree&board=${BOARD}&exam=${EXAM}&year=${YEAR}&type=tbl&cols=eiin,i_code,i_name,zilla,thana&_=1701859764274`;
  const eiins = [];
  try {
    let curr = 1;
    const isnts = await (await fetch(url)).json();
    for (const inst of isnts.data) {
      let [eiin, _, n, z, u] = inst;
      eiin = parseInt(eiin);
      eiins.push(eiin);
      console.log(`${eiin} - saved (${calcu(curr, isnts.data.length)})`);
      curr++;
      //   break;
    }
  } catch (err) {
    console.log(err);
  }
  return eiins;
}

async function getAllStudent(eiins) {
  let total_student = 0;
  for (let i = 0; i < eiins.length; i++) {
    const eiin = eiins[i];
    try {
      const url = `http://mymensinghboard.webbaseapplication.com/resultmb/result_sheet.php?eiin=${eiin}`;
      const res = await fetch(url);
      const data = await res.text();
      const dom = new JSDOM(data).window.document;
      let state_div = dom.getElementsByClassName("group_body");
      if (!state_div.length) {
        continue;
      }
      state_div = state_div[state_div.length - 1];
      let eiin_total = state_div.innerHTML.trim().split(",");
      eiin_total = parseInt(
        eiin_total[eiin_total.length - 1].split("=")[1].trim()
      );
      total_student += eiin_total;
      console.log(
        `${eiin} - has ${eiin_total} (${calcu(i + 1, eiins.length)})`
      );
    } catch (err) {
      console.log(err);
      console.log("SOme Error");
    }
    // break;
  }
  return total_student;
}

async function main() {
  const eiins = await getEiinList();
  const total_student = await getAllStudent(eiins);
  console.log(
    `\nTotal Institutions - ${eiins.length}\nTotal Students - ${total_student}`
  );
}

main();
