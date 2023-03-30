const express = require("express");
const mongoose = require("mongoose");
const express_ws = require("express-ws");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const Pegawai = require("./models/pegawai");
// const rutePegawai = require("./routes/rutePegawai");
// const ruteKehadiran = require("./routes/ruteKehadiran");

const PORT = 3300;
// const mongodb_URI = "mongodb+srv://miftahurasidqi:Cedm4Ip6XI4f5kSy@cluster0.d3dl5wx.mongodb.net/presensi_QR";
const mongodb_URI = "mongodb+srv://miftahurasidqi:Cedm4Ip6XI4f5kSy@cluster0.d3dl5wx.mongodb.net/ngetes";
// const mongodb_URI = "mongodb://127.0.0.1:27017/ngetessss";
const router = express.Router();
const app = express();
dotenv.config();
express_ws(app);
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

mongoose.set("strictQuery", false);
const connectMongo = async () => {
  try {
    const con = await mongoose.connect(mongodb_URI);
    console.log(`conect sucses : ${con.connection.host}`);
  } catch (error) {
    process.exit(1);
  }
};
// app.use("/pegawai", rutePegawai);
// app.use("/kehadiran", ruteKehadiran);

app.use(
  "/tes",
  router.get("/", async (req, res) => {
    res.json({ msg: "sucses" });
  })
);
app.use(
  "/mongodb",
  router.get("/", async (req, res) => {
    const findPegawai = await Pegawai.find();

    res.json(findPegawai);
  })
);
connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`server run on port ${PORT}`);
  });
});

// mongoose
//   .connect(mongodb_URI)
//   .then(() => {
//     console.log("Terhubung dengan MongoDB");
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("Gagal terhubung dengan MongoDB:", err);
//   });
