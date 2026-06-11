import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const registerUrl = 'http://localhost:8080/';

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        nickname: '',
        password: '',
        phone: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError('');
    //
    //     const { username, email, nickname, password, phone } = form;
    //     if (!username || !email || !nickname || !password || !phone) {
    //         setError('모든 항목을 입력해주세요.');
    //         return;
    //     }
    //
    //     try {
    //         const res = await fetch('registerUrl', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(form),
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
    //         // 임시: 백엔드 없을 때 바로 로그인 페이지로 이동
    //         navigate('/login');
    //     }
    // };

    // 테스트용 코드
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const { username, email, nickname, password, phone } = form;
        if (!username || !email || !nickname || !password || !phone) {
            setError('모든 항목을 입력해주세요.');
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
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        value={form.email}
                        onChange={handleChange}
                    />
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
                    <input
                        type="tel"
                        name="phone"
                        placeholder="전화번호"
                        value={form.phone}
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