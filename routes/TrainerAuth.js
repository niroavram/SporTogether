const express = require('express')
const Router = express.Router()
const mongoose = require('mongoose')
//const Trainee = mongoose.model("Trainee")
const Trainer = mongoose.model("Trainer")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../key')
const requireLoginTrainee = require('../middleware/requireLoginTrainee')
const requireLoginTrainer = require('../middleware/requireLoginTrainer')


Router.post('/signupTrainer',(req,res)=>{
    const {username,email,password,age,tel,experience, sportType, photo} = req.body
    if(!email || !password || !username || !age || !tel||!experience || !sportType){
        return res.status(422).json({error:"please add all the fields"})
    }
    Trainer.findOne({email:email})
    .then((saveTrainer)=>{
        if(saveTrainer){
            return res.status(422).json({error:"Trainer already exist with that email"})
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
                const trainer = new Trainer({
                    email,
                    password:hashedpassword,
                    age,
                    tel,
                    experience,
                    username,
                    sportType,
                })
                trainer.save(err => {
                    if (err) {
                      res.status(500).send({ message: err })
                      return
                    }
                    res.json({message:"saved successfully"})
                })
        })
        
    })

    .catch(err=>{
        console.log(err)
    })
})


Router.post('/signinTrainer',(req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }
    Trainer.findOne({email:email})
    .then(savedTrainer=>{
        if(!savedTrainer){
           return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password, savedTrainer.password)
        .then(doMatch=>{
            if(doMatch){
               const token = jwt.sign({_id:savedTrainer._id},JWT_SECRET)
               const {_id, username, email, tel, age, password, experience, sportType, photo} = savedTrainer
               res.json({token, trainer:{ _id, username, email, tel, age, password, experience, sportType, photo}})
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})


Router.get("/TrainerDetails",(req,res)=>{
    Trainer.find({_id: req.body})
      .populate("-password")
      .then((trainerDetails)=>{
        res.json({trainerDetails})
  })
  .catch((err)=>{
    res.json(err)
  })
  })


//   Router.post('/EditTrainer',(req,res)=>{
//     const {username,email,password,age,tel,experience, sportType, photo} = req.body
//     if(!email || !password || !username || !age || !tel||!experience|| !sportType){
//         return res.status(422).json({error:"please fill in all the fields"})
//     }
//     Trainer.findOne({email:email})
//     .then((saveTrainer)=>{
//         if(saveTrainer){
//             return res.status(422).json({error:"Trainer already exist with that email"})
//         }
//         bcrypt.hash(password,12)
//         .then(hashedpassword=>{
//                 const trainer = new Trainer({
//                     email,
//                     password:hashedpassword,
//                     age,
//                     tel,
//                     experience,
//                     username,
//                 })
//                 trainer.save(err => {
//                     if (err) {
//                       res.status(500).send({ message: err })
//                       return
//                     }
//                     res.json({message:"saved successfully"})
//                 })
//         })
        
//     })

//     .catch(err=>{
//         console.log(err)
//     })
// })


Router.post('/editTrainerProfile',(req,res)=>{
    const {username, email,age,tel,experience, sportType} = req.body
    if(!username ||!email || !age || !tel||!experience || !sportType){
        return res.status(422).json({error:"please add all the fields"})
    }
    Trainer.findOne({email:email})
    .then(savedTrainer=>{
        if(!savedTrainer){
           return res.status(422).json({error:"Trainer not found"})
        }
        savedTrainer.username = username
        savedTrainer.age = age
        savedTrainer.tel = tel
        savedTrainer.experience = experience
        savedTrainer.sportType = sportType
        savedTrainer.save()
        .then((trainer)=> {res.json({message: "Updated trainer profile successfully"})})
        .catch(err => {res.json({message: err})})
    })
})


// Router.post('/signup',(req,res)=>{
//     const {username,email,password,age,tel} = req.body
//     if(!email || !password || !username || !age || !tel ){
//         return res.status(422).json({error:"please add all the fields required"})
//     }
//     Trainee.findOne({email:email})
//     .then((savedTrainee)=>{
//         if(savedTrainee){
//             return res.status(422).json({error:"Trainee already exist with that email"})
//         }
//         bcrypt.hash(password,12)
//         .then(hashedpassword=>{
//                 const trainee = new Trainee({
//                     email,
//                     password:hashedpassword,
//                     age,
//                     tel,
//                     username
//                 })
//                 trainee.save(err => {
//                     if (err) {
//                       res.status(500).send({ message: err })
//                       return
//                     }
//                     res.json({message:"trainee saved successfully"})
//                 })
//         })
        
//     })

//     .catch(err=>{
//         console.log(err)
//     })
// })
// Router.post('/signupTrainer',(req,res)=>{
//     const {username,email,password,age,tel,experience} = req.body
//     if(!email || !password || !username || !age || !tel||!experience){
//         return res.status(422).json({error:"please add all the fields"})
//     }
//     Trainer.findOne({email:email})
//     .then((saveTrainer)=>{
//         if(saveTrainer){
//             return res.status(422).json({error:"Trainer already exist with that email"})
//         }
//         bcrypt.hash(password,12)
//         .then(hashedpassword=>{
//                 const trainer = new Trainer({
//                     email,
//                     password:hashedpassword,
//                     age,
//                     tel,
//                     experience,
//                     username
//                 })
//                 trainer.save(err => {
//                     if (err) {
//                       res.status(500).send({ message: err })
//                       return
//                     }
//                     res.json({message:"saved successfully"})
//                 })
//         })
        
//     })

//     .catch(err=>{
//         console.log(err)
//     })
// })

// Router.post('/signin',(req,res)=>{
//     const {email,password} = req.body
//     if(!email || !password){
//         return res.status(422).json({error:"please add email or password"})
//     }
//     Trainee.findOne({email:email})
//     .then(savedTrainee=>{
//         if(!savedTrainee){
//            return res.status(422).json({error:"Invalid email or password"})
//         }
//         bcrypt.compare(password, savedTrainee.password)
//         .then(doMatch=>{
//             if(doMatch){
//                // res.json({message:"successfully signed in"})
//                const token = jwt.sign({_id:savedTrainee._id},JWT_SECRET)
//                res.json({token})
//             }
//             else{
//                 return res.status(422).json({error:"Invalid email or password"})
//             }
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     })
// })
// Router.post('/signinTrainer',(req,res)=>{
//     const {email,password} = req.body
//     if(!email || !password){
//         return res.status(422).json({error:"please add email or password"})
//     }
//     Trainer.findOne({email:email})
//     .then(savedTrainer=>{
//         if(!savedTrainer){
//            return res.status(422).json({error:"Invalid email or password"})
//         }
//         bcrypt.compare(password, savedTrainer.password)
//         .then(doMatch=>{
//             if(doMatch){
//             //  res.json({message:"successfully signed in"},)
//                const token = jwt.sign({_id:savedTrainer._id},JWT_SECRET)
//                res.json({token})
//             }
//             else{
//                 return res.status(422).json({error:"Invalid email or password"})
//             }
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     })
// })

// Router.post('/editTrainerProfile'),(req,res)=>{
//     const {username, email,age,tel,experience, sportType} = req.body
//     if(!username ||!email || !age || !tel||!experience || !sportType){
//         return res.status(422).json({error:"please add all the fields"})
//     }
//     Trainer.findOne({email:email})
//     .then(savedTrainer=>{
//         if(!savedTrainer){
//            return res.status(422).json({error:"Please fill in all the field required"})
//         }
//         savedTrainer.username = username
//         savedTrainer.age = age
//         savedTrainer.tel = tel
//         savedTrainer.experience = experience
//         savedTrainer.sportType = sportType
//         savedTrainer.save()
//         .then((trainer)=> {res.json({message: "Updated trainer profile successfully"})})
//         .catch(err => {res.json({message: err})})
//     })
// }

module.exports = Router