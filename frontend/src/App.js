import React, { useState } from "react";

function App() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (!query) return;
        const res = await fetch(`http://localhost:4000/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
    };

    return (
            <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <h2>이력서 검색</h2>
            <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="검색어 입력"
        style={{ width: 300, marginRight: 10 }}
            />
            <button onClick={handleSearch}>검색</button>
            <ul>
            {results.map(r => (
                    <li key={r.filename}>
                    <b>{r.filename}</b> <br />
                    <span style={{ color: "#888" }}>{r.preview}</span>
                    </li>
            ))}
        </ul>
            </div>
    );
}

export default App;
