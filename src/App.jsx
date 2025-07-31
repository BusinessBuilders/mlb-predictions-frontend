import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Target, DollarSign, Flame, Zap, AlertTriangle,
  Star, BarChart3, Calendar, Clock, Trophy, Bell, User, Settings, Menu,
  Eye, Shield, Rocket, Crown, Diamond, Activity, ChevronRight, Play,
  Pause, Volume2, VolumeX, Filter, Search, ArrowUp, ArrowDown, Circle,
  CheckCircle, XCircle, Plus, Minus, X, Lock, Unlock, Heart, Share,
  MessageCircle, ThumbsUp, ThumbsDown, Download, Upload, RefreshCw,
  Bookmark, BookmarkCheck, CreditCard, Wallet, PieChart, LineChart,
  MapPin, Phone, Mail, Gift, Percent, Timer, Layers, Maximize2,
  Thermometer, Wind, CloudRain, BaseballIcon as Baseball
} from 'lucide-react';

const MLBPredictionsApp = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const [liveMode, setLiveMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [betSlipOpen, setBetSlipOpen] = useState(false);
  const [currentBets, setCurrentBets] = useState([]);
  const [userTier, setUserTier] = useState('DIAMOND');
  const [portfolioValue, setPortfolioValue] = useState(15420);
  const [showNotifications, setShowNotifications] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load prediction data from your JSON files
  useEffect(() => {
    const loadPredictionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to load the latest prediction data
        // First attempt: load from latest.json
        let response;
        let data;

        try {
          response = await fetch('/data/latest.json');
          if (response.ok) {
            data = await response.json();
          }
        } catch (err) {
          console.log('Latest.json not found, trying specific file...');
        }

        // Second attempt: load the specific file you provided
        if (!data) {
          try {
            response = await fetch('/data/ultimate_predictions_detailed_2025-07-31_20250731_072408.json');
            if (response.ok) {
              data = await response.json();
            }
          } catch (err) {
            console.log('Specific file not found, using fallback...');
          }
        }

        // Third attempt: try any JSON file in the data folder
        if (!data) {
          try {
            response = await fetch('/data/predictions.json');
            if (response.ok) {
              data = await response.json();
            }
          } catch (err) {
            console.log('Fallback file not found, using sample data...');
          }
        }

        // Fallback: Use sample data if no files found
        if (!data) {
          console.log('Loading sample data for demonstration...');
          data = getSampleData();
        }

        // Validate and process the data
        if (data && (data.detailed_predictions || data.predictions)) {
          // Handle both detailed format and summary format
          const processedData = processMLBData(data);
          setPredictionData(processedData);
        } else {
          throw new Error('Invalid data format');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading prediction data:', error);
        setError(error.message);

        // Load sample data as fallback
        const sampleData = getSampleData();
        setPredictionData(sampleData);
        setLoading(false);
      }
    };

    loadPredictionData();
  }, []);

  // Function to process your MLB data format
  const processMLBData = (rawData) => {
    // If it's already in the right format, return as-is
    if (rawData.detailed_predictions && rawData.meta && rawData.summary) {
      return rawData;
    }

    // If it's in summary format, convert to detailed format
    if (rawData.predictions && !rawData.detailed_predictions) {
      return {
        meta: rawData.meta || {
          system_name: "Ultimate MLB Betting System",
          version: "6.0",
          date: rawData.date || new Date().toISOString().split('T')[0],
          total_predictions: rawData.predictions?.length || 0
        },
        summary: {
          date: rawData.date || new Date().toISOString().split('T')[0],
          success: rawData.success || true,
          average_overall_confidence: rawData.average_overall_confidence || 70,
          average_gpt_confidence: rawData.average_gpt_confidence || 80,
          total_system_ev: rawData.total_system_ev || 0.5,
          total_expected_profit: rawData.total_expected_profit || 100,
          total_scorching_batters: rawData.total_scorching_batters || 15,
          strong_betting_opportunities: rawData.strong_betting_opportunities || 0,
          elite_edge_games: rawData.elite_edge_games || 0,
          edge_strength_breakdown: rawData.edge_strength_breakdown || {"MODERATE": 2, "WEAK": 1},
          bet_recommendation_breakdown: rawData.bet_recommendation_breakdown || {"LEAN": 2, "PASS": 1}
        },
        detailed_predictions: rawData.predictions.map(pred => convertToDetailedFormat(pred))
      };
    }

    return rawData;
  };

  // Convert prediction to detailed format
  const convertToDetailedFormat = (prediction) => {
    return {
      game_info: {
        game_id: prediction.game_id || `${prediction.game}_${new Date().toISOString().split('T')[0]}`,
        date: prediction.date || new Date().toISOString().split('T')[0],
        away_team: prediction.game?.split(' @ ')[0] || 'AWAY',
        home_team: prediction.game?.split(' @ ')[1] || 'HOME',
        venue: prediction.venue || 'Unknown Venue'
      },
      primary_edges: {
        hot_batter_system: {
          advantage: prediction.hot_batter_advantage || "No hot batters detected",
          scorching_batters: parseInt(prediction.hot_batter_advantage?.match(/(\d+) scorching/)?.[1]) || 0,
          hr_candidates: parseInt(prediction.hot_batter_advantage?.match(/(\d+) HR candidates/)?.[1]) || 0,
          system_ev: 0.0
        },
        pitcher_quality: {
          home_quality: 50,
          away_quality: 50,
          advantage: prediction.pitcher_quality_advantage || "Neutral pitching matchup"
        }
      },
      real_mlb_context: {
        bullpen_advantage: prediction.real_bullpen_advantage || "Neutral bullpen matchup",
        recent_form_advantage: prediction.real_recent_form_advantage || "Even recent form",
        series_context: "Game #1",
        venue_advantage: "Neutral venue"
      },
      gpt_analysis: {
        predicted_winner: prediction.predicted_winner || 'home',
        confidence: prediction.gpt_confidence || prediction.confidence || 75,
        win_probability: prediction.win_probability || 0.6,
        key_factors: prediction.gpt_key_factors || ["Sample factor 1", "Sample factor 2"],
        reasoning: prediction.gpt_reasoning || "Analysis based on available data",
        market_inefficiencies: prediction.market_inefficiencies || ["Sample inefficiency"],
        betting_recommendations: prediction.betting_recommendations || ["Sample recommendation"]
      },
      system_metrics: {
        total_system_ev: prediction.total_system_ev || 0.3,
        overall_confidence: prediction.overall_confidence || prediction.confidence || 75,
        edge_strength: prediction.edge_strength || "MODERATE",
        bet_recommendation: prediction.bet_recommendation || "LEAN",
        expected_roi: prediction.expected_roi || 0.05,
        kelly_bet_size: 0.05,
        max_bet_amount: prediction.max_bet_amount || 500.0
      },
      environmental: {
        weather_impact: {
          temperature: 75.0,
          feels_like: 76.0,
          conditions: "clear",
          humidity: 60,
          wind_speed: 5.0,
          data_source: "estimated"
        }
      }
    };
  };

  // Sample data function for fallback
  const getSampleData = () => {
    return {
      meta: {
        system_name: "Ultimate MLB Betting System",
        version: "6.0",
        export_timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        total_predictions: 3
      },
      summary: {
        date: new Date().toISOString().split('T')[0],
        success: true,
        average_overall_confidence: 68.8,
        average_gpt_confidence: 81.7,
        total_system_ev: 0.95,
        total_expected_profit: 95.0,
        total_scorching_batters: 22,
        strong_betting_opportunities: 0,
        elite_edge_games: 0,
        edge_strength_breakdown: {
          "MODERATE": 2,
          "WEAK": 1
        },
        bet_recommendation_breakdown: {
          "LEAN": 2,
          "PASS": 1
        }
      },
      detailed_predictions: [
        {
          game_info: {
            game_id: "TB_NYY_2025-07-31",
            date: "2025-07-31",
            away_team: "TB",
            home_team: "NYY",
            venue: "Yankee Stadium"
          },
          primary_edges: {
            hot_batter_system: {
              advantage: "MASSIVE ADVANTAGE: 5 scorching batters, 0 HR candidates",
              scorching_batters: 5,
              hr_candidates: 0,
              system_ev: 0.0
            },
            pitcher_quality: {
              home_quality: 0,
              away_quality: 43,
              advantage: "MASSIVE AWAY ADVANTAGE: 43 point quality difference"
            }
          },
          real_mlb_context: {
            bullpen_advantage: "NEUTRAL BULLPEN MATCHUP: #17 vs #13",
            recent_form_advantage: "MASSIVE HOME FORM ADVANTAGE: 55.0% vs 30.0%",
            series_context: "Game #4",
            venue_advantage: "MASSIVE HOME VENUE ADVANTAGE: +0.100 OPS differential"
          },
          gpt_analysis: {
            predicted_winner: "home",
            confidence: 85,
            win_probability: 0.62,
            key_factors: [
              "Home team recent form: 11-9 (55.0%) vs Away team: 6-14 (30.0%)",
              "Pitcher quality advantage: Ryan Pepiot (43/100) over Marcus Stroman (0/100)",
              "Home team venue performance: 0.782 OPS, 3.62 ERA vs Away team on road: 0.682 OPS, 3.87 ERA"
            ],
            reasoning: "The prediction for the home team to win is primarily driven by a convergence of factors. The home team has a significant advantage in recent form, winning 55% of their last 20 games compared to the away team's 30%.",
            market_inefficiencies: [
              "Books may undervalue the home team's pitcher advantage",
              "Recent form and venue performance not fully priced in"
            ],
            betting_recommendations: [
              "Bet on home team moneyline",
              "Confidence level: High, consider larger bet size"
            ]
          },
          system_metrics: {
            total_system_ev: 0.35,
            overall_confidence: 74.33,
            edge_strength: "MODERATE",
            bet_recommendation: "LEAN",
            expected_roi: 0.07,
            kelly_bet_size: 0.05,
            max_bet_amount: 500.0
          },
          environmental: {
            weather_impact: {
              temperature: 78.0,
              feels_like: 79.0,
              conditions: "clear sky",
              humidity: 85,
              wind_speed: 6.9,
              data_source: "api_real"
            }
          }
        }
      ]
    };
  };

  // Team logos mapping
  const teamLogos = {
    'TB': '⚡', 'NYY': '🗽', 'ATL': '🪓', 'CIN': '🔴',
    'TEX': '🤠', 'SEA': '⚓', 'LAD': '⭐', 'SF': '🌉',
    'BOS': '🧦', 'HOU': '🚀', 'CHC': '🐻', 'STL': '🐦',
    'MIA': '🐠', 'COL': '⛰️', 'PIT': '🏴‍☠️', 'CLE': '⚾',
    'NYM': '🍎', 'PHI': '🔔', 'WSN': '🦅', 'MIL': '🍺',
    'MIN': '🌾', 'KC': '👑', 'CHW': '⚫', 'DET': '🐅',
    'OAK': '🌲', 'LAA': '😇', 'ARI': '🐍', 'SD': '🌊',
    'TOR': '🍁', 'BAL': '🐦‍⬛'
  };

  // Utility functions
  const getTierColor = (edgeStrength) => {
    switch(edgeStrength) {
      case 'ELITE': return 'from-cyan-400 to-blue-600';
      case 'STRONG': return 'from-yellow-400 to-orange-500';
      case 'MODERATE': return 'from-green-400 to-emerald-500';
      case 'WEAK': return 'from-gray-300 to-gray-500';
      default: return 'from-purple-400 to-pink-500';
    }
  };

  const getTierIcon = (edgeStrength) => {
    switch(edgeStrength) {
      case 'ELITE': return <Diamond className="w-4 h-4" />;
      case 'STRONG': return <Crown className="w-4 h-4" />;
      case 'MODERATE': return <Star className="w-4 h-4" />;
      case 'WEAK': return <Trophy className="w-4 h-4" />;
      default: return <Trophy className="w-4 h-4" />;
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch(recommendation) {
      case 'MAX BET': return 'from-red-600/20 to-orange-600/20 border-red-500/30';
      case 'BET': return 'from-green-600/20 to-emerald-600/20 border-green-500/30';
      case 'LEAN': return 'from-yellow-600/20 to-orange-600/20 border-yellow-500/30';
      case 'PASS': return 'from-gray-600/20 to-gray-500/20 border-gray-500/30';
      default: return 'from-blue-600/20 to-purple-600/20 border-blue-500/30';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatOdds = (odds) => {
    return odds > 0 ? `+${odds}` : `${odds}`;
  };

  const addToBetSlip = (game) => {
    const newBet = {
      id: game.game_info.game_id,
      game: `${game.game_info.away_team} @ ${game.game_info.home_team}`,
      pick: game.gpt_analysis.predicted_winner === 'away' ? game.game_info.away_team : game.game_info.home_team,
      odds: -110, // Default odds, replace with real odds
      stake: 0,
      potential: 0,
      confidence: game.system_metrics.overall_confidence
    };
    setCurrentBets([...currentBets, newBet]);
    setBetSlipOpen(true);
  };

  // Helper function for calculating payouts
  const calculatePayout = (stake, odds) => {
    if (odds > 0) {
      return stake * (odds / 100);
    } else {
      return stake * (100 / Math.abs(odds));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner w-32 h-32 mb-4 mx-auto"></div>
          <p className="text-white text-xl mb-2">Loading MLB Predictions...</p>
          <p className="text-gray-400 text-sm">Searching for prediction data files...</p>
        </div>
      </div>
    );
  }

  if (error && !predictionData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl mb-4">Failed to load prediction data</p>
          <p className="text-gray-400 text-sm mb-4">{error}</p>
          <div className="bg-gray-800 rounded-lg p-4 text-left">
            <p className="text-yellow-400 text-sm font-bold mb-2">Quick Setup:</p>
            <p className="text-gray-300 text-xs mb-2">1. Create folder: <code className="bg-gray-700 px-1 rounded">public/data/</code></p>
            <p className="text-gray-300 text-xs mb-2">2. Copy your JSON file to: <code className="bg-gray-700 px-1 rounded">public/data/latest.json</code></p>
            <p className="text-gray-300 text-xs">3. Refresh the page</p>
          </div>
        </div>
      </div>
    );
  }

  if (!predictionData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-xl">No prediction data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 flex flex-col`}>
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Baseball className="w-7 h-7 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    MLB ELITE
                  </h1>
                  <p className="text-xs text-gray-400 font-medium tracking-wider">
                    PREDICTIONS v{predictionData.meta?.version || '6.0'}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-400">Today's EV</span>
                  <span className="text-lg font-bold text-green-400">
                    +{(predictionData.summary.total_system_ev * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-gray-400">Avg Confidence</div>
                    <div className="font-bold text-white">{predictionData.summary.average_overall_confidence.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Hot Batters</div>
                    <div className="font-bold text-yellow-400">{predictionData.summary.total_scorching_batters}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard', badge: null },
              { id: 'predictions', icon: Target, label: 'Today\'s Picks', badge: predictionData.meta?.total_predictions },
              { id: 'live', icon: Activity, label: 'Live Games', badge: notifications },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics', badge: null },
              { id: 'first-inning', icon: Timer, label: 'First Inning', badge: 'NEW' },
              { id: 'props', icon: Gift, label: 'Player Props', badge: 'HOT' },
              { id: 'weather', icon: CloudRain, label: 'Weather Edge', badge: null },
              { id: 'tools', icon: Settings, label: 'Tools', badge: null }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                  selectedTab === item.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {sidebarOpen && (
                  <>
                    <span className="font-medium">{item.label}</span>
                    {item.badge && (
                      <span className={`ml-auto px-2 py-1 rounded-full text-xs font-bold ${
                        typeof item.badge === 'number'
                          ? 'bg-red-500 text-white'
                          : item.badge === 'HOT'
                            ? 'bg-orange-500 text-white'
                            : 'bg-green-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          {sidebarOpen && (
            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">Pro Bettor</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"></div>
                    <span className="text-xs text-gray-300">{userTier} Member</span>
                  </div>
                  <p className="text-xs text-gray-400">System: {predictionData.meta?.system_name || 'MLB System'}</p>
                </div>
                <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    MLB Elite Predictions
                  </h2>
                  <p className="text-gray-400 flex items-center space-x-4">
                    <span>{predictionData.summary?.date || 'Today'}</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>System v{predictionData.meta?.version || '6.0'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{predictionData.meta?.total_predictions || predictionData.detailed_predictions?.length || 0} Games Analyzed</span>
                    </span>
                    {error && (
                      <span className="flex items-center space-x-1 text-yellow-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-xs">Using sample data</span>
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* System Status */}
                <div className="flex items-center space-x-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold text-sm">SYSTEM ACTIVE</span>
                </div>

                {/* Quick Stats */}
                <div className="hidden md:flex items-center space-x-4 bg-gray-800/50 px-4 py-2 rounded-xl">
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">+{predictionData.summary?.total_expected_profit || 95}</div>
                    <div className="text-xs text-gray-400">Expected $</div>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold text-lg">{predictionData.summary?.average_gpt_confidence?.toFixed(1) || '81.7'}%</div>
                    <div className="text-xs text-gray-400">Avg Confidence</div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-bounce">
                        {notifications}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setBetSlipOpen(!betSlipOpen)}
                    className="relative p-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    <Wallet className="w-5 h-5" />
                    {currentBets.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                        {currentBets.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Stats Dashboard */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: "System EV",
                  value: `+${(predictionData.summary?.total_system_ev * 100 || 95).toFixed(1)}%`,
                  icon: TrendingUp,
                  color: 'from-green-400 to-emerald-600',
                  change: '+12.3%',
                  trend: 'up',
                  subtitle: `${predictionData.summary?.total_expected_profit || 95} expected profit`
                },
                {
                  label: "AI Confidence",
                  value: `${predictionData.summary?.average_gpt_confidence?.toFixed(1) || '81.7'}%`,
                  icon: Target,
                  color: 'from-blue-400 to-cyan-600',
                  change: '+5.2%',
                  trend: 'up',
                  subtitle: 'GPT Analysis Average'
                },
                {
                  label: "Hot Batters",
                  value: predictionData.summary?.total_scorching_batters || 22,
                  icon: Flame,
                  color: 'from-orange-400 to-red-600',
                  change: `${((predictionData.summary?.total_scorching_batters || 22) / (predictionData.meta?.total_predictions || 3)).toFixed(1)} avg`,
                  trend: 'neutral',
                  subtitle: 'Scorching performers'
                },
                {
                  label: "Strong Edges",
                  value: Object.values(predictionData.summary?.edge_strength_breakdown || {}).reduce((a, b) => a + b, 0),
                  icon: Diamond,
                  color: 'from-purple-400 to-pink-600',
                  change: `${predictionData.summary?.bet_recommendation_breakdown?.LEAN || 0} leans`,
                  trend: 'up',
                  subtitle: 'Betting opportunities'
                }
              ].map((stat, index) => (
                <div key={index} className="card group cursor-pointer p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        {stat.trend === 'up' ? (
                          <ArrowUp className="w-4 h-4 text-green-400" />
                        ) : stat.trend === 'down' ? (
                          <ArrowDown className="w-4 h-4 text-red-400" />
                        ) : (
                          <Minus className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-green-400' :
                          stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">vs yesterday</div>
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2 text-white">{stat.value}</div>
                  <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
                  <div className="text-gray-500 text-xs mt-1">{stat.subtitle}</div>
                </div>
              ))}
            </div>

            {/* Game Predictions */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Baseball className="w-6 h-6 text-white" />
                  </div>
                  <span>Today's Predictions</span>
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    SYSTEM v{predictionData.meta?.version || '6.0'}
                  </div>
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select className="bg-transparent text-white text-sm border-none outline-none">
                      <option>All Games</option>
                      <option>LEAN Only</option>
                      <option>Strong Edge</option>
                      <option>Hot Batters</option>
                    </select>
                  </div>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>

              {/* Game Cards */}
              {predictionData.detailed_predictions?.map((game, index) => (
                <div key={game.game_info.game_id} className="card-game group">
                  {/* Game Header */}
                  <div className="p-6 border-b border-gray-700/50">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        {/* Edge Strength Badge */}
                        <div className={`w-20 h-12 bg-gradient-to-r ${getTierColor(game.system_metrics.edge_strength)} rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
                          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                          <div className="flex items-center space-x-1 text-white relative z-10">
                            {getTierIcon(game.system_metrics.edge_strength)}
                            <span className="text-sm font-bold">{game.system_metrics.edge_strength}</span>
                          </div>
                        </div>

                        {/* Game Teams */}
                        <div>
                          <div className="flex items-center space-x-4 text-3xl font-bold mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{teamLogos[game.game_info.away_team] || '⚾'}</span>
                              <span className={`${game.gpt_analysis.predicted_winner === 'away' ? 'text-green-400' : 'text-gray-300'} transition-colors`}>
                                {game.game_info.away_team}
                              </span>
                            </div>
                            <div className="text-gray-500 text-xl">@</div>
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{teamLogos[game.game_info.home_team] || '⚾'}</span>
                              <span className={`${game.gpt_analysis.predicted_winner === 'home' ? 'text-green-400' : 'text-gray-300'} transition-colors`}>
                                {game.game_info.home_team}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>{game.game_info.venue}</span>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{game.real_mlb_context.series_context}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Confidence & Win Probability */}
                      <div className="text-right">
                        <div className="text-xs text-gray-400 mb-1">AI CONFIDENCE</div>
                        <div className="text-4xl font-bold text-green-400 mb-1">{game.system_metrics.overall_confidence.toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">Win Prob: {(game.gpt_analysis.win_probability * 100).toFixed(1)}%</div>
                      </div>
                    </div>

                    {/* Weather Conditions */}
                    {game.environmental?.weather_impact && (
                      <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/20">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Thermometer className="w-5 h-5 text-blue-400" />
                            <span className="text-blue-400 font-medium">{game.environmental.weather_impact.temperature}°F</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Wind className="w-5 h-5 text-cyan-400" />
                            <span className="text-cyan-400 font-medium">{game.environmental.weather_impact.wind_speed} mph</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CloudRain className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-400 font-medium capitalize">{game.environmental.weather_impact.conditions}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Humidity: {game.environmental.weather_impact.humidity}%
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Key Advantages Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {/* Hot Batters */}
                      <div className="bg-gray-800/30 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Flame className="w-5 h-5 text-orange-400" />
                          <span className="text-gray-400 text-sm font-bold">Hot Batters</span>
                        </div>
                        <div className="text-white font-bold">{game.primary_edges.hot_batter_system.scorching_batters} Scorching</div>
                        <div className="text-xs text-gray-400 mt-1">{game.primary_edges.hot_batter_system.advantage}</div>
                      </div>

                      {/* Pitcher Quality */}
                      <div className="bg-gray-800/30 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="w-5 h-5 text-green-400" />
                          <span className="text-gray-400 text-sm font-bold">Pitching Edge</span>
                        </div>
                        <div className="text-white font-bold">
                          Home: {game.primary_edges.pitcher_quality.home_quality} | Away: {game.primary_edges.pitcher_quality.away_quality}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{game.primary_edges.pitcher_quality.advantage}</div>
                      </div>

                      {/* Recent Form */}
                      <div className="bg-gray-800/30 rounded-xl p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-blue-400" />
                          <span className="text-gray-400 text-sm font-bold">Recent Form</span>
                        </div>
                        <div className="text-white font-bold text-sm">{game.real_mlb_context.recent_form_advantage.split(':')[0]}</div>
                        <div className="text-xs text-gray-400 mt-1">{game.real_mlb_context.recent_form_advantage.split(':')[1] || ''}</div>
                      </div>
                    </div>

                    {/* AI Analysis */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20">
                      <div className="flex items-center space-x-2 mb-3">
                        <Eye className="w-5 h-5 text-purple-400" />
                        <span className="font-bold text-purple-400">AI Analysis</span>
                        <div className="bg-purple-500/20 px-2 py-1 rounded text-xs font-bold text-purple-300">
                          {game.gpt_analysis.confidence}% Confidence
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">{game.gpt_analysis.reasoning}</p>

                      {/* Key Factors */}
                      <div className="space-y-1">
                        {game.gpt_analysis.key_factors.slice(0, 3).map((factor, i) => (
                          <div key={i} className="flex items-start space-x-2 text-xs">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-gray-300">{factor}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Market Inefficiencies */}
                    <div className="mb-6">
                      <div className="text-sm font-bold text-yellow-400 mb-2 flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Market Inefficiencies</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {game.gpt_analysis.market_inefficiencies.map((inefficiency, index) => (
                          <div
                            key={index}
                            className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs text-yellow-300"
                          >
                            {inefficiency}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className={`p-6 bg-gradient-to-r ${getRecommendationColor(game.system_metrics.bet_recommendation)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                          {game.system_metrics.bet_recommendation === 'PASS' ? (
                            <XCircle className="w-8 h-8 text-gray-400" />
                          ) : (
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          )}
                          <div>
                            <div className={`font-bold text-xl ${
                              game.system_metrics.bet_recommendation === 'PASS' ? 'text-gray-400' : 'text-green-400'
                            }`}>
                              {game.system_metrics.bet_recommendation} RECOMMENDATION
                            </div>
                            <div className="text-sm text-gray-400">
                              Pick: <span className="text-white font-bold">
                                {game.gpt_analysis.predicted_winner === 'away'
                                  ? `${game.game_info.away_team} (Away)`
                                  : `${game.game_info.home_team} (Home)`}
                              </span> • EV: +{(game.system_metrics.expected_roi * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right mr-4">
                          <div className="text-2xl font-bold text-green-400">+{formatCurrency(game.system_metrics.max_bet_amount * game.system_metrics.expected_roi)}</div>
                          <div className="text-sm text-gray-400">Max Expected Profit</div>
                        </div>
                        {game.system_metrics.bet_recommendation !== 'PASS' && (
                          <button
                            onClick={() => addToBetSlip(game)}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all flex items-center space-x-2 group"
                          >
                            <Wallet className="w-5 h-5" />
                            <span>ADD TO SLIP</span>
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedGame(game)}
                          className="px-6 py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors flex items-center space-x-2"
                        >
                          <Eye className="w-5 h-5" />
                          <span>DETAILS</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bet Slip Modal */}
      {betSlipOpen && (
        <div className="fixed top-20 right-6 w-80 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center space-x-2">
                <Wallet className="w-5 h-5" />
                <span>Bet Slip</span>
              </h3>
              <button
                onClick={() => setBetSlipOpen(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-4">
            {currentBets.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Wallet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No bets added yet</p>
                <p className="text-sm">Add some picks to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentBets.map((bet, index) => (
                  <div key={index} className="bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-white">{bet.game}</div>
                      <button
                        onClick={() => setCurrentBets(currentBets.filter((_, i) => i !== index))}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">{bet.pick}</div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs text-gray-400">Odds:</span>
                      <span className="font-mono font-bold text-green-400">{formatOdds(bet.odds)}</span>
                      <span className="text-xs text-gray-400">Confidence:</span>
                      <span className="text-xs font-bold text-yellow-400">{bet.confidence.toFixed(1)}%</span>
                    </div>
                    <input
                      type="number"
                      placeholder="Stake ($)"
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      onChange={(e) => {
                        const newBets = [...currentBets];
                        newBets[index].stake = parseFloat(e.target.value) || 0;
                        newBets[index].potential = calculatePayout(newBets[index].stake, newBets[index].odds);
                        setCurrentBets(newBets);
                      }}
                    />
                    {bet.potential > 0 && (
                      <div className="text-sm text-green-400 mt-2">
                        Potential: {formatCurrency(bet.potential)}
                      </div>
                    )}
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold">Total Stake:</span>
                    <span className="font-bold text-white">
                      {formatCurrency(currentBets.reduce((sum, bet) => sum + (bet.stake || 0), 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold">Potential Return:</span>
                    <span className="font-bold text-green-400">
                      {formatCurrency(currentBets.reduce((sum, bet) => sum + (bet.potential || 0), 0))}
                    </span>
                  </div>
                  <button className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg font-bold hover:shadow-lg transition-all">
                    PLACE BETS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Details Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl border border-gray-700 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Detailed Game Analysis</h2>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Game Info & Analysis */}
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Game Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Game ID:</span>
                        <span className="font-mono text-white">{selectedGame.game_info.game_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Venue:</span>
                        <span className="text-white">{selectedGame.game_info.venue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Series Context:</span>
                        <span className="text-white">{selectedGame.real_mlb_context.series_context}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Predicted Winner:</span>
                        <span className="text-green-400 font-bold capitalize">
                          {selectedGame.gpt_analysis.predicted_winner} ({selectedGame.gpt_analysis.predicted_winner === 'away' ? selectedGame.game_info.away_team : selectedGame.game_info.home_team})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">System Metrics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{selectedGame.system_metrics.overall_confidence.toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">Overall Confidence</div>
                      </div>
                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{selectedGame.gpt_analysis.confidence}%</div>
                        <div className="text-sm text-gray-400">GPT Confidence</div>
                      </div>
                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-400">+{(selectedGame.system_metrics.expected_roi * 100).toFixed(1)}%</div>
                        <div className="text-sm text-gray-400">Expected ROI</div>
                      </div>
                      <div className="text-center p-4 bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">{selectedGame.system_metrics.edge_strength}</div>
                        <div className="text-sm text-gray-400">Edge Strength</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Betting Recommendations</h3>
                    <div className="space-y-3">
                      {selectedGame.gpt_analysis.betting_recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Advanced Analysis */}
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Hot Batter Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                        <span className="text-gray-400">Scorching Batters:</span>
                        <span className="text-orange-400 font-bold">{selectedGame.primary_edges.hot_batter_system.scorching_batters}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                        <span className="text-gray-400">HR Candidates:</span>
                        <span className="text-red-400 font-bold">{selectedGame.primary_edges.hot_batter_system.hr_candidates}</span>
                      </div>
                      <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                        <div className="text-orange-400 font-medium text-sm">{selectedGame.primary_edges.hot_batter_system.advantage}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">MLB Context</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-700 rounded-lg">
                        <div className="text-gray-400 text-sm">Bullpen Advantage</div>
                        <div className="text-white font-medium">{selectedGame.real_mlb_context.bullpen_advantage}</div>
                      </div>
                      <div className="p-3 bg-gray-700 rounded-lg">
                        <div className="text-gray-400 text-sm">Recent Form</div>
                        <div className="text-white font-medium">{selectedGame.real_mlb_context.recent_form_advantage}</div>
                      </div>
                      <div className="p-3 bg-gray-700 rounded-lg">
                        <div className="text-gray-400 text-sm">Venue Advantage</div>
                        <div className="text-white font-medium">{selectedGame.real_mlb_context.venue_advantage}</div>
                      </div>
                    </div>
                  </div>

                  {selectedGame.environmental?.weather_impact && (
                    <div className="bg-gray-800 rounded-xl p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                        <CloudRain className="w-5 h-5" />
                        <span>Weather Conditions</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-lg font-bold text-blue-400">{selectedGame.environmental.weather_impact.temperature}°F</div>
                          <div className="text-sm text-gray-400">Temperature</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-lg font-bold text-cyan-400">{selectedGame.environmental.weather_impact.wind_speed} mph</div>
                          <div className="text-sm text-gray-400">Wind Speed</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-lg font-bold text-gray-400">{selectedGame.environmental.weather_impact.humidity}%</div>
                          <div className="text-sm text-gray-400">Humidity</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded-lg">
                          <div className="text-sm font-bold text-white capitalize">{selectedGame.environmental.weather_impact.conditions}</div>
                          <div className="text-sm text-gray-400">Conditions</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Key Factors</h3>
                    <div className="space-y-2">
                      {selectedGame.gpt_analysis.key_factors.map((factor, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-300 text-sm">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full AI Reasoning */}
              <div className="mt-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20 p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <span>Complete AI Analysis</span>
                </h3>
                <p className="text-gray-300 leading-relaxed">{selectedGame.gpt_analysis.reasoning}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="fixed top-20 right-6 w-96 bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl z-50">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">System Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2 bg-green-400"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">System v{predictionData.meta?.version || '6.0'} loaded successfully</p>
                  <p className="text-gray-400 text-xs mt-1">{predictionData.meta?.total_predictions || predictionData.detailed_predictions?.length || 0} games analyzed</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2 bg-yellow-400"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">{predictionData.summary?.total_scorching_batters || 22} hot batters detected</p>
                  <p className="text-gray-400 text-xs mt-1">Avg {((predictionData.summary?.total_scorching_batters || 22) / (predictionData.meta?.total_predictions || 3)).toFixed(1)} per game</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full mt-2 bg-purple-400"></div>
                <div className="flex-1">
                  <p className="text-white text-sm">Expected system EV: +{(predictionData.summary?.total_system_ev * 100 || 95).toFixed(1)}%</p>
                  <p className="text-gray-400 text-xs mt-1">Total expected profit: ${predictionData.summary?.total_expected_profit || 95}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MLBPredictionsApp; space-x-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">LIVE</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* System Stats Preview */}
          {sidebarOpen && predictionData.summary && (
            <div className="p-4 border-b border-gray-800">
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4">
                <div className="flex items-center
