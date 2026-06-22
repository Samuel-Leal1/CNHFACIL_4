import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';

function MainLayout() {
  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
