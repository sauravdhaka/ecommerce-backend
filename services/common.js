const passport = require('passport')
const nodemailer = require('nodemailer')


// Email

let transporter = nodemailer.createTransport({
  host : "smtp.gmail.com",
  port : 587,
  secure : false,
  auth : {
    user: 'sauravdhaka2001@gmail.com',//gmail
    pass : process.env.MAIL_PASSWORD,//pass
  }
})

exports.isAuth = (req,res,done)=>{
  return passport.authenticate('jwt')
}


exports.sanitizeUser = (user)=>{
    return {id:user.id , role : user.role}
}


exports.cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['jwt'];
    }
    // TODO : this is temporary token for testing without cookies
    //token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjhhN2E1OWZjZWYzYjM5NjI2ZTQ0MiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjk0MDY1MjMxfQ.vq20BkmfsCGFr5x3q1QQg8KsCok3vOB2z8-2laJTCys'
    return token;
  };
  
exports.sendMail = async function({to , subject , text , html}){
  
  let info = await transporter.sendMail({
    from : '"E-commerce" <foo@example@gmail.com>',//sender address
   to,
   subject,
   text,
   html
  });
  return info
}

