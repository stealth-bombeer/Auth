
require('dotenv').config()
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const requireAuth = async (req, res, next) => {
    //verify auth token
    const {authorization}=req.headers
    if(!authorization)
    {
        return res.status(401).json({error:"Auth token reqd."})
    }
    //get token sent by ftend
    const token=authorization.split(' ')[1];
    try {
        //get user id from token
        const {_id}=jwt.verify(token,process.env.SECRET)

        //attach user id to req object by reqd by other fx's
        req.user=await User.findById({_id}).select('_id');
        next();

    } catch (err) {
        console.log(err);
        res.status(401).json({error:"Auth token reqd."})
    }

}
module.exports = requireAuth;