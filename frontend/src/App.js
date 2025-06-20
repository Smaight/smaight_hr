import React, { useState } from "react";
import "./App.css";

function App() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [inputs, setInputs] = useState([{ id: Date.now(), value: '' }]);
    const BACKEND = 'http://localhost:4000'

    // 입력창 추가
    const handleAdd = () => {
        setInputs([...inputs, { id: Date.now(), value: '' }]);
    };

    // 입력창 제거
    const handleRemove = (id) => {
        setInputs(inputs.filter((input) => input.id !== id));
    };

    // 입력값 변경
    const handleChange = (id, newValue) => {
        setInputs(inputs.map((input) =>
            input.id === id ? { ...input, value: newValue } : input
        ));
    };

    // 검색 실행(백엔드 호출)
    const handleSearch = async () => {
        const keywords = inputs.map(i => i.value.trim()).filter(Boolean);

        if (keywords.length === 0) {
            alert('검색어를 하나 이상 입력해주세요.');
            return;
        }

        const params = new URLSearchParams();
        keywords.forEach((kw, idx) => params.append(`q${idx + 1}`, kw));

        console.log(`params = ${decodeURIComponent(params)}`);

        try {
            const response = await fetch(`${BACKEND}/search?${params.toString()}`);
            if (!response.ok) {
                alert('서버 오류가 발생했습니다.');
                return;
            }

            const data = await response.json();

            if (data.length === 0) {
                alert('검색결과가 없습니다.');
                setResults([]);
            } else {
                setResults(data.results);
            }

        } catch (error) {
            console.error('검색 실패 : ', error);
            alert('검색에 실패하였습니다.');
        }
    };

    return (
        <div className="container">
            <h2>이력서 검색</h2>

            {
                inputs.map((input, idx) => (
                    <div key={input.id} className="condition-row">
                        <input type="text"
                            value={input.value}
                            onChange={(e) => handleChange(input.id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSearch();
                                }
                            }}
                            placeholder={`조건 ${idx + 1}`}
                        />
                        <button onClick={() => handleRemove(input.id)}>- 조건 삭제</button>
                    </div>
                ))
            }

            <div className="controls">
                <button onClick={handleAdd}>+ 조건 추가</button>
                <button onClick={handleSearch}>검색</button>
            </div>
            <ul className="results">
                {results.map(r => (
                    <li key={r.filename} className="result-card">
                        <strong>{r.filename}</strong> <br />
                        <p>{r.preview}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
