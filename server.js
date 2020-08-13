const express = require('express')
const mongoose = require('mongoose')
const ejs = require('ejs')
const path = require('path')
const User = require('./models/user.model')

const app = express();
const port = process.env.PORT || 3000;

//SERVER CONNECTION
app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})

app.use(express.static(path.join(__dirname, 'views')));
app.set("view engine", "ejs");

//DATABASE CONNECTIONS
const uri = 'mongodb://localhost/assignment';
mongoose.connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});
let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("disconnected", () => console.log("Disonnected to MongoDB"));
db.on("reconnected", () => console.log("Reconnected to MongoDB"));
db.on("error", err => console.log(err));

//API ROUTES
require('./routes')(app);





