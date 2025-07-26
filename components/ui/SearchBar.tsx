import { Search } from 'lucide-react';
import { debounce } from '@/lib/utils';
import { UI } from '@/lib/constants';
import { useMemo } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "行きたい場所やカテゴリを入力...",
  className = ""
}: SearchBarProps) {
  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce(onSearch, UI.SEARCH_DEBOUNCE),
    [onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);
    debouncedSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-orange-300 focus:outline-none transition-colors"
      />
    </div>
  );
}