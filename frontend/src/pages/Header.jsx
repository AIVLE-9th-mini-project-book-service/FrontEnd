import { useState, useEffect } from "react";
import logo from "../img/logo.png";
function Header() {
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("genre");

  const GENRE_LIST = ["소설", "고전", "역사"];
  const TAG_LIST = ["한국문학", "고전문학", "개발/프로그래밍"];

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <img src={logo} alt="로고" />
        </div>

        <div className="search-area">
          <button
            className="search-type-btn"
            onClick={() => setIsHeaderOpen(!isHeaderOpen)}
          >
            자료검색
          </button>

          <input
            className="search-input"
            placeholder="도서명 또는 저자를 입력하세요."
          />

          <button className="icon-btn">🔍</button>
          <button className="detail-btn">상세검색</button>
        </div>

        <button className="Delete-btn">휴지통</button>
      </div>
    </header>
  );
}

export default Header;
