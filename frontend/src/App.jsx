import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useUserStore } from './store/userStore'
import LoginPage from './pages/LoginPage'
import DiaryWritePage from './pages/DiaryWritePage'
import DiaryListPage from './pages/DiaryListPage'
import PhotobookOrderPage from './pages/PhotobookOrderPage'
import BottomNav from './components/BottomNav'

function PrivateRoute({ children }) {
  const user = useUserStore(s => s.user)
  return user ? children : <Navigate to="/login" replace />
}

function Layout() {
  const { pathname } = useLocation()
  const showNav = pathname !== '/login'

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><DiaryListPage /></PrivateRoute>} />
        <Route path="/diary/write" element={<PrivateRoute><DiaryWritePage /></PrivateRoute>} />
        <Route path="/photobook/order" element={<PrivateRoute><PhotobookOrderPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {showNav && <BottomNav />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}