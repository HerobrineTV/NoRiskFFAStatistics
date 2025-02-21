import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://api.hglabor.de/stats/FFA';

export const useFetchData = () => {
  const [killsList, setKillsList] = useState([]);
  const [bountyList, setBountyList] = useState([]);
  const [xpList, setXpList] = useState([]);
  const [killstreakList, setKillstreakList] = useState([]);
  const [currentKillstreakList, setCurrentKillstreakList] = useState([]);
  const [deathsList, setDeathsList] = useState([]);
  const [kdList, setKdList] = useState([]);
  const [usernames, setUsernames] = useState({});

  const fetchData = async (sort) => {
    try {
      const response = await fetch(`${API_BASE_URL}/top?sort=${sort}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${sort} data:`, error);
      return [];
    }
  };

  const fetchUsername = async (uuid) => {
    try {
      const response = await fetch(`https://playerdb.co/api/player/minecraft/${uuid}`);
      if (!response.ok) {
        throw new Error('Player not found');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Could not find info for "${uuid}"`);
      }
      return data.data.player.username;
    } catch (error) {
      console.error(`Error fetching info for "${uuid}":`, error);
      return uuid;
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const kills = await fetchData('kills');
      const deaths = await fetchData('deaths');
      const xp = await fetchData('xp');
      const highestKillStreak = await fetchData('highestKillStreak');
      const bounty = await fetchData('bounty');
      const currentKillstreak = await fetchData('currentKillStreak');

      setKillsList(kills);
      setDeathsList(deaths);
      setXpList(xp);
      setKillstreakList(highestKillStreak);
      setBountyList(bounty);
      setCurrentKillstreakList(currentKillstreak);

      // Calculate K/D list
      const kdList = kills.map(player => ({
        ...player,
        kd: player.kills / Math.max(player.deaths, 1)
      }));
      kdList.sort((a, b) => b.kd - a.kd);
      setKdList(kdList);

      // Fetch usernames
      const allPlayers = [...kills, ...deaths, ...bounty, ...xp, ...highestKillStreak];
      for (const item of allPlayers) {
        if (!usernames[item.playerId]) {
          const username = await fetchUsername(item.playerId);
          setUsernames(prevUsernames => ({
            ...prevUsernames,
            [item.playerId]: username
          }));
        }
      }
    };

    fetchAllData();
  }, []);

  return {
    killsList,
    bountyList,
    xpList,
    killstreakList,
    deathsList,
    kdList,
    usernames,
    currentKillstreakList,
  };
};

export const searchPlayer = async (identifier) => {
  try {
    const response = await fetch(`https://playerdb.co/api/player/minecraft/${identifier}`);
    if (!response.ok) {
      throw new Error('Player not found');
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(`Could not find info for "${identifier}"`);
    }
    return {
      uuid: data.data.player.id,
      username: data.data.player.username,
      avatar: `https://crafthead.net/avatar/${data.data.player.id}`
    };
  } catch (error) {
    console.error(`Error fetching info for "${identifier}":`, error);
    return null;
  }
};