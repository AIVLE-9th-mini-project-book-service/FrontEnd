import { useState } from "react";
import logo from "../img/logo.png";

function Header({ onGoToMain, onGoToList, onGoToRegister, onGoToDeleted }) {
  const NAV_LIST = [
    { title: "도서목록", onClick: onGoToList },
    { title: "새 도서 등록", onClick: onGoToRegister },
    { title: "휴지통", onClick: onGoToDeleted },
  ];

  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo" onClick={onGoToMain} style={{ cursor: "pointer" }}>
          <img src={logo} alt="로고" />
        </div>

        <nav className="nav-wrap">
          <div className="nav-bar">
            <div className="nav-menu-area">
              {NAV_LIST.map((menu) => (
                <button
                  key={menu.title}
                  className="nav-item"
                  onClick={menu.onClick}
                >
                  {menu.title}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;