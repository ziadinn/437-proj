import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerNav?: React.ReactNode;
  username?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  headerTitle = 'simple-blog-site',
  headerNav,
  username
}) => {
  return (
    <div className="container">
      <header>
        <div className="logo">{headerTitle}{' '}
          {username && <>/ <span className="text-accent">{username}</span></>}
        </div>
        <nav>
          {headerNav}
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer>
        simple-blog-site
      </footer>
    </div>
  );
}; 