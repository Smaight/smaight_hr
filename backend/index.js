import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 4000;
const TXT_DIR = "/data"; // 도커에서 마운트할 경로

app.use(cors());
app.use(express.json());

app.get("/search", (req, res) => {
    const queryParams = Object.values(req.query).map(q => q.trim()).filter(Boolean);

    if (queryParams.length === 0) {
        return res.status(400).json({ error: "검색어가 필요합니다." });
    }

    fs.readdir(TXT_DIR, (err, files) => {
        if (err)
            return res.status(500).json({ error: "폴더를 읽을 수 없습니다." });

        const txtFiles = files.filter(f => f.endsWith(".txt"));
        const results = [];

        txtFiles.forEach(file => {
            const filePath = path.join(TXT_DIR, file);
            const content = fs.readFileSync(filePath, "utf-8");
            const hasMatch = queryParams.some(q => content.includes(q));

            if (hasMatch) {
                results.push({ filename: file, preview: content.slice(0, 100) });
            }
        });
        res.json({ results });
    });
});

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});
