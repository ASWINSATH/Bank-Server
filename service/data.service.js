//import jsonwebtoken

const jwt = require('jsonwebtoken')

//import db.js

const db = require('./db')

userDetails = {
  1000: { acno: 1000, username: 'aswin', password: 100, balance: 10000, transaction: [] },
  1001: { acno: 1001, username: 'ashal', password: 101, balance: 20000, transaction: [] },
  1002: { acno: 1002, username: 'asal', password: 102, balance: 30000, transaction: [] }
}

//register 

const register = (acno, password, username) => {
  return db.User.findOne({ acno })
    .then(user => {
      if (user) {
        return {
          statusCode: 401,
          status: false,
          message: 'user alredy exist..'
        }
      }

      else {
        const newUser = db.User({
          acno,
          username,
          password,
          balance: 0,
          transaction: []
        })

        newUser.save()
        return {
          statusCode: 201,
          status: true,
          message: "successfully register"
        }
      }
    })
}

//login

const login = (acno, pswd) => {
  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      currentUser = user.username
      currentAcno = acno

      // token generation
      const token = jwt.sign({
        currentAcno: acno
      }, 'supersecretkey12345')

      return {
        statusCode: 200,
        status: true,
        message: 'succefully logged in',
        currentUser,
        currentAcno,
        token
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: "incorrect account number/password"
      }

    }

  })

}

//deposit

const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt)
  return db.User.findOne({
    acno,
    password: pswd

  }).then(user => {
    if (user) {
      user.balance += amount
      user.transaction.push({
        type: 'CREDIT',
        amount

      })
      user.save()
      return {
        statusCode: 200,
        status: true,
        message: `${amount} credited and new balance is ${user.balance}`
      }
    }
    else {
      return {
        statusCode: 401,
        status: false,
        message: 'incorrect password/username'
      }
    }
  })
}

//withdraw

const withdraw = (acno, pswd, amt) => {
  var amount = parseInt(amt)

  return db.User.findOne({
    acno,
    password: pswd
  }).then(user => {
    if (user) {
      if (user.balance >= amount) {
        user.balance -= amount
        user.transaction.push({
          type: 'DEBIT',
          amount
        })


        user.save()
        return {
          statusCode: 200,
          status: true,
          message: `${amount} debited and new balance is ${user.balance}`
        }
      }
      else {
        return {
          statusCode: 401,
          status: false,
          message: 'Insufficient balance'
        }
      }
    }

    else {
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect password/account'
      }
    }
  })
}

//transaction 

const getTranscation = (acno) => {
  return db.User.findOne({
    acno
  }).then(user => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        transaction: user.transaction
      }
    }
    else {
      return {
        statusCode: 402,
        status: true,
        message: 'user doesnot exist'
      }
    }
  })
}

//export all function 
module.exports = {
  register,
  login,
  deposit,
  withdraw,
  getTranscation
}