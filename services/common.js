const passport = require('passport')

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
    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjgzZTMzMjVmZWE0MTRjYTk0N2VkYSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5Mzk5MDUxOX0.qUeKffDsQkwjUnIvYKAG5s-QeALpdOLXVHTM-VHCKiE'
    return token;
  };
  