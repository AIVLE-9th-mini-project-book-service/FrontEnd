# 📚도서관리시스템



## 프로젝트 소개&구성

AI 표지 생성을 지원하는 도서관리 시스템 "걷기가 서재"입니다. 누구나 작가가 되어 자유롭게 도서에 대한 글을 작성하고, 수정할 수 있는 창작 플랫폼입니다.

책의 내용을 시각적으로 전달하고, 좋아요/댓글 기능을 통해 사람들과 소통할 수 있습니다.



## Screenshot

- 도서 메인페이지 UI

<img width="640" height="349" alt="Image" src="https://github.com/user-attachments/assets/4f1f84a4-3ab2-4571-9b84-30f1f856b754" />

- 도서 등록페이지 UI

<img width="640" height="348" alt="Image" src="https://github.com/user-attachments/assets/6b9b5995-6993-4770-9e4b-d5f41694b37f" />

- 도서 목록페이지 UI

<img width="640" height="349" alt="Image" src="https://github.com/user-attachments/assets/e2cf5065-a57a-42c5-b99c-ef65f72ca5b4" />

- 도서 수정페이지 UI

<img width="640" height="334" alt="Image" src="https://github.com/user-attachments/assets/14ce77f1-c4f3-449c-b7a0-098b07e529d4" />

- 도서 삭제 페이지 UI

<img width="640" height="362" alt="Image" src="https://github.com/user-attachments/assets/4d0b9076-9a6c-4bef-93b8-8f8d78c8cfb6" />

- 도서 통계 페이지 UI

<img width="640" height="313" alt="Image" src="https://github.com/user-attachments/assets/1501908b-4357-4df4-b23e-c50df0bcdf4d" />

- 휴지통 UI

<img width="640" height="338" alt="Image" src="https://github.com/user-attachments/assets/3d6c192d-c34f-4fb0-821a-5b675119be30" />



## 팀원 구성

- 박유경 : 조장 · PM/기획 · 스타일링/QA · 도서 삭제 기능

- 김완수 : PPT 작성 · AI 이미지 생성 · DB 수정 및 저장

- 박선호 : 문서 작성 · UI 작성 · 도서 목록 조회 기능

- 박형우 : 검토 담당자 · AI 한줄평 작성 · DB 수정 및 저장

- 신가람 : 검토 담당자 · 스타일링/QA · 도서 검색 기능

- 심유리 : UI 작성 · 메인페이지 작성

- 윤빈 : PPT 작성 · 도서 등록 기능 · Router Dom 적용

- 최지흠 : PPT 작성 · Update/Delete 기능

- 한승연 : 서기 · 게시글 조회 기능 · 댓글 기능



## 기능 소개

- 새 도서 등록 : 제목·저자 입력, 장르·태그 복수 선택, 도서 내용 작성 기능

- 도서 목록 : 도서 검색 및 도서 추천 기능

- 사용자통계 : 등록된 도서 장르·태그별 통계

- 휴지통 : 삭제된 도서 확인 기능

- 도서 수정 : 도서 등록 시 작성한 내용 수정

- 도서 삭제 : 등록된 도서 삭제

- 댓글 : 도서에 대한 감상평 작성 기능

- AI 한줄평 생성 : 도서 제목, 내용에 따라 도서에 대한 한줄평 생성

- AI 표지 생성 : 도서 내용에 맞는 표지를 AI가 자동 생성



## 기술 스택

- Frontend : React 19 · vite · fetch

- Data : json-server

- AI : OpenAI API (GPT Image)

- Coporation : Github

- json-server : 1.0.0-beta.15

- node.js : 25.7.0

- npm : 11.10.1


## 요구 사항

- 도서 목록 확인
- 신규 도서 등록
- 도서 상세 정보 조회
- 도서 수정 및 삭제
- AI 표지 이미지 생성


## 설치 방법

git clone https://github.com/AIVLE-Mini-project-FrontEnd/FrontEnd.git

cd frontend

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
│   │   ├── Openapi_text.js
│   │   └── Openapi.js
│   ├── Button.jsx
│   ├── DeletedBookCard.jsx
│   ├── Input.jsx
│   └── TextArea.jsx
├── img/
│   ├── Book/
│   │   └── [책 제목].png
│   ├── icon01.png
│   ├── icon02.png
│   ├── icon03.png
│   ├── logo.png
│   └── no-cover.svg
├── pages/
│   ├── BookChart.jsx
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
├── bookOption.js
├── main.jsx
└── style.css
