const fs = require("fs");
const MightyPDFParser = require("./lib/parser.js");
const debug = false;

if (debug) {
  const dataBuffer = fs.readFileSync("./test.pdf");
  MightyPDFParser(dataBuffer, {
    pageRange: true,
    startPage: 1,
    endPage: 3,
  }).then((response) => {
    console.log(response.text);
    console.log(response.pageCount);
    console.log(response.version);
  });
}

module.exports = MightyPDFParser;
