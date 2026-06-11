import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const registerUrl = 'http://localhost:8080/';

const domainOptions = ['gmail.com', 'naver.com', 'kakao.com', 'daum.net', 'outlook.com', '직접입력'];

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        nickname: '',
        password: '',
    });
    const [email, setEmail] = useState({ id: '', domain: '', custom: '' });
    const [isDirect, setIsDirect] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [phone, setPhone] = useState({ p1: '', p2: '', p3: '' });
    const [error, setError] = useState('');
    const dropdownRef = useRef(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;
        if (!/^\d*$/.test(value)) return;
        setPhone({ ...phone, [name]: value });
    };

    const handleSelectDomain = (option) => {
        if (option === '직접입력') {
            setIsDirect(true);
            setEmail({ ...email, domain: '', custom: '' });
        } else {
            setIsDirect(false);
            setEmail({ ...email, domain: option, custom: '' });
        }
        setDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError('');
    //
    //     const { username, nickname, password } = form;
    //     const fullEmail = `${email.id}@${isDirect ? email.custom : email.domain}`;
    //     const fullPhone = `${phone.p1}-${phone.p2}-${phone.p3}`;
    //
    //     if (!username || !email.id || (isDirect && !email.custom) || !nickname || !password || !phone.p1 || !phone.p2 || !phone.p3) {
    //         setError('모든 항목을 입력해주세요.');
    //         return;
    //     }
    //
    //     if (phone.p1.length !== 3 || phone.p2.length < 3 || phone.p2.length > 4 || phone.p3.length !== 4) {
    //         setError('휴대폰 번호 자리수가 올바르지 않습니다.');
    //         return;
    //     }
    //
    //     try {
    //         const res = await fetch(registerUrl, {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ ...form, email: fullEmail, phone: fullPhone }),
    //         });
    //
    //         if (!res.ok) {
    //             setError('회원가입에 실패했습니다.');
    //             return;
    //         }
    //
    //         navigate('/login');
    //
    //     } catch (err) {
    //         setError('서버 연결에 실패했습니다.');
    //     }
    // };

    // 테스트용 코드
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { username, nickname, password } = form;

        if (!username || !email.id || (isDirect && !email.custom) || !nickname || !password || !phone.p1 || !phone.p2 || !phone.p3) {
            setError('모든 항목을 입력해주세요.');
            return;
        }

        const emailRegex = /^[^\s@]+$/;
        if (!emailRegex.test(email.id)) {
            setError('이메일 아이디를 올바르게 입력해주세요.');
            return;
        }

        if (phone.p1.length !== 3 || phone.p2.length < 3 || phone.p2.length > 4 || phone.p3.length !== 4) {
            setError('휴대폰 번호 자리수가 올바르지 않습니다.');
            return;
        }

        alert('회원가입이 완료되었습니다!');
        navigate('/login');
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">회원가입</h2>
                <div className="login-form">
                    <input
                        type="text"
                        name="username"
                        placeholder="아이디"
                        value={form.username}
                        onChange={handleChange}
                    />
                    <div className="email-group">
                        <input
                            type="text"
                            placeholder="이메일 아이디"
                            value={email.id}
                            onChange={(e) => setEmail({ ...email, id: e.target.value })}
                        />
                        <span>@</span>
                        <div className="custom-dropdown" ref={dropdownRef}>
                            {isDirect ? (
                                <div className="domain-direct">
                                    <input
                                        type="text"
                                        placeholder="도메인 입력"
                                        value={email.custom}
                                        onChange={(e) => setEmail({ ...email, custom: e.target.value })}
                                    />
                                    <span
                                        className="dropdown-arrow"
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                    >
                                        ▼
                                    </span>
                                </div>
                            ) : (
                                <div
                                    className="dropdown-selected"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <span>{email.domain}</span>
                                    <span className="dropdown-arrow">▼</span>
                                </div>
                            )}
                            {dropdownOpen && (
                                <ul className="dropdown-list">
                                    {domainOptions.map((option) => (
                                        <li
                                            key={option}
                                            className="dropdown-item"
                                            onClick={() => handleSelectDomain(option)}
                                        >
                                            {option}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                    <input
                        type="text"
                        name="nickname"
                        placeholder="닉네임"
                        value={form.nickname}
                        onChange={handleChange}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <div className="phone-group">
                        <input
                            type="text"
                            name="p1"
                            placeholder="010"
                            maxLength={3}
                            value={phone.p1}
                            onChange={handlePhoneChange}
                        />
                        <span>-</span>
                        <input
                            type="text"
                            name="p2"
                            placeholder="1234"
                            maxLength={4}
                            value={phone.p2}
                            onChange={handlePhoneChange}
                        />
                        <span>-</span>
                        <input
                            type="text"
                            name="p3"
                            placeholder="5678"
                            maxLength={4}
                            value={phone.p3}
                            onChange={handlePhoneChange}
                        />
                    </div>
                    {error && <p className="error-msg">{error}</p>}
                    <button onClick={handleSubmit}>회원가입</button>
                    <button className="secondary-btn" onClick={() => navigate('/login')}>
                        로그인으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;