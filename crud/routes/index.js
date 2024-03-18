module.exports = {
    getHomePage: function(req, res) {
        // ดึงข้อมูล products จากฐานข้อมูลหรือที่อื่น ๆ และกำหนดค่าให้กับตัวแปร products
        // เช่นดึงจากฐานข้อมูล
        db.query('SELECT * FROM products', (err, results) => {
            if (err) throw err;
            const products = results;
            
            // ส่งข้อมูล products ไปยังหน้า index.ejs
            res.render('index', { products: products });
        });
    }
};
