// Dependencies
// =============================================================
//  node npms:
let path = require("path");
let fs = require("fs");

//  third party npms:
let express = require("express");
let { uuid } = require("uuidv4");
let helmet = require("helmet");
//==============================================================

let app = express();
let PORT = process.env.PORT || 3000;

// Helmet can help protect your app from some well-known web vulnerabilities by 
// setting HTTP headers appropriately.

// Helmet is actually just a collection of smaller middleware functions that set 
// security-related HTTP response headers:

    // csp sets the Content-Security-Policy header to help prevent cross-site scripting attacks and other cross-site injections.
    // hidePoweredBy removes the X-Powered-By header.
    // hsts sets Strict-Transport-Security header that enforces secure (HTTP over SSL/TLS) connections to the server.
    // ieNoOpen sets X-Download-Options for IE8+.
    // noCache sets Cache-Control and Pragma headers to disable client-side caching.
    // noSniff sets X-Content-Type-Options to prevent browsers from MIME-sniffing a response away from the declared content-type.
    // frameguard sets the X-Frame-Options header to provide clickjacking protection.
    // xssFilter sets X-XSS-Protection to enable the Cross-site scripting (XSS) filter in most recent web browsers.
app.use(helmet());
// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));




// API ROUTES
app.get("/api/notes", function (req, res) {
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    if (err) throw err;
    let db = JSON.parse(data);
    res.send(db);
  });
});

app.post("/api/notes", function (req, res) {
  let note = { ...req.body, id: uuid() };
  //save db.jason to variable
  fs.readFile(__dirname + "/db/db.json", (err, data) => {
    if (err) throw err;
    let db = JSON.parse(data);
    db.push(note);

    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(db), (err, data) => {
      if (err) throw err;
      res.send(data);
    });
  });
});

app.delete("/api/notes/:id", function (req, res) {
  fs.readFile("db/db.json", (err, data) => {
    let db = JSON.parse(data);
    let savedNote = db.filter((item) => item.id !== req.params.id);
    fs.writeFile("db/db.json", JSON.stringify(savedNote, null, 2), (err) => {
      if (err) throw err;
      res.send(req.body);
    });
  });
});




// HTML ROUTES:
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});





// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
