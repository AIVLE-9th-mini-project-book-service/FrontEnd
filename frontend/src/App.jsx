import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Header from './pages/Header';
import Footer from './pages/Footer';
import BookMain from './pages/BookMain';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookEdit from './pages/BookEdit';
import BookRegister from './pages/BookRegister';
import DeletedBook from './pages/DeletedBook';
import BookChart from './pages/BookChart';
import BookFinder from './pages/BookFinder';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Header />
                <main>
                    <Routes>
                        <Route path="/"               element={<BookMain />} />
                        <Route path="/login"          element={<Login />} />
                        <Route path="/register"       element={<Register />} />
                        <Route path="/books"          element={<BookList />} />
                        <Route path="/books/search"   element={<BookFinder />} />
                        <Route path="/books/chart"    element={<BookChart />} />
                        <Route path="/books/:id"      element={<BookDetail />} />

                        <Route path="/books/register" element={<PrivateRoute><BookRegister /></PrivateRoute>} />
                        <Route path="/books/deleted"  element={<PrivateRoute><DeletedBook /></PrivateRoute>} />
                        <Route path="/books/:id/edit" element={<PrivateRoute><BookEdit /></PrivateRoute>} />
                    </Routes>
                </main>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;