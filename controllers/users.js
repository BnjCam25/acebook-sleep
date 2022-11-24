const User = require('../models/user')

const UsersController = {
  New: (req, res) => {
    res.render('users/new', { newUser: true })
  },

  Create: (req, res) => {
    const user = new User(req.body)
    const email = user.email

    User.findOne({ email }).then((email) => {
      if (!email) {
        req.session.user = user
        user.save((err) => {
          if (err) {
            throw err
          }
          res.status(201).redirect('/posts')
        })
      } else if (user.email !== email) {
        res.redirect('/users/new')
      }
    })
  },

  All: (req, res) => {
    User.find().populate('user_id').exec((err, users) => {
      if (err) {
        throw err
      }

      res.render('users/all', { users, current_user: req.session.user.first_name, current_session: req.session.user._id, user_first_name: req.body.first_name, user_last_name: req.body.user_last_name })
    })
  },

  AddFriend: (req, res) => {
  //    // check if current user is in the friends list
    User.findOne({ _id: req.body.id, friends: req.session.user._id }).exec((err, result) => {
      if (err) {
        throw err
      }
      if (result) {
        User.findOneAndUpdate({ _id: req.body.id }, { $pull: { friends: req.session.user._id } }).exec((err) => {
          if (err) {
            throw err
          }
          User.findOneAndUpdate({ _id: req.session.user._id }, { $pull: { friends: req.body.id } }).exec((err) => {
            if (err) {
              throw err
            }
            res.status(201).redirect('/users/all')
          })
        })
      } else {
        User.findOneAndUpdate({ _id: req.body.id }, { $push: { friends: req.session.user._id } }).exec((err) => {
          if (err) {
            throw err
          }
          User.findOneAndUpdate({ _id: req.session.user._id }, { $push: { friends: req.body.id } }).exec((err) => {
            if (err) {
              throw err
            }
            res.status(200).redirect('/users/all')
          })
        })
      }
    })
  }
}


module.exports = UsersController
