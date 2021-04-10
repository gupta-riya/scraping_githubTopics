// scrapping the player of match serially


let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";
let request = require("request");
let cheerio = require("cheerio");

let num = 1;
request(url, cb);
function cb(error, response, html) {
    if (error) {
        console.log(error)
    } else {
        // console.log(html);
        extractHtml(html);
    }
}
function extractHtml(html) {
    let selTool = cheerio.load(html);
    
    let scoreList = selTool('.match-cta-container a[data-hover="Scorecard"]');
    
    console.log(scoreList.length);
    let allLinks = [];
    
    for(let i = 0 ; i < scoreList.length ; i++)
    {
            let halfUrl =  selTool(scoreList[i]).attr("href");
            let scoreUrl = "https://www.espncricinfo.com" + halfUrl;
           allLinks.push(scoreUrl);
           
      
    }
    serialPlayer(allLinks, 0)
}
function serialPlayer(allLinks, n) {
    if (n == allLinks.length) {
        return;
    }
    request(allLinks[n], function (err, resp, html) {
        if (err) {
            console.log(err);
        } else {
            extractPlayer(html);
            serialPlayer(allLinks, n + 1);
        }
    })
}
function extractPlayer(html) {
    let selTool = cheerio.load(html);
   let playerDetails= selTool(".best-player-content").text();
   console.log(num + "." + playerDetails);
   num++;
   
}