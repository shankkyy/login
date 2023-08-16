const jwt = require("jsonwebtoken");
const db = require("../routes/dbconfig");

const login = async(req,res)=>{

    const {email,password} = req.body;
    if(!email || !password) return res.json({status: "error", error:"Please enter username or password"});
    else{
        let query = "SELECT * FROM employee WHERE CompanyEmail = ?"
        db.query(query, [email], (err,result)=>{
            if(err) throw err;
            if(!result.length || result[0].Password!=password)
                return res.json({status: "error", error:"Incorrect Email or password"});
            else{
                const token = jwt.sign({id:result[0].employeeid}, process.env.JWT_SECRET,{
                    expiresIn:process.env.JWT_EXPIRES,
                })
                const cookieOptions = {
                    expiresIn: new Date(Date.now() + process.env.COOKIE_EXPIRES*24*60*60*1000),
                    httpOnly: true
                }
                res.cookie("userRegistered", token, cookieOptions);
                return res.json({status:"success", success:"User has been logged in"});
            }
        })
    }
}
module.exports = login;