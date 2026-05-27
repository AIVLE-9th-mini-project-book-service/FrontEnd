import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-inner">

        <div className="footer-top">

          {/* 로고 영역 */}
          <div className="footer-brand">
            <img
              src={logo}
              alt="도서관리 로고"
              className="footer-logo-img"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
            <p className="footer-tagline">체계적인 도서 관리 시스템</p>
          </div>

          {/* 프로젝트 개요 */}
          <div className="footer-project">
            <h4 className="footer-section-title">미니프로젝트 4차</h4>
            <ul className="footer-project-list">
              <li>
                <span className="footer-project-label">프로젝트명</span>
                <span className="footer-project-value">도서관리 시스템</span>
              </li>
              <li>
                <span className="footer-project-label">조원</span>
                <span className="footer-project-value">
                  박유경 · 한승연 · 윤빈 · 심유리 · 김완수 · 최지흠 · 박형우 · 신가람 · 박선호
                </span>
              </li>
              <li>
                <span className="footer-project-label">기간</span>
                <span className="footer-project-value">2026.05.22 – 2026.05.27</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 하단 저작권 */}
        <div className="footer-bottom">
          <p>© 2026 도서관리 시스템 — 미니프로젝트 4차. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
