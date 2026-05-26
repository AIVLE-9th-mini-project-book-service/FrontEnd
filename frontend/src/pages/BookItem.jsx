import React from 'react';
import { useState, useEffect } from "react";
import './BookItem.css'
import './BookMain.css'
<Book
  id={1}
  title="데미안"
  author="헤르만 헤세"
  likes={100}
  content="성장 소설"
  tag="소설,고전"
  coverImageUrl="https://picsum.photos/200/300"
  onSelect={() => {}}
/>
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

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.({ id, title, author, tag, coverImageUrl });
  };

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
            onClick={() => onSelect(id)}
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

function BookItem() {
    return (
        <>
            <Navigation />
            <Book />
        </>
    );
}
export default BookItem;
