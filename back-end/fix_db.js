const fs = require('fs');
const db = require('./db');

db.any("SELECT pg_get_functiondef(oid) as def FROM pg_proc WHERE proname = 'get_students_with_enrollments'")
  .then(res => {
    fs.writeFileSync('get_students_def.sql', res[0].def);
    console.log("Wrote get_students_def.sql");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
