import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const loginUrl = 'http://localhost:8080/';

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setError('');
    //
    //     try {
    //         const res = await fetch('loginUrl', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(form),
    //         });
    //
    //         if (!res.ok) {
    //             setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    //             return;
    //         }
    //
    //         const data = await res.json();
    //         login({ nickname: data.nickname, token: data.token });
    //         navigate('/');
    //
    //     } catch (err) {
    //         setError('서버 연결에 실패했습니다.');
    //     }
    // };

    // 테스트용 코드
    const handleSubmit = async (e) => {
        e.preventDefault();
        login({ nickname: '윤빈', token: 'test-token' });
        navigate('/');
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2 className="login-title">로그인</h2>
                <div className="login-form">
                    <input
                        type="text"
                        name="username"
                        placeholder="아이디"
                        value={form.username}
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