import React from 'react';
import { useState, useEffect } from "react";
import './BookItem.css'
import './BookMain.css'
import logo from "./img/logo.png";

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

                    {isHeaderOpen && (
                        <div className="category-menu">
                            <div className="tab-area">
                                <button
                                    className={`tab ${selectedTab === "genre" ? "active" : ""}`}
                                    onClick={() => setSelectedTab("genre")}
                                >
                                    장르분류
                                </button>

                                <button
                                    className={`tab ${selectedTab === "tag" ? "active" : ""}`}
                                    onClick={() => setSelectedTab("tag")}
                                >
                                    태그분류
                                </button>
                            </div>

                            <div className="menu-content">
                                <ul className="category-list">
                                    {(selectedTab === "genre" ? GENRE_LIST : TAG_LIST).map(
                                        (item) => (
                                            <li key={item}>{item}</li>
                                        )
                                    )}
                                </ul>
                            </div>

                            <button
                                className="close-btn"
                                onClick={() => setIsHeaderOpen(false)}
                            >
                                닫기 X
                            </button>
                        </div>
                    )}
                </div>

                <button className="Delete-btn">휴지통</button>
            </div>
        </header>
    );
}

function Navigation() {
  const [isAllNavOpen, setIsAllNavOpen] = useState(false);
  const [navMenu, setNavMenu] = useState(null);

  const NAV_LIST = [
    {
      title: "도서검색",
      items: ["통합검색"],
    },
    {
      title: "종류별",
      items: ["장르별", "태그별", "좋아요순"],
    },
    {
      title: "지원",
      items: ["공지사항", "자주 묻는 질문"],
    },
  ];

  return (
    <nav className="nav-wrap">
      <div className="nav-bar">
        <button
          className="nav-menu-btn"
          onClick={() => setIsAllNavOpen(!isAllNavOpen)}
        >
          ☰
        </button>

        <div className="nav-menu-area">
          {NAV_LIST.map((menu) => (
            <div
              key={menu.title}
              className="nav-item-wrap"
              onMouseEnter={() => setNavMenu(menu.title)}
              onMouseLeave={() => setNavMenu(null)}
            >
              <button
                className={`nav-item ${navMenu === menu.title ? "active" : ""
                  }`}
              >
                {menu.title}
              </button>

              {!isAllNavOpen && navMenu === menu.title && (
                <div className="single-dropdown">
                  {menu.items.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isAllNavOpen && (
        <div className="all-dropdown">
          {NAV_LIST.map((menu) => (
            <div className="all-column" key={menu.title}>
              {menu.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

function Book({ id, title, author,likes, content, tag, coverImageUrl, onSelect }) {
    // 컴마(,)로 들어온 태그 문자열을 배열로 쪼갬 (예: "React,Java" -> ["React", "Java"])
    const tagsArray = tag ? tag.split(',') : [];


    return (
        <li
            onClick={() => onSelect(id)}s
            className="book-detail-card"
        >
            <div className="book-detail-header">
                <h2>도서 상세 정보</h2>
                <div className="book-action-buttons">
                    <button>수정</button>
                    <button>삭제</button>
                </div>
            </div>

            <div className="book-detail-content">
                <div className="book-cover-area">
                    <img
                        src={coverImageUrl}
                        alt={title}
                        className="book-detail-image"
                    />


                    <button className="like-btn">
                        ♥ {likes}
                    </button>
                </div>

                <div className="book-info-area">
                    <h1>도서명 {title}</h1>
                    <div className="book-author">
                        <strong>저자</strong>
                        <p>{author}</p>
                    </div>

                    <div className="book-tags">
                        <strong>태그</strong>

                        <div className="tag-wrap">
                            {tagsArray.map((t, idx) => (
                                <span key={idx}>
                                    #{t.trim()}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="book-description">
                        <strong>내용</strong>
                        <p>
                            {content}
                        </p>
                    </div>
                </div>
            </div>
        </li>
    );
}


function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-logo">
                    <img src={logo} alt="에이블스쿨" />
                </div>

                <div className="footer-info">
                    <p>(35262) 대전광역시 서구 문정로48번길 30 KT탄방타워 (탄방동)</p>
                    <p>
                        대표전화 042-000-0000 (운영시간: 09:00~18:00, 휴관일 / 공휴일 제외)
                    </p>
                    <p>
                        팩스 042-000-0000
                    </p>
                </div>
            </div>
        </footer>
    );
}

function BookItem() {
    return (
        <>
            <Header />
            <Navigation />
            <Book />
            <Footer />
        </>
    );
}
export default BookItem;
