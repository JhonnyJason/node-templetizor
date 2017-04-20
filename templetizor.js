var fs = require('fs');
var cheerio = require('cheerio');

var $ = cheerio.load(fs.readFileSync('simpleSample.html'));


var ids = {
    id: "",
    text: ""
}



$('[id]').each(function() { //Get elements that have an id=

    ids.id = ($(this).attr("id")); //add id to array
    ids.text = $(this).text().trim(); //add text to array
    console.log(ids) // this gets all the ids correct, but adds the text on parent ids as well even though they dont have a text, need to fix that
    var json = JSON.stringify(ids, null, 4);

    // doesnt want to save file correctly, no idea why...
    fs.writeFile('sample.json', json, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
});
