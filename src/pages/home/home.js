import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchData, searchPlayer } from '../../utils/api';
import './home.css';

function Home() {
  const navigate = useNavigate();
  const { killsList, bountyList, xpList, killstreakList, deathsList, kdList, usernames } = useFetchData();

  const [searchTerm, setSearchTerm] = useState('');
  const [activeList, setActiveList] = useState('kills');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hoverInfo, setHoverInfo] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/player/${searchTerm}`);
  };

  const renderList = (list, title) => (
    <div className="list-container">
      <h2>{title}</h2>
      <ul>
        {list.slice(0, 10).map((item, index) => (
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
              <span className="rank">{index + 1}</span>
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
    </div>
  );

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
        {(!isMobile || activeList === 'kills') && renderList(killsList, 'Top Kills')}
        {(!isMobile || activeList === 'deaths') && renderList(deathsList, 'Top Deaths')}
        {(!isMobile || activeList === 'kd') && renderList(kdList, 'Top K/D')}
        {(!isMobile || activeList === 'bounty') && renderList(bountyList, 'Top Current Bounties')}
        {(!isMobile || activeList === 'xp') && renderList(xpList, 'Top XP')}
        {(!isMobile || activeList === 'killstreak') && renderList(killstreakList, 'Top Killstreaks')}
      </div>
      {renderHoverInfo()}
    </div>
  );
}

export default Home;