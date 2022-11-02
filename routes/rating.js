const express = require('express');
const { conector, getDecodedToken }  = require('../mysql_conector'); 

const router = express.Router();


router.post('/new-rating', (req, res) => {

   const  { productID, comment } = req.body;
   const { id } = getDecodedToken(req)


   const data = new Date()
   const month = ["Jamuary", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
   const dateToday = data.getDate().toString() + " " +month[data.getMonth()] + " " + data.getFullYear(); 
    

   const QUERY = 'INSERT INTO rating (productID, userID, rating, comment, comment_data) VALUES (?, ?, ?, ?, ?)';
    
   conector.query(QUERY, [productID, id, comment.rating, comment.comment, dateToday], (err) => {
        if (err) throw err; 
        res.status(200).send({msg: "New review successfully created"}); 
     })


})

router.post('/rating', (req, res) => {
   
   const { productID } = req.body 

   const QUERY = (`
   
   select users.name,rating.rating,rating.comment,rating.comment_data from rating 
   INNER JOIN users ON rating.userID = users.id 
   INNER JOIN products ON rating.productID = products.id 
   where productID = ?`)

   conector.query(QUERY,[productID], (err, rows) => {
      if (err) throw err;
      const data = JSON.parse(JSON.stringify(rows));

      console.log(rows.length)

      if(rows.length <= 0){
         return res.send({data})
      }
      

      return res.status(200).send({data})
   }) 

})



module.exports = router