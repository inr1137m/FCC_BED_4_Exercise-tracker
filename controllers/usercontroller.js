const User = require('./../models/userModel')

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    // console.log({user: newUser});
    res.status(201).json({
      "_id" : newUser._id,
      "username" : newUser.username
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.retrieveUser = async (req, res) => {
  try {
    const userlist = await User.find().select('-log');
    res.status(201).json(userlist);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.addExercise = async (req, res) => {
  try{
    if(req.body.date === '' || typeof(req.body.date) === "undefined"){
      let [day, mon, date, year]= (Date(Date.now())).split(' ');
      req.body.date = [day, mon, date, year].join(' '); 
    } else {
      // console.log(req.body.date);
      let [day, mon, date, year]= (new Date(req.body.date).toString()).split(' ');
      req.body.date = [day, mon, date, year].join(' ');
    }
    // console.log(req.body.date);

    const addEx = await User.findByIdAndUpdate(req.params._id,{$push : {log :req.body}});
    // req.body['_id'] = addEx['_id'];
    // req.body['username'] = addEx['username'];

    res.status(201).json({_id: addEx['_id'],
    username: addEx['username'],
    date: req.body.date,
    duration: req.body.duration*1,
    description: req.body.description});
  }catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.retrieveExLogs = async (req, res) => {
  try {
    // console.log(req.params._id);
    let Exlogs = await User.find({_id : req.params._id});
    let data = { _id: Exlogs[0]._id, username: Exlogs[0].username, count: Exlogs[0].log.length, log: Exlogs[0].log };
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};