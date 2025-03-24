import express from "express";
import bodyParser from 'body-parser';
import { configDotenv } from "dotenv";
import User from "./userModel.js"

import cors from 'cors'; // website error

import jwt from 'jsonwebtoken'; 


configDotenv();


const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({ message: "ok " })
})


app.post('/register', async (req, res) => {

    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@\.com$/;
   
    if (!gmailRegex.test(email)) {
        return res.status(400).json({
            message: "email is invalid"
        });
    }

        const user = await User.create({ name, email, password });

        res.status(201).json({
            message: "created",
            user
        })




    } catch (error) {
        console.log(error);

        res.status(500).json({ error });

    }




})

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "email or password is missing"
        })
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        return res.status(400).json({
            message: "email is invalid"
    });
    }

    try {

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({
                message: "invalid credential"
            })

        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            return res.status(401).json({
                message: "invalid credential"
            })
        }
        const token = jwt.sign({email:user.email}, process.env.JWT_SECRET, {expiresIn: '1hr'});

        const userData = {
            email: user.email,
            name: user.name,
            token: token // 
        };


        return res.status(200).json({ message: "success", userData });



        // int future can be send the token also

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "server side error"});

    }

})

app.get("/secure", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];


    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return res.status(200).json({ message: "This is verified", user: req.user });
    } catch (error) {
        return res.status(403).json({ message: "Not authorized, invalid token" });
    }

});

export default app;