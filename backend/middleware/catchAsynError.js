export default (errorFunction)=>(req,res,next)=>{
    Promise.resolve(errorFunction(req,res,next)).catch(next)
}