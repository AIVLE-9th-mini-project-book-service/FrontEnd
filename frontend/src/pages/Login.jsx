import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const isAdmin = !form.email.includes('@');
        const url = isAdmin ? '/api/admin/login' : '/api/members/login';
        const body = isAdmin
            ? { username: form.email, password: form.password }
            : { email: form.email, password: form.password };

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                setError('아이디/이메일 또는 비밀번호가 올바르지 않습니다.');
                return;
            }

            const data = await res.json();
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
            login({ nickname: data.name ?? form.email, token: data.accessToken, isAdmin });
            navigate('/');

        } catch (err) {
            setError('서버 연결에 실패했습니다.');
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">로그인</h2>
                <div className="login-form">
                    <input
                        type="text"
                        name="email"
                        placeholder="이메일 또는 관리자 아이디"
                        value={form.email}
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
                    <button onClick={handleSubmit}>로그인</button>
                    <button className="secondary-btn" onClick={() => navigate('/register')}>
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;