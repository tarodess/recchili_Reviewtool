import styles from './page.module.css';
import QuestionnaireForm from '@/components/QuestionnaireForm';

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <h1>アンケートのご協力をお願いします！</h1>
        <p>ご意見・ご感想をお聞かせくださいませ。</p>
      </header>

      <div className={styles.container}>
        <QuestionnaireForm />
      </div>
    </main>
  );
}
