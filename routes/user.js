const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const bcrypt = require("bcrypt");

//const User = require("../model/User.js")

const jwt = require("jsonwebtoken")

const userRouter = (fastify, option, done) => {
    fastify.post("/api/users/create", async (req, replay) => {
        console.log("papapapa",req.body.email)
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                replay.send({
                    success: false,
                    msg: "Please fill the field"
                })
            } else {
               
                const is_email = await prisma.user.findUnique({
                     where:{email}});
               
                if (is_email) {
                    replay.send({
                        success: false,
                        msg: "Email already exist"
                    })
                } else
                 {
                    const hashPassword = await bcrypt.hash(password, 12)
                    const users = {
                        name: name,
                        email: email,
                        password: hashPassword
                    };
                    const result = await prisma.user.create({
                        data:users
                    });
                    if (result) {
                        replay.send({
                            success: true,
                            msg: "User Create successfully"
                        })
                    } else {
                        replay.send({
                            success: false,
                            msg: "Server Problem"
                        })
                    }
                }

            }
        } catch (error) {
            replay.send("error " + error.message);
        }
    });


    fastify.post("/api/users/login", async (req, replay) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                replay.send({
                    success: false,
                    msg: "Please fill the field"
                })
            } else {
                const users = await prisma.user.findUnique({
                    where:{email}
                })
                if (users) {
                    const hashPassword = await bcrypt.compare(password, users.password)
                    if (hashPassword) {
                        const payload = { user_id: users.id };
                        const token = jwt.sign({ payload }, process.env.SECRET_KEY);
                        replay.send({
                            success: true,
                            msg: "Login Successfully",
                            token: token
                        })
                    } else {
                        replay.send({
                            success: false,
                            msg: "InValid Email and password",
                        })
                    }
                } else {
                    replay.send({
                        success: false,
                        msg: "InValid Email and password",
                    })
                }
            }
        } catch (error) {
            replay.send("error " + error.message);
        }
    });


    fastify.get("/api/users/me", async (req, replay) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            console.log('mi token', token)
            const { payload } = jwt.verify(token, process.env.SECRET_KEY);
            const users = await prisma.user.findUnique({where:{id:payload.user_id}});
            replay.send({ users }).status(200);
        } catch (error) {
            replay.status(401).send("unAuthorized");
        }
    })

}

module.exports = userRouter;