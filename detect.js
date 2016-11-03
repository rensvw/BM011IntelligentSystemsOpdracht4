#!/usr/bin/env node
"use strict";

var path = require('path');
var glob = require("glob");
var fs = require('fs');
var ngramUtils = require('./ngramCreater');
var now = require('performance-now');
var startTime;
var endTime;
var performanceBiGram;
var performanceTriGram;

// Generic Function to sort the scores.
function sortScores(scores){
    return Object.keys(scores).map(function(language) {
        return {'language': language, 'score':scores[language]};
    }).sort(function(first, second) {
        return first['score'] - second['score'];
    });
}

if (process.argv.length != 3){
    console.log("Usage npm run detect <phrase>");
    return;
}

var NOT_FOUND = 1000;


// Loading our language profiles
console.log("Reading Language Profiles\n");
var languageProfilesBiGram = JSON.parse(fs.readFileSync('language-profile-bigram.json', 'utf-8'));
var languageProfilesTriGram = JSON.parse(fs.readFileSync('language-profile-trigram.json', 'utf-8'));

// Reading the text the user wants to detect from the input.
var text = process.argv[2];
console.log("Determining Language for [text: ", text, "] \n");


// Generate the ngrams from the document.
startTime = now();
var documentProfileBiGram = ngramUtils.generateProfileBiGram(text, 300);
console.log("Text split while using Bi Gram method:");
console.log(documentProfileBiGram);
endTime = now();
performanceBiGram = (endTime - startTime);
console.log("Generating the Bi Gram profile takes: ",performanceBiGram," ms!");


startTime = now();
var documentProfileTriGram = ngramUtils.generateProfileTriGram(text, 300);
console.log("\nText split while using Tri Gram method:");
console.log(documentProfileTriGram);
endTime = now();
performanceTriGram = (endTime - startTime);
console.log("Generating the Bi Gram profile takes: ",performanceTriGram," ms!");

// Create an empty scores array
var scoresBiGram = Object.create(null);
var scoresTriGram = Object.create(null);

// Initialise this with 0 for each language;
Object.keys(languageProfilesBiGram).forEach(function(language){
    scoresBiGram[language] = 0;
});
Object.keys(languageProfilesTriGram).forEach(function(language){
    scoresTriGram[language] = 0;
});

startTime = now();
// Compute the out of index for each language.
documentProfileBiGram.forEach(function(documentNgram){
    var documentIndex = documentNgram.index;
    var languages = Object.keys(languageProfilesBiGram);

    languages.forEach(function(language){
        var languageProfile = languageProfilesBiGram[language];
        var languageNgram = languageProfile.filter(function(languageNgram){
            return languageNgram.ngram == documentNgram.ngram;
        });

        if (languageNgram.length == 1){
            scoresBiGram[language] +=  Math.abs(languageNgram[0].index - documentIndex);
        }
    });
});
endTime = now();
performanceBiGram = performanceBiGram + (endTime - startTime);
console.log("Generating the Bi Gram scores takes: ",performanceTriGram," ms!");



startTime = now();
documentProfileTriGram.forEach(function(documentNgram){
    var documentIndex = documentNgram.index;
    var languages = Object.keys(languageProfilesTriGram);

    languages.forEach(function(language){
        var languageProfile = languageProfilesTriGram[language];
        var languageNgram = languageProfile.filter(function(languageNgram){
            return languageNgram.ngram == documentNgram.ngram;
        });

        if (languageNgram.length == 1){
            scoresTriGram[language] +=  Math.abs(languageNgram[0].index - documentIndex);
        }
    });
});
endTime = now();
performanceTriGram = performanceTriGram + (endTime - startTime);
console.log("Generating the Tri Gram scores: ",performanceTriGram," ms!");


startTime = now();
var sortedScoresBiGram = sortScores(scoresBiGram);
endTime = now();
performanceBiGram = (performanceBiGram + (endTime - startTime)).toFixed(3);



startTime = now();
var sortedScoresTriGram = sortScores(scoresTriGram);
endTime = now();
performanceTriGram = (performanceTriGram + (endTime - startTime)).toFixed(3);



console.log("\nResults Bi Gram:\n");
console.log(JSON.stringify(sortedScoresBiGram));
console.log("Total time Bi Gram: ",performanceBiGram," ms!");

console.log("\nResults Tri Gram:\n");
console.log(JSON.stringify(sortedScoresTriGram));
console.log("Total time Tri Gram: ",performanceTriGram," ms!\n");



