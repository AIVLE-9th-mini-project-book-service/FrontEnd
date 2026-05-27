import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/Header';
import Footer from './pages/Footer';
import BookMain from './pages/BookMain';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookEdit from './pages/BookEdit';
import BookRegister from './pages/BookRegister';
import DeletedBook from './pages/DeletedBook';
import BookChart from './pages/BookChart';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/"               element={<BookMain />} />
          <Route path="/books"          element={<BookList />} />
          <Route path="/books/register" element={<BookRegister />} />
          <Route path="/books/deleted"  element={<DeletedBook />} />
          <Route path="/books/:id"      element={<BookDetail />} />
          <Route path="/books/:id/edit" element={<BookEdit />} />
          <Route path="/books/chart"    element={<BookChart />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;