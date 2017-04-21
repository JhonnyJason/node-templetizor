var fs = require('fs');
var cheerio = require('cheerio');

var $ = cheerio.load(fs.readFileSync('simpleSample.html'));


var temparray = [];
var array = [];


$('[id]').filter(function() {
    var temp = {
        id: $(this).attr("id"),
        text: $(this).clone().children().remove().end().text().replace(/\s+/g, " ").trim()
    }
    temparray.push(temp);

});

// did this so I can remove the id's that have no text
// we could probably figure out a better way to do this since im using 2 arrays this way but fokit
for (var i = 0; i <= temparray.length - 1; i++) {
    if (temparray[i].text) {
        var ids = temparray[i].id;
        var texts = temparray[i].text;

        var temp = {
            id: ids,
            text: texts
        }

        array.push(temp);
    }
}

var myJsonString = JSON.stringify(array, null, 4);
console.log(myJsonString)

fs.writeFile('sample.json', myJsonString, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});
