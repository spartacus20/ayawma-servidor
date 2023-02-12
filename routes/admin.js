
require('dotenv').config();
const express = require('express')
const cloudinary = require('../Config/cloudinary.js');
const { addProduct, removeProduct } = require('../mysql_conector.js')
const router = express.Router();

router.post("/api/admin/new/product", async (req, res) => {

    const { id, name, description, price, imageList } = req.body;
    console.log(price)
    console.log(id)
    let newImages = [];
    for (let i = 0; i < imageList.length; i++) {
        const { public_id, url } = await cloudinary.uploader.upload(imageList[i], {
            folder: 'ayawma',
        });
        newImages.push({ public_id, url });
    }
    const images = [...newImages];
    addProduct(id, name, price, description, images, res)
    // console.log(req.body.imageList)
    // console.log(req.body)

})

router.post("/api/admin/delete/product", async (req, res) => {
    const { id } = req.body;
    console.log(id)
    removeProduct(id, res)
})




module.exports = router;