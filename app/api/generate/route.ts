import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 星の数を日本語に変換
function ratingToText(rating: number): string {
    const map: Record<number, string> = { 5: '最高', 4: 'とても良い', 3: '普通', 2: 'やや不満', 1: '不満' };
    return map[rating] || '';
}

function frequencyToText(frequency: string): string {
    const map: Record<string, string> = {
        first: '初めて', monthly: '月1回程度', weekly: '週1回程度',
        biweekly: '月2〜3回', regular: 'ほぼ毎日',
    };
    return map[frequency] || '';
}

export async function POST(request: Request) {
    const body = await request.json();
    const { atmosphere, taste, recommendation, overall, frequency, freeText } = body;

    const apiKey = process.env.GEMINI_API_KEY;

    // APIキーがない場合はテンプレート生成にフォールバック
    if (!apiKey) {
        const review = generateFallback(atmosphere, taste, recommendation, overall, frequency, freeText);
        return NextResponse.json({ review });
    }

    try {
        // Gemini APIで生成
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const hasFreeText = freeText && freeText.trim().length > 0;

        const prompt = `あなたはGoogleマップの口コミを書くアシスタントです。
以下のアンケート回答をもとに、激辛ラーメン専門店「レッチリ」のGoogleクチコミとして自然な口コミ文を作成してください。

【アンケート回答】
- 来店頻度: ${frequencyToText(frequency)}
- ラーメンの味: ★${taste}（${ratingToText(taste)}）
- 雰囲気・清潔感: ★${atmosphere}（${ratingToText(atmosphere)}）
- おすすめ度: ★${recommendation}（${ratingToText(recommendation)}）
- 総合評価: ★${overall}（${ratingToText(overall)}）
${hasFreeText ? `- お客様の声: 「${freeText}」` : ''}

【ルール】
- 150〜250文字程度で書いてください
- 実際のGoogleクチコミのような自然な口調で書いてください
${hasFreeText ? `- 【最重要】お客様の声（自由記入）の内容を口コミの核として最も重視してください。星評価はあくまで補助的な参考情報として扱い、テキストに書かれた具体的な感想・意見・体験を中心に文章を構成してください。星評価とテキストの内容が矛盾する場合は、テキストの内容を優先してください。` : `- アンケートの各項目の評価をうまく文章に織り込んでください`}
- 「★」や「評価」などアンケートっぽい表現は使わないでください
- 絵文字は使わないでください
- 改行を適度に入れて読みやすくしてください`;

        const result = await model.generateContent(prompt);
        const reviewText = result.response.text();

        return NextResponse.json({ review: reviewText });
    } catch (error) {
        console.error('Gemini API Error:', error);
        // エラー時はテンプレートでフォールバック
        const review = generateFallback(atmosphere, taste, recommendation, overall, frequency, freeText);
        return NextResponse.json({ review });
    }
}

// APIキーがない場合やエラー時のフォールバック生成
function generateFallback(
    atmosphere: number, taste: number, recommendation: number,
    overall: number, frequency: string, freeText: string
): string {
    const parts: string[] = [];

    // 導入
    if (frequency === 'first') {
        parts.push("初めてレッチリさんに来ました！");
    } else if (frequency === 'regular' || frequency === 'weekly') {
        parts.push(`${frequencyToText(frequency)}通っているリピーターです。`);
    } else {
        parts.push(`${frequencyToText(frequency)}のペースで通っています。`);
    }

    // 味
    if (taste >= 4) {
        parts.push("ラーメンのスープは絶品で、麺との相性も抜群です。");
    } else if (taste === 3) {
        parts.push("ラーメンの味は安定した美味しさでした。");
    } else {
        parts.push("ラーメンの味は個人的にはもう少しかなと感じました。");
    }

    // 雰囲気
    if (atmosphere >= 4) {
        parts.push("店内は清潔感があり、居心地がとても良かったです。");
    } else if (atmosphere === 3) {
        parts.push("お店の雰囲気も落ち着いていて過ごしやすかったです。");
    }

    // 自由記入（テキストがある場合はそちらを最重視）
    const hasFreeText = freeText && freeText.trim().length > 0;
    if (hasFreeText) {
        // テキストがある場合、星評価による文章を減らしてテキスト内容を中心に据える
        parts.length = Math.min(parts.length, 1); // 導入部分だけ残す
        parts.push(freeText.trim());
    }

    // 締め
    if (recommendation >= 4 && overall >= 4) {
        parts.push("\n\nラーメン好きなら絶対に行くべきお店です。また必ず来ます！");
    } else if (recommendation >= 3 || overall >= 3) {
        parts.push("\n\nまた機会があれば食べに来たいと思います。");
    } else {
        parts.push("\n\n今後のメニューの変化にも期待しています。");
    }

    return parts.join("");
}
