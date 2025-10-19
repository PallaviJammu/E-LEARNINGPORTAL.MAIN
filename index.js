const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/elearnDB")
  .then(() => console.log("✅ GOT CONNECTION"))
  .catch((error) => console.log("❌ Failed to connect:", error));

// Middleware
app.use(express.urlencoded({ extended: true }));

// ✅ Serve all static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// ✅ Optional: also serve subjects folder (CSS/images inside it)
app.use("/subjects", express.static(path.join(__dirname, "subjects")));

// EJS view setup (for foundcomp.ejs)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const companySchema = new mongoose.Schema({}, { strict: false });
const Company = mongoose.model("Companie", companySchema);

// ✅ Default route — load homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Register route
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const user = new User({ username, email, password });

  user.save()
    .then(() => {
      console.log("✅ User registered:", username);
      res.redirect("login.html");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error registering user.");
    });
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      console.log("✅ Login successful:", username);
      res.redirect("index.html");
    } else {
      res.status(401).send("Invalid username or password.");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred during login.");
  }
});

// Company search route
app.post("/compsearch", async (req, res) => {
  const { company } = req.body;
  try {
    const results = await Company.find({ company_name: company });
    res.render("foundcomp", { data: results });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching for company.");
  }
});

// Start server
app.listen(1111, () => {
  console.log("🚀 Listening on http://localhost:1111");
});
