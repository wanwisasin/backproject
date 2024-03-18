const fs = require('fs');

exports.addProductPage = (req, res) => {
    res.render('add-product.ejs', {
        title: " Add a new product",
        message: ''
    });
};

exports.addProduct = (req, res) => {
    if (!req.files) {
        return res.status(400).send("No files were uploaded.");
    }

    let message = '';
    let name = req.body.product_name;
    let description = req.body.product_des;
    let price = req.body.product_price;
    let quanlity = req.body.product_quanlity; // Updated variable name
    let categoryId = req.body.category_id; // Updated variable name
    let uploadedFile = req.files.product_img; // Updated variable name
    let image_name = uploadedFile.name;
    let fileExtension = uploadedFile.mimetype.split('/')[1];
    image_name = name + '.' + fileExtension; // Use product name for image name

    let productNameQuery = "SELECT * FROM `products` WHERE product_name = '" + name + "'";

    db.query(productNameQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }

        if (result.length < 0) {
            message = 'Product name already exists';
            res.render('add-product.ejs', {
                message,
                title: " Add a new product"
            });
        } else {
            // check the filetype before uploading it
            if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg') {
                // upload the file to the /public/assets/img directory
                uploadedFile.mv(`public/assets/img/`+image_name, (err ) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    // send the product's details to the database
                    let query = "INSERT INTO `products` (product_name, product_des, product_price, product_quanlity, product_img, category_id) VALUES ('" +
                        name + "', '" + description + "', '" + price + "', '" + quanlity + "', '" + image_name + "', '" + categoryId + "')";
                    db.query(query, (err, result) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        res.redirect('/');
                    });
                });
            } else {
                message = "Invalid File format. Only 'jpeg' and 'png' images are allowed.";
                res.render('add-product.ejs', {
                    message,
                    title: "Add a new product"
                });
            }
        }
    });
}

exports.editProductPage = (req, res) => {
    let productId = req.params.id;
    let query = "SELECT * FROM `products` WHERE product_id = '" + productId + "' "; // Updated column name
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.render('edit-product.ejs', {
            title: "Edit Product",
            product: result[0],
            message: ''
        });
    });
}

exports.editProduct = (req, res) => {
    let productId = req.params.id;
    let name = req.body.product_name;
    let description = req.body.product_des;
    let price = req.body.product_price;
    let quanlity = req.body.product_quanlity; // Updated variable name
    let categoryId = req.body.category_id; // Updated variable name

    let query = "UPDATE `products` SET `product_name` = '" + name + "', `product_des` = '" + description + "', `product_price` = '" + price + "', `product_quanlity` = '" + quanlity + "', `category_id` = '" + categoryId + "' WHERE `products`.`product_id` = '" + productId + "'"; // Updated column names
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/');
    });
}

exports.deleteProduct = (req, res) => {
    let productId = req.params.id;
    let getImageQuery = 'SELECT product_img from `products` WHERE product_id = "' + productId + '"'; // Updated column name
    let deleteProductQuery = 'DELETE FROM products WHERE product_id = "' + productId + '"'; // Updated column name

    db.query(getImageQuery, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        let image = result[0].product_img; // Updated column name

        fs.unlink(`public/assets/img/`+image, (err) => {
            if (err) {
                return res.status(500).send(err);
            }
            db.query(deleteProductQuery, (err, result) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.redirect('/');
            });
        });
    });
}
