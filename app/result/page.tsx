'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import ReviewDisplay from '@/components/ReviewDisplay';

interface ReviewData {
    atmosphere: number;
    taste: number;
    recommendation: number;
    overall: number;
    frequency: string;
    freeText: string;
}

export default function ResultPage() {
    const router = useRouter();
    const [data, setData] = useState<ReviewData | null>(null);

    useEffect(() => {
        const storedData = localStorage.getItem('reviewData');
        if (!storedData) {
            router.push('/');
            return;
        }
        setData(JSON.parse(storedData));
    }, [router]);

    if (!data) return null;

    return (
        <main className={styles.main}>
            <div className={styles.header}>
                <p className={styles.stepLabel}>所要時間：1分程度</p>
                <h1>お客様アンケート</h1>
                <p className={styles.thankYou}>アンケートにご協力ありがとうございました。</p>
            </div>

            <div className={styles.container}>
                <ReviewDisplay
                    atmosphere={data.atmosphere}
                    taste={data.taste}
                    recommendation={data.recommendation}
                    overall={data.overall}
                    frequency={data.frequency}
                    freeText={data.freeText}
                />
            </div>
        </main>
    );
}
