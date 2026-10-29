const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/stations", require("./routes/stations"));
app.use("/api/passengers", require("./routes/passengers"));
app.use("/api/trains", require("./routes/trains"));
app.use("/api/reservations", require("./routes/reservations"));

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
