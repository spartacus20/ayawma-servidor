
const ERROR_HANDLERS = {
    CastError: res => 
        res.status(400).send({error: "id used is malformed"}),

    ValidationsError: (res,err) => 
        res.status(409).send({error: err.message}), 

    JsonWebTokenError: (res) => 
        res.status(401).send({error: "token missing or invalid"}),
    
    defaultError : res => res.status(500).end()
}

export  const handleError = (error, req, res, next) => {
  
    const handler =  ERROR_HANDLERS.defaultError
    handler(res, error)
}

