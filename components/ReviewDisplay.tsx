'use client';

import React, { useEffect, useState, useRef } from 'react';
import RatingStars from './RatingStars';
import styles from './ReviewDisplay.module.css';

interface ReviewDisplayProps {
    atmosphere: number;
    taste: number;
    recommendation: number;
    overall: number;
    frequency: string;
    freeText: string;
}

export default function ReviewDisplay({ atmosphere, taste, recommendation, overall, frequency, freeText }: ReviewDisplayProps) {
    const [reviewText, setReviewText] = useState("");
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchReview = async () => {
            try {
                const res = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ atmosphere, taste, recommendation, overall, frequency, freeText }),
                });
                const data = await res.json();
                setReviewText(data.review);
            } catch (error) {
                setReviewText("口コミの生成に失敗しました。手動で入力してください。");
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [atmosphere, taste, recommendation, overall, frequency, freeText]);

    const handleRegenerate = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ atmosphere, taste, recommendation, overall, frequency, freeText }),
            });
            const data = await res.json();
            setReviewText(data.review);
        } catch (error) {
            setReviewText("口コミの生成に失敗しました。手動で入力してください。");
        } finally {
            setLoading(false);
        }
    };

    const GOOGLE_REVIEW_URL = "https://www.google.com/maps/place/%E6%BF%80%E8%BE%9B%E3%83%A9%E3%83%BC%E3%83%A1%E3%83%B3%E5%B0%82%E9%96%80%E5%BA%97+%E3%83%AC%E3%83%83%E3%83%81%E3%83%AA+%E5%9C%9F%E6%B5%A6%E5%BA%97/@36.0809422,140.2010964,18z/data=!3m1!5s0x602212b524b58543:0x1eb58328463d22f7!4m6!3m5!1s0x602212b5236af5ed:0x46fbdd355028c1c0!8m2!3d36.0809422!4d140.2018889!16s%2Fg%2F11c2p5q68z?entry=ttu&g_ep=EgoyMDI2MDIxNi4wIKXMDSoASAFQAw%3D%3D";

    const handleCopy = () => {
        navigator.clipboard.writeText(reviewText).then(() => {
            setCopied(true);
        });
    };

    return (
        <div className={styles.container}>
            <p className={styles.subtitle}>
                よろしければGoogleクチコミにも<br />投稿をお願いします。
            </p>
            <h2 className={styles.title}>＼ アンケートの内容をもとに文章案<br />を作成しました ／</h2>

            <div className={styles.card}>
                {loading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>AIが文章を考え中...</p>
                    </div>
                ) : (
                    <>
                        <textarea
                            ref={textareaRef}
                            className={styles.textarea}
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        />

                        <div className={styles.actions}>
                            <button
                                className={styles.regenerateButton}
                                onClick={handleRegenerate}
                            >
                                🔄 文章を再作成する
                            </button>

                            <p className={styles.instruction}>
                                上記はアンケートの内容をもとに作成した文章案です。<br />
                                <strong>来店理由</strong>や<strong>詳細な感想</strong>などを追記してクチコミにご活用ください（コピー / ペースト）
                            </p>

                            <button className={styles.copyButton} onClick={handleCopy}>
                                {copied ? '✅ コピーしました！' : '📋 文章をコピーする'}
                            </button>

                            <a
                                href={GOOGLE_REVIEW_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.googleButton}
                            >
                                Googleクチコミに投稿する →
                            </a>
                            <p className={styles.subInstruction}>
                                ① 上の「コピー」ボタンで文章をコピー → ② 「Googleクチコミに投稿する」から口コミを貼り付け
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
