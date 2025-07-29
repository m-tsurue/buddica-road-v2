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
    address: '神奈川県横浜市中区新港2-8-1',
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
    vibes: ['神聖', '荘厳', '歴史的'],
    address: '栃木県日光市山内'
  },
  // 追加データ - 関東エリア
  {
    id: '7',
    name: '鎌倉大仏',
    description: '高さ13.35mの巨大な阿弥陀如来坐像。長谷にある浄土宗の寺院「高徳院」の本尊。',
    images: ['https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&h=600&fit=crop'],
    location: { lat: 35.3166, lng: 139.5361 },
    tags: ['仏教', '歴史', '観光名所'],
    bestTime: '午前中',
    duration: '1時間',
    rating: 4.6,
    reviews: 3421,
    vibes: ['静寂', '神聖', '歴史的'],
    address: '神奈川県鎌倉市長谷4-2-28'
  },
  {
    id: '8',
    name: '江ノ島',
    description: '湘南の代表的な観光地。江島神社、展望台、洞窟など見どころ満載。',
    images: ['https://images.unsplash.com/photo-1595587870672-c79b47875b50?w=800&h=600&fit=crop'],
    location: { lat: 35.2998, lng: 139.4803 },
    tags: ['海', 'デート', '観光'],
    bestTime: '夕方',
    duration: '3時間',
    rating: 4.4,
    reviews: 2876,
    vibes: ['ロマンチック', 'リラックス', '海風'],
    address: '神奈川県藤沢市江の島'
  },
  {
    id: '9',
    name: '箱根神社',
    description: '芦ノ湖に浮かぶ朱色の鳥居で有名。縁結びや開運のパワースポット。',
    images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=600&fit=crop'],
    location: { lat: 35.2044, lng: 139.0233 },
    tags: ['神社', 'パワースポット', '湖'],
    bestTime: '早朝',
    duration: '1.5時間',
    rating: 4.7,
    reviews: 4123,
    vibes: ['神聖', '厳かな', '清々しい'],
    address: '神奈川県足柄下郡箱根町元箱根80-1'
  },
  {
    id: '10',
    name: '富士山五合目',
    description: '富士山の中腹、標高2305mの展望地。雲海や山梨の景色が楽しめる。',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    location: { lat: 35.3606, lng: 138.7274 },
    tags: ['山', '絶景', 'ドライブ'],
    bestTime: '午前中',
    duration: '2時間',
    rating: 4.8,
    reviews: 5432,
    vibes: ['壮大', '爽快', '自然'],
    address: '山梨県南都留郡富士河口湖町'
  },
  {
    id: '11',
    name: '神田神保町',
    description: '古書店街として有名な文化的なエリア。学術書から古典まで幅広い書籍が揃う。',
    images: ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop'],
    location: { lat: 35.6958, lng: 139.7570 },
    tags: ['文化', '歴史', 'ショッピング'],
    bestTime: '午後',
    duration: '2時間',
    rating: 4.2,
    reviews: 1832,
    vibes: ['知的', '静か', '歴史的'],
    address: '東京都千代田区神田神保町'
  },
  {
    id: '12',
    name: '川越',
    description: '小江戸と呼ばれる蔵造りの街並み。時の鐘や菓子屋横丁が人気。',
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
    location: { lat: 35.9254, lng: 139.4857 },
    tags: ['歴史', '文化', 'グルメ'],
    bestTime: '午前中',
    duration: '3時間',
    rating: 4.4,
    reviews: 2918,
    vibes: ['風情ある', '賑やか', '懐かしい'],
    address: '埼玉県川越市'
  },
  {
    id: '13',
    name: '秩父',
    description: '自然豊かな山間地域。温泉や神社、四季の美しい風景が楽しめる。',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'],
    location: { lat: 35.9928, lng: 139.0861 },
    tags: ['自然', 'パワースポット', '温泉'],
    bestTime: '早朝',
    duration: '1日',
    rating: 4.6,
    reviews: 3421,
    vibes: ['清々しい', '神聖', '癒し'],
    address: '埼玉県秩父市'
  },
  {
    id: '14',
    name: '成田山新勝寺',
    description: '成田空港近くの古刹。初詣で有名で、年中多くの参拝者が訪れる。',
    images: ['https://images.unsplash.com/photo-1590470043184-aea87e5a9880?w=800&h=600&fit=crop'],
    location: { lat: 35.6965, lng: 140.3239 },
    tags: ['寺院', 'パワースポット', '歴史'],
    bestTime: '午前中',
    duration: '2時間',
    rating: 4.5,
    reviews: 4567,
    vibes: ['神聖', '厳か', '賑やか'],
    address: '千葉県成田市成田1'
  },
  {
    id: '15',
    name: '横浜中華街',
    description: '日本最大の中華街。本格的な中華料理と活気ある街の雰囲気を楽しめる。',
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop'],
    location: { lat: 35.4437, lng: 139.6503 },
    tags: ['グルメ', '文化', 'ショッピング'],
    bestTime: '夕方',
    duration: '2時間',
    rating: 4.3,
    reviews: 8910,
    vibes: ['エキサイティング', '多国籍', '賑やか'],
    address: '神奈川県横浜市中区山下町'
  }
];