//import React, { useState } from "react";
import PageLayout from "../../components/layout/PageLayout/PageLayout";
import Header from "../../components/layout/Header/Header";
//import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { TopNav } from "../../components/layout/TopNav/TopNav";
import RightPanel from "../../components/layout/RightPanel/RightPanel";
import Footer from "../../components/layout/Footer/Footer";
import Chat from "../../components/chat/Chat";
import logoSrc from "../../assets/logo.png";


export interface HomePageProps {
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export default function HomePage({ theme, onToggleTheme }: HomePageProps) {
  return (
    <PageLayout
      header={
        <Header
          // title="askKTU"           ⟵ remove/ignore the text title
          logo={{ src: logoSrc, alt: "askKTU logo" }}
          onToggleTheme={onToggleTheme}
          theme={theme}
        />
      }
      topNav={<TopNav />}
      //leftColumn={<Sidebar items={sidebarItems} />} // cia history
      rightMain={
        <>
          <Chat />
		
          <RightPanel /> 
        </>
      }
      footer={<Footer />}
    />
  );
}
