'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RatingStars from './RatingStars';
import styles from './QuestionnaireForm.module.css';

const FREQUENCY_OPTIONS = [
    { value: 'first', label: '初めて' },
    { value: 'monthly', label: '月に1回程度' },
    { value: 'weekly', label: '週に1回程度' },
    { value: 'biweekly', label: '月に2〜3回' },
    { value: 'regular', label: 'ほぼ毎日' },
];

export default function QuestionnaireForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        atmosphere: 0,
        taste: 0,
        recommendation: 0,
        overall: 0,
        frequency: '',
        freeText: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        localStorage.setItem('reviewData', JSON.stringify(formData));
        router.push('/result');
    };

    const updateRating = (field: string, value: number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const isFormValid = formData.atmosphere && formData.taste && formData.recommendation && formData.overall && formData.frequency;

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.timeLabel}>
                <span className={styles.timeBadge}>所要時間：1分程度</span>
                <h2 className={styles.sectionTitle}>お客様アンケート</h2>
                <p className={styles.sectionSub}>アンケートにご協力ありがとうございます。</p>
            </div>

            <RatingStars
                label="お店の雰囲気や清潔感はいかがでしたか？"
                value={formData.atmosphere}
                onChange={(val) => updateRating('atmosphere', val)}
                required
            />

            <RatingStars
                label="ラーメンの味はいかがでしたか？"
                value={formData.taste}
                onChange={(val) => updateRating('taste', val)}
                required
            />

            <RatingStars
                label="周りにおすすめしたいですか？"
                value={formData.recommendation}
                onChange={(val) => updateRating('recommendation', val)}
                required
            />

            <RatingStars
                label="当店の総合的な評価はいかがでしたか？"
                value={formData.overall}
                onChange={(val) => updateRating('overall', val)}
                required
            />

            {/* ラーメン頻度 */}
            <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                    <span className={styles.required}>必須</span>
                    レッチリのラーメンはどの頻度で食べにきますか？
                </label>
                <div className={styles.frequencyOptions}>
                    {FREQUENCY_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`${styles.frequencyButton} ${formData.frequency === opt.value ? styles.frequencyActive : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, frequency: opt.value }))}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 自由記入欄 */}
            <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                    <span className={styles.optionalBadge}>任意</span>
                    その他、ご感想やご意見があればお聞かせください
                </label>
                <textarea
                    className={styles.freeTextArea}
                    placeholder="例：味噌ラーメンが特に美味しかった、チャーシューが絶品だった、接客が丁寧だった…など"
                    value={formData.freeText}
                    onChange={(e) => setFormData(prev => ({ ...prev, freeText: e.target.value }))}
                    rows={4}
                />
            </div>

            <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting || !isFormValid}
            >
                {isSubmitting ? (
                    <span className={styles.submittingText}>
                        <span className={styles.spinnerSmall}></span>
                        AIが文章を生成中...
                    </span>
                ) : '回答して口コミを生成する'}
            </button>

            <p className={styles.note}>
                ※回答内容はAI口コミ生成の参考にのみ使用されます。
            </p>
        </form>
    );
}
