var fs = require('fs');
var cheerio = require('cheerio');

var $ = cheerio.load(fs.readFileSync('simpleSample.html'));


var arr = [];

// the thing we need to deal now with is the duplicating of text cause of nested parent-child divs
$('[id]').each(function() {
    var temp = {
        id: $(this).attr("id"),
        text: $(this).text().replace(/\s+/g, " ").trim()
    }
    arr.push(temp);

});

var myJsonString = JSON.stringify(arr, null, 4);
console.log(myJsonString)

fs.writeFile('sample.json', myJsonString, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
