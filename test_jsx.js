const fs = require('fs');
const code = fs.readFileSync('c:/Users/soniy/mindwhile-schoolerp/src/school/pages/StudyCenter/ManageResources.jsx', 'utf8');

// A simple stack-based JSX tag checker
let inJsx = false;
let lines = code.split('\n');
let tags = [];

for (let i = 80; i < lines.length; i++) {
    let line = lines[i];
    // This is not a real parser, just let Babel syntax checking do it.
}
