//to get last ball comment from the site cricinfo

let request = require('request');
let cheerio = require('cheerio');

request("https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/ball-by-ball-commentary",cb);
function cb(err, response, html)
{
    if(err){
        console.log(err);
    }else{
       extractData(html); //cheerio function
    }
}
function extractData(html)
{
    let selTool = cheerio.load(html);       //load the data
    let commentryArr = selTool(".col-14.col-md-15.col-lg-14 .match-comment-long-text");           //get the element in the data by class or id
    console.log(commentryArr.length);

    let last_ball_comment = selTool(commentryArr[0]).text();
    console.log(last_ball_comment);
}