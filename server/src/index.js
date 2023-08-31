import express from "express";
import cors from "cors";

const app = express();

const PORT = 3001;

app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));