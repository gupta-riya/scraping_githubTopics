
// we need to extract number of  wickets taken by  all the bowlers in the match and also printing the maximum wicket

let request = require('request');
let cheerio = require('cheerio');

request("https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard",cb);
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
    let bothBowlerTable = selTool(".table.bowler");

    /*
    //to get complete tables 
    let bowlerTable = "";
    for(let i = 0 ; i  < bothBowlerTable.length ; i++)
    {
        bowlerTable += selTool(bothBowlerTable[i]).html();
    } 
   console.log(bowlerTable);   
   */
  
   let hwt_name="";
   let hwt = 0;
   for(let i = 0 ; i < bothBowlerTable.length ; i++)
   {
       let playerRow = selTool(bothBowlerTable[i]).find("tbody tr");        //get each row

       for(let j = 0 ; j < playerRow.length ; j++)
       {
           let allColoumPlayer = selTool(playerRow[j]).find("td");          //get each column of a particular row
           let name = selTool(allColoumPlayer[0]).text();
           let wicket = selTool(allColoumPlayer[4]).text();

        //to get bowler with highest wicket
           if(wicket >= hwt)
           {
               hwt_name = name;
               hwt = wicket;
           }
           console.log("name : ",name , "\t\t wicket : ",wicket);
       }

       console.log("``````````````````````````````````````````````");
   }
    console.log("Higest wicket player name = ",hwt_name,"\tHighest wicket = ",hwt);    
}