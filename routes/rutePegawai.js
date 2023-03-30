const express = require("express")
const pegawaiCtr = require("../controllers/pegawaiCtr");
const otentikasiMw = require("../middlewares/otentikasiMw");
const peranMw = require("../middlewares/peranMw");
const rute = express.Router();


rute.post("/", otentikasiMw, aksesPeran('admin'), pegawaiCtr.tambahPegawai);
rute.get("/", otentikasiMw.otentikasiMw, (0, peranMw.aksesPeran)('admin'), pegawaiCtr.semuaPegawai);
rute.get("/profil", otentikasiMw.otentikasiMw, pegawaiCtr.profil);
rute.post("/login", pegawaiCtr.login);
// Add more routes as needed
exports.default = rute;
//# sourceMappingURL=rutePegawai.js.map