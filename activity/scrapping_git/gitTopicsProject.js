
// visiting on github topics page and extracting each topic url and after visiting their url, we need to extract first 8 repos
//and after visiting each repo , we will create pdf of each issue mentioned on the first page of the repo

let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let PDFDocument = require("pdfkit");

request("https://github.com/topics", cb);

function cb(err, resp, html) {
  if (err) {
    console.log(err);
  } else {
    extractTopics(html);
  }
}

function extractTopics(html) {
  let selTool = cheerio.load(html);

  let topicName = selTool(".topic-box a");
  for (let i = 0; i < topicName.length; i++) {
    let repoUrl = selTool(topicName[i]).attr("href");
    repoUrl = "https://github.com" + repoUrl;
    getRepos(repoUrl);
  }
}

function getRepos(repoUrl) {
  request(repoUrl, cb);
  function cb(err, resp, html) {
    if (err) {
      console.log(err);
    } else {
      extractRepos(html);
    }
  }
}

function extractRepos(html) {
  let selTool = cheerio.load(html);
  let topicName = selTool(".h1-mktg");

  let folderName = topicName.text().trim();
  //console.log(folderName);
  createDirectory(folderName);

  let repoLinks = selTool("a.text-bold");

  for (let i = 0; i < 8; i++) {
    let repoPageLink = selTool(repoLinks[i]).attr("href");

    let repoName = repoPageLink.split("/").pop();
    createJsonFile(repoName, folderName);
    let issueUrl = "https://github.com" + repoPageLink + "/issues";
    getIssues(repoName, folderName, issueUrl);
  }
}

//creating folder for each topic
function createDirectory(topicName) {
  let pathOfFolder = path.join(__dirname, topicName);
  if (fs.existsSync(pathOfFolder) == false) {
    fs.mkdirSync(pathOfFolder);
  }
}

//creating json file
function createJsonFile(repoName, folderName, repoUrl) {
  let pathOfFile = path.join(__dirname, folderName, repoName + ".json");
  if (fs.existsSync(pathOfFile) == false) {
    let createStream = fs.createWriteStream(pathOfFile);
    createStream.end();
  }
}

function getIssues(repoName, folderName, issueUrl) {
  request(issueUrl, cb);
  function cb(err, resp, html) {
    if (err) {
      console.log(err);
    } else {
      extractIssues(html, repoName, folderName);
    }
  }
}

//extract all the issues and write in a json file
function extractIssues(html, repoName, folderName) {
  let selTool = cheerio.load(html);
  let issueDetail = selTool("a.markdown-title");
  let arr = [];
  for (let i = 0; i < issueDetail.length; i++) {
    let issueLink = selTool(issueDetail[i]).attr("href");
    let issueTitle = selTool(issueDetail[i]).text();

    arr.push({
      name: issueTitle,
      link: "https://github.com" + issueLink,
    });
  }
  let filePath = path.join(__dirname, folderName, repoName + ".pdf");
  let pdfDoc = new PDFDocument();
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.text(JSON.stringify(arr));
  pdfDoc.end();
  //fs.writeFileSync(filePath,JSON.stringify(arr));
  //console.table(arr)
  console.log("``````````````````````````");
}
