const {createUser} = require("../model/userModel")

const addUser = async(req, res) =>{
    try{
        const {name,email,password} =req.body
        if (!name || !email || !password){
             return res.json({
                messege:"fild empty",
            })
        }
const user = await createUser(name, email, password) 
        if(user){
        res.json({
            messege : "Created Sucessfully",
            user: user
        })
    }
    }
    
    catch (e){
        res.json({
            messege: "unsucessful",
            e:e.messege,
        })
    }
}

module.exports={addUser}