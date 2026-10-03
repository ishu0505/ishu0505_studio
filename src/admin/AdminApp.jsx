/**
 * FILE: src/admin/AdminApp.jsx
 * WHAT IT DOES
 *   The front door of the admin. src/App.jsx loads this file ONLY when the address
 *   ends in  #/admin  , so normal visitors never download any admin code.
 *
 *   checking  -> a short loading message
 *   logged out -> <Login />
 *   logged in  -> <Studio />   (once the content has loaded)
 */
import './admin.css';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { useNoIndex } from './hooks/useNoIndex';
import CrayonFilters from '../components/doodles/CrayonFilters';
import Login from './components/Login';
import Studio from './components/Studio';

function Screens() {
  const { session, content } = useAdmin();
  useNoIndex();

  if (session.status === 'checking') return <p className="adm-loading">Checking your login…</p>;
  if (session.status === 'logged-out') return <Login />;
  if (content.status === 'error') {
    return (
      <main className="adm-login">
        <div className="adm-panel">
          <p className="adm-error" role="alert">{content.error}</p>
          <button type="button" className="adm-btn" onClick={content.load}>Try again</button>{' '}
          <button type="button" className="adm-btn adm-btn--ghost" onClick={session.logout}>Log out</button>
        </div>
      </main>
    );
  }
  if (content.status !== 'ready') return <p className="adm-loading">Loading the site content…</p>;
  return <Studio />;
}

export default function AdminApp() {
  return (
    <AdminProvider>
      <CrayonFilters />
      <Screens />
    </AdminProvider>
  );
}
