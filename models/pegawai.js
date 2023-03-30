const mongoose = require("mongoose");

const skemaPegawai = new mongoose.Schema({
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
exports.default = mongoose_1.default.model("Pegawai", skemaPegawai, "pegawai");
//# sourceMappingURL=pegawai.js.map
