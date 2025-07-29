export interface Spot {
  id: string;
  name: string;
  description: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  tags: string[];
  bestTime: string;
  duration: string;
  rating: number;
  reviews: number;
  vibes: string[];
}

export const mockSpots: Spot[] = [
  {
    id: '1',
    name: '江の島シーキャンドル',
    description: '湘南のシンボル的な展望灯台。360度の大パノラマから富士山や房総半島まで見渡せる絶景スポット。',
    images: [
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=800&h=600&fit=crop'
    ],
    location: { lat: 35.2999, lng: 139.4813 },
    address: '神奈川県藤沢市江の島2-3-28',
    tags: ['絶景', '夕日', 'デート'],
    bestTime: '夕方（16:00-18:00）',
    duration: '1時間',
    rating: 4.8,
    reviews: 2341,
    vibes: ['ロマンチック', 'フォトジェニック', '開放的']
  },
  {
    id: '2',
    name: '鎌倉大仏',
    description: '高さ約11.3mの国宝・阿弥陀如来像。700年以上の歴史を持つ、鎌倉のシンボル的存在。',
    images: [
      'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1574290533993-10400ecac3c1?w=800&h=600&fit=crop'
    ],
    location: { lat: 35.3169, lng: 139.5358 },
    address: '神奈川県鎌倉市長谷4-2-28',
    tags: ['歴史', '文化', '家族向け'],
    bestTime: '午前中（9:00-11:00）',
    duration: '30分',
    rating: 4.6,
    reviews: 5432,
    vibes: ['荘厳', '歴史的', '神秘的']
  },
  {
    id: '3',
    name: '箱根彫刻の森美術館',
    description: '自然と芸術が融合した野外美術館。広大な庭園に点在する彫刻作品を散策しながら楽しめる。',
    images: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop'
    ],
    location: { lat: 35.2444, lng: 139.0502 },
    address: '神奈川県足柄下郡箱根町二ノ平1121',
    tags: ['アート', '散策', '写真映え'],
    bestTime: '午後（13:00-16:00）',
    duration: '2時間',
    rating: 4.7,
    reviews: 3211,
    vibes: ['アーティスティック', '開放的', 'のんびり']
  },
  {
    id: '4',
    name: '河口湖オルゴールの森',
    description: '中世ヨーロッパの街並みを再現したテーマパーク。富士山を背景に、オルゴールの音色が響く幻想的な空間。',
    images: [
      'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop'
    ],
    location: { lat: 35.5103, lng: 138.7741 },
    address: '山梨県南都留郡富士河口湖町河口3077-20',
    tags: ['テーマパーク', '音楽', '富士山'],
    bestTime: '日中（11:00-15:00）',
    duration: '1.5時間',
    rating: 4.5,
    reviews: 1876,
    vibes: ['メルヘン', 'ロマンチック', '異国情緒']
  },
  {
    id: '5',
    name: 'みなとみらいコスモワールド',
    description: '横浜のシンボル「コスモクロック21」がある都市型遊園地。夜のイルミネーションは必見。',
    images: [
      'https://images.unsplash.com/photo-1544030288-e6e6108867f6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1602940659805-770d1b3b9911?w=800&h=600&fit=crop'
    ],
    location: { lat: 35.4552, lng: 139.6369 },
    tags: ['夜景', 'デート', 'アトラクション'],
    bestTime: '夜（18:00-21:00）',
    duration: '2時間',
    rating: 4.4,
    reviews: 4321,
    vibes: ['エキサイティング', 'ロマンチック', 'キラキラ']
  },
  {
    id: '6',
    name: '日光東照宮',
    description: '徳川家康を祀る世界遺産。豪華絢爛な建築と彫刻が見どころ。特に「眠り猫」と「三猿」が有名。',
    images: [
      'https://images.unsplash.com/photo-1590470043184-aea87e5a9880?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580477371194-4593e3c7c6cf?w=800&h=600&fit=crop'
    ],
    location: { lat: 36.7580, lng: 139.5986 },
    tags: ['世界遺産', '歴史', 'パワースポット'],
    bestTime: '午前中（9:00-12:00）',
    duration: '2時間',
    rating: 4.9,
    reviews: 6543,
    vibes: ['神聖', '荘厳', '歴史的']
  }
];