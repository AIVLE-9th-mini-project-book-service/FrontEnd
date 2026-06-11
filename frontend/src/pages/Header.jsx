import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import logo from '../img/logo.png';

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

          <div className="header-icons">
            <button className="icon-link-btn" onClick={() => navigate('/books')}>
              <img src="src/img/icon01.png" alt="도서 목록" />
            </button>
            <button className="icon-link-btn" onClick={() => navigate('/books/register')}>
              <img src="src/img/icon02.png" alt="도서 등록" />
            </button>
            <button className="icon-link-btn" onClick={() => navigate('/books/deleted')}>
              <img src="src/img/icon03.png" alt="휴지통" />
            </button>

            {user ? (
                <div className="auth-area">
                  <span>{user.nickname}님 환영합니다</span>
                  <button className="icon-link-btn" onClick={handleLogout}>로그아웃</button>
                </div>
            ) : (
                <button className="icon-link-btn" onClick={() => navigate('/login')}>
                  로그인
                </button>
            )}
          </div>

        </div>
      </header>
  );
}

export default Header;