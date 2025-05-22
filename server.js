const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
    res.send("Hello, this is your Node.js server!");
});

app.listen(PORT, "localhost", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
