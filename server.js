const express = require('express')
const bodyParser = require('body-parser')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const morgan = require('morgan')
const userController  =require('./controllers/usercontroller')

const app = express()

const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'))


//Db connect
const Dblink = process.env['Dburl'];
mongoose.connect(Dblink, (err) => {
  if(err) {
    console.log("Db connect error : ", err); 
  } else { 
    console.log('DB Connected 😉');
  }
});


//routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route('/api/users')
.get(userController.retrieveUser)
.post(userController.createUser);

app.route('/api/users/:_id/exercises').post(userController.addExercise);

app.route('/api/users/:_id/logs').get(userController.retrieveExLogs);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
