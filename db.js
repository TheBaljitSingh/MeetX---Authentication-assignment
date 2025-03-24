import mongoose from 'mongoose';


export const connectDatabase = async()=>{

    await mongoose.connect(process.env.DB_URI)
    .then ((data)=>{
        console.log(`Database connection successfull`);
    })
    .catch((e)=>{
        console.log(`Database Connection Error ${e}`)
    })


}

