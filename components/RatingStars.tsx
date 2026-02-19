'use client';

import React, { useState } from 'react';
import styles from './RatingStars.module.css';

interface RatingStarsProps {
    label: string;
    value: number;
    onChange?: (value: number) => void;
    required?: boolean;
    readOnly?: boolean;
}

export default function RatingStars({ label, value, onChange, required, readOnly = false }: RatingStarsProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const displayValue = hoverValue !== null ? hoverValue : value;

    const handleClick = (star: number) => {
        if (!readOnly && onChange) {
            onChange(star);
        }
    };

    return (
        <div className={styles.container}>
            <label className={styles.label}>
                {required && <span className={styles.required}>必須</span>}
                {label}
            </label>
            <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`${styles.star} ${star <= displayValue ? styles.filled : ''} ${readOnly ? styles.readOnly : ''}`}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => !readOnly && setHoverValue(star)}
                        onMouseLeave={() => !readOnly && setHoverValue(null)}
                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        disabled={readOnly}
                    >
                        ★
                    </button>
                ))}
            </div>
        </div>
    );
}
