import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchData, getFullLeaderboardHome } from '../../utils/api';
import './home.css';

function Home() {
  const navigate = useNavigate();
  const { killsList, bountyList, xpList, killstreakList, deathsList, kdList, usernames } = useFetchData();

  const [expandedList, setExpandedList] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeList, setActiveList] = useState('kills');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [fullLeaderboard, setFullLeaderboard] = useState({});
  const [isLoadingFullLeaderboard, setIsLoadingFullLeaderboard] = useState(false);

    // Process and limit the lists to 1000 entries
    const processedLists = useMemo(() => {
      const processList = (list) => list.slice(0, 1000);
      return {
        kills: processList(killsList),
        deaths: processList(deathsList),
        kd: processList(kdList),
        bounty: processList(bountyList),
        xp: processList(xpList),
        killstreak: processList(killstreakList),
      };
    }, [killsList, deathsList, kdList, bountyList, xpList, killstreakList]);

    useEffect(() => {
      if (expandedList) {
        const listType = expandedList.toLowerCase().replace(/\s+/g, '').replace('top', '');
        if (!fullLeaderboard[listType] || fullLeaderboard[listType].length === 0) {
          fetchFullLeaderboard(listType);
        }
      }
    }, [expandedList, fullLeaderboard]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    const handleClickOutside = (event) => {
      if (expandedList && !event.target.closest('.list-container')) {
        setExpandedList(null);
      }
    };
  
    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [expandedList]);

  useEffect(() => {
    if (expandedList) {
      const listType = expandedList.toLowerCase().replace(/\s+/g, '').replace('top', '');
      fetchFullLeaderboard(listType);
    }
  }, [expandedList]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const fetchFullLeaderboard = async (listType) => {
    if (!fullLeaderboard[listType] || fullLeaderboard[listType].length === 0) {
      setIsLoadingFullLeaderboard(true);
      try {
        const fullData = await getFullLeaderboardHome(listType);
        if (fullData && fullData.length > 0) {
          setFullLeaderboard(prevState => ({
            ...prevState,
            [listType]: fullData
          }));
        }
      } catch (error) {
        console.error("Error fetching full leaderboard:", error);
      } finally {
        setIsLoadingFullLeaderboard(false);
      }
    }
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/player/${searchTerm}`);
  };

  const renderList = (list, title) => {
    const isExpanded = expandedList === title;
    const listType = title.toLowerCase().replace(/\s+/g, '').replace('top', '');
    let displayList = isExpanded ? (fullLeaderboard[listType] || list) : list.slice(0, 10);

    // Ensure displayList is always an array
    if (!Array.isArray(displayList)) {
      console.error(`DisplayList is not an array for ${title}:`, displayList);
      displayList = [];
    }
  
    const getTrophyEmoji = (index) => {
      if (index === 0) return '🥇';
      if (index === 1) return '🥈';
      if (index === 2) return '🥉';
      return '';
    };
  
    return (
      <div className={`list-container ${isExpanded ? 'expanded' : ''}`}>
        <h2 onClick={() => {
          if (isExpanded) {
            setExpandedList(null);
          } else {
            setExpandedList(title);
            fetchFullLeaderboard(listType);
          }
        }}>{title}</h2>
        <ul>
          {displayList.map((item, index) => (
            <li 
              key={item.playerId} 
              className="player-item"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHoverInfo({
                  item,
                  position: { top: rect.top, left: rect.right + 10 }
                });
              }}
              onMouseLeave={() => setHoverInfo(null)}
              onClick={() => navigate(`/player/${item.playerId}`)}
            >
              <div className="player-info">
                <span className="rank">
                  {getTrophyEmoji(index) || `${index + 1}`}
                </span>
                <img 
                  src={`https://crafatar.com/avatars/${item.playerId}?size=48&overlay`} 
                  alt="Player head" 
                  className="player-head"
                  width="24" 
                  height="24"
                />
                <span className="player-id">
                  {usernames[item.playerId] || "Loading Username..."}
                </span>
                <span className="stat-value">
                  {title === 'Top Kills' ? item.kills : 
                   title === 'Top Deaths' ? item.deaths :
                   title === 'Top K/D' ? item.kd.toFixed(2) :
                   title === 'Top XP' ? item.xp :
                   title === 'Top Killstreaks' ? item.highestKillStreak :
                   item.bounty}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {isExpanded && isLoadingFullLeaderboard && (
          <p>Loading more entries...</p>
        )}
      </div>
    );
  };

  const renderHoverInfo = () => {
    if (!hoverInfo) return null;
    const { item, position } = hoverInfo;
    return (
      <div 
        className="player-hover"
        style={{
          position: 'fixed',
          top: `${position.top}px`,
          left: `${position.left}px`,
          zIndex: 1000,
        }}
      >
        <p><strong>Username:</strong> {usernames[item.playerId] || "Loading Username..."}</p>
        <p><strong>UUID:</strong> {item.playerId}</p>
        <p><strong>Kills:</strong> {item.kills}</p>
        <p><strong>Deaths:</strong> {item.deaths}</p>
        <p><strong>XP:</strong> {item.xp}</p>
        <p><strong>K/D:</strong> {(item.kills / Math.max(item.deaths, 1)).toFixed(2)}</p>
      </div>
    );
  };

  return (
    <div className="page-container">
      <br/>
      <br/>
      <br/>
      <br/>
      <h2>NoRisk Hero FFA Top 10 Statistics</h2>
      <div className="search-container">
        <form onSubmit={handleSearchSubmit} className="search-wrapper">
            <input
            type="text"
            placeholder="Username / UUID"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
            />
            <button type="submit" className="search-button">
            <i className="fas fa-search">Search</i>
            </button>
        </form>
      </div>
      {isMobile && (
        <div className="filtergroup-buttons">
          <button onClick={() => setActiveList('kills')}>Top Kills</button>
          <button onClick={() => setActiveList('deaths')}>Top Deaths</button>
          <button onClick={() => setActiveList('kd')}>Top K/D</button>
          <button onClick={() => setActiveList('bounty')}>Top Bounties</button>
          <button onClick={() => setActiveList('xp')}>Top XP</button>
          <button onClick={() => setActiveList('killstreak')}>Top Killstreaks</button>
        </div>
      )}
      <div className="filtergroup-lists">
        {(!isMobile || activeList === 'kills') && renderList(processedLists.kills, 'Top Kills')}
        {(!isMobile || activeList === 'deaths') && renderList(processedLists.deaths, 'Top Deaths')}
        {(!isMobile || activeList === 'kd') && renderList(processedLists.kd, 'Top K/D')}
        {(!isMobile || activeList === 'bounty') && renderList(processedLists.bounty, 'Top Current Bounties')}
        {(!isMobile || activeList === 'xp') && renderList(processedLists.xp, 'Top XP')}
        {(!isMobile || activeList === 'killstreak') && renderList(processedLists.killstreak, 'Top Killstreaks')}
      </div>
      {renderHoverInfo()}
    </div>
  );
}

export default Home;