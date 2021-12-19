const User = require('./../models/userModel')
const Logs = require('./../models/logModel')

const util = require('util')

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    // console.log({user: newUser});
    res.status(201).json({
      "_id": newUser._id,
      "username": newUser.username
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
    const userlist = await User.find();
    res.status(201).json(userlist);
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.addExercise = async (req, res) => {
  try {
    const userid = await User.find({ _id: req.params._id });
    req.body.uid = req.params._id;
    req.body.username = userid[0]['username'];
    if (req.body.date === '' || typeof (req.body.date) === "undefined") {
      let [day, mon, date, year] = (Date(Date.now())).split(' ');
      req.body.date = [day, mon, date, year].join(' ');
    } else {
      let [day, mon, date, year] = (new Date(req.body.date).toString()).split(' ');
      req.body.date = [day, mon, date, year].join(' ');
    }
    const addEx = await Logs.create(req.body);
    res.status(201).json({
      _id: req.body.uid,
      username: req.body.username,
      date: req.body.date,
      duration: req.body.duration * 1,
      description: req.body.description
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};


const cDate = (StrObj) => {
  let xlog = [];
  for (let i = 0; i < StrObj.length; i++) {
    let [day, mon, date, year] = (new Date(StrObj[i]['date']).toString()).split(' ');
    let newdate = [day, mon, date, year].join(' ');
    xlog.push({
      description: StrObj[i]['description'],
      duration: StrObj[i]['duration'],
      date: newdate
    });
  }
  return xlog;
}


exports.retrieveExLogs = async (req, res) => {
  try {
    const userid = await User.find({ _id: req.params._id });
    let uid = req.params._id;
    let username = userid[0]['username'];
    if ((req.query.from) && (req.query.to)) {
      let from = new Date(Date.parse(req.query.from));
      let to = new Date(Date.parse(req.query.to));
      let Exlogs = await Logs.find({ uid: uid, date: { $gte: from, $lte: to } }).select("-_id -uid -username");
      let data = { _id: uid, username: username, count: Exlogs.length, log: cDate(Exlogs) };
      res.status(201).json(data);
    } else if (req.query.limit) {
      let Exlogs = await Logs.find({ uid: uid }).select("-_id -uid -username").limit(req.query.limit * 1);
      let data = { _id: uid, username: username, count: Exlogs.length, log: cDate(Exlogs) };
      res.status(201).json(data);
    }
    else {
      let Exlogs = await Logs.find({ uid: uid }).select('-_id -uid -username');
      let data = { _id: uid, username: username, count: Exlogs.length, log: cDate(Exlogs) };
      res.status(201).json(data);
    }
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};