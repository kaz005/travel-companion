import { db } from "../db";
import { scenes } from "../db/schema";

const seedScenes = [
  {
    name: "東京タワー",
    imageUrl: "https://images.unsplash.com/photo-1490806843957-31f4c9a91c65",
    explanations: {
      ja: "東京のランドマーク的存在の東京タワー。高さ333メートルの展望台からは東京の街並みを一望できます。",
      en: "Tokyo Tower is a landmark of Tokyo. The 333-meter observation deck offers a panoramic view of Tokyo.",
      zh: "东京塔是东京的地标。从333米高的观景台可以眺望东京的街景。"
    }
  },
  {
    name: "浅草寺",
    imageUrl: "https://images.unsplash.com/photo-1590559899731-a382839e5549",
    explanations: {
      ja: "浅草寺は東京都内最古の寺院です。雷門と仲見世通りで知られる観光名所です。",
      en: "Senso-ji is Tokyo's oldest temple. It's famous for its Kaminarimon Gate and Nakamise Shopping Street.",
      zh: "浅草寺是东京最古老的寺庙。以雷门和仲见世商店街而闻名。"
    }
  },
  {
    name: "渋谷スクランブル交差点",
    imageUrl: "https://images.unsplash.com/photo-1542931287-023b922fa89b",
    explanations: {
      ja: "世界で最も忙しい交差点の一つ。1回の信号で最大3000人が横断します。",
      en: "One of the busiest crossings in the world. Up to 3000 people cross at a single light change.",
      zh: "世界上最繁忙的十字路口之一。每次信号灯变换时可多达3000人同时横穿。"
    }
  },
  {
    name: "皇居",
    imageUrl: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc",
    explanations: {
      ja: "天皇家の居住地であり、江戸城跡地に建つ。美しい日本庭園で知られています。",
      en: "The Imperial Palace is the residence of Japan's Imperial Family, built on the site of Edo Castle.",
      zh: "皇居是日本皇室的住所，建在江户城遗址上，以优美的日本庭园而闻名。"
    }
  },
  {
    name: "上野公園",
    imageUrl: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1",
    explanations: {
      ja: "上野公園は桜の名所として有名で、複数の美術館や博物館が集まる文化の中心地です。",
      en: "Ueno Park is famous for its cherry blossoms and is a cultural center with multiple museums.",
      zh: "上野公园以樱花而闻名，是拥有多个美术馆和博物馆的文化中心。"
    }
  },
  {
    name: "お台場",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
    explanations: {
      ja: "お台場は未来的な雰囲気の娯楽施設が集まる人工島です。自由の女神像のレプリカがあります。",
      en: "Odaiba is an artificial island with futuristic entertainment facilities and a Statue of Liberty replica.",
      zh: "台场是一个人工岛，聚集着未来感的娱乐设施，还有自由女神像的复制品。"
    }
  },
  {
    name: "新宿御苑",
    imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989",
    explanations: {
      ja: "新宿御苑は、日本庭園、英国風景式庭園、フランス式整形庭園を併せ持つ都会のオアシスです。",
      en: "Shinjuku Gyoen is an urban oasis featuring Japanese, English, and French gardens.",
      zh: "新宿御苑是城市中的绿洲，融合了日本庭园、英式风景园和法式几何园林。"
    }
  },
  {
    name: "築地市場",
    imageUrl: "https://images.unsplash.com/photo-1617871944148-012b124857b7",
    explanations: {
      ja: "かつての世界最大の魚市場。現在も多くの寿司店や海鮮店が軒を連ねています。",
      en: "Formerly the world's largest fish market. Still home to many sushi and seafood restaurants.",
      zh: "曾是世界最大的鱼市场。现在仍有许多寿司店和海鲜店。"
    }
  }
];

export async function seed() {
  try {
    // First, delete all existing scenes
    await db.delete(scenes);
    
    // Then insert new scenes
    for (const scene of seedScenes) {
      await db.insert(scenes).values(scene);
    }
    console.log('Seed data inserted successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}
