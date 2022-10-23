const { clear } = require('console');
const http = require('http');
const { type } = require('os');
const fs = require('fs').promises;
const path = require('path');

const app = http.createServer(async (req, res) => {
  const requestMethod = req.method;
  const requestURL = req.url;
  const jsonPath = path.resolve("./data.json");
  const jsonFile = await fs.readFile(jsonPath, "utf8");
  if(requestURL === "/apiv1/users/"){
    if(requestMethod === "GET"){
      res.writeHead("200", "Content-Type", "application/json");
      res.write(jsonFile);
      res.end();
    } else if (requestMethod === "POST"){
      req.on("data", async (data) => {
        const Data = JSON.parse(data);
        const dataInFile = JSON.parse(jsonFile);
        const newData = [...dataInFile, Data];
        fs.writeFile(jsonPath, JSON.stringify(newData));
        res.end();
      })
    } else if (requestMethod === "PUT") {
      req.on("data", async (data) => {
        const Data = JSON.parse(data);
        const idData = Data.id;
        const dataInFile = JSON.parse(jsonFile);
        const indexDataToUpdate = dataInFile.findIndex(dat => 
          dat.id === idData
        );
        dataInFile[indexDataToUpdate] = Data;
        fs.writeFile(jsonPath, JSON.stringify(dataInFile), "utf8");
        res.writeHead("200");
        res.end();
      })
    } else if (requestMethod === "DELETE"){
      req.on("data", async(data) => {
        const Data = JSON.parse(data);
        const dataInFile = JSON.parse(jsonFile);
        const newArray = dataInFile.filter(dat => dat.id !== Data.id);
        // console.log(newArray);
        fs.writeFile(jsonPath,JSON.stringify(newArray), "utf8");
        res.writeHead("200");
        res.end();
      })
    }
  } else {
    res.writeHead("503");
  }
});

const PORT = 8000;

app.listen(PORT);

console.log('funcionando todo ok');