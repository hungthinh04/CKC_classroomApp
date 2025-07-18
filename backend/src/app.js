const express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const baivietRoutes = require('./routes/baiviet');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
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

app.use('/api', require('./routes/auth'));
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
// app.use('/auth', require('./routes/auth'));
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // hoặc 'abc'
  api_key: process.env.CLOUDINARY_API_KEY, // hoặc '123'
  api_secret: process.env.CLOUDINARY_API_SECRET // hoặc 'xyz'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
  }
});
const upload = multer({ storage: storage });

router.post('/uploads', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: req.file.path });
});

module.exports = app;
