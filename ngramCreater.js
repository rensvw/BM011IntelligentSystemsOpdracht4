"use strict";
function getNgrams(text, n){
    var ngrams = {};
    var content = text
            // Make sure that there is letter a period.
            .replace(/\.\s*/g, '_')
            // Discard all digits.
            .replace(/[0-9]/g, "")
            //Discard all punctuation except for Apostrophe.
            .replace(/[&\/\\#,+()$~%.":*?<>{}]/g,'')
            // Remove duplicate spaces.
            .replace(/\s*/g, '')
            .toLowerCase();
    for(var i = 0; i < content.length - (n-1); i++){
        var token = content.substring(i, i + n);
        if (token in ngrams)
            ngrams[token] += 1;
        else
            ngrams[token] = 1;
    }
    return ngrams;
}

function sortNgrams(ngrams){
    return Object.keys(ngrams).map(function(key) {
        return {'ngram': key, 'freq':ngrams[key]};
    }).sort(function(first, second) {
        // If the frequency is the same favour larger ngrams
        return second['freq'] - first['freq'];
    }).map(function(ngram, index){
        ngram['index'] = index;
        return ngram;
    });
}

exports.generateProfileBiGram = function(text, topN){
    var biGrams = getNgrams(text, 2);
    var sortedNgrams = sortNgrams(biGrams);
    return sortedNgrams.slice(0, topN);
};

exports.generateProfileTriGram = function(text, topN){
    var triGrams = getNgrams(text, 3);
    var sortedNgrams = sortNgrams(triGrams);
    return sortedNgrams.slice(0, topN);
};
