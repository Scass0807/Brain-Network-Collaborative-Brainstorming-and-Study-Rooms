require('dotenv').config({path: __dirname+'/.env'});
const express = require('express');
const router = express.Router();
const User = require('../controllers/user.controller.js');
const jwt = require('jsonwebtoken');
const redis = require("redis");

const redisClient = redis.createClient();

redisClient.on("connect", function () {
    console.log('redis connected');
});

const generateAccessToken = (user, result) => {
    jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,  {expiresIn: `5m`},(err, token) => {
        if(err) {
            result(err,null);
            return;
        }
        result(null, token);
    });
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const authToken = authHeader && authHeader.split(' ')[1];
    if(authToken == null)
    {
        res.status(401).send({
           message: `No authorization header token provided`
        });
        return;
    }
    jwt.verify(authToken,process.env.ACCESS_TOKEN_SECRET, (err, user) => {
       if(err)
       {
           res.status(403).send({
               message: err.message || "Access token could not be verified. It may have expired. please refresh token or log in again."
           });
           return;
       }
       redisClient.get(user.userid, (err, result) =>{
          if(err)
          {
              res.status(500).send({
                  message: err.message || "An internal server error occurred while authenticating."
              });
              return;
          }
          if(result === null)
          {
              res.status(403).send({
                  message: "User no longer authenticated please log in again."
              });
              return;
          }
          const redisTokens = JSON.parse(result);
          if (redisTokens.accessToken !== authToken)
          {
              res.status(403).send({
                  message: "Access token old and no longer valid please. Stop trying to hack."
              });
              return;
          }
          req.user = user;
          next();
       });

    });

};

const refreshToken = (req, res) => {
  const refToken = req.body.token || null;
    if(refToken == null)
    {
        res.status(401).send({
            message: `No refresh token provided`
        });
        return;
    }
    jwt.verify(refToken,process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err)
        {
            res.status(403).send({
                message: err.message || "Refresh token could not be verified. It may have expired. please log in again."
            });
            return;
        }
        redisClient.get(user.userid, (err, result) =>{
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while authenticating."
                });
                return;
            }
            if(result === null)
            {
                res.status(403).send({
                    message: "User no longer authenticated please log in again."
                });
                return;
            }
            const redisTokens = JSON.parse(result);
            if (redisTokens.refreshToken !== refToken)
            {
                res.status(403).send({
                    message: "Refresh token old and no longer valid please. Stop trying to hack."
                });
                return;
            }
            generateAccessToken({
                    username: user.username,
                    userid: user.userid
            },(err, accessToken) => {
                redisClient.set(user.userid, JSON.stringify({
                        accessToken: accessToken,
                        refreshToken: redisTokens.refreshToken
                    }),
                    redisClient.print
                );
                res.json({accessToken: accessToken});
            });
        });

    });
};

const login = (req, res)=> {
    const  userid = req.body.userid;
    const  username = req.body.username;

    if(req.body.authenticated)
    {
        const user = {
            username: username,
            userid: userid
        };
        generateAccessToken(user,(err, accessToken) =>{
            if(err)
            {
                res.status(500).send({
                    message: err.message || `An internal server error occurred while generating access token.`
                });
                return;
            }
            jwt.sign(user,process.env.REFRESH_TOKEN_SECRET,{expiresIn: `24h`},(err, refreshToken) => {
                res.json({
                    userid: userid,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                });
                redisClient.set(user.userid, JSON.stringify({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }),
                redisClient.print
                );
            });
        });
    }
    else
    {
        res.status(401).send({
            message: `Incorrect username or password.`
        });
    }


};

const logout = (req,res) => {
    redisClient.del(req.body.userid);
    res.send("User logged out");
};

router.post('/login', User.authenticate, login); // login
router.post('/refreshToken', refreshToken);
module.exports = {
    router:router,
    authenticateToken: authenticateToken
};
