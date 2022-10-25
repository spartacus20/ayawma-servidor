const express = require('express');
const { conector }  = require('../mysql_conector'); 

const router = express.Router();


router.post('/new-rating', (req, res) => {

    const  { productID, userID, comment } = req.body;
   console.log(req.body)
    var data = new Date()

    const month = ["Jamuary", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const dateToday = data.getDate().toString() + " " +month[data.getMonth()] + " " + data.getFullYear(); 
    

    const QUERY = 'INSERT INTO rating (productID, userID, rating, comment, comment_data) VALUES (?, ?, ?, ?, ?)';
    
     conector.query(QUERY, [productID, userID, comment.rating, comment.comment, dateToday], (err) => {
        if (err) throw err; 
        res.status(200).send({msg: "New review successfully created"}); 
     })


})





module.exports = router