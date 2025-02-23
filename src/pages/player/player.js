import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useFetchData, fetchHeroData, searchPlayer, getFullLeaderboard } from '../../utils/api';
import './player.css';

const heroesConfig = {
  katara: {
    normalizedName: "Katara",
    image: "/images/katara.png",
    abilities: {
      water_circle: {
        customName: "Water Circle",
        image: "/images/abilities/water_circle.png",
        upgrades: {
          water_circle_fall_distance: {
            customName: "Fall Distance",
            image: "/images/upgrades/water_circle_fall_distance.png",
            mapping: "Water Circle Fall Distance"
          },
          water_circle_sphere: {
            customName: "Sphere",
            image: "/images/upgrades/water_circle_sphere.png",
            mapping: "Water Circle Sphere"
          }
        }
      },
      ice_shards: {
        customName: "Ice Shards",
        image: "/images/abilities/ice_shards.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          }
        }
      },
      water_pillar: {
        customName: "Water Pillar",
        image: "/images/abilities/water_pillar.png",
        upgrades: {
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          },
          water_pillar_start_boost: {
            customName: "Start Boost",
            image: "/images/upgrades/water_pillar_start_boost.png",
            mapping: "Water Pillar Start Boost"
          },
          water_pillar_distance: {
            customName: "Distance",
            image: "/images/upgrades/water_pillar_distance.png",
            mapping: "Water Pillar Distance"
          },
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          }
        }
      },
      water_forming: {
        customName: "Water Forming",
        image: "/images/abilities/water_forming.png",
        upgrades: {
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          },
          water_forming_max_blocks: {
            customName: "Max Blocks",
            image: "/images/upgrades/water_forming_max_blocks.png",
            mapping: "Water Forming Max Blocks"
          },
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          }
        }
      },
      water_bending: {
        customName: "Water Bending",
        image: "/images/abilities/water_bending.png",
        upgrades: {
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          },
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          }
        }
      },
      healing: {
        customName: "Healing",
        image: "/images/abilities/healing.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          regeneration: {
            customName: "Regeneration",
            image: "/images/upgrades/regeneration.png",
            mapping: "regeneration"
          },
          max_duration_lasts: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "Max Duration Lasts"
          }
        }
      }
    }
  },
  aang: {
    normalizedName: "Aang",
    image: "/images/aang.png",
    abilities: {
      air_ball: {
        customName: "Air Ball",
        image: "/images/abilities/air_ball.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          },
          max_size: {
            customName: "Max Size",
            image: "/images/upgrades/max_size.png",
            mapping: "maxSize"
          }
        }
      },
      levitation: {
        customName: "Levitation",
        image: "/images/abilities/levitation.png",
        upgrades: {
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          },
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          }
        }
      },
      air_scooter: {
        customName: "Air Scooter",
        image: "/images/abilities/air_scooter.png",
        upgrades: {
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          },
          step_height: {
            customName: "Step Height",
            image: "/images/upgrades/air_scooter_step_height.png",
            mapping: "stepHeight"
          },
          speed: {
            customName: "Speed",
            image: "/images/upgrades/air_scooter_speed.png",
            mapping: "speed"
          },
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          }
        }
      },
      spiritual_projection: {
        customName: "Spiritual Projection",
        image: "/images/abilities/spiritual_projection.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          spiritual_projection_max_distance: {
            customName: "Max Distance",
            image: "/images/upgrades/spiritual_projection_max_distance.png",
            mapping: "Spiritual Projection Max Distance"
          }
        }
      },
      tornado: {
        customName: "Tornado",
        image: "/images/abilities/tornado.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          },
          tornado_increase_rate: {
            customName: "Increase Rate",
            image: "/images/upgrades/tornado_increase_rate.png",
            mapping: "Tornado Increase Rate"
          },
          tornado_decrease_rate: {
            customName: "Decrease Rate",
            image: "/images/upgrades/tornado_decrease_rate.png",
            mapping: "Tornado Decrease Rate"
          }
        }
      }
    }
  },
  toph: {
    normalizedName: "Toph",
    image: "/images/toph.png",
    abilities: {
      earth_surf: {
        customName: "Earth Surf",
        image: "/images/abilities/earth_surf.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "Max Duration"
          },
          step_height: {
            customName: "Step Height",
            image: "/images/upgrades/step_height.png",
            mapping: "stepHeight"
          },
          speed: {
            customName: "Speed",
            image: "/images/upgrades/speed.png",
            mapping: "speed"
          },
          radius: {
            customName: "Radius",
            image: "/images/upgrades/radius.png",
            mapping: "radius"
          }
        }
      },
      earth_column: {
        customName: "Earth Column",
        image: "/images/abilities/earth_column.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          },
          radius: {
            customName: "Radius",
            image: "/images/upgrades/radius.png",
            mapping: "radius"
          },
          height: {
            customName: "Height",
            image: "/images/upgrades/height.png",
            mapping: "height"
          },
          earth_column_boost: {
            customName: "Boost",
            image: "/images/upgrades/earth_column_boost.png",
            mapping: "Earth Column Boost"
          }
        }
      },
      earth_push: {
        customName: "Earth Push",
        image: "/images/abilities/earth_push.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          damage: {
            customName: "Damage",
            image: "/images/upgrades/damage.png",
            mapping: "damage"
          }
        }
      },
      earth_armor: {
        customName: "Earth Armor",
        image: "/images/abilities/earth_armor.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          armor: {
            customName: "Armor",
            image: "/images/upgrades/armor.png",
            mapping: "armor"
          },
          speed: {
            customName: "Speed",
            image: "/images/upgrades/speed.png",
            mapping: "speed"
          },
          knockback: {
            customName: "Knockback",
            image: "/images/upgrades/knockback.png",
            mapping: "knockback"
          }
        }
      },
      earth_trap: {
        customName: "Earth Trap",
        image: "/images/abilities/earth_trap.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          },
          max_duration: {
            customName: "Max Duration",
            image: "/images/upgrades/max_duration.png",
            mapping: "maxDuration"
          },
          slowness: {
            customName: "Slowness",
            image: "/images/upgrades/slowness.png",
            mapping: "slowness"
          }
        }
      },
      seismic_sense: {
        customName: "Seismic Sense",
        image: "/images/abilities/seismic_sense.png",
        upgrades: {
          cooldown: {
            customName: "Cooldown",
            image: "/images/upgrades/cooldown.png",
            mapping: "cooldown"
          }
        }
      }
    }
  }
};

const PlayerPage = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);
  const [heroData, setHeroData] = useState(null);
  const [fullLeaderboards, setFullLeaderboards] = useState({});
  const [leaderboardsLoading, setLeaderboardsLoading] = useState(true);

  const { killsList, bountyList, xpList, killstreakList, deathsList, kdList, currentKillstreakList } = useFetchData();

  const [dataLoaded, setDataLoaded] = useState(false);

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

  useEffect(() => {
    const fetchFullLeaderboards = async () => {
      setLeaderboardsLoading(true);
      const leaderboards = await getFullLeaderboard();
      setFullLeaderboards(leaderboards);
      setLeaderboardsLoading(false);
    };
  
    fetchFullLeaderboards();
  }, []);

  useEffect(() => {
    const fetchHeroDataEffect = async () => {
      if (selectedHero) {
        const data = await fetchHeroData(selectedHero);
        setHeroData(data);
      }
    };

    fetchHeroDataEffect();
  }, [selectedHero]);

  useEffect(() => {
    if (killsList && bountyList && xpList && killstreakList && deathsList && kdList && currentKillstreakList) {
      setDataLoaded(true);
    }
  }, [killsList, bountyList, xpList, killstreakList, deathsList, kdList, currentKillstreakList]);

  const renderHeroAbilities = () => {
    if (!selectedHero || !heroData) return null;
  
    const heroConfig = heroesConfig[selectedHero];
    const playerHeroData = player.heroes[selectedHero] || {};
  
    return (
      <div className="hero-abilities">
        <h3>{heroConfig.normalizedName} Abilities</h3>
        {Object.entries(heroConfig.abilities).map(([ability, abilityData]) => (
          <div key={ability} className="ability">
            <img src={abilityData.image} className="ability-image" />
            <div className="ability-content">
              <h4>{abilityData.customName}</h4>
              {Object.entries(abilityData.upgrades).map(([upgrade, upgradeData]) => {
                const expPoints = playerHeroData[ability]?.[upgrade]?.experiencePoints || 0;
                const abilityProperties = heroData?.properties?.[ability] || [];
                
                // Find the matching property, trying different variations of the name
                const abilityProperty = abilityProperties.find(prop => 
                  prop.name === upgradeData.mapping ||
                  prop.name === upgradeData.customName ||
                  prop.name.toLowerCase() === upgradeData.mapping.toLowerCase() ||
                  prop.name.toLowerCase() === upgradeData.customName.toLowerCase() ||
                  prop.name.replace(/\s/g, '') === upgradeData.mapping.replace(/\s/g, '') ||
                  prop.name.replace(/\s/g, '') === upgradeData.customName.replace(/\s/g, '')
                );
                
                let level = 0;
                let XPnextLevel = 0;
                let currentValue = 'N/A';
  
                if (abilityProperty) {
                  level = Math.floor(Math.cbrt(expPoints / abilityProperty.levelScale));
                  level = Math.min(level, abilityProperty.maxLevel);
                  XPnextLevel = abilityProperty.levelScale * Math.pow(level + 1, 3);
                  currentValue = abilityProperty.baseValue;
  
                  if (abilityProperty.modifier) {
                    for (let i = 0; i < level; i++) {
                      if (abilityProperty.modifier.type === "gg.norisk.heroes.common.ability.operation.AddValueTotal") {
                        currentValue += abilityProperty.modifier.steps[i] || 0;
                      } else if (abilityProperty.modifier.type === "gg.norisk.heroes.common.ability.operation.MultiplyBase") {
                        currentValue *= (1 + abilityProperty.modifier.steps[i]) || 1;
                      }
                    }
                  }
                }
  
                const displayValue = typeof currentValue === 'number' ? currentValue.toFixed(2) : currentValue;
  
                return (
                  <div key={upgrade} className="upgrade">
                    <img src={upgradeData.image} className="upgrade-image" />
                    <span className="upgrade-column">
                      {upgradeData.customName}:
                    </span>
                    <span className="upgrade-column"> 
                       Level {level}
                    </span>
                    <span className="upgrade-column">
                      ({expPoints} / {XPnextLevel})
                      {/* {displayValue !== 'N/A' && ` - Current Value: ${displayValue}`} */}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };


  const getPlayerRank = (stat) => {
    if (leaderboardsLoading) return 'Loading...';
    if (!player || !fullLeaderboards[stat]) return 'N/A';
    
    const list = fullLeaderboards[stat];
    const playerIndex = list.findIndex(entry => entry.playerId === player.uuid);
    return playerIndex !== -1 ? playerIndex + 1 : 'N/A';
  };

  if (loading) return <div className="loading"><br/><br/><br/>Loading...</div>;
  if (error) return <div className="error"><br/><br/><br/>Player not found</div>;
  if (!player) return <div className="error"><br/><br/><br/>Player not found</div>;

  return (
    <div className="player-page">
        <br/>
        <br/>
        <br/>
      <div className="player-header">
        <img src={`https://crafatar.com/avatars/${player.uuid}?size=48&overlay`} alt={`${player.name} headshot`} className="player-headshot" />
        <h1>{player.name}</h1>
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
            <div className="stat-item"><small>{player.uuid}</small></div>
          </div>
        </div>
        <div className="player-additional-stats">
          <h2>Hero Abilities</h2>
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
              {Object.entries(heroesConfig).map(([hero, config]) => (
                <button key={hero} onClick={() => setSelectedHero(hero)}>
                  <img src={config.image} alt={config.normalizedName} className="hero-image" />
                  <span>{config.normalizedName}</span>
                </button>
              ))}
            </div>
            <div className="Hero-Items">
              {renderHeroAbilities()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;