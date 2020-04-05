//load modules
let http = require("http");
let config = require("./config/config");
const { StringDecoder } = require('string_decoder');
let url = require("url");
let router = require("./routes/routes");

// load database Connection
let db = require("./dbConnection/db");

function startApp () {
        // connect to database
        db();
        var server = http.createServer((req , res) => {
        // start to collect data
        // get url
        let { pathname } = url.parse(req.url, true);
        // trim url
        let trimmedUrl = pathname.trim().replace(/\//, "");
        // get req method
        let method = req.method.toLowerCase();
        // get req headers
        let headers = req.headers;
        // gather all data together
        let data = { trimmedUrl, method, headers };
        
        // select which handler will handler the req
        let selectedHandler = router[trimmedUrl] ? router[trimmedUrl] : router['notFound'];
        
        // get data from req body
        let body = "";
        // string decoder class is for parsing data from  req body
        let decoder = new StringDecoder("utf8");

        // set req encoding to utf8
        req.setEncoding("utf8");

        // this event will trigger when there is a data in the req
        req.on("data", chunck => {
              body  += chunck;  
        });

        // when req is ending
        req.on("end", d => {
          // get any data if exists
          body += decoder.end(d);

              // parse body data body data exits
              let parsedData = body ? JSON.parse(body) : '';
              // inject payload to data obj  
              data.payload = parsedData;

              // set the content type for the res
              res.setHeader("Content-Type","application/json");
              // allow client side to fetch data (allow cross origin resource sharing)
              res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
              // allowed headers
              res.setHeader("Access-Control-Allow-Headers", "*");
              // allowed methods
              res.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS, PUT, PATCH, DELETE"
              );  
              res.statusCode = 200;
              // call the selcted handler to handler the incoming req
              selectedHandler(data, (err, code, msg) => {
                // handle err in the first argument
                if(err) {
                  res.end(JSON.stringify({ msg: "An Error Ocurried", error: err }));
                }else{
                    // if there is no error 
                    code = code;
                    //write a response to the client
                    res.write(JSON.stringify({ msg })); 
                    //end the response
                    res.end(); 
                }
              }) 
        }); 
    });

    server.listen(config.PORT, () => {
        console.log(`App is running at port ${config.PORT}`)
    });
}

// these for catch any Exp i did not handle
process.on("uncaughtException", err => {
  console.log(err);
  process.exitCode = 1;
})

startApp();