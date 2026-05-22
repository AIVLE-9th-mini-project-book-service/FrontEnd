import { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import TextArea from "../components/TextArea";

const GENRE_LIST = ["소설", "고전", "역사", "IT", "동화", "자기계발", "과학", "경제", "철학", "예술"];
const TAG_LIST = ["한국문학", "고전문학", "개발/프로그래밍", "역사/인문", "고전/동화", "베스트셀러", "추천도서", "과학/기술"];

function BookRegister() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    likes: 0,
    content: "",
    tag: "",
    coverImageUrl: "",
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreSelect = (genre) => {
    setForm((prev) => ({ ...prev, genre: prev.genre === genre ? "" : genre }));
  };

  const handleTagSelect = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    const newBook = {
      ...form,
      tag: selectedTags.join(","),
      likes: Number(form.likes),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const res = await fetch("http://localhost:3000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBook),
    });

    if (res.ok) {
      alert("도서가 등록되었습니다!");
      setForm({ title: "", author: "", genre: "", likes: 0, content: "", tag: "", coverImageUrl: "" });
      setSelectedTags([]);
      onBack();
    } else {
      alert("등록 실패! json-server 실행 확인해주세요.");
    }
  };

  return (
    <div>
      <h2>도서 등록</h2>

      <Input name="title" placeholder="도서 제목" value={form.title} onChange={handleChange} />
      <Input name="author" placeholder="저자명" value={form.author} onChange={handleChange} />

      <div>
        <p>장르</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {GENRE_LIST.map((g) => (
            <span
              key={g}
              onClick={() => handleGenreSelect(g)}
              style={{
                padding: "4px 12px",
                borderRadius: "99px",
                cursor: "pointer",
                border: `1px solid ${form.genre === g ? "#1D9E75" : "#ccc"}`,
                background: form.genre === g ? "#E1F5EE" : "transparent",
                color: form.genre === g ? "#085041" : "inherit",
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p>태그</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {TAG_LIST.map((t) => (
            <span
              key={t}
              onClick={() => handleTagSelect(t)}
              style={{
                padding: "4px 12px",
                borderRadius: "99px",
                cursor: "pointer",
                border: `1px solid ${selectedTags.includes(t) ? "#1D9E75" : "#ccc"}`,
                background: selectedTags.includes(t) ? "#E1F5EE" : "transparent",
                color: selectedTags.includes(t) ? "#085041" : "inherit",
              }}
            >
              {t} {selectedTags.includes(t) && "×"}
            </span>
          ))}
        </div>
      </div>

      <TextArea name="content" placeholder="도서 내용" value={form.content} onChange={handleChange} rows={4} />

      <Button label="등록하기" onClick={handleSubmit} />
    </div>
  );
}

export default BookRegister;