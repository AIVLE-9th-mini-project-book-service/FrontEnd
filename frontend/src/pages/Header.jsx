import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';

function Header() {
  const navigate = useNavigate();

  const NAV_LIST = [
    { title: '도서목록',    path: '/books' },
    { title: '새 도서 등록', path: '/books/register' },
    { title: '휴지통',      path: '/books/deleted' },
  ];

  return (
    <header className="header">
      <div className="header-inner">

        <div
          className="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        >
          <img src={logo} alt="로고" />
        </div>

        <nav className="header-nav">
          {NAV_LIST.map((menu) => (
            <button
              key={menu.title}
              className="nav-item"
              onClick={() => navigate(menu.path)}
            >
              {menu.title}
            </button>
          ))}
        </nav>

      </div>
    </header>
  );
}

export default Header;