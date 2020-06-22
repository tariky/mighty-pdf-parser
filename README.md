[![logo](https://i.ibb.co/0CdqDtx/mpdflogo.png)]()



### Mighty PDF Parser

------

###### Easiest JavaScript PDF parser without complex setup. It uses Mozilla PDFjs library.



#### How to Install?

------

```
npm i mighty-pdf-parser
```



#### How to use it?

------

```javascript
const mightyPdfParser = require("mighty-pdf-parser");
const fs = require("fs");

const dataBuffer = fs.readFileSync("./test.pdf");

const options = {
    // Activate pageRange option so you can parse pages with range.
    // Default = false (parse all pages from document).
    pageRange: true,
    // Define starting page for range
    // Default = 1.
    startPage: 1,
    // Define end page for range
    // Default = 1.
    endPage: 1
}

mightyPdfParser(dataBuffer, options).then(response => {
    // Response with number of pages that are parsed.
    console.log(response.pageCount);
    // Response with document metadata.
    console.log(response.metadata);
    // Response with document basic info.
    console.log(response.info);
    // Reponse with text
    console.log(response.text);
    // Response with PDFjs version.
});
```



#### Have issue?

------

Report it here on GitHub.