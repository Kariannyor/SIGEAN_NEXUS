// src/components/Layout.tsx
import React from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  return (
    <div style={styles.container}>
      <Sidebar onLogout={onLogout} />
      <div style={styles.content}>{children}</div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex"
  },
  content: {
    marginLeft: "240px",
    padding: "20px",
    width: "100%"
  }
};

export default Layout;
