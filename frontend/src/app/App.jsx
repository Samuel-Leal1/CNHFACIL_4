import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import PrivateRoute from '../components/PrivateRoute'
import MainLayout from '../layouts/MainLayout'

import Login       from '../pages/Login/Login'
import Cadastro    from '../pages/Cadastro/Cadastro'
import Dashboard   from '../pages/Dashboard/Dashboard'
import Cursos      from '../pages/Cursos/Cursos'
import Aulas       from '../pages/Aulas/Aulas'
import Simulados   from '../pages/Simulados/Simulados'
import Questoes    from '../pages/Questoes/Questoes'
import Desempenho  from '../pages/Desempenho/Desempenho'
import Perfil      from '../pages/Perfil/Perfil'
import Instrutores from '../pages/Instrutores/Instrutores'
import Admin       from '../pages/Admin/Admin'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          {/* Privadas com layout */}
          <Route element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }>
            <Route path="/inicio"      element={<Dashboard />} />
            <Route path="/perfil"      element={<Perfil />} />
            <Route path="/cursos"      element={<Cursos />} />
            <Route path="/aulas/:cursoId" element={<Aulas />} />
            <Route path="/aulas"       element={<Aulas />} />
            <Route path="/simulados"   element={<Simulados />} />
            <Route path="/questoes"    element={<Questoes />} />
            <Route path="/desempenho"  element={<Desempenho />} />
            <Route path="/instrutores" element={<Instrutores />} />
            <Route path="/admin"       element={
              <PrivateRoute adminOnly>
                <Admin />
              </PrivateRoute>
            } />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
