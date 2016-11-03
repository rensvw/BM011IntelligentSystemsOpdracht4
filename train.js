#!/usr/bin/env node
"use strict";
var path = require('path');
var glob = require("glob");
var fs = require('fs');
var ngramUtils = require('./ngramCreater');

var ngrams = {};

console.log("Started Application");
// options is optional
glob("subset/*.txt", function (er, files) {
    var languageProfileBiGram = {};
    var languageProfileTriGram = {};
    files.forEach(function(file){
        var lang = path.basename(file, '.txt');
        console.log("Training [Lanugage: ", lang, "] [File: ", file, "]");
        var text = fs.readFileSync(file,'utf8');
        languageProfileBiGram[lang] = ngramUtils.generateProfileBiGram(text, 300);
        languageProfileTriGram[lang] = ngramUtils.generateProfileTriGram(text, 300);
    });
    fs.writeFileSync('language-profile-bigram.json', JSON.stringify(languageProfileBiGram));
    console.log("Written Language Profile to File [language-profile-bigram.json]");
    fs.writeFileSync('language-profile-trigram.json', JSON.stringify(languageProfileTriGram));
    console.log("Written Language Profile to File [language-profile-trigram.json]");
});