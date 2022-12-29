const express = require('express')
const bodyParser = require("body-parser");
const db = require("./api/models");
const path = require('path')
var morgan = require('morgan')
const app = express();
app.use(morgan('dev'));
const fs  = require('fs')
const dotenv = require('dotenv');
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
// console.log(__dirname + '/api/upload')
//app.use('/upload',express.static(path.join(__dirname, '/public')))



if (fs.existsSync(path.join(__dirname + '/public'))){
    console.log('The path exists.');
}else {
    console.log('The path not  exists.');
}
  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public',express.static(path.join(__dirname + '/public')));
//app.use(express.static(__dirname + '/../../../public'));
app.set('views', path.join(__dirname + '/public'));
app.engine('public', require('ejs').renderFile);
app.set('view engine', 'public');




app.get("/", (req, res) => {
    res.json({ message: "Welcome to my Demo Appication " });
});


db.sequelize.sync().then(() => {
    console.log("Drop and re-sync db.");
  });


require("./api/routes/UserRoute.js")(app)

app.listen(3000, () => {
    console.log(`Server is running on port 3000.`);
})