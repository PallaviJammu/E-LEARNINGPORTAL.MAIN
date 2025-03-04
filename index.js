const express = require("express");
const app = express();
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "subjects")));

const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/elearnDB')
    .then(() => {
        console.log("GOT CONNECTION");
    })
    .catch((error) => console.log("oh no, failed", error));

let schema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = mongoose.model("User", schema);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);
    const user = new User({ username, email, password });
    user.save()
        .then((data) => {
            console.log(data);
            res.redirect("login.html");
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Error registering user.");
        });
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);

    try {
        const user = await User.findOne({ username, password });
        console.log(user)
        if (user) {
            res.redirect("index.html");
        } else {
            res.status(401).send("Invalid username or password.");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred during login.");
    }
});
const companySchema = new mongoose.Schema({}, { strict: false }); // Allows all key-value pairs

const Company = mongoose.model("Companie", companySchema); // Explicitly map to "companies" collection

app.post("/compsearch", async (req, res) => {
    const { company } = req.body;
    console.log(req.body)
    const results = await Company.find({ company_name: company });
    console.log(results)
    res.render("foundcomp", { data: results })
});

app.listen(1111, () => {
    console.log("Listening to port 1111");
});