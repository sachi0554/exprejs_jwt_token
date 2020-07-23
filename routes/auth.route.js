const express = require('express')
const router = express.Router();
const createError = require('http-errors')
const User = require('../models/user.model')
const {authSchema} = require('../helper/validation.schema')
const {signAccessToken, RefreshToken, VerifyrefreshToken} = require('../authProvider/jwt.provider')

router.post('/register', async(req, res , next)=>{
    try {
        const result = await authSchema.validateAsync(req.body)

        const exitUser = await User.findOne({email: result.email})
        if(exitUser) throw createError.Conflict(`this ${result.email} already exit`)

        const user = new User(result)
        const saveUser = await user.save()
        const accessToken = await signAccessToken(saveUser.id)
        const refreshToken = await RefreshToken(saveUser.id)

        res.send({accessToken, refreshToken})

    } catch (error) {
       if(error.isJoi === true) error.status = 422
       next(error) 
    }
})

router.post('/login', async(req, res , next)=>{
    try {
        const result = await authSchema.validateAsync(req.body)  

        const user = await User.findOne({email: result.email})
        if(!user) throw createError.NotFound("User not register in system")

        const isMatch = await user.isValidPassword(result.password)
        if(!isMatch) throw createError.Unauthorized('Username/Password not valid')
        
        const accessToken = await signAccessToken(user.id)
        const refreshToken = await RefreshToken(user.id)

        res.send({accessToken , refreshToken})
        
    } catch (error) {
        if(error.isJoi === true) return next(createError.BadRequest("Invalid Username/Password "))
        next(error)
    }
})

router.post('/refresh-token', async(req, res , next)=>{
   try {
       const {refreshToken} = req.body
       if(!refreshToken) throw createError.BadRequest()
       const userId = await VerifyrefreshToken(refreshToken)

       const accessToken = await signAccessToken(userId)
       const refToken = await RefreshToken(userId)

       res.send({"accessToken":accessToken, "refreshToken":refToken})

   } catch (error) {
       next(error)
   }
})

router.delete('/logout', async(req, res , next)=>{
    res.send("Logout Token Route");
})




module.exports = router