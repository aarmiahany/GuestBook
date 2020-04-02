let http = require("http");
let config = require("./config/config");
const querystring = require('querystring');
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
        let trimmedUrl = pathname.replace(/\//, "");
        // get req method
        let method = req.method.toLowerCase();

        // gather all data together
        let data = { trimmedUrl, method };
        
        // select which handler will handler the req
        let selectedHandler = router[trimmedUrl] ? router[trimmedUrl] : router['notFound'];
        
        // get data from req body
        let body = '';

        req.on("data", data => {
              body  += data;  
        });

        // when req is ending
        req.on("end", _ => {
              // parse body data
              let parsedData = JSON.parse(body);
              // inject payload to data obj  
              data.payload = parsedData;
                 // call the hadnler
              selectedHandler(data, (err, statusCode, msg, headerType) => {
                    if(err) throw err;
                    res.statusCode = statusCode || 200;
                    res.setHeader(headerType || "Content-Type", "json/application");
                    res.end(msg);
               });
        });

     
    });

    server.listen(config.PORT, () => {
        console.log(`App is running at port ${config.PORT}`)
    });
}

startApp();