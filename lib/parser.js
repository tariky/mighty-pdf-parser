const DEFAULT_OPTIONS = require("./contants");
const { endPage, startPage } = require("./contants");

var PDFJS = null;

/**
 * Itarates over text content, check if text is on same row, if yes then concatenate it. If else then create new row.
 * @param {Array} items Array of text content.
 * @return {String} Text with formatted rows.
 */
function rowSplitter(textContent) {
  let rowPosition,
    text = "";

  textContent.map((item) => {
    if (rowPosition === item.transform[5] || !rowPosition) {
      // Check if first text item if yes do not add whitespace before it.
      !rowPosition ? (text += item.str) : (text += ` ${item.str}`);
    } else {
      text += `\n${item.str}`;
    }
    rowPosition = item.transform[5];
  });

  return text;
}

/**
 * @param {Object} page PDFPageProxy Object.
 * @return {Promise} Promise with rendered page.
 */
async function pageRenderer(page) {
  let textContent = await page.getTextContent();
  let formattedText = rowSplitter(textContent.items);
  return formattedText;
}

/**
 * @param {Buffer} dataBuffer File Buffer (.pdf).
 * @param {Object} options Options { pageRange: true || false, startPage: number, endPage: number }.
 * @param {Boolean}   options.pageRange Default: false witch means parse all pages, if true then parsing pages are defined in startPage and endPage.
 * @param {Number}   options.startPage Starting page for parser. Default: 1.
 * @param {Number}   options.endPage End page for parser. Default: 1.
 * @return {Promise} Promise with PDF text.
 */
async function MightyPDF(dataBuffer, options) {
  let response = {
    version: null,
    metadata: null,
    pageCount: 0,
    info: null,
    text: "",
  };
  if (typeof options === "undefined") options = DEFAULT_OPTIONS;
  if (typeof options.version !== "string")
    options.version = DEFAULT_OPTIONS.version;
  if (typeof options.pageRange !== "boolean")
    options.pageRange = DEFAULT_OPTIONS.pageRange;
  if (typeof options.startPage !== "number")
    options.startPage = DEFAULT_OPTIONS.startPage;
  if (typeof options.endPage !== "number")
    options.endPage = DEFAULT_OPTIONS.endPage;

  PDFJS = PDFJS
    ? PDFJS
    : require(`../pdfjs/pdfjs-dist/es5/${options.version}/pdf.js`);
  PDFJS.disableWorker = true;

  let pdfData = await PDFJS.getDocument(dataBuffer).promise;
  let pageCount = pdfData.numPages;

  let metaData = await pdfData.getMetadata().catch(function (err) {
    return null;
  });

  response.info = metaData ? metaData.info : null;
  response.metadata = metaData ? metaData.metadata : null;

  let text = "";

  if (options.endPage > pageCount)
    return console.error(
      `Document have ${pageCount} page. End page cannot be higer then that.`
    );

  if (options.pageRange) {
    for (let index = options.startPage; index <= options.endPage; index++) {
      let page = await pdfData.getPage(index);
      let renderedPage = await pageRenderer(page);
      index === options.startPage
        ? (text += renderedPage)
        : (text += `\n${renderedPage}`);
    }
    response.pageCount =
      parseInt(options.endPage) - parseInt(options.startPage) + 1;
  } else {
    for (let index = 1; index <= pageCount; index++) {
      let page = await pdfData.getPage(index);
      let renderedPage = await pageRenderer(page);
      index === 1 ? (text += renderedPage) : (text += `\n${renderedPage}`);
    }
    response.pageCount = pageCount;
  }

  response.version = PDFJS.version;
  response.text = text;

  return response;
}

module.exports = MightyPDF;
