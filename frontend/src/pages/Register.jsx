import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const domainOptions = ['gmail.com', 'naver.com', 'kakao.com', 'daum.net', 'outlook.com', '직접입력'];

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        nickname: '',
        password: '',
    });
    const [email, setEmail] = useState({ id: '', domain: '', custom: '' });
    const [isDirect, setIsDirect] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [error, setError] = useState('');
    const dropdownRef = useRef(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { nickname, password } = form;
        const fullEmail = `${email.id}@${isDirect ? email.custom : email.domain}`;

        if (!email.id || (isDirect && !email.custom) || !nickname || !password) {
            setError('모든 항목을 입력해주세요.');
            return;
        }

        try {
            const res = await fetch('/members/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: fullEmail,
                    password: password,
                    name: nickname,
                }),
            });

            if (!res.ok) {
                setError('회원가입에 실패했습니다.');
                return;
            }

            navigate('/login');

        } catch (err) {
            setError('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">회원가입</h2>
                <div className="login-form">
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
                                        style={{ cursor: 'pointer', color: '#333', fontSize: '12px', flexShrink: 0 }}
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
                        placeholder="이름"
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