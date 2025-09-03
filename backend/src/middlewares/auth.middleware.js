import jwt from "jsonwebtoken"

export async function auth(req,res,next){
    const token = req.headers.token;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
            if(err){
                res.status(401).send({
                    message: 'Unauthorised'
                })
            } else {
                req.user = decoded;
                next()
            }
        })
    } else {
        res.status(401).send({
              message: "Unauthorized access"
        })
    }
}