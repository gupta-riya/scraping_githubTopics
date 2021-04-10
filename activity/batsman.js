
//extracting the data from cricket info providing website and getting the names and birthdays of all the batsman played in the speific match 


let request = require('request');
let cheerio = require('cheerio');

request("https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard", cb);
function cb(err, response, html) {
    if (err) {
        console.log(err);
    } else {
        extractData(html); //cheerio function
    }
}

function extractData(html) {
    let selTool = cheerio.load(html);
    let teamNameEleArr = selTool(".Collapsible h5");
    let teamNameArr = [];

    for (let i = 0; i < teamNameEleArr.length; i++) {
        let teamName = selTool(teamNameEleArr[i]).text();
        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();
        teamNameArr.push(teamName);
        console.log(teamName);
    }

    let batsmantableArr = selTool(".table.batsman");
    /*

    //to get the batsman table data
    let batsmanHtmlStr = "";
    for(let i = 0 ; i < batsmantableArr.length ; i++)
    {
        batsmanHtmlStr += selTool(batsmantableArr[i]).html();
    }

    console.log(batsmanHtmlStr);
    */

    /*
    for(let i = 0 ; i < batsmantableArr.length ; i++)
    {
        let playersRow = selTool(batsmantableArr[i]).find("tbody tr");

        //if player all column length is greater than 8 then it is a valid row becoz there are extra  useless rows also which we need to remove
        
        //we can also do j = j+2 as every player row is followed by one useless row
        for(let j = 0 ; j < playersRow.length - 1 ; j++)
        {
            //playersRow.length-1 to remove that extra row at the last
            //second way is there is a batsman class where valid player row is 
            let playersAllColumn = selTool(playersRow[j]).find("td");
            if(playersAllColumn.length==8)
            {
            let name = selTool(playersAllColumn[0]).text();
            console.log(name + " of " + teamNameArr[i]);
            }
        }

        console.log("``````````````````````````````````````````````````````");

       
    }
    */

    //or

    /*
    for(let i = 0 ; i < batsmantableArr.length ; i++)
    {
        let playersRow = selTool(batsmantableArr[i]).find("tbody tr .batsman-cell");

       
        for(let j = 0 ; j < playersRow.length  ; j++)
        {
            //playersRow.length-1 to remove that extra row at the last
            //second way is there is a batsman class where valid player row is
            let name = selTool(playersRow[j]).text(); 
            console.log(name + " of " + teamNameArr[i]);
        }

        console.log("``````````````````````````````````````````````````````");

       
    }
    */


    //to get bdays of the players that are on next pagee

    for (let i = 0; i < batsmantableArr.length; i++) {
        let playersRow = selTool(batsmantableArr[i]).find("tbody tr a");


        for (let j = 0; j < playersRow.length; j++) {
            //got the url for every player

            let name = selTool(playersRow[j]).text();
            let teamName = teamNameArr[i];
            let link = "https://www.espncricinfo.com" + selTool(playersRow[j]).attr("href");
            // console.log(name + " " + teamName + " " + link);
            // batman name team
            printBirthdays(link, name, teamName);
        }
        // console.log("`````````````````````````");
    }
}

function printBirthdays(link, name, teamName) {
    request(link, cb);
    function cb(error, response, html) {
        if (error) {
            console.log(error)
        } else {
            // console.log(html);
            extractBirthday(html, name, teamName);
            console.log("````````````````````````````");
        }
    }
}
function extractBirthday(html, name, teamName) {
    let selectorTool = cheerio.load(html);
    let birthdayElem = selectorTool(".player-card-description.gray-900");
    let birthday = selectorTool(birthdayElem[1]).text();
    console.log(name + "Plays for " + teamName + " was born on " + birthday)

}
