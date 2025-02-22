import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useFetchData, searchPlayer } from '../../utils/api';
import './player.css';

const PlayerPage = () => {

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
              image: "/images/upgrades/water_circle_fall_distance.png"
            },
            water_circle_sphere: {
              customName: "Sphere",
              image: "/images/upgrades/water_circle_sphere.png"
            }
          }
        },
        ice_shards: {
          customName: "Ice Shards",
          image: "/images/abilities/ice_shards.png",
          upgrades: {
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            },
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            }
          }
        },
        water_pillar: {
          customName: "Water Pillar",
          image: "/images/abilities/water_pillar.png",
          upgrades: {
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            water_pillar_start_boost: {
              customName: "Start Boost",
              image: "/images/upgrades/water_pillar_start_boost.png"
            },
            water_pillar_distance: {
              customName: "Distance",
              image: "/images/upgrades/water_pillar_distance.png"
            },
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            }
          }
        },
        water_forming: {
          customName: "Water Forming",
          image: "/images/abilities/water_forming.png",
          upgrades: {
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            water_forming_max_blocks: {
              customName: "Max Blocks",
              image: "/images/upgrades/water_forming_max_blocks.png"
            },
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            }
          }
        },
        water_bending: {
          customName: "Water Bending",
          image: "/images/abilities/water_bending.png",
          upgrades: {
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            }
          }
        },
        healing: {
          customName: "Healing",
          image: "/images/abilities/healing.png",
          upgrades: {
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            },
            use: {
              customName: "Use",
              image: "/images/upgrades/use.png"
            },
            regeneration: {
              customName: "Regeneration",
              image: "/images/upgrades/regeneration.png"
            },
            max_duration_lasts: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
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
              image: "/images/upgrades/cooldown.png"
            },
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            max_size: {
              customName: "Max Size",
              image: "/images/upgrades/max_size.png"
            }
          }
        },
        levitation: {
          customName: "Levitation",
          image: "/images/abilities/levitation.png",
          upgrades: {
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            }
          }
        },
        air_scooter: {
          customName: "Air Scooter",
          image: "/images/abilities/air_scooter.png",
          upgrades: {
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            step_height: {
              customName: "Step Height",
              image: "/images/upgrades/air_scooter_step_height.png"
            },
            speed: {
              customName: "Speed",
              image: "/images/upgrades/air_scooter_speed.png"
            },
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            }
          }
        },
        spiritual_projection: {
          customName: "Spiritual Projection",
          image: "/images/abilities/spiritual_projection.png",
          upgrades: {
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            },
            spiritual_projection_max_distance: {
              customName: "Max Distance",
              image: "/images/upgrades/spiritual_projection_max_distance.png"
            }
          }
        },
        tornado: {
          customName: "Tornado",
          image: "/images/abilities/tornado.png",
          upgrades: {
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            },
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            tornado_increase_rate: {
              customName: "Increase Rate",
              image: "/images/upgrades/tornado_increase_rate.png"
            },
            tornado_decrease_rate: {
              customName: "Decrease Rate",
              image: "/images/upgrades/tornado_decrease_rate.png"
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
              image: "/images/upgrades/cooldown.png"
            },
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            step_height: {
              customName: "Step Height",
              image: "/images/upgrades/step_height.png"
            },
            speed: {
              customName: "Speed",
              image: "/images/upgrades/speed.png"
            },
            radius: {
              customName: "Radius",
              image: "/images/upgrades/radius.png"
            }
          }
        },
        earth_column: {
          customName: "Earth Column",
          image: "/images/abilities/earth_column.png",
          upgrades: {
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            },
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            radius: {
              customName: "Radius",
              image: "/images/upgrades/radius.png"
            },
            height: {
              customName: "Height",
              image: "/images/upgrades/height.png"
            },
            earth_column_boost: {
              customName: "Boost",
              image: "/images/upgrades/earth_column_boost.png"
            }
          }
        },
        earth_push: {
          customName: "Earth Push",
          image: "/images/abilities/earth_push.png",
          upgrades: {
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            },
            damage: {
              customName: "Damage",
              image: "/images/upgrades/damage.png"
            }
          }
        },
        earth_armor: {
          customName: "Earth Armor",
          image: "/images/abilities/earth_armor.png",
          upgrades: {
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            },
            armor: {
              customName: "Armor",
              image: "/images/upgrades/armor.png"
            },
            speed: {
              customName: "Speed",
              image: "/images/upgrades/speed.png"
            },
            knockback: {
              customName: "Knockback",
              image: "/images/upgrades/knockback.png"
            }
          }
        },
        earth_trap: {
          customName: "Earth Trap",
          image: "/images/abilities/earth_trap.png",
          upgrades: {
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            },
            max_duration: {
              customName: "Max Duration",
              image: "/images/upgrades/max_duration.png"
            },
            slowness: {
              customName: "Slowness",
              image: "/images/upgrades/slowness.png"
            }
          }
        },
        seismic_sense: {
          customName: "Seismic Sense",
          image: "/images/abilities/seismic_sense.png",
          upgrades: {
            cooldown: {
              customName: "Cooldown",
              image: "/images/upgrades/cooldown.png"
            }
          }
        }
      }
    }
  };

  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHero, setSelectedHero] = useState(null);

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

  const renderHeroAbilities = () => {
    if (!selectedHero) return null;
  
    const heroConfig = heroesConfig[selectedHero];
    const playerHeroData = player.heroes[selectedHero] || {};
  
    return (
      <div className="hero-abilities">
        <h3>
          {heroConfig.normalizedName} Abilities
        </h3>
        {Object.entries(heroConfig.abilities).map(([ability, abilityData]) => (
          <div key={ability} className="ability">
            <img src={abilityData.image} className="ability-image" />
            <div className="ability-content">
              <h4>{abilityData.customName}</h4>
              {Object.entries(abilityData.upgrades).map(([upgrade, upgradeData]) => {
                const expPoints = playerHeroData[ability]?.[upgrade]?.experiencePoints || 0;
                const level = expPoints >= 500 ? Math.floor(expPoints / 500) : 0;
                return (
                  <div key={upgrade} className="upgrade">
                    <img src={upgradeData.image} className="upgrade-image" />
                    <span>{upgradeData.customName}: Level {level} ({expPoints} XP)</span>
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