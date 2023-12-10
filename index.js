const { JSDOM } = require("jsdom");
const Institution = require("./models/Institution");
const Student = require("./models/Students");
const db = require("./db");

const BOARD = "mymensingh";
const YEAR = 2023;
const EXAM = "hsc";

function calcu(curr, total) {
  return `${((curr / total) * 100).toFixed(2)}%`;
}

// STEP : 1
async function getEiinList() {
  const url = `https://eboardresults.com/v2/list?id=btree&board=${BOARD}&exam=${EXAM}&year=${YEAR}&type=tbl&cols=eiin,i_code,i_name,zilla,thana&_=1701859764274`;
  try {
    let curr = 1;
    const isnts = await (await fetch(url)).json();
    for (const inst of isnts.data) {
      let [eiin, _, n, z, u] = inst;
      eiin = parseInt(eiin);
      const institution = await Institution.create({
        eiin,
        name: n,
        zilla: z,
        upazilla: u,
      });
      console.log(`${eiin} - saved (${calcu(curr, isnts.data.length)})`);
      curr++;
      //   break;
    }
  } catch (err) {
    console.log(err);
  }
}

// STEP : 2
async function getInstitutionRes() {
  let eiins = await Institution.findAll();
  for (let ei = 0; ei < eiins.length; ei++) {
    const eiin = eiins[ei].eiin;
    const resUrl = `http://mymensinghboard.webbaseapplication.com/resultmb/result_sheet.php?eiin=${eiin}`;
    const res = await (await fetch(resUrl)).text();
    const body = new JSDOM(res).window.document.body.getElementsByClassName(
      "result"
    );

    const studentsToCreate = [];
    for (let i = 0; i < body.length; i++) {
      let roll_txt = body[i];
      let [roll, gpa] = roll_txt.innerHTML.replace("]", "").split("[");
      roll = parseInt(roll);
      studentsToCreate.push({
        roll_no: roll,
        result: gpa,
        eiin,
      });
    }

    try {
      const createdStudent = await Student.bulkCreate(studentsToCreate);
      createdStudent.forEach((s, ind) => {
        console.log(
          s.roll_no,
          "Saved",
          calcu(ind + 1, createdStudent.length),
          calcu(ei + 1, eiins.length)
        );
      });
    } catch (error) {
      console.log(`Some Error - Exist`);
    }
  }
}

// STEP : 3
function objKey(text) {
  let key_text = text
    .split(" ")
    .map((txt) => txt.toLowerCase())
    .toString()
    .replace(".", "")
    .replace(",", "_")
    .replace("'", "");
  return key_text;
}
function studentInfo(text) {
  const student = {};
  const dom = new JSDOM(text).window.document.body;
  const student_info_table = dom.getElementsByClassName("table_info")[0];
  const student_info_table_tr = student_info_table.getElementsByTagName("tr");
  for (let i = 0; i < student_info_table_tr.length; i++) {
    const cells = student_info_table_tr[i].cells;
    let [key1, value1, key2, value2] = cells;
    [key1, value1, key2, value2] = [
      objKey(key1.innerHTML.trim()),
      value1.innerHTML.trim(),
      objKey(key2.innerHTML.trim()),
      value2.innerHTML.trim(),
    ];
    student[key1] = value1;
    student[key2] = value2;
    // console.log(element.cells[0].innerHTML, objKey(element.cells[0].innerHTML));
  }

  let student_result_table = dom.getElementsByClassName("table_result")[0];

  if (student_result_table) {
    student_result_table = student_result_table.rows;
    const res_table = [];
    for (let i = 1; i < student_result_table.length; i++) {
      const element = student_result_table[i];
      let [sub, grade] = element.cells;

      res_table.push([sub.innerHTML.trim(), grade.innerHTML.trim()]);
    }

    student.result_data = JSON.stringify(res_table);
  }

  delete student.type;
  delete student.passing_year;
  delete student.result;
  return student;
}
async function getStudentResult() {
  const res_url = `http://mymensinghboard.webbaseapplication.com/resultmb/result.php`;
  const students = await Student.findAll();
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    if (student.name) {
      console.log(student.roll_no, "Exist", calcu(i + 1, students.length));
      continue;
    }
    try {
      const formData = new FormData();
      formData.append("roll", student.roll_no);
      formData.append("regno", "");
      const result_res = await fetch(res_url, {
        method: "POST",
        body: formData,
      });
      const result_html_text = await result_res.text();
      const studentData = studentInfo(result_html_text);

      await student.update({ ...studentData });

      console.log(
        `${student.roll_no} updated ${calcu(i + 1, students.length)}`
      );
    } catch (err) {
      console.log(err);
    }

  }
}

async function main() {
  await db.sync();
  // STEP : 1
  // getEiinList();

  // // STEP : 2
  // getInstitutionRes();

  // // STEP : 3
  getStudentResult();

  // test();
}

main();
