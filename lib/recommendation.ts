import { Spot, mockSpots } from './mock-data';

// 2つの座標間の距離を計算（km）
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 地球の半径（km）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// タグの類似度を計算
function calculateTagSimilarity(tags1: string[], tags2: string[]): number {
  const commonTags = tags1.filter(tag => tags2.includes(tag));
  const totalTags = new Set([...tags1, ...tags2]).size;
  return commonTags.length / totalTags;
}

// vibesの類似度を計算
function calculateVibesSimilarity(vibes1: string[], vibes2: string[]): number {
  const commonVibes = vibes1.filter(vibe => vibes2.includes(vibe));
  const totalVibes = new Set([...vibes1, ...vibes2]).size;
  return commonVibes.length / totalVibes;
}

// レコメンドスコアを計算
function calculateRecommendationScore(
  primarySpot: Spot, 
  candidateSpot: Spot,
  maxDistance: number = 100 // 最大距離（km）
): number {
  // 距離による減衰（近いほど高スコア）
  const distance = calculateDistance(
    primarySpot.location.lat, primarySpot.location.lng,
    candidateSpot.location.lat, candidateSpot.location.lng
  );
  const distanceScore = Math.max(0, 1 - (distance / maxDistance));

  // タグ類似度
  const tagSimilarity = calculateTagSimilarity(primarySpot.tags, candidateSpot.tags);

  // vibes類似度
  const vibesSimilarity = calculateVibesSimilarity(primarySpot.vibes, candidateSpot.vibes);

  // 評価による重み付け
  const ratingScore = candidateSpot.rating / 5.0;

  // 総合スコア（重み付け平均）
  const totalScore = (
    distanceScore * 0.4 +        // 距離: 40%
    tagSimilarity * 0.25 +       // タグ類似度: 25%
    vibesSimilarity * 0.20 +     // vibes類似度: 20%
    ratingScore * 0.15           // 評価: 15%
  );

  return totalScore;
}

// レコメンドスポットを生成
export function generateRecommendations(
  primaryDestination: Spot,
  excludeIds: string[] = [],
  maxResults: number = 10
): Spot[] {
  // 候補スポットを取得（主要目的地と既に除外されたスポットを除く）
  const candidates = mockSpots.filter(spot => 
    spot.id !== primaryDestination.id && 
    !excludeIds.includes(spot.id)
  );

  // 各候補のスコアを計算
  const scoredCandidates = candidates.map(candidate => ({
    spot: candidate,
    score: calculateRecommendationScore(primaryDestination, candidate),
    distance: calculateDistance(
      primaryDestination.location.lat, primaryDestination.location.lng,
      candidate.location.lat, candidate.location.lng
    )
  }));

  // スコア順でソート
  scoredCandidates.sort((a, b) => b.score - a.score);

  // 上位スポットを返す
  return scoredCandidates
    .slice(0, maxResults)
    .map(item => item.spot);
}

// カテゴリベースの推奨スポット
export function getSpotsByCategory(category: string): Spot[] {
  return mockSpots.filter(spot => 
    spot.tags.some(tag => tag.includes(category)) ||
    spot.vibes.some(vibe => vibe.includes(category))
  );
}

// エリアベースの推奨スポット
export function getSpotsByArea(areaName: string): Spot[] {
  // モックデータに合わせたエリア分類（実際の座標ベース）
  const areaSpotMapping: { [key: string]: string[] } = {
    '湘南': ['1'], // 江の島シーキャンドル
    '箱根': ['3'], // 箱根彫刻の森美術館  
    '鎌倉': ['2'], // 鎌倉大仏
    '富士五湖': ['4'], // 河口湖オルゴールの森
    '横浜': ['5'], // みなとみらいコスモワールド
    '日光': ['6']  // 日光東照宮
  };

  const spotIds = areaSpotMapping[areaName];
  if (!spotIds) {
    // エリアマッピングにない場合は座標ベースで検索
    const areaCoordinates: { [key: string]: { lat: [number, number], lng: [number, number] } } = {
      '湘南': { lat: [35.25, 35.35], lng: [139.45, 139.55] },
      '箱根': { lat: [35.20, 35.30], lng: [139.00, 139.10] },
      '鎌倉': { lat: [35.30, 35.35], lng: [139.50, 139.60] },
      '富士五湖': { lat: [35.45, 35.55], lng: [138.70, 138.80] }
    };

    const area = areaCoordinates[areaName];
    if (!area) return [];

    return mockSpots.filter(spot => 
      spot.location.lat >= area.lat[0] && spot.location.lat <= area.lat[1] &&
      spot.location.lng >= area.lng[0] && spot.location.lng <= area.lng[1]
    );
  }

  return mockSpots.filter(spot => spotIds.includes(spot.id));
}

// 人気スポットのランキング生成
export function getTrendingSpots(): Spot[] {
  // レーティングとレビュー数を基にトレンドスコアを計算
  const trendingSpots = mockSpots.map(spot => ({
    ...spot,
    trendScore: spot.rating * Math.log(spot.reviews + 1) // ログスケールでレビュー数を調整
  }));

  // トレンドスコア順でソート
  trendingSpots.sort((a, b) => b.trendScore - a.trendScore);
  
  return trendingSpots;
}

// デバッグ用: レコメンドスコアの詳細情報
export function getRecommendationDetails(primarySpot: Spot, candidateSpot: Spot) {
  const distance = calculateDistance(
    primarySpot.location.lat, primarySpot.location.lng,
    candidateSpot.location.lat, candidateSpot.location.lng
  );
  
  return {
    distance: Math.round(distance * 10) / 10,
    tagSimilarity: Math.round(calculateTagSimilarity(primarySpot.tags, candidateSpot.tags) * 100) / 100,
    vibesSimilarity: Math.round(calculateVibesSimilarity(primarySpot.vibes, candidateSpot.vibes) * 100) / 100,
    rating: candidateSpot.rating,
    totalScore: Math.round(calculateRecommendationScore(primarySpot, candidateSpot) * 100) / 100
  };
}