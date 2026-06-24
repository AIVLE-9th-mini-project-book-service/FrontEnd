import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import GitHub from '../img/GitHub.png'
import Notion from '../img/Notion.png'

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-content">

          {/* 로고 영역 */}
          <div className="footer-brand">
            <img
              src={logo}
              alt="도서관리 로고"
              className="footer-logo-img"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            />
            <p>체계적인 도서 관리 시스템</p>

            <div className="social-list">
              <a
                href="https://github.com/AIVLE-9th-mini-project-book-service"
                target="_blank"
              >
                <img src={GitHub} alt="깃허브 버튼" />
              </a>
              <a
                href="https://exclusive-windscreen-c9e.notion.site/4-5-368ba2ae6a958051a4b7cbde046648c0?source=copy_link"
                target="_blank"
              >
                <img src={Notion} alt="노션 버튼" />
              </a>
            </div>
          </div>

          {/* 프로젝트 개요 */}
          <div className="footer-project">
            <h4>미니프로젝트 4차</h4>
            <p>도서관리시스템 개발</p>
            <p>2026.05.22 ~ 05.27</p>
          </div>

          <div className="footer-project">
            <h4>미니프로젝트 5차</h4>
            <p>도서관리시스템 서버 개발</p>
            <p>2026.06.09 ~ 06.12</p>
          </div>

          <div className="footer-project">
            <h4>조장</h4>
            <p>박유경</p>
          </div>

          <div className="footer-project">
            <h4>조원</h4>
            <div className="member-list">
              <p>김완수</p>
              <p>박선호</p>
              <p>박형우</p>
              <p>신가람</p>
              <p>심유리</p>
              <p>윤빈</p>
              <p>최지흠</p>
              <p>한승연</p>
            </div>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="footer-bottom">
          <p>© 2026 도서관리 시스템 — 미니프로젝트 4차, 5차. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
