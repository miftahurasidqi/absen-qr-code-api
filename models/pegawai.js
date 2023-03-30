const mongoose = require("mongoose");

const sekema = mongoose.Schema;
const skemaPegawai = new sekema({
  nama: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  peran: {
    type: String,
    enum: ["pegawai", "admin"],
    default: "pegawai",
  },
});
module.exports = mongoose.model("Pegawai", skemaPegawai);
