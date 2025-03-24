import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    email:{
        type: String,
        require: true,
        unique: true,
    },
    password:{
        type: String,
        require: true,
    }
});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        // console.log(this.password);

        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
    

})

userSchema.methods.comparePassword = async function(userPassword){

    if (!userPassword || !this.password) {
        throw new Error ("Password or hashed password is missing");
    }
    return await bcrypt.compare(userPassword, this.password);
}



export default mongoose.model("User", userSchema);