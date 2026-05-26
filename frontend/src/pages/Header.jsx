function Header({ onGoToList, onGoToDeleted }) {
    return (
        <header>
        <h1>
            도서 관리
        </h1>
        <nav>
            <button type="button" onClick={onGoToList}>
                도서 목록
            </button>
            <button type="button" onClick={onGoToDeleted}>
                삭제 도서
            </button>
        </nav>
        </header>
    );
}

export default Header;
