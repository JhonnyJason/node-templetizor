// i setup a script in package.json so you can start this with npm start instead of templetizor.js

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


url = 'http://dev-buerstmayr.cominsy.net/';

request(url, function(error, response, html) {
    if (!error) {
        var $ = cheerio.load(html);

        var header, text;


        // we should probably make this a json array and push header and text objects to it
        // so the can refference them as json object in array[1][2][3] etc, 
        // probably could figure out better structure but i think you get the point

        var json = { header: "", text: "" };

        // this only gets the text from the first header on site
        $('#header3-3 > div > div > div').filter(function() {
            var data = $(this);
            header = data.children().first().text().trim();

            json.header = header;

        })

        // this only gets the text from the first text under header on site
        $('#content1-4 > div > div > div').filter(function() {
            var data = $(this);
            text = data.children().first().text().trim();

            json.text = text;

        })
    }

    fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {
        console.log('File successfully written! - Check your project directory for the output.json file');
    })


})
