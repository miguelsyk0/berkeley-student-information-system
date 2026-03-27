const fetch = require('node-fetch'); // wait, if fetch is global in node 22, let's just use it directly.

async function run() {
  try {
    const res = await fetch('http://localhost:4000/api/sections');
    const data = await res.text();
    console.log("SECTIONS:", data);

    const res2 = await fetch('http://localhost:4000/api/years');
    const data2 = await res2.text();
    console.log("YEARS:", data2);
  } catch (err) {
    console.error(err);
  }
}

run();
