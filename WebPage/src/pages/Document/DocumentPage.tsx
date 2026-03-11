import PageLayout from "../../components/layout/PageLayout/PageLayout";
import Header from "../../components/layout/Header/Header";
import { TopNav } from "../../components/layout/TopNav/TopNav";
import RightPanel from "../../components/layout/RightPanel/RightPanel";
import Footer from "../../components/layout/Footer/Footer";
import logoSrc from "../../assets/logo.png";

export default function DocumentPage() {
    return (
        <PageLayout
            header={
                <Header
                    logo={{ src: logoSrc, alt: "askKTU logo" }}
                    // Theme removed → no props passed
                />
            }
            topNav={<TopNav />}
            rightMain={
                <section className="document-container">
                    {/* Placeholder for the actual document component */}
                    <h1>Document</h1>
                    <p>This page will display a document.</p>
                </section>
            }
            footer={<Footer />}
        />
    );
}
