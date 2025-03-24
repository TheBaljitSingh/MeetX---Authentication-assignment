import app from './app.js';



import {connectDatabase} from "./db.js"
connectDatabase();


const port = process.env.port || 3000;

const server = app.listen(port, (e)=>{
    if(e){
        console.log("error is here" + err);
    }

    console.log(`server is working on 3000 port`);

})


