import { useEffect, useState } from "react";
import styles from "./App.module.css";
import SiteHeader from "./components/siteHeader";
import SiteFooter from "./components/siteFooter";
import BackToTop from "./components/backToTop";
import ExamCountdownPlanner from "./components/examCountdownPlanner";

const App = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    useEffect(() => {
        const onScroll = () => setShowBackToTop(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return (
        <div className={styles["app-shell"]} id="top">
            <SiteHeader title="Exam Atlas" mark="E" navItems={[["Upcoming", "#dashboard"], ["Study plan", "#workspace"]]} repoUrl="https://github.com/a2rp/exam-countdown-planner" />
            <main className={styles.pageContent}>
                <ExamCountdownPlanner />
            </main>
            <SiteFooter repoUrl="https://github.com/a2rp/exam-countdown-planner" />
            <BackToTop visible={showBackToTop} />
        </div>
    );
};

export default App;
