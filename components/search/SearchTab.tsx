import { useState } from 'react';
import { Search } from 'lucide-react';
import { Spot } from '@/lib/mock-data';
import { SearchBar } from '@/components/ui/SearchBar';
import { SpotCard } from '@/components/ui/SpotCard';
import { CategoryGrid } from './CategoryGrid';
import { AreaGrid } from './AreaGrid';

interface SearchTabProps {
  onSpotSelect: (spot: Spot) => void;
  searchResults: Spot[];
  onSearch: (query: string) => void;
  searchQuery: string;
  showResults: boolean;
  onClearResults: () => void;
}

export function SearchTab({
  onSpotSelect,
  searchResults,
  onSearch,
  searchQuery,
  showResults,
  onClearResults
}: SearchTabProps) {
  const [query, setQuery] = useState(searchQuery);

  const handleSearch = (searchQuery: string) => {
    onSearch(searchQuery);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">🔍 キーワードで探す</h3>
      
      {/* 検索バー */}
      <SearchBar
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        className="mb-8"
      />

      {/* 検索結果 */}
      {showResults && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold">
              「{searchQuery}」の検索結果 ({searchResults.length}件)
            </h4>
            <button
              onClick={onClearResults}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ✕ 閉じる
            </button>
          </div>
          
          {searchResults.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {searchResults.map((spot) => (
                <SpotCard
                  key={spot.id}
                  spot={spot}
                  onClick={() => onSpotSelect(spot)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>「{searchQuery}」に一致するスポットが見つかりませんでした</p>
              <p className="text-sm mt-2">別のキーワードで検索してみてください</p>
            </div>
          )}
        </div>
      )}

      {/* カテゴリとエリア */}
      {!showResults && (
        <>
          <CategoryGrid onCategorySearch={handleSearch} />
          <AreaGrid onAreaSearch={handleSearch} />
        </>
      )}
    </div>
  );
}