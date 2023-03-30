const mongoose = require("mongoose");
const skemaKodeQr = new mongoose.Schema({
  kode: { type: String, required: true, unique: true },
  tanggal: { type: Date, required: true, default: Date.now },
});
module.exports = mongoose.model("KodeQr", skemaKodeQr, "kodeqr");
//# sourceMappingURL=kodeqr.js.map
