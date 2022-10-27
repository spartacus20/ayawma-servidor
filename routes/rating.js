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

router.post('/rating', (req, res) => {
   
   const { productID } = req.body 

   const QUERY = 'select * from rating where productID = ?'

   conector.query(QUERY,[productID], (err, rows) => {
      if (err) throw err;
      const data = JSON.parse(JSON.stringify(rows));

      console.log(rows.length)

      if(rows.length <= 0){
         return res.status(404).send({msg: "No reviews found"})
      }
      
      return res.status(200).send({data})
   }) 

})



module.exports = router