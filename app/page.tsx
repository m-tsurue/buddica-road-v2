export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-orange-600">
            BUDDICA ROAD
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            最高のドライブ体験を
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            思い出に残るドライブプランを作成しましょう
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md mx-auto">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚗</span>
            </div>
            <h3 className="text-xl font-bold mb-2">デプロイ成功！</h3>
            <p className="text-gray-600">
              BUDDICA ROADの基本バージョンが正常に動作しています。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}