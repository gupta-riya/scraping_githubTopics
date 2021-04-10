// scrapping the player of match parallely


let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";
let request = require("request");
let cheerio = require("cheerio");

request(url, cb);
function cb(error, response, html) {
    if (error) {
        console.log(error)
    } else {
       
        extractHtml(html);
    }
}
function extractHtml(html) {
    let selTool = cheerio.load(html);
    let scoreList = selTool('.match-cta-container a[data-hover="Scorecard"]');
    
    console.log(scoreList.length);
    
    for(let i = 0 ; i < scoreList.length ; i++)
    {
            let halfUrl =  selTool(scoreList[i]).attr("href");
            let scoreUrl = "https://www.espncricinfo.com" + halfUrl;
            //console.log(scoreUrl);
           getPlayerOfTheMatch(scoreUrl);
           
      
    }
}
   
function getPlayerOfTheMatch(scoreUrl) {
  
    request(scoreUrl, function (err, res, html) {
        if (err) {
            console.log(err);
        } else {
            extractPlayer(html);
        }
    })
}
function extractPlayer(html) {
    let selTool = cheerio.load(html);
   let playerDetails= selTool(".best-player-content").text();
   console.log(playerDetails)
   
}