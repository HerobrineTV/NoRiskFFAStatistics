import { useState, useEffect } from 'react';

const API_BASE_URL = 'https://api.hglabor.de/stats/FFA';
const HERO_API_BASE_URL = 'https://api.hglabor.de/ffa/hero';

// Cache object to store data and timestamps
const cache = {
  data: {},
  timestamps: {}
};

// Utility function to check if cached data is still valid
const isCacheValid = (key) => {
  const timestamp = cache.timestamps[key];
  return timestamp && (Date.now() - timestamp) < 600000; // 10 minutes in milliseconds
};

// Utility function to set cache
const setCache = (key, data) => {
  cache.data[key] = data;
  cache.timestamps[key] = Date.now();
};

// Utility function to get cache
const getCache = (key) => {
  return cache.data[key];
};

export const fetchHeroData = async (heroName) => {
  const cacheKey = `hero_${heroName}`;
  if (isCacheValid(cacheKey)) {
    return getCache(cacheKey);
  }

  try {
    const response = await fetch(`${HERO_API_BASE_URL}/${heroName}`);
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching hero data for ${heroName}:`, error);
    return null;
  }
};

export const calculateLevel = (xp, heroData) => {
  if (!heroData) return 0;

  const levelScale = heroData.properties.air_scooter[0].levelScale;
  return Math.floor(xp / levelScale) + 1;
};

const fetchData = async (sort, page = 1) => {
  const cacheKey = `${sort}_${page}`;
  if (isCacheValid(cacheKey)) {
    return getCache(cacheKey);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/top?sort=${sort}&page=${page}`);
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${sort} data (page ${page}):`, error);
    return [];
  }
};

export const useFetchData = () => {
  const [killsList, setKillsList] = useState([]);
  const [bountyList, setBountyList] = useState([]);
  const [xpList, setXpList] = useState([]);
  const [killstreakList, setKillstreakList] = useState([]);
  const [currentKillstreakList, setCurrentKillstreakList] = useState([]);
  const [deathsList, setDeathsList] = useState([]);
  const [kdList, setKdList] = useState([]);
  const [usernames, setUsernames] = useState({});

  const fetchData = async (sort, page = 1) => {
    const cacheKey = `${sort}_${page}`;
    if (isCacheValid(cacheKey)) {
      return getCache(cacheKey);
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/top?sort=${sort}&page=${page}`);
      const data = await response.json();
      setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error(`Error fetching ${sort} data (page ${page}):`, error);
      return [];
    }
  };

  const fetchUsername = async (uuid) => {
    const cacheKey = `username_${uuid}`;
    if (isCacheValid(cacheKey)) {
      return getCache(cacheKey);
    }
  
    try {
      const response = await fetch(`https://playerdb.co/api/player/minecraft/${uuid}`);
      if (!response.ok) {
        throw new Error('Player not found');
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Could not find info for "${uuid}"`);
      }
      const username = data.data.player.username;
      setCache(cacheKey, username);
      return username;
    } catch (error) {
      console.error(`Error fetching info for "${uuid}":`, error);
      return uuid;
    }
  };

  const updateUsername = async (playerId) => {
    if (!usernames[playerId]) {
      const username = await fetchUsername(playerId);
      setUsernames(prevUsernames => ({
        ...prevUsernames,
        [playerId]: username
      }));
    }
  };

  const fetchAdditionalPages = async (categories) => {
    const allPlayers = new Set();
    const playerMaps = {
      kills: new Map(),
      deaths: new Map(),
      xp: new Map(),
      highestKillStreak: new Map(),
      bounty: new Map(),
      currentKillStreak: new Map()
    };
  
    for (let page = 2; page <= 20; page++) {
      for (const category of categories) {
        const data = await fetchData(category, page);
        data.forEach(player => {
          allPlayers.add(player.playerId);
          if (playerMaps[category].has(player.playerId)) {
            // Update existing player data
            const existingPlayer = playerMaps[category].get(player.playerId);
            playerMaps[category].set(player.playerId, {
              ...existingPlayer,
              ...player,
              [category]: Math.max(existingPlayer[category], player[category])
            });
          } else {
            // Add new player
            playerMaps[category].set(player.playerId, player);
          }
        });
      }
    }
  
    // Update leaderboards
    setKillsList(prevList => {
      const newList = [...prevList, ...playerMaps.kills.values()];
      return newList.sort((a, b) => b.kills - a.kills);
    });
    setDeathsList(prevList => {
      const newList = [...prevList, ...playerMaps.deaths.values()];
      return newList.sort((a, b) => b.deaths - a.deaths);
    });
    setXpList(prevList => {
      const newList = [...prevList, ...playerMaps.xp.values()];
      return newList.sort((a, b) => b.xp - a.xp);
    });
    setKillstreakList(prevList => {
      const newList = [...prevList, ...playerMaps.highestKillStreak.values()];
      return newList.sort((a, b) => b.highestKillStreak - a.highestKillStreak);
    });
    setBountyList(prevList => {
      const newList = [...prevList, ...playerMaps.bounty.values()];
      return newList.sort((a, b) => b.bounty - a.bounty);
    });
    setCurrentKillstreakList(prevList => {
      const newList = [...prevList, ...playerMaps.currentKillStreak.values()];
      return newList.sort((a, b) => b.currentKillStreak - a.currentKillStreak);
    });
  
    setKdList(prevList => {
      const kdMap = new Map([...prevList, ...playerMaps.kills.values()].map(player => [player.playerId, player]));
      const updatedList = Array.from(kdMap.values()).map(player => {
        const kills = player.kills || 0;
        const deaths = player.deaths || 1;
        return {
          ...player,
          kills,
          deaths,
          kd: kills / Math.max(deaths, 1)
        };
      });
      return updatedList.sort((a, b) => b.kd - a.kd);
    });
  
    // Fetch usernames for new players
    for (const playerId of allPlayers) {
      await updateUsername(playerId);
    }
  };
  
  useEffect(() => {
    const fetchAllData = async () => {
      const categories = ['kills', 'deaths', 'xp', 'highestKillStreak', 'bounty', 'currentKillStreak'];
      const firstPageData = await Promise.all(categories.map(category => fetchData(category)));
  
      const [kills, deaths, xp, highestKillStreak, bounty, currentKillstreak] = firstPageData;
  
      setKillsList(kills);
      setDeathsList(deaths);
      setXpList(xp);
      setKillstreakList(highestKillStreak);
      setBountyList(bounty);
      setCurrentKillstreakList(currentKillstreak);
  
      // Calculate initial K/D list using only the kills leaderboard
      const initialKdList = kills.map(player => ({
        ...player,
        kd: player.kills / Math.max(player.deaths || 1, 1)
      }));
      initialKdList.sort((a, b) => b.kd - a.kd);
      setKdList(initialKdList);
  
      // Fetch usernames for the top 10 players from each leaderboard
      const top10Players = new Set();
      firstPageData.forEach(list => {
        list.slice(0, 10).forEach(item => top10Players.add(item.playerId));
      });
      initialKdList.slice(0, 10).forEach(item => top10Players.add(item.playerId));
  
      for (const playerId of top10Players) {
        await updateUsername(playerId);
      }
  
      // Fetch additional pages
      await fetchAdditionalPages(categories);
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
    setKillsList,
    setBountyList,
    setXpList,
    setKillstreakList,
    setDeathsList,
    setKdList,
    setCurrentKillstreakList,
  };
};

export const searchPlayer = async (identifier) => {
  const cacheKey = `player_${identifier}`;
  if (isCacheValid(cacheKey)) {
    return getCache(cacheKey);
  }

  try {
    const response = await fetch(`https://playerdb.co/api/player/minecraft/${identifier}`);
    if (!response.ok) {
      throw new Error('Player not found');
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(`Could not find info for "${identifier}"`);
    }
    const playerData = {
      uuid: data.data.player.id,
      username: data.data.player.username,
      avatar: `https://crafthead.net/avatar/${data.data.player.id}`
    };
    setCache(cacheKey, playerData);
    return playerData;
  } catch (error) {
    console.error(`Error fetching info for "${identifier}":`, error);
    return null;
  }
};

export const getFullLeaderboard = async () => {
  const cacheKey = 'full_leaderboard';
  if (isCacheValid(cacheKey)) {
    return getCache(cacheKey);
  }

  const categories = ['kills', 'deaths', 'kd', 'bounty', 'xp', 'highestKillStreak', 'currentKillStreak'];
  const fullLeaderboards = {};

  for (const category of categories) {
    let allData = [];
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const data = await fetchData(category, page);
      if (data.length === 0) {
        hasMoreData = false;
      } else {
        allData = allData.concat(data);
        page++;
      }
    }

    fullLeaderboards[category] = allData;
  }

  setCache(cacheKey, fullLeaderboards);
  return fullLeaderboards;
};

export const getFullLeaderboardHome = async () => {
  const cacheKey = 'full_leaderboard';
  if (isCacheValid(cacheKey)) {
    return getCache(cacheKey);
  }

  const categories = ['kills', 'deaths', 'kd', 'bounty', 'xp', 'highestKillStreak', 'currentKillStreak'];
  const fullLeaderboards = {};

  for (const category of categories) {
    let allData = [];
    let page = 1;
    let hasMoreData = true;

    while (hasMoreData) {
      const data = await fetchData(category, page);
      if (data.length === 0) {
        hasMoreData = false;
      } else {
        allData = allData.concat(data);
        page++;
      }
    }

    fullLeaderboards[category] = allData;
  }

  setCache(cacheKey, fullLeaderboards);
  return fullLeaderboards;
};