// exports.profil = exports.login = exports.semuaPegawai = exports.tambahPegawai = void 0;
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const pegawai = require("../models/pegawai");
const ruteWs = require("../routes/ruteWs");
const pegawai = require("../models/pegawai");

const tambahData = async (nama, email, password, peran) => {
  const salt = await bcrypt.genSalt(10);
  const passwordTerenkripsi = await bcrypt.hash(password, salt);
  // Membuat pegawai baru
  const pegawaiBaru = new pegawai({ nama, email, password: passwordTerenkripsi, peran });
  // Menyimpan pegawai baru ke database
  pegawaiBaru.save();
  return pegawaiBaru;
};

const tambahPegawai = async (req, res) => {
  const { nama, email, password, peran } = req.body;
  // Validasi data yang diterima dari request
  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Nama, email dan password harus disertakan" });
  }

  try {
    // Mengecek apakah email sudah ada dalam database
    const cekEmail = await pegawai.findOne({ email });
    if (cekEmail) {
      return res.status(400).json({ message: "Email sudah digunakan" });
    }
    // Membuat pegawai baru
    const pegawaiBaru = await tambahData(nama, email, password, peran);
    // Mengirimkan response dengan pegawai yang baru dibuat
    res.status(201).json(pegawaiBaru);
  } catch (error) {
    console.error("Gagal menambahkan pegawai:", error);
    res.status(500).json({ message: "Gagal menambahkan pegawai" });
  }
};

// exports.tambahPegawai = tambahPegawai;
const semuaPegawai = async (req, res) => {
  try {
    // Ambil halaman dari query parameter atau gunakan 1 sebagai default
    const halaman = parseInt(req.query.halaman) || 1;
    const dataPerHalaman = 10;

    // Menghitung jumlah total dokumen untuk menghitung jumlah halaman
    const totalDocuments = await pegawai.countDocuments();
    const totalHalaman = Math.ceil(totalDocuments / dataPerHalaman);
    const skip = (halaman - 1) * dataPerHalaman;

    // Mengambil pegawai dari database menggunakan pagination dan mengurutkan berdasarkan tanggal secara descending
    const data = await pegawai.default.find({}, { _id: 0, password: 0, __v: 0 }).sort({ nama: 1 }).skip(skip).limit(dataPerHalaman);

    // Mengirimkan response dengan daftar pegawai, halaman saat ini, dan jumlah halaman
    res.status(200).json({ data, halaman, totalHalaman });
  } catch (error) {
    console.error("Gagal mengambil data pegawai:", error);
    res.status(500).json({ message: "Gagal mengambil data pegawai" });
  }
};

// exports.semuaPegawai = semuaPegawai;

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let pegawai = await pegawai.findOne({ email });
    if (!pegawai) {
      if (email === process.env.ADMINEMAIL && password === process.env.ADMINPASS) {
        pegawai = await tambahData(email, email, password, "admin");
      } else {
        return res.status(400).json({ message: "Email atau password salah" });
      }
    }
    const isPasswordValid = await bcrypt.compare(password, pegawai.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Email atau password salah" });
    }
    const token = await jsonwebtoken.sign({ id: pegawai._id, peran: pegawai.peran }, process.env.JWT_SECRET || "secret", {
      expiresIn: "1w",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan saat mencoba login" });
  }
};
// exports.login = login;

const profil = async (req, res) => {
  try {
    // Mencari pegawai berdasarkan ID
    const pegawai = await pegawai.findById(req.user.id, { _id: 0, password: 0, __v: 0 });
    if (!pegawai) {
      // Jika pegawai tidak ditemukan, kirimkan pesan error
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    return res.status(200).json({ data: pegawai });
  } catch (error) {
    console.error("Gagal mengambil data profil:", error);
    res.status(500).json({ message: "Gagal mengambil data profil" });
  }
};

module.exports = {
  tambahPegawai,
  semuaPegawai,
  login,
  profil,
};
