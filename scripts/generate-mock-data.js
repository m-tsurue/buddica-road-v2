// スクリプトで100件のモックデータを生成

const spots = [];

const names = [
  '浅草寺', '東京タワー', '明治神宮', '皇居', '上野公園', '新宿御苑', '代々木公園', '六本木ヒルズ',
  '東京駅', '渋谷スクランブル交差点', '築地市場', '豊洲市場', 'お台場', '原宿竹下通り', '表参道',
  '銀座', '秋葉原', '神田神保町', '巣鴨地蔵通り', '谷中銀座', '下町風俗資料館', '東京国立博物館',
  '科学博物館', '現代美術館', '森美術館', '東京都現代美術館', '葛西臨海公園', '井の頭恩賜公園',
  '小石川後楽園', '東京ドーム', '両国国技館', '雷門', '仲見世通り', '隅田川', '東京湾',
  '鎌倉大仏', '江ノ島', '箱根神社', '富士山五合目', '日光東照宮', '華厳の滝', '中禅寺湖',
  '奥多摩湖', '高尾山', '御岳山', '秩父神社', '長瀞', '川越', '小江戸', '蔵造りの街並み',
  '氷川神社', '所沢航空記念公園', '狭山湖', '多摩湖', '昭和記念公園', '府中郷土の森',
  '調布飛行場', '深大寺', '神代植物公園', '多摩動物園', 'サンリオピューロランド', '東京サマーランド',
  '横浜中華街', '赤レンガ倉庫', 'みなとみらい21', 'ランドマークタワー', 'コスモワールド',
  '山下公園', '氷川丸', '元町', '野毛山動物園', '金沢動物園', '三溪園', 'ズーラシア',
  '八景島シーパラダイス', '鶴見川', '多摩川', '相模川', '江の島水族館', '新江ノ島水族館',
  '茅ヶ崎海岸', '湘南海岸', '由比ヶ浜', '材木座海岸', '逗子海岸', '葉山海岸', '三浦海岸',
  '城ヶ島', '三崎港', '横須賀軍港', '猿島', '観音崎', '走水海岸', '久里浜海岸',
  '千葉マリンスタジアム', '幕張メッセ', '海浜幕張', '成田山新勝寺', '佐原', '香取神宮',
  '犬吠埼灯台', '銚子', '九十九里浜', '白里海岸', '御宿海岸', '勝浦朝市', '鴨川シーワールド'
];

const prefectures = ['東京都', '神奈川県', '千葉県', '埼玉県', '茨城県', '栃木県', '群馬県', '山梨県'];
const tags = ['観光', '自然', '歴史', '文化', 'グルメ', 'ショッピング', '体験', 'デート', 'ファミリー', 'パワースポット'];
const vibes = ['静か', '賑やか', 'ロマンチック', '神聖', '楽しい', 'リラックス', 'エキサイティング', '歴史的'];

for (let i = 11; i <= 110; i++) {
  const spot = {
    id: i.toString(),
    name: names[Math.floor(Math.random() * names.length)] + (i > names.length ? ` ${Math.floor(i / names.length + 1)}号店` : ''),
    description: `${names[Math.floor(Math.random() * names.length)]}の魅力的なスポット。訪れる価値のある場所です。`,
    images: [`https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=600&fit=crop`],
    location: {
      lat: 35.5 + Math.random() * 2,
      lng: 139.0 + Math.random() * 2
    },
    tags: tags.slice().sort(() => 0.5 - Math.random()).slice(0, 3),
    bestTime: ['早朝', '午前中', '午後', '夕方', '夜'][Math.floor(Math.random() * 5)],
    duration: ['30分', '1時間', '1.5時間', '2時間', '3時間'][Math.floor(Math.random() * 5)],
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    reviews: Math.floor(Math.random() * 5000) + 100,
    vibes: vibes.slice().sort(() => 0.5 - Math.random()).slice(0, 2),
    address: `${prefectures[Math.floor(Math.random() * prefectures.length)]}○○市○○町${Math.floor(Math.random() * 99) + 1}-${Math.floor(Math.random() * 99) + 1}`
  };
  spots.push(spot);
}

console.log(',');
spots.forEach((spot, index) => {
  console.log('  {');
  console.log(`    id: '${spot.id}',`);
  console.log(`    name: '${spot.name}',`);
  console.log(`    description: '${spot.description}',`);
  console.log(`    images: ['${spot.images[0]}'],`);
  console.log(`    location: { lat: ${spot.location.lat.toFixed(4)}, lng: ${spot.location.lng.toFixed(4)} },`);
  console.log(`    tags: [${spot.tags.map(t => `'${t}'`).join(', ')}],`);
  console.log(`    bestTime: '${spot.bestTime}',`);
  console.log(`    duration: '${spot.duration}',`);
  console.log(`    rating: ${spot.rating},`);
  console.log(`    reviews: ${spot.reviews},`);
  console.log(`    vibes: [${spot.vibes.map(v => `'${v}'`).join(', ')}],`);
  console.log(`    address: '${spot.address}'`);
  console.log(`  }${index < spots.length - 1 ? ',' : ''}`);
});