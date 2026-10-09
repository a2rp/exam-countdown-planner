import { useEffect, useMemo, useState } from "react";
import { FiCalendar, FiChevronRight, FiPlus, FiTrash2 } from "react-icons/fi";
import ConfirmDialog from "../confirmDialog";
import styles from "./styles.module.css";
const dateAfter = (days) => { const date = new Date(); date.setDate(date.getDate() + days); return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0"); };
const defaults = [
    { id: "bio", subject: "Biology", detail: "Cell systems and genetics", date: dateAfter(3), priority: "High" },
    { id: "history", subject: "Modern history", detail: "Industrial age to 1945", date: dateAfter(8), priority: "Medium" },
    { id: "math", subject: "Calculus II", detail: "Integrals and sequences", date: dateAfter(14), priority: "High" },
];
const loadExams = () => { try { return JSON.parse(localStorage.getItem("exam-atlas-items")) || defaults; } catch { return defaults; } };
const daysUntil = (date) => Math.ceil((new Date(date + "T00:00:00") - new Date(new Date().toDateString())) / 86400000);
const ExamCountdownPlanner = () => {
    const [exams, setExams] = useState(loadExams); const [subject, setSubject] = useState(""); const [detail, setDetail] = useState(""); const [date, setDate] = useState("");
    const [priority, setPriority] = useState("Medium"); const [filter, setFilter] = useState("All"); const [pending, setPending] = useState(null);
    useEffect(() => localStorage.setItem("exam-atlas-items", JSON.stringify(exams)), [exams]);
    const ordered = useMemo(() => exams.filter((exam) => filter === "All" || exam.priority === filter).sort((a, b) => a.date.localeCompare(b.date)), [exams, filter]);
    const soonest = [...exams].sort((a, b) => a.date.localeCompare(b.date))[0];
    const addExam = (event) => { event.preventDefault(); if (!subject.trim() || !date) return; setExams((items) => [...items, { id: crypto.randomUUID(), subject: subject.trim(), detail: detail.trim() || "Review and practice", date, priority }]); setSubject(""); setDetail(""); setDate(""); };
    return <section className={styles.examCountdownPlanner} id="dashboard">
        <header className={styles.masthead}><div><p className={styles.label}>EXAM ATLAS / TERM PLANNER</p><h1>Know what's next.</h1><p>See every deadline clearly, then give your study time a direction.</p></div><div className={styles.countdown}><span className={styles.calendar}><FiCalendar /></span><small>NEXT EXAM</small><strong>{soonest ? Math.max(0, daysUntil(soonest.date)) : "-"}<i>days</i></strong><span>{soonest?.subject || "No exams added"}</span></div></header>
        <div className={styles.summary}><span><b>{exams.length.toString().padStart(2, "0")}</b> exams scheduled</span><span><b>{exams.filter((item) => item.priority === "High").length}</b> high-priority subjects</span><span className={styles.termNote}>One day at a time. You can do this.</span></div>
        <div className={styles.columns} id="workspace"><section className={styles.examList}><div className={styles.listHead}><div><p className={styles.label}>YOUR CALENDAR</p><h2>Upcoming exams</h2></div><div className={styles.filters}>{["All", "High", "Medium"].map((item) => <button key={item} className={filter === item ? styles.active : ""} onClick={() => setFilter(item)} type="button">{item}</button>)}</div></div>
            {ordered.map((exam) => <article className={styles.examRow} key={exam.id}><div className={styles.dateTile}><b>{new Date(exam.date + "T12:00:00").getDate().toString().padStart(2, "0")}</b><span>{new Date(exam.date + "T12:00:00").toLocaleString("en", { month: "short" })}</span></div><div className={styles.examInfo}><div className={styles.rowTitle}><h3>{exam.subject}</h3><span className={exam.priority === "High" ? styles.high : styles.medium}>{exam.priority} priority</span></div><p>{exam.detail}</p></div><div className={styles.daysLeft}><b>{Math.max(0, daysUntil(exam.date))}</b><span>days left</span></div><button className={styles.remove} type="button" aria-label={"Remove " + exam.subject} onClick={() => setPending(exam)}><FiTrash2 /></button></article>)}
            {!ordered.length && <p className={styles.empty}>No exams in this view.</p>}
        </section>
        <form className={styles.addExam} onSubmit={addExam}><span className={styles.formIcon}><FiPlus /></span><p className={styles.label}>MAKE A PLAN</p><h2>Add an exam</h2><p className={styles.formText}>Add a subject to your countdown.</p><label>Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="e.g. Chemistry" required /></label><label>What to cover<input value={detail} onChange={(event) => setDetail(event.target.value)} placeholder="e.g. Organic reactions" /></label><div className={styles.formPair}><label>Exam date<input type="date" min={dateAfter(0)} value={date} onChange={(event) => setDate(event.target.value)} required /></label><label>Priority<select value={priority} onChange={(event) => setPriority(event.target.value)}><option>Medium</option><option>High</option></select></label></div><button className={styles.addButton} type="submit">Add to calendar <FiChevronRight /></button></form></div>
        {pending && <ConfirmDialog title="Remove this exam?" description={pending.subject + " will be removed from your saved countdowns."} onCancel={() => setPending(null)} onConfirm={() => { setExams((items) => items.filter((item) => item.id !== pending.id)); setPending(null); }} />}
    </section>;
};
export default ExamCountdownPlanner;