import { NextResponse } from 'next/server';

const FREQUENCY_MAP: Record<string, string> = {
    first: '初めて訪問',
    monthly: '月1回ほど来店',
    weekly: '週1回ほど来店',
    biweekly: '月2〜3回来店',
    regular: 'ほぼ毎日来店',
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { atmosphere, taste, recommendation, overall, frequency, freeText } = body;

        let reviewText = "";

        // --- Intro based on frequency ---
        if (frequency === 'first') {
            const intros = [
                "初めて訪れましたが、期待以上の体験でした！",
                "ずっと気になっていたお店にやっと行けました。",
                "友人のおすすめで初来店しました。",
            ];
            reviewText += intros[Math.floor(Math.random() * intros.length)];
        } else if (frequency === 'regular' || frequency === 'weekly') {
            const intros = [
                "何度も通っている常連ですが、いつ来ても安定の美味しさです。",
                "毎回足を運んでいますが、やっぱりここのラーメンが一番です。",
                "リピーターです。今回も大満足でした！",
            ];
            reviewText += intros[Math.floor(Math.random() * intros.length)];
        } else {
            const intros = [
                "定期的に通っているお気に入りのお店です。",
                "月に何度か訪れますが、毎回満足しています。",
            ];
            reviewText += intros[Math.floor(Math.random() * intros.length)];
        }

        // --- Taste ---
        if (taste >= 4) {
            const tastePhrases = [
                "ラーメンのスープは絶品で、麺との相性も抜群です。",
                "一口目からスープの深みに感動しました。麺のコシも完璧です。",
                "とにかくラーメンが美味しい！スープを最後の一滴まで飲み干しました。",
            ];
            reviewText += tastePhrases[Math.floor(Math.random() * tastePhrases.length)];
        } else if (taste === 3) {
            reviewText += "ラーメンの味はしっかりしていて、安定感のある美味しさでした。";
        } else {
            reviewText += "ラーメンは普通に美味しかったです。";
        }

        // --- Atmosphere ---
        if (atmosphere >= 4) {
            reviewText += "店内は清潔感があり、居心地がとても良かったです。";
        } else if (atmosphere === 3) {
            reviewText += "お店の雰囲気も落ち着いていて、ゆっくり食事を楽しめました。";
        }

        // --- Free text integration ---
        if (freeText && freeText.trim().length > 0) {
            reviewText += `特に「${freeText.trim()}」と感じました。`;
        }

        // --- Recommendation / Closing ---
        if (recommendation >= 4) {
            const closings = [
                "\n\nラーメン好きな方には自信を持っておすすめできるお店です！また必ず来ます。",
                "\n\n友人や家族にもぜひ紹介したいお店です。リピート確定です！",
                "\n\nここのラーメンは間違いなくトップクラス。周りにもどんどん勧めていきたいです！",
            ];
            reviewText += closings[Math.floor(Math.random() * closings.length)];
        } else if (recommendation === 3) {
            reviewText += "\n\nまた機会があれば食べに来たいと思います。";
        } else {
            reviewText += "\n\nまた機会があれば立ち寄りたいです。";
        }

        return NextResponse.json({ review: reviewText });
    } catch (error) {
        return NextResponse.json({ error: "Failed to generate review" }, { status: 500 });
    }
}
