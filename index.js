const express = require('express')
const server = express()
const mongoose = require('mongoose');
const { createProduct } = require('./controller/Product');
const productRouters = require('./routes/Products')
const categoryRouter = require('./routes/Category')
const brandsRouter = require('./routes/Brand')
const usersRouter = require('./routes/User')
const authRouter = require('./routes/Auth')
const cartRouter = require('./routes/Cart')
const ordersRouter = require('./routes/Order')
const cors = require('cors')
const session = require('express-session')
const passport = require('passport');
const { User } = require('./model/User');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken')
const JwtStrategy  = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const crypto = require('crypto');
const { isAuth, sanitizeUser } = require('./services/common');

const SECRET_KEY = 'SECRET_KEY';
// JWT opitions
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY // TODO : should not be in code



// middlewares
server.use(
    session({
      secret: 'keyboard cat',
      resave: false, // don't save session if unmodified
      saveUninitialized: false, // don't create session until something stored
    })
  );

server.use(passport.authenticate('session'))

server.use(cors({
    exposedHeaders:['X-Total-Count']
}))
server.use(express.json());
server.use('/products',isAuth(),productRouters.router) // we can also use jwt token for client-only auth
server.use('/categories',isAuth(),categoryRouter.router)
server.use('/brands',isAuth(),brandsRouter.router)
server.use('/users',isAuth(),usersRouter.router)
server.use('/auth',authRouter.router)
server.use('/cart',isAuth(),cartRouter.router)
server.use('/orders',isAuth(),ordersRouter.router)


//Passport Strategies
passport.use(
    'local',
    new LocalStrategy(async function (username,password,done){
      try {
        const user = await User.findOne(
          { email: username }
        ).exec();
        if (!user) {
          done(null,false,{ message: "invalid credentials"})
        }
        crypto.pbkdf2(
         password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {

             if (!crypto.timingSafeEqual(user.password,hashedPassword)) {
              return done(null,false,{ message: "invalid credentials" })

               
            } 
            const token = jwt.sign(sanitizeUser(user),SECRET_KEY);

            done(null,token); // this line send to serialize
            
          })

      } catch (err) {
        done(err)
      }
    })
  );
  

  passport.use(
    'jwt',
    new JwtStrategy(opts, async function (jwt_payload, done) {
      console.log({jwt_payload})
      try {
        const user = await User.findOne({id:jwt_payload.sub})
        if(user){
          return done(null,sanitizeUser(user));// This calls the serializer
        }
        else{
          return done(null,false)
        }

      } catch (err) {
        return done(err,false);

      }
      
           
      
    })
  );

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
      console.log('serialized',user)
      return cb(null, { id: user.id, role: user.role });
    });
  });
  
  // this changes session variable req.user when called from authorized request
  
  passport.deserializeUser(function (user, cb) {
    console.log('deserialized',user)
    process.nextTick(function () {
      return cb(null, user);
    });
  });


main().catch(err=>console.log(err))

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    console.log('database connected')
}



server.listen(8080,()=>{
    console.log('server started')
})