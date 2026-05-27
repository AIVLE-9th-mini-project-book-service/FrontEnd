# 📚도서관리시스템





## 프로젝트 소개&구성

AI 표지 생성을 지원하는 도서관리 시스템 "걷기가 서재"입니다. 누가나 작가가 되어 자유롭게 글을 집필하고 공개할 수 있는 창작 플랫폼입니다.

책의 내용을 시각적으로 전달하고, 내용에 맞는 표지를 선정하여 독자로 하여금 책을 클릭하도록 유도합니다.



## 팀원 구성

- PM · 기획 : 박유경

- UI · 레이아웃 : 심유리

- CRUD 연동 : 한승연, 최지흠, 윤빈

- OpenAI 연동 : 김완수, 박형우

- 스타일링 · QA : 신가람

- 발표 · 문서 : 박선호



## 기능 소개

- 도서 목록 : 도서 검색 및 도서 추천 기능

- 도서 등록 : 제목·저자 입력, 장르·태그 복수 선택, 도서 내용 작성 기능

- 도서 수정 : 도서 등록 시 작성한 내용 수정

- OpenAI 표지 생성 : 책 내용에 맞는 표지를 AI가 자동 생성



## 기술 스택

- Frontend : React 19 · vite · fetch

- Data : json-server

- AI : OpenAI API (GPT Image)

- Coporation : Github



## 요구 사항

- json-server : 0.17.4

- node.js : 25.7.0

- npm : 11.10.1



## 설치 방법

git clone

cd [프로젝트명]

npm install

npm install react-router-dom



## 실행 방법

npx json-server --watch db.json --port 3000

npm run dev



## 프로젝트 구조

```text
src/
├── components/
│   ├── api/          
│   ├── Button.jsx
│   ├── DeletedBookCard.jsx
│   ├── Input.jsx
│   └── TextArea.jsx
├── img/
│   ├── Book/
│   │   └── [책 제목].png
│   ├── logo.png
│   └── no-cover.svg
├── pages/
│   ├── BookDetail.jsx
│   ├── BookEdit.css
│   ├── BookEdit.jsx
│   ├── BookFinder.css
│   ├── BookFinder.jsx
│   ├── BookItem.jsx
│   ├── BookList.jsx
│   ├── BookMain.jsx
│   ├── BookRegister.jsx
│   ├── DeletedBook.jsx
│   ├── Footer.jsx
│   └── Header.jsx
├── utils/
│   └── bookUtils.js
├── App.jsx          
├── main.jsx
└── style.css