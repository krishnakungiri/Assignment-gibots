const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    gender: { type: String, default: null },
    name: Object,
    location: Object,
    email: { type: String, default: null },
    login: Object,
    dob: Object,
    registered: Object,
    phone: { type: String, default: null },
    cell: { type: String, default: null },
    id: Object,
    picture: Object,
    nat: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);