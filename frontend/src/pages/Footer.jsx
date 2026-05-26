import logo from '../img/logo.png';

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
          <p>팩스 042-000-0000</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;