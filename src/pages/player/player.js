import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useFetchData, searchPlayer } from '../../utils/api';
import './player.css';

const PlayerPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { killsList, bountyList, xpList, killstreakList, deathsList, kdList, currentKillstreakList } = useFetchData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let uuid = id;
        let playerInfo;
        
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)) {
          playerInfo = await searchPlayer(uuid);
          if (!playerInfo) {
            throw new Error('Player not found');
          }
          uuid = playerInfo.uuid;
        } else {
          playerInfo = await searchPlayer(uuid);
        }

        const playerResponse = await axios.get(`https://api.hglabor.de/stats/FFA/${uuid}`);
        setPlayer({
          ...playerResponse.data,
          name: playerInfo.username,
          uuid: playerInfo.uuid
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data: ' + err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getPlayerRank = (stat) => {
    if (!player) return 'N/A';
    let list;
    switch(stat) {
      case 'kills': list = killsList; break;
      case 'deaths': list = deathsList; break;
      case 'kd': list = kdList; break;
      case 'bounty': list = bountyList; break;
      case 'xp': list = xpList; break;
      case 'highestKillStreak': list = killstreakList; break;
      case 'currentKillStreak': list = currentKillstreakList; break;
      default: return 'N/A';
    }
    const playerIndex = list.findIndex(entry => entry.playerId === player.uuid);
    return playerIndex !== -1 ? playerIndex + 1 : 'N/A';
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!player) return <div className="error">Player not found</div>;

  return (
    <div className="player-page">
        <br/>
        <br/>
        <br/>
      <div className="player-header">
        <img src={`https://crafatar.com/avatars/${player.uuid}?size=48&overlay`} alt={`${player.name} headshot`} className="player-headshot" />
        <h1>{player.name} ({player.uuid})</h1>
      </div>
      <div className="player-content">
        <div className="player-main-info">
          <img src={`https://crafatar.com/renders/body/${player.uuid}?scale=10&overlay`} alt={`${player.name} skin render`} className="player-skin-render" />
          <div className="player-stats">
            <div className="stat-item"><span>Kills:</span> {player.kills} <small>(Rank: {getPlayerRank('kills')})</small></div>
            <div className="stat-item"><span>Deaths:</span> {player.deaths} <small>(Rank: {getPlayerRank('deaths')})</small></div>
            <div className="stat-item"><span>K/D Ratio:</span> {(player.kills / (player.deaths || 1)).toFixed(2)} <small>(Rank: {getPlayerRank('kd')})</small></div>
            <div className="stat-item"><span>XP:</span> {player.xp} <small>(Rank: {getPlayerRank('xp')})</small></div>
            <div className="stat-item"><span>Current Killstreak:</span> {player.currentKillStreak} <small>(Rank: {getPlayerRank('currentKillStreak')})</small></div>
            <div className="stat-item"><span>Highest Killstreak:</span> {player.highestKillStreak} <small>(Rank: {getPlayerRank('highestKillStreak')})</small></div>
            <div className="stat-item"><span>Current Bounty:</span> {player.bounty} <small>(Rank: {getPlayerRank('bounty')})</small></div>
          </div>
        </div>
        <div className="player-additional-stats">
          <h2>Additional Statistics</h2>
          <div className="stats-grid">
            {Object.entries(player).map(([key, value]) => {
              if (typeof value === 'number' && !['kills', 'deaths', 'xp', 'highestKillStreak', 'bounty', 'currentKillStreak'].includes(key)) {
                return (
                  <div key={key} className="stat-item">
                    <span className="stat-name">{key}:</span>
                    <span className="stat-value">{value}</span>
                  </div>
                );
              }
              return null;
            })}
            <div className="Hero-Buttons">
                <button>Katara</button>
                <button>Aang</button>
                <button>Toph</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;


