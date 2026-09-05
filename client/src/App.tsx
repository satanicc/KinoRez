import { useState } from 'react';
import Search from './pages/Search';
import Details from './pages/Details';
import Player from './pages/Player';

type Page = 'search' | 'details' | 'player';

interface SelectedContent {
  id: string;
  title: string;
  type: 'movie' | 'series';
  poster: string;
}

interface PlayerConfig {
  id: string;
  translationId?: string;
  season?: number;
  episode?: number;
  quality?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('search');
  const [selectedContent, setSelectedContent] = useState<SelectedContent | null>(null);
  const [playerConfig, setPlayerConfig] = useState<PlayerConfig | null>(null);

  const handleSelectContent = (content: SelectedContent) => {
    setSelectedContent(content);
    setCurrentPage('details');
  };

  const handlePlayContent = (config: PlayerConfig) => {
    setPlayerConfig(config);
    setCurrentPage('player');
  };

  const handleBackToSearch = () => {
    setCurrentPage('search');
    setSelectedContent(null);
    setPlayerConfig(null);
  };

  const handleBackToDetails = () => {
    setCurrentPage('details');
  };

  return (
    <div className="min-h-screen bg-darker">
      <header className="bg-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1
            className="text-3xl font-bold text-red-600 cursor-pointer hover:text-red-500"
            onClick={handleBackToSearch}
          >
            KinoRez
          </h1>
          <p className="text-gray-400 text-sm">Free Movies & TV Series Streaming</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'search' && (
          <Search onSelectContent={handleSelectContent} />
        )}

        {currentPage === 'details' && selectedContent && (
          <Details
            content={selectedContent}
            onPlay={handlePlayContent}
            onBack={handleBackToSearch}
          />
        )}

        {currentPage === 'player' && playerConfig && (
          <Player
            config={playerConfig}
            onBack={handleBackToDetails}
          />
        )}
      </main>
    </div>
  );
}
