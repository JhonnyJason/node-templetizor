//All the requirements
var Modules = {
  fs: require('fs'),
  cheerio: require('cheerio')
};


//---------------------------------------------------------------------------------------------------------------------
// global variables
//---------------------------------------------------------------------------------------------------------------------
var ignoredSubTags = ["span", "a", "b", "sup", "img", "strong", "br"];

//---------------------------------------------------------------------------------------------------------------------
// global variables
//---------------------------------------------------------------------------------------------------------------------
var $ = null;
var idBase = "fakeID";
var idCount = 0;
var content = {};

//---------------------------------------------------------------------------------------------------------------------
// The main Program
//---------------------------------------------------------------------------------------------------------------------
function main() {
  var filenames = Modules.fs.readdirSync(__dirname + "/htmlFiles");
  for(var i = 0; i < filenames.length; i++) {
    var filename = filenames[i].split(".")[0];
    templatize(filename);
  }
}
main();


//---------------------------------------------------------------------------------------------------------------------
// the functions
//---------------------------------------------------------------------------------------------------------------------
function templatize(filename) {

  $ = Modules.cheerio.load(Modules.fs.readFileSync(__dirname + "/htmlFiles/" + filename + ".html"));

  var head = $('head');
  var body = $('body');

  // /get all the elements
  getElementsWithContent(body);

  //add some essential stuff for including administrative elements, styles and scripts
  head.append("{{{headInclude}}}\n");
  body.append("{{{adminPanel}}}\n");
  body.append("{{{scriptInclude}}}\n");

  //save html
  //console.log($.html());
  Modules.fs.writeFile(
    __dirname + "/outputFiles/templates/" + filename + '.mustache',
    $.html(),
    function (err) {
      if (err) throw err;
      console.log("wrote " + filename + ".mustache successfully");
    }
  );

  //save json
  //console.log(JSON.stringify(content));
  Modules.fs.writeFile(
    __dirname + "/outputFiles/content/" + filename + '.json',
    JSON.stringify(content),
    function (err) {
      if (err) throw err;
      console.log("wrote " + filename + ".json successfully");
    }
  );

}

function checkNode(node) {
  //console.log(node.html());

  if(hasNoText(node)) {
    return;
  }
  if(!node.html()) { //we neither have content nor children
    return; //so we leave the empty leave
  }

  var id = node.attr("id");


  //pfusch for excluding the menu
  if(id == "menu")
    return;
  //pfusch for excluding nasty Labels
  if(node.is("label"))
    return;


  //check next
  var children = node.children();

  var nonNodeElements = 0;

  for (var i = 0; i < children.length; i++) {
    if(isSubTagToIgnore(children[i])) {
      //console.log("!! -  We have a nonNode element here  -  !! ");
      nonNodeElements++;
    } else {
      checkNode($(children[i]));
    }
  }

  if(!children.length || (children.length == nonNodeElements)) { //we have here a leave
    //console.log("!!!   ---   This Node either had no children at all or it only had links as children!");

    if(!id) {
      id = idBase + idCount++;
      node.attr("id", id);
    }

    node.addClass("editable-field");
    content[id] = node.html();
    node.html("{{{content." + id + "}}}");
  }
}

function getElementsWithContent(body) {
  var children = body.children();

  console.log("we have " + children.length + " children!");

  for (var i = 0; i < children.length; i++) {
    checkNode($(children[i]));
  }

}

function isSubTagToIgnore(node) {

  for( var i = 0; i < ignoredSubTags.length;  i++) {
    if($(node).is(ignoredSubTags[i])) {
      return true;
    }
  }

  return false;
}

function hasNoText(node) {
    var text = node.text();
    console.log("_____________START")
    console.log(text);
    if(text) {
      console.log("_____________REPLACED")
      text = text.replace(/\s/g, "");
      console.log(text);
      if(text){
        console.log(" - - - had Text");
        return false;
      }
    }
    console.log(" - - - no Text");
    return true;
}