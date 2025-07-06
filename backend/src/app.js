const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const baivietRoutes = require('./routes/baiviet');
const multer = require('multer');
// const giangvienRoutes = require('./routes/giangvien');


const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use("/uploads", express.static("uploads"));

app.use(cors({
  origin: '*',
  exposedHeaders: ['Content-Range'],
}));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', userRoutes);
// app.use('/api', baivietRoutes);
app.use('/api', require('./routes/giangvien'));
app.use('/api', require('./routes/sinhvien'));
app.use('/admin', adminRoutes);
// app.use("/sinhvien", require("./routes/sinhvien"));

app.use('/baiviet', require('./routes/baiviet'));
app.use('/lophocphan', require('./routes/lopHocPhan'));
// app.use('/giangvien', require('./routes/giangvien'));
// app.use('/sinhvien', require('./routes/sinhvien'));
app.use('/sinhvien_lhp', require('./routes/sinhvien_lhp'));
app.use('/api/comments', require("./routes/nhanxet"));

module.exports = app;
