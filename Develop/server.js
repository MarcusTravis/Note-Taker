// Dependencies
// =============================================================
let express = require("express");
let path = require("path");
let fs = require("fs");
const { uuid } = require("uuidv4");
console.log(uuid());

// Sets up the Express App
// =============================================================
let app = express();
let PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

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

// In order to delete a note, you'll need to read all 
// notes from the db.json file, remove the note with 
// the given id property, and then rewrite the notes 
// to the db.json file.
app.delete('/api/notes/:id', function (req, res) {
  console.log(req);
  if (err) throw err;
    let db = JSON.parse(data);
    db.push(note);
  let id = req.params.id;
  

  fs.writeFile(__dirname + "/db/db.json", JSON.stringify(db), (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

//POST - CREATE
//GET - READ
//PULL - UPDATE
//DELETE - DELETE
