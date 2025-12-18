// server.cjs
const express = require("express");
const path = require("path");

const app = express();
const distPath = path.join(__dirname, "dist");

// Serve i file statici (build di Vite)
app.use(express.static(distPath));

// Qualunque altra route -> index.html (fallback SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Porta gestita da Passenger via process.env.PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
