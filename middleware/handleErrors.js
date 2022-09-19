
const ERROR_HANDLERS = {
    CastError: res => 
        res.status(400).send({error: "id used is malformed"}),

    ValidationsError: (res,err) => 
        res.status(409).send({error: err.message}),
        
    ReferenceError: (res) => 
        res.status(409).send({error: "Someting wrong  with reference."}),

    defaultError : res => res.status(500).end()
}


export  const handleError = (err, req, res, next) => {
    const handler =  ERROR_HANDLERS[err.name] || ERROR_HANDLERS.defaultError
    handler(res, err)
}

