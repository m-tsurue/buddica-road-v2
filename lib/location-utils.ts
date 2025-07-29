import { Spot } from './mock-data';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface DistanceFilter {
  driveTime: 'short' | 'day' | 'overnight';
  maxDistance: number; // km
  estimatedTime: number; // hours
}

// ドライブ時間に基づく距離制限
export const DRIVE_TIME_LIMITS: Record<string, DistanceFilter> = {
  short: {
    driveTime: 'short',
    maxDistance: 100,
    estimatedTime: 3,
  },
  day: {
    driveTime: 'day', 
    maxDistance: 200,
    estimatedTime: 8,
  },
  overnight: {
    driveTime: 'overnight',
    maxDistance: 500,
    estimatedTime: 16,
  },
};

/**
 * 2点間の距離を計算（ハーバーサイン公式）
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // 地球の半径 (km)
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // 小数点1位まで
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * 距離から推定移動時間を計算
 */
export function estimateDriveTime(distance: number): number {
  // 平均時速60kmで計算（下道想定）
  const averageSpeed = 60;
  return Math.round((distance / averageSpeed) * 10) / 10;
}

/**
 * ユーザーの現在地から指定距離以内のスポットを取得
 */
export function getSpotsByDistance(
  spots: Spot[],
  userLocation: UserLocation,
  filter: DistanceFilter
): Spot[] {
  return spots
    .map(spot => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        spot.location.lat,
        spot.location.lng
      );
      
      const driveTime = estimateDriveTime(distance);
      
      return {
        ...spot,
        distance,
        driveTime,
      };
    })
    .filter(spot => spot.distance <= filter.maxDistance)
    .sort((a, b) => a.distance - b.distance); // 距離順にソート
}

/**
 * 距離に応じてスポットを分類
 */
export function categorizeSpotsByDistance(
  spots: Spot[],
  userLocation: UserLocation
): {
  short: Spot[];
  day: Spot[];
  overnight: Spot[];
} {
  const spotsWithDistance = spots.map(spot => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      spot.location.lat,
      spot.location.lng
    );
    
    return {
      ...spot,
      distance,
      driveTime: estimateDriveTime(distance),
    };
  });

  return {
    short: spotsWithDistance.filter(s => s.distance <= DRIVE_TIME_LIMITS.short.maxDistance),
    day: spotsWithDistance.filter(s => s.distance <= DRIVE_TIME_LIMITS.day.maxDistance),
    overnight: spotsWithDistance.filter(s => s.distance <= DRIVE_TIME_LIMITS.overnight.maxDistance),
  };
}

/**
 * 現在地の住所を取得（逆ジオコーディング）
 */
export async function getLocationAddress(coords: UserLocation): Promise<string> {
  try {
    // 簡易的な地域判定（実際のアプリでは逆ジオコーディングAPIを使用）
    const { latitude, longitude } = coords;
    
    // 関東地方の大まかな判定
    if (latitude >= 35.0 && latitude <= 36.5 && longitude >= 138.5 && longitude <= 140.5) {
      return '関東地方';
    }
    // 関西地方の大まかな判定
    else if (latitude >= 34.0 && latitude <= 35.5 && longitude >= 134.5 && longitude <= 136.5) {
      return '関西地方';
    }
    // その他
    else {
      return '現在地';
    }
  } catch (error) {
    console.error('位置情報の取得に失敗:', error);
    return '現在地';
  }
}

/**
 * 保存された位置情報を取得
 */
export function getSavedLocation(): UserLocation | null {
  try {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * 位置情報を保存
 */
export function saveLocation(location: UserLocation): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem('userLocation', JSON.stringify(location));
  } catch (error) {
    console.error('位置情報の保存に失敗:', error);
  }
}