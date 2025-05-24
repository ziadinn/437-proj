import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  headerNav?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  headerTitle = 'simple-blog',
  headerNav 
}) => {
  return (
    <div className="container">
      <header>
        <div className="logo">{headerTitle}</div>
        <nav>
          {headerNav}
        </nav>
      </header>

      <main>
        {children}
      </main>

      <footer>
        simple-blog
      </footer>
    </div>
  );
}; 