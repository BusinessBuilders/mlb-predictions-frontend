import React, { useState, useEffect } from 'react';
import TrackingComponent from './TrackingComponent';
import {
  TrendingUp, TrendingDown, Target, DollarSign, Flame, Zap, AlertTriangle,
  Star, BarChart3, Calendar, Clock, Trophy, Bell, User, Settings, Menu,
  Eye, Shield, Rocket, Crown, Diamond, Activity, ChevronRight, Play,
  Pause, Volume2, VolumeX, Filter, Search, ArrowUp, ArrowDown, Circle,
  CheckCircle, XCircle, Plus, Minus, X, Lock, Unlock, Heart, Share,
  MessageCircle, ThumbsUp, ThumbsDown, Download, Upload, RefreshCw,
  Bookmark, BookmarkCheck, CreditCard, Wallet, PieChart, LineChart,
  MapPin, Phone, Mail, Gift, Percent, Timer, Layers, Layers3, Maximize2,
  Thermometer, Wind, CloudRain, CircleDot, Home, Crosshair, Sparkles,
  Info, Award, Briefcase, Users, Building, Globe, Cpu, Database, 
  Server, Cloud, BarChart2, Headphones, Video, Camera, Mic, Edit, 
  Copy, Trash, Save, FileText, Image
} from 'lucide-react';

const MLBPredictionsApp = () => {
  // State Management
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
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
  const [nrfiData, setNrfiData] = useState(null);
  const [batterData, setBatterData] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const [parlayData, setParlayData] = useState(null);
  const [parlayLoading, setParlayLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [homerSortBy, setHomerSortBy] = useState('confidence');
  const [hitSortBy, setHitSortBy] = useState('confidence');
  const [predictionSortBy, setPredictionSortBy] = useState('confidence');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [viewMode, setViewMode] = useState('detail'); // 'list' or 'detail'
  const [parlayFilters, setParlayFilters] = useState({
    includeHomers: true,
    includeHits: true,
    includeNRFI: true,
    includeStrikeouts: true,
    includeMoneyline: true,
    riskLevel: 'all',
    minConfidence: 60
  });

  // Toggle card expansion
  const toggleCardExpansion = (cardId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('ET');
  const [bankroll, setBankroll] = useState(10000);
  const [riskTolerance, setRiskTolerance] = useState('moderate');
  const [favoriteTeams, setFavoriteTeams] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    highConfidence: true,
    hotBatters: true,
    weatherAlerts: true,
    lineMovement: true,
    injuries: true
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(true);
        setMobileMenuOpen(false);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        loadAllData();
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  // Load both prediction data files
  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try different paths to find the data files
      const paths = [
        '/data/latest.json',
        './data/latest.json',
        'data/latest.json',
        '/latest.json',
        './latest.json'
      ];

      const nrfiPaths = [
        '/data/NRFI.json',
        './data/NRFI.json',
        'data/NRFI.json',
        '/NRFI.json',
        './NRFI.json',
        '/data/NFRI.json',
        './data/NFRI.json',
        'data/NFRI.json',
        '/NFRI.json',
        './NFRI.json'
      ];

      let predictionsData = null;
      let nrfiDataResult = null;

      // Try to load predictions data from different paths
      for (const path of paths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            predictionsData = await response.json();
            console.log(`Successfully loaded predictions from ${path}`);
            break;
          }
        } catch (e) {
          console.log(`Failed to load from ${path}`);
        }
      }

      // Try to load NRFI data from different paths
      for (const path of nrfiPaths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            nrfiDataResult = await response.json();
            console.log(`Successfully loaded NRFI data from ${path}`);
            break;
          }
        } catch (e) {
          console.log(`Failed to load from ${path}`);
        }
      }

      // Set the data if found
      if (predictionsData) {
        setPredictionData(predictionsData);
      } else {
        console.error('Could not load predictions data from any path');
      }

      if (nrfiDataResult) {
        setNrfiData(nrfiDataResult);
      } else {
        console.error('Could not load NRFI data from any path');
      }

      // Try to load batter predictions data
      const batterPaths = [
        '/data/batter_predictions.json',
        './data/batter_predictions.json',
        'data/batter_predictions.json'
      ];

      let batterDataResult = null;
      for (const path of batterPaths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            batterDataResult = await response.json();
            console.log(`Successfully loaded batter data from ${path}`);
            break;
          }
        } catch (e) {
          console.log(`Failed to load batter data from ${path}`);
        }
      }

      if (batterDataResult) {
        setBatterData(batterDataResult);
      } else {
        console.log('Could not load batter predictions data - will use NRFI fallback');
      }

      // Try to load tracking dashboard data
      const trackingPaths = [
        '/data/analytics_dashboard.json',
        './data/analytics_dashboard.json',
        'data/analytics_dashboard.json'
      ];
      let trackingDataResult = null;
      for (const path of trackingPaths) {
        try {
          const response = await fetch(path);
          if (response.ok) {
            trackingDataResult = await response.json();
            console.log(`Successfully loaded tracking data from ${path}`);
            break;
          }
        } catch (e) {
          console.log(`Failed to load tracking data from ${path}`);
        }
      }
      if (trackingDataResult) {
        setTrackingData(trackingDataResult);
      } else {
        console.log('Could not load tracking data - dashboard will show placeholder');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Team logos mapping
  const teamLogos = {
    'TB': '⚡', 'NYY': '🗽', 'ATL': '🪓', 'CIN': '🔴',
    'TEX': '🤠', 'SEA': '⚓', 'LAD': '⭐', 'SF': '🌉',
    'BOS': '🧦', 'HOU': '🚀', 'CHC': '🐻', 'STL': '🐦',
    'MIA': '🐠', 'COL': '⛰️', 'PIT': '🏴‍☠️', 'CLE': '⚾',
    'NYM': '🍎', 'PHI': '🔔', 'WSN': '🦅', 'MIL': '🍺',
    'MIN': '🌾', 'KC': '👑', 'CHW': '⚫', 'DET': '🐅',
    'OAK': '🌲', 'LAA': '😇', 'ARI': '🐍', 'SD': '🌊',
    'TOR': '🍁', 'BAL': '🐦‍⬛', 'Athletics': '🌲', 'A': '🌲'
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

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone === 'ET' ? 'America/New_York' : 'America/Los_Angeles'
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    if (confidence >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const calculateKellyBet = (probability, odds, bankroll) => {
    const decimalOdds = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
    const q = 1 - probability;
    const p = probability;
    const b = decimalOdds - 1;
    const kelly = (b * p - q) / b;
    return Math.max(0, Math.min(kelly * bankroll * 0.25, bankroll * 0.05)); // Quarter Kelly with 5% max
  };

  const addToBetSlip = (game) => {
    const newBet = {
      id: game.game_info.game_id,
      game: `${game.game_info.away_team} @ ${game.game_info.home_team}`,
      pick: game.gpt_analysis.predicted_winner === 'away' ? game.game_info.away_team : game.game_info.home_team,
      odds: -110, // Default odds, replace with real odds
      stake: 0,
      potential: 0,
      confidence: game.system_metrics.overall_confidence,
      kellyBet: calculateKellyBet(game.gpt_analysis.win_probability, -110, bankroll)
    };
    setCurrentBets([...currentBets, newBet]);
    setBetSlipOpen(true);
    
    // Play sound if enabled
    if (soundEnabled) {
      playSound('add');
    }
  };

  const removeBet = (betId) => {
    setCurrentBets(currentBets.filter(bet => bet.id !== betId));
    if (soundEnabled) {
      playSound('remove');
    }
  };

  const playSound = (type) => {
    // Implement sound playing logic here
    console.log(`Playing ${type} sound`);
  };

  // Helper function for calculating payouts
  const calculatePayout = (stake, odds) => {
    if (odds > 0) {
      return stake * (odds / 100);
    } else {
      return stake * (100 / Math.abs(odds));
    }
  };

  // Filter and sort games
  const getFilteredGames = () => {
    if (!predictionData?.detailed_predictions) return [];
    
    let games = [...predictionData.detailed_predictions];
    
    // Apply filter
    switch (selectedFilter) {
      case 'bet':
        games = games.filter(g => 
          g.system_metrics.bet_recommendation === 'BET' || 
          g.system_metrics.bet_recommendation === 'STRONG BET'
        );
        break;
      case 'lean':
        games = games.filter(g => g.system_metrics.bet_recommendation === 'LEAN');
        break;
      case 'strong':
        games = games.filter(g => g.system_metrics.edge_strength === 'STRONG' || g.system_metrics.edge_strength === 'ELITE');
        break;
      case 'hot':
        games = games.filter(g => g.primary_edges.hot_batter_system.scorching_batters > 0);
        break;
    }
    
    // Apply search
    if (searchQuery) {
      games = games.filter(g => 
        g.game_info.away_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.game_info.home_team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.game_info.venue.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sort
    switch (predictionSortBy) {
      case 'confidence':
        games.sort((a, b) => b.system_metrics.overall_confidence - a.system_metrics.overall_confidence);
        break;
      case 'ev':
        games.sort((a, b) => b.system_metrics.expected_roi - a.system_metrics.expected_roi);
        break;
      case 'edge': {
        const edgeOrder = { 'ELITE': 4, 'STRONG': 3, 'MODERATE': 2, 'WEAK': 1 };
        games.sort((a, b) => (edgeOrder[b.system_metrics.edge_strength] || 0) - (edgeOrder[a.system_metrics.edge_strength] || 0));
        break;
      }
    }
    
    return games;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 mb-4 mx-auto relative">
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-4 border-4 border-pink-500 border-t-transparent rounded-full animate-spin animate-reverse"></div>
            <div className="absolute inset-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-xl mb-2">Loading MLB Predictions...</p>
          <p className="text-gray-400 text-sm animate-pulse">Analyzing {predictionData?.meta?.total_predictions || '...'} games</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-2">Error Loading Data</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              Retry Loading
            </button>
            <div className="text-sm text-gray-500">
              <p>Make sure your data files are in the correct location:</p>
              <code className="block mt-2 p-2 bg-gray-900 rounded text-gray-300">
                /public/data/latest.json<br/>
                /public/data/NRFI.json
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render functions for different sections
  const renderContent = () => {
    switch(selectedTab) {
      case 'dashboard':
        return renderDashboard();
      case 'predictions':
        return renderPredictions();
      case 'nrfi':
        return renderNRFI();
      case 'props':
        return renderProps();
      case 'homers':
        return renderHomers();
      case 'hits':
        return renderHitsPredictions();
      case 'parlays':
        return renderParlays();
      case 'tracking':
        return <TrackingComponent trackingData={trackingData} />;
      case 'live':
        return renderLiveGames();
      case 'analytics':
        return renderAnalytics();
      case 'weather':
        return renderWeatherEdge();
      case 'tools':
        return renderTools();
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="p-4 lg:p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome to MLB Elite</h2>
          <p className="text-gray-300 mb-4">System v{predictionData?.meta?.version || '6.0'} • {predictionData?.summary?.date || 'Today'}</p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-black/30 px-4 py-2 rounded-lg">
              <span className="text-gray-400 text-sm">Portfolio Value</span>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(portfolioValue)}</div>
            </div>
            <div className="bg-black/30 px-4 py-2 rounded-lg">
              <span className="text-gray-400 text-sm">Today's ROI</span>
              <div className="text-2xl font-bold text-yellow-400">+{((predictionData?.summary?.total_system_ev || 0) * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-black/30 px-4 py-2 rounded-lg">
              <span className="text-gray-400 text-sm">Active Bets</span>
              <div className="text-2xl font-bold text-blue-400">{currentBets.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {[
          {
            label: "System EV",
            value: `+${((predictionData?.summary?.total_system_ev || 0) * 100).toFixed(1)}%`,
            icon: TrendingUp,
            color: 'from-green-400 to-emerald-600',
            change: '+12.3%',
            trend: 'up',
            subtitle: `${formatCurrency(predictionData?.summary?.total_expected_profit || 0)} expected profit`
          },
          {
            label: "AI Confidence",
            value: `${predictionData?.summary?.average_gpt_confidence?.toFixed(1) || '0.0'}%`,
            icon: Target,
            color: 'from-blue-400 to-cyan-600',
            change: '+5.2%',
            trend: 'up',
            subtitle: 'GPT Analysis Average'
          },
          {
            label: "Hot Batters",
            value: predictionData?.summary?.total_scorching_batters || 0,
            icon: Flame,
            color: 'from-orange-400 to-red-600',
            change: `${((predictionData?.summary?.total_scorching_batters || 0) / (predictionData?.meta?.total_predictions || 1)).toFixed(1)} avg`,
            trend: 'neutral',
            subtitle: 'Scorching performers'
          },
          {
            label: "NRFI Plays",
            value: nrfiData?.betting_opportunities?.nrfi_bets?.length || 0,
            icon: Crosshair,
            color: 'from-purple-400 to-pink-600',
            change: `${nrfiData?.summary?.expected_value?.premium_plays || 0} premium`,
            trend: 'up',
            subtitle: 'First inning opportunities'
          }
        ].map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 hover:border-gray-600 transition-all group cursor-pointer p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3 lg:mb-4">
              <div className={`w-12 lg:w-14 h-12 lg:h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                <stat.icon className="w-6 lg:w-7 h-6 lg:h-7 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {stat.trend === 'up' ? (
                    <ArrowUp className="w-3 lg:w-4 h-3 lg:h-4 text-green-400" />
                  ) : stat.trend === 'down' ? (
                    <ArrowDown className="w-3 lg:w-4 h-3 lg:h-4 text-red-400" />
                  ) : (
                    <Minus className="w-3 lg:w-4 h-3 lg:h-4 text-gray-400" />
                  )}
                  <span className={`text-xs lg:text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-400' :
                    stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">vs yesterday</div>
              </div>
            </div>
            <div className="text-2xl lg:text-3xl font-bold mb-1 lg:mb-2 text-white">{stat.value}</div>
            <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
            <div className="text-gray-500 text-xs mt-1">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/20 p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Target className="w-6 h-6 text-purple-400" />
            <span>Today's Best Bets</span>
          </h3>
          <div className="space-y-3">
            {predictionData?.detailed_predictions?.slice(0, 3).map((game, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer" onClick={() => setSelectedGame(game)}>
                <div>
                  <span className="text-white font-medium">
                    {game.game_info.away_team} @ {game.game_info.home_team}
                  </span>
                  <div className="text-xs text-gray-400 mt-1">
                    {game.system_metrics.bet_recommendation} • {game.system_metrics.edge_strength}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${getConfidenceColor(game.system_metrics.overall_confidence)}`}>
                    {game.system_metrics.overall_confidence.toFixed(1)}%
                  </span>
                  <div className="text-xs text-gray-400">
                    EV: +{(game.system_metrics.expected_roi * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setSelectedTab('predictions')}
            className="mt-4 w-full py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded-lg text-sm font-medium transition-all"
          >
            View All Predictions
          </button>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl border border-blue-500/20 p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span>Premium Opportunities</span>
          </h3>
          <div className="space-y-3">
            {nrfiData?.betting_opportunities?.nrfi_bets?.slice(0, 3).map((bet, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors cursor-pointer">
                <div>
                  <span className="text-white font-medium">{bet.matchup}</span>
                  <div className="text-xs text-gray-400 mt-1">
                    {bet.strength} • {formatPercentage(bet.probability)} prob
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-yellow-400 font-bold">{bet.units} units</span>
                  <div className="text-xs text-gray-400">
                    EV: +{(bet.expected_value * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setSelectedTab('nrfi')}
            className="mt-4 w-full py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-sm font-medium transition-all"
          >
            View All NRFI Plays
          </button>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
          <LineChart className="w-6 h-6 text-green-400" />
          <span>System Performance</span>
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Performance chart visualization would go here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPredictions = () => {
    const filteredGames = getFilteredGames();
    
    return (
      <div className="p-4 lg:p-6">
        <div className="space-y-4 lg:space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-4 lg:mb-0">
              <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <CircleDot className="w-5 lg:w-6 h-5 lg:h-6 text-white" />
              </div>
              <span>Today's Predictions</span>
              <div className="bg-gradient-to-r from-cyan-400 to-blue-600 px-3 lg:px-4 py-1 lg:py-2 rounded-full text-xs lg:text-sm font-bold shadow-lg">
                SYSTEM v{predictionData?.meta?.version || '6.0'}
              </div>
            </h3>
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                <Filter className="w-4 h-4 text-gray-400" />
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-transparent text-white text-sm border-none outline-none"
                >
                  <option value="all">All Games</option>
                  <option value="bet">BET Only</option>
                  <option value="lean">LEAN Only</option>
                  <option value="strong">Strong Edge</option>
                  <option value="hot">Hot Batters</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg">
                <ArrowUp className="w-4 h-4 text-gray-400" />
                <select 
                  value={predictionSortBy}
                  onChange={(e) => setPredictionSortBy(e.target.value)}
                  className="bg-transparent text-white text-sm border-none outline-none"
                >
                  <option value="confidence">Confidence</option>
                  <option value="ev">Expected Value</option>
                  <option value="edge">Edge Strength</option>
                </select>
              </div>

              {/* View Toggle Button */}
              <button
                onClick={() => setViewMode(viewMode === 'detail' ? 'list' : 'detail')}
                className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <Layers3 className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">
                  {viewMode === 'detail' ? 'Less' : 'More'}
                </span>
              </button>

              <button
                onClick={() => loadAllData()}
                className="px-3 lg:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden lg:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Game Cards or List */}
          {viewMode === 'list' ? (
            /* Simple List View */
            <div className="space-y-3">
              {filteredGames.map((game) => (
                <div key={game.game_info.game_id} className="bg-gradient-to-r from-gray-900/90 to-gray-800/90 rounded-xl border border-gray-700 p-4 hover:border-purple-500/50 transition-colors">
                  <div className="flex items-center justify-between">
                    {/* Game Matchup */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-lg font-bold">
                        <span className="text-lg">{teamLogos[game.game_info.away_team] || '⚾'}</span>
                        <span className={`${game.gpt_analysis.predicted_winner === 'away' ? 'text-green-400' : 'text-gray-300'} transition-colors`}>
                          {game.game_info.away_team}
                        </span>
                        <span className="text-gray-500">@</span>
                        <span className="text-lg">{teamLogos[game.game_info.home_team] || '⚾'}</span>
                        <span className={`${game.gpt_analysis.predicted_winner === 'home' ? 'text-green-400' : 'text-gray-300'} transition-colors`}>
                          {game.game_info.home_team}
                        </span>
                      </div>
                      
                      {/* Predicted Winner Badge */}
                      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-3 py-1 rounded-full">
                        <span className="text-white text-sm font-bold">
                          {game.gpt_analysis.predicted_winner === 'away' ? game.game_info.away_team : game.game_info.home_team}
                        </span>
                      </div>
                    </div>

                    {/* Confidence & Edge */}
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-400">Confidence</div>
                        <div className={`text-lg font-bold ${getConfidenceColor(game.system_metrics.overall_confidence)}`}>
                          {game.system_metrics.overall_confidence.toFixed(1)}%
                        </div>
                      </div>
                      <div className={`w-12 h-8 bg-gradient-to-r ${getTierColor(game.system_metrics.edge_strength)} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-xs font-bold">{game.system_metrics.edge_strength}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Detailed Cards View */
            filteredGames.map((game, index) => (
            <div key={game.game_info.game_id} className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 group">
              {/* Game Header */}
              <div className="p-4 lg:p-6 border-b border-gray-700/50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center space-x-3 lg:space-x-4 mb-4 lg:mb-0">
                    {/* Edge Strength Badge */}
                    <div className={`w-16 lg:w-20 h-10 lg:h-12 bg-gradient-to-r ${getTierColor(game.system_metrics.edge_strength)} rounded-xl flex items-center justify-center shadow-xl relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                      <div className="flex items-center space-x-1 text-white relative z-10">
                        {getTierIcon(game.system_metrics.edge_strength)}
                        <span className="text-xs lg:text-sm font-bold">{game.system_metrics.edge_strength}</span>
                      </div>
                    </div>

                    {/* Game Teams */}
                    <div>
                      <div className="flex items-center space-x-2 lg:space-x-4 text-xl lg:text-3xl font-bold mb-1 lg:mb-2">
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <span className="text-lg lg:text-2xl">{teamLogos[game.game_info.away_team] || '⚾'}</span>
                          <span className={`${game.gpt_analysis.predicted_winner === 'away' ? 'text-green-400' : 'text-gray-300'} transition-colors`}>
                            {game.game_info.away_team}
                          </span>
                        </div>
                        <div className="text-gray-500 text-lg lg:text-xl">@</div>
                        <div className="flex items-center space-x-1 lg:space-x-2">
                          <span className="text-lg lg:text-2xl">{teamLogos[game.game_info.home_team] || '⚾'}</span>
                          <span className={`${game.gpt_analysis.predicted_winner === 'home' ? 'text-green-400' : 'text-gray-300'} transition-colors`}>
                            {game.game_info.home_team}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-xs lg:text-sm text-gray-400">
                        <span>{game.game_info.venue}</span>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 lg:w-4 h-3 lg:h-4" />
                          <span>{game.real_mlb_context?.series_context || 'Game'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confidence & Win Probability */}
                  <div className="text-right">
                    <div className="text-xs text-gray-400 mb-1">AI CONFIDENCE</div>
                    <div className={`text-3xl lg:text-4xl font-bold mb-1 ${getConfidenceColor(game.system_metrics.overall_confidence)}`}>
                      {game.system_metrics.overall_confidence.toFixed(1)}%
                    </div>
                    <div className="text-xs lg:text-sm text-gray-400">Win Prob: {(game.gpt_analysis.win_probability * 100).toFixed(1)}%</div>
                  </div>
                </div>

                {/* Weather Conditions */}
                {game.environmental?.weather_impact && (
                  <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-xl border border-blue-500/20">
                    <div className="flex flex-wrap items-center gap-2 lg:gap-4">
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <Thermometer className="w-4 lg:w-5 h-4 lg:h-5 text-blue-400" />
                        <span className="text-blue-400 font-medium text-sm lg:text-base">
                          {game.environmental.weather_impact.temperature || game.environmental.weather_impact.temp || 'N/A'}°F
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <Wind className="w-4 lg:w-5 h-4 lg:h-5 text-cyan-400" />
                        <span className="text-cyan-400 font-medium text-sm lg:text-base">{game.environmental.weather_impact.wind_speed || 0} mph</span>
                      </div>
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <CloudRain className="w-4 lg:w-5 h-4 lg:h-5 text-gray-400" />
                        <span className="text-gray-400 font-medium capitalize text-sm lg:text-base">{game.environmental.weather_impact.conditions || 'Unknown'}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        Humidity: {game.environmental.weather_impact.humidity || 0}%
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Advantages Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4 mt-4 lg:mt-6">
                  {/* Hot Batters */}
                  <div className="bg-gray-800/30 rounded-xl p-3 lg:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Flame className="w-4 lg:w-5 h-4 lg:h-5 text-orange-400" />
                      <span className="text-gray-400 text-xs lg:text-sm font-bold">Hot Batters</span>
                    </div>
                    <div className="text-white font-bold text-sm lg:text-base">{game.primary_edges.hot_batter_system.scorching_batters} Scorching</div>
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">{game.primary_edges.hot_batter_system.advantage}</div>
                  </div>

                  {/* Pitcher Quality */}
                  <div className="bg-gray-800/30 rounded-xl p-3 lg:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 lg:w-5 h-4 lg:h-5 text-green-400" />
                      <span className="text-gray-400 text-xs lg:text-sm font-bold">Pitching Edge</span>
                    </div>
                    <div className="text-white font-bold text-sm lg:text-base">
                      H: {game.primary_edges.pitcher_quality.home_quality} | A: {game.primary_edges.pitcher_quality.away_quality}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">{game.primary_edges.pitcher_quality.advantage}</div>
                  </div>

                  {/* Recent Form */}
                  <div className="bg-gray-800/30 rounded-xl p-3 lg:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-4 lg:w-5 h-4 lg:h-5 text-blue-400" />
                      <span className="text-gray-400 text-xs lg:text-sm font-bold">Recent Form</span>
                    </div>
                    <div className="text-white font-bold text-xs lg:text-sm">{game.real_mlb_context?.recent_form_advantage?.split(':')[0] || 'N/A'}</div>
                    <div className="text-xs text-gray-400 mt-1">{game.real_mlb_context?.recent_form_advantage?.split(':')[1] || ''}</div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="mt-4 lg:mt-6 p-3 lg:p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-2 lg:mb-3">
                    <Eye className="w-4 lg:w-5 h-4 lg:h-5 text-purple-400" />
                    <span className="font-bold text-purple-400 text-sm lg:text-base">AI Analysis</span>
                    <div className="bg-purple-500/20 px-2 py-1 rounded text-xs font-bold text-purple-300">
                      {game.gpt_analysis.confidence}% Confidence
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs lg:text-sm leading-relaxed mb-3 line-clamp-4 lg:line-clamp-none">{game.gpt_analysis.reasoning}</p>

                  {/* Key Factors */}
                  <div className="space-y-1">
                    {game.gpt_analysis.key_factors?.slice(0, 3).map((factor, i) => (
                      <div key={i} className="flex items-start space-x-2 text-xs">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="text-gray-300 line-clamp-2 lg:line-clamp-none">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Market Inefficiencies */}
                {game.gpt_analysis.market_inefficiencies && (
                  <div className="mt-4 lg:mt-6">
                    <div className="text-xs lg:text-sm font-bold text-yellow-400 mb-2 flex items-center space-x-2">
                      <AlertTriangle className="w-3 lg:w-4 h-3 lg:h-4" />
                      <span>Market Inefficiencies</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {game.gpt_analysis.market_inefficiencies.map((inefficiency, index) => (
                        <div
                          key={index}
                          className="px-2 lg:px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-xs text-yellow-300"
                        >
                          {inefficiency}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className={`p-4 lg:p-6 bg-gradient-to-r ${getRecommendationColor(game.system_metrics.bet_recommendation)}`}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center space-x-3 lg:space-x-4 mb-4 lg:mb-0">
                    <div className="flex items-center space-x-3">
                      {game.system_metrics.bet_recommendation === 'PASS' ? (
                        <XCircle className="w-6 lg:w-8 h-6 lg:h-8 text-gray-400" />
                      ) : (
                        <CheckCircle className="w-6 lg:w-8 h-6 lg:h-8 text-green-400" />
                      )}
                      <div>
                        <div className={`font-bold text-lg lg:text-xl ${
                          game.system_metrics.bet_recommendation === 'PASS' ? 'text-gray-400' : 'text-green-400'
                        }`}>
                          {game.system_metrics.bet_recommendation} RECOMMENDATION
                        </div>
                        <div className="text-xs lg:text-sm text-gray-400">
                          Pick: <span className="text-white font-bold">
                            {game.gpt_analysis.predicted_winner === 'away'
                              ? `${game.game_info.away_team} (Away)`
                              : `${game.game_info.home_team} (Home)`}
                          </span> • EV: +{(game.system_metrics.expected_roi * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between lg:justify-end space-x-2 lg:space-x-3">
                    <div className="text-right mr-2 lg:mr-4">
                      <div className="text-xl lg:text-2xl font-bold text-green-400">+{formatCurrency(game.system_metrics.max_bet_amount * game.system_metrics.expected_roi)}</div>
                      <div className="text-xs lg:text-sm text-gray-400">Max Expected Profit</div>
                    </div>
                    {game.system_metrics.bet_recommendation !== 'PASS' && (
                      <button
                        onClick={() => addToBetSlip(game)}
                        className="px-4 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm lg:text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all flex items-center space-x-2 group"
                      >
                        <Wallet className="w-4 lg:w-5 h-4 lg:h-5" />
                        <span className="hidden sm:inline">ADD TO SLIP</span>
                        <ChevronRight className="w-4 lg:w-5 h-4 lg:h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedGame(game)}
                      className="px-3 lg:px-6 py-3 lg:py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors flex items-center space-x-2"
                    >
                      <Eye className="w-4 lg:w-5 h-4 lg:h-5" />
                      <span className="hidden sm:inline">DETAILS</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )))}

          {filteredGames.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <CircleDot className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">No predictions match your criteria</p>
              <p className="text-sm mt-2">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderNRFI = () => (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Crosshair className="w-6 h-6 text-white" />
          </div>
          <span>NRFI Opportunities</span>
        </h3>
        <p className="text-gray-400">No Run First Inning bets with enhanced analysis</p>
      </div>

      {nrfiData?.betting_opportunities?.nrfi_bets?.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {nrfiData.betting_opportunities.nrfi_bets.map((bet, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-purple-500/50 transition-all">
              <div className="p-4 lg:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-white">{bet.matchup}</h4>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    bet.confidence >= 90 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    bet.confidence >= 80 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {bet.confidence}% CONF
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Probability</div>
                    <div className="text-2xl font-bold text-purple-400">{bet.probability.toFixed(1)}%</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Expected Value</div>
                    <div className="text-2xl font-bold text-green-400">+{(bet.expected_value * 100).toFixed(1)}%</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-bold text-yellow-400 mb-2">{bet.strength}</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{bet.reasoning}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Recommended: <span className="text-white font-bold">{bet.units} units</span>
                  </div>
                  <button 
                    onClick={() => {
                      // Add NRFI bet logic
                      playSound('add');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                  >
                    ADD TO SLIP
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Crosshair className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No NRFI opportunities available</p>
          <p className="text-sm mt-2">Check back later for updates</p>
        </div>
      )}
    </div>
  );

  const renderProps = () => (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <span>Strikeout Props</span>
        </h3>
        <p className="text-gray-400">AI-powered strikeout predictions with edge analysis</p>
      </div>

      {nrfiData?.betting_opportunities?.strikeout_props?.length > 0 ? (
        <div className="space-y-4">
          {nrfiData.betting_opportunities.strikeout_props.map((prop, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 lg:p-6 hover:border-blue-500/50 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">{prop.pitcher}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{prop.direction} {prop.line}</span>
                    <span>Prediction: {prop.prediction}</span>
                  </div>
                </div>
                <div className="mt-3 lg:mt-0 flex items-center space-x-3">
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    prop.confidence >= 90 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    prop.confidence >= 80 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {prop.confidence}% CONF
                  </div>
                  <div className="text-lg font-bold text-yellow-400">{prop.conviction}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Edge</div>
                  <div className="text-lg font-bold text-blue-400">{prop.edge}</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">EV</div>
                  <div className="text-lg font-bold text-green-400">+{(prop.expected_value * 100).toFixed(1)}%</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-400 mb-1">Units</div>
                  <div className="text-lg font-bold text-white">{prop.units}</div>
                </div>
              </div>

              <div className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-3">{prop.reasoning}</div>

              <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                BET {prop.direction} {prop.line}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No strikeout props available</p>
          <p className="text-sm mt-2">Check back when games are posted</p>
        </div>
      )}
    </div>
  );

  const renderHomers = () => (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-2 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <span>Homer Predictions</span>
        </h3>
        <p className="text-gray-400">AI-powered home run and RBI predictions</p>
      </div>

      {(batterData?.homer_predictions?.length > 0 || nrfiData?.homer_predictions?.length > 0) ? (
        <>
          {/* Homer Props Sorting Buttons */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-400 mr-4">Sort by:</div>
              {[
                { key: 'confidence', label: 'Confidence' },
                { key: 'season_hrs', label: 'Season Power' },
                { key: 'recent_hrs', label: 'Hot Streak' },
                { key: 'vs_pitcher_ops', label: 'vs Pitcher' },
                { key: 'ops', label: 'Season OPS' }
              ].map((sort) => (
                <button
                  key={sort.key}
                  onClick={() => setHomerSortBy(sort.key)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    homerSortBy === sort.key 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              Top {Math.min(15, (batterData?.homer_predictions || nrfiData?.homer_predictions || []).length)} picks
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(batterData?.homer_predictions || nrfiData?.homer_predictions || [])
              .sort((a, b) => {
                switch (homerSortBy) {
                  case 'confidence':
                    return (b.confidence || 0) - (a.confidence || 0);
                  case 'season_hrs':
                    return (b.stats?.season_hrs || 0) - (a.stats?.season_hrs || 0);
                  case 'recent_hrs':
                    return (b.stats?.recent_hrs || 0) - (a.stats?.recent_hrs || 0);
                  case 'vs_pitcher_ops':
                    return (b.pitcher_matchup?.adjusted_ops || 0) - (a.pitcher_matchup?.adjusted_ops || 0);
                  case 'ops':
                    return (b.stats?.ops || 0) - (a.stats?.ops || 0);
                  default:
                    return (b.confidence || 0) - (a.confidence || 0);
                }
              })
              .slice(0, 15)
              .map((player, index) => {
                const cardId = `homer-${index}`;
                const isExpanded = expandedCards.has(cardId);
                return (
            <div key={index} className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 hover:border-orange-500/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-white">{player.player}</h4>
                  <div className="text-sm text-gray-400">{player.team}</div>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-500/20">
                  <span className="text-2xl">⚡</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400">Confidence</div>
                  <div className="text-lg font-bold text-orange-400">{player.confidence?.toFixed(1) || '0.0'}%</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400">Recent HRs</div>
                  <div className="text-lg font-bold text-yellow-400">{player.stats?.recent_hrs || player.recent_hrs || 0}</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Confidence</span>
                  <span className="font-bold text-white">{player.confidence?.toFixed(1) || '0.0'}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-400 to-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(player.confidence || 0, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3 text-sm text-gray-300">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Analysis:</span>
                  <div className="flex items-center space-x-2">
                    {player.gpt_enhanced && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">GPT Enhanced</span>}
                    <button 
                      onClick={() => toggleCardExpansion(cardId)}
                      className="text-orange-400 hover:text-orange-300 transition-colors"
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </button>
                  </div>
                </div>
                <div className={isExpanded ? '' : 'line-clamp-2'}>
                  {player.reasoning || 'AI analysis based on recent performance'}
                </div>
                {player.pitcher_matchup && (
                  <div className="text-xs text-blue-400 mt-1">vs {player.pitcher_matchup.pitcher} ({player.pitcher_matchup.hand}HP)</div>
                )}
              </div>

              <button className="w-full py-2 rounded-lg font-bold transition-all bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-lg hover:shadow-orange-500/25">
                HOMER PICK
              </button>
            </div>
                );
              })}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <Rocket className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No homer predictions available</p>
          <p className="text-sm mt-2">Check back when lineups are posted</p>
        </div>
      )}
    </div>
  );

  const renderHitsPredictions = () => (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span>Hit Predictions</span>
        </h3>
        <p className="text-gray-400">AI-powered hitting predictions and hot batter analysis</p>
      </div>

      {batterData?.hits_predictions?.length > 0 ? (
        <>
          {/* Hit Props Sorting Buttons */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-400 mr-4">Sort by:</div>
              {[
                { key: 'confidence', label: 'Confidence' },
                { key: 'avg', label: 'Batting Avg' },
                { key: 'vs_pitcher_avg', label: 'vs Pitcher' },
                { key: 'recent_hits', label: 'Hot Form' },
                { key: 'obp', label: 'On Base %' }
              ].map((sort) => (
                <button
                  key={sort.key}
                  onClick={() => setHitSortBy(sort.key)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    hitSortBy === sort.key 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-400">
              Top {Math.min(12, batterData.hits_predictions.length)} picks
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {batterData.hits_predictions
              .sort((a, b) => {
                switch (hitSortBy) {
                  case 'confidence':
                    return (b.confidence || 0) - (a.confidence || 0);
                  case 'avg':
                    return (b.stats?.avg || 0) - (a.stats?.avg || 0);
                  case 'vs_pitcher_avg':
                    return (b.pitcher_matchup?.adjusted_avg || 0) - (a.pitcher_matchup?.adjusted_avg || 0);
                  case 'recent_hits':
                    return (b.stats?.recent_hits || 0) - (a.stats?.recent_hits || 0);
                  case 'obp':
                    return (b.stats?.obp || 0) - (a.stats?.obp || 0);
                  default:
                    return (b.confidence || 0) - (a.confidence || 0);
                }
              })
              .slice(0, 12)
              .map((player, index) => {
                const cardId = `hit-${index}`;
                const isExpanded = expandedCards.has(cardId);
                return (
            <div key={index} className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-white">{player.player}</h4>
                  <div className="text-sm text-gray-400">{player.team}</div>
                </div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-500/20">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400">Confidence</div>
                  <div className="text-lg font-bold text-blue-400">{player.confidence?.toFixed(1) || '0.0'}%</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-400">Avg</div>
                  <div className="text-lg font-bold text-green-400">{(player.stats?.avg || 0).toFixed(3)}</div>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Hit Probability</span>
                  <span className="font-bold text-white">{player.confidence?.toFixed(1) || '0.0'}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(player.confidence || 0, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3 text-sm text-gray-300">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Analysis:</span>
                  <div className="flex items-center space-x-2">
                    {player.gpt_enhanced && <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">GPT Enhanced</span>}
                    <button 
                      onClick={() => toggleCardExpansion(cardId)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {isExpanded ? 'Less' : 'More'}
                    </button>
                  </div>
                </div>
                <div className={isExpanded ? '' : 'line-clamp-2'}>
                  {player.reasoning || 'Hot batter analysis based on recent performance'}
                </div>
                {player.pitcher_matchup && (
                  <div className="text-xs text-blue-400 mt-1">vs {player.pitcher_matchup.pitcher} ({player.pitcher_matchup.hand}HP)</div>
                )}
              </div>

              <button className="w-full py-2 rounded-lg font-bold transition-all bg-gradient-to-r from-blue-600 to-green-600 hover:shadow-lg hover:shadow-blue-500/25">
                HIT PICK
              </button>
            </div>
                );
              })}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hit predictions available</p>
          <p className="text-sm mt-2">Check back when lineups are posted</p>
        </div>
      )}
    </div>
  );

  const renderLiveGames = () => (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span>Live Games</span>
          <div className="bg-red-500/20 px-3 py-1 rounded-full text-sm font-bold text-red-400 border border-red-500/30">
            LIVE
          </div>
        </h3>
        <p className="text-gray-400">Real-time game tracking and live betting opportunities</p>
      </div>

      <div className="text-center py-12 text-gray-400">
        <Activity className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-xl">No live games at the moment</p>
        <p className="text-sm mt-2">Games will appear here when they start</p>
      </div>
    </div>
  );

  const renderParlays = () => {
    const generateParlay = async (numLegs, preferences = "") => {
      setParlayLoading(true);
      
      // Debug: Log what data we're sending
      console.log('Debug - Sending data:', {
        nrfiData: nrfiData,
        batterData: batterData,
        predictionData: predictionData
      });
      
      try {
        const response = await fetch('/api/parlay/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            num_legs: numLegs,
            min_confidence: parlayFilters.minConfidence,
            preferences: preferences,
            filters: parlayFilters,
            prediction_data: {
              nrfi_data: nrfiData,
              batter_data: batterData,
              prediction_data: predictionData
            }
          }),
        });
        
        const result = await response.json();
        setParlayData(result);
      } catch (error) {
        console.error('Error generating parlay:', error);
        setParlayData({ 
          success: false, 
          error: 'Failed to generate parlay. Make sure the parlay API is running.' 
        });
      } finally {
        setParlayLoading(false);
      }
    };

    return (
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Layers3 className="w-6 h-6 text-white" />
            </div>
            <span>Parlay Builder</span>
          </h3>
          <p className="text-gray-400">AI-generated smart parlay combinations using high-confidence picks</p>
        </div>

        {/* Parlay Generation Controls */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-6">
          <h4 className="text-lg font-bold mb-4">Generate Smart Parlays</h4>
          
          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg">
            <h5 className="font-bold mb-3">Parlay Filters</h5>
            
            {/* Pick Type Filters */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
              {[
                { key: 'includeHomers', label: '🏠 Homers', color: 'orange' },
                { key: 'includeHits', label: '⚾ Hits', color: 'blue' },
                { key: 'includeNRFI', label: '🚫 NRFI', color: 'red' },
                { key: 'includeStrikeouts', label: '🔥 Strikeouts', color: 'purple' },
                { key: 'includeMoneyline', label: '💰 Moneyline', color: 'green' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setParlayFilters(prev => ({ ...prev, [filter.key]: !prev[filter.key] }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    parlayFilters[filter.key]
                      ? filter.color === 'orange' ? 'bg-orange-500 text-white' :
                        filter.color === 'blue' ? 'bg-blue-500 text-white' :
                        filter.color === 'red' ? 'bg-red-500 text-white' :
                        filter.color === 'purple' ? 'bg-purple-500 text-white' :
                        filter.color === 'green' ? 'bg-green-500 text-white' :
                        'bg-gray-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            {/* Risk Level & Confidence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Risk Level</label>
                <select
                  value={parlayFilters.riskLevel}
                  onChange={(e) => setParlayFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg border border-gray-600"
                >
                  <option value="all">All Risk Levels</option>
                  <option value="safe">Safe (80%+ confidence)</option>
                  <option value="medium">Medium (65-79% confidence)</option>
                  <option value="risky">Risky (&lt;65% confidence)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Min Confidence: {parlayFilters.minConfidence}%</label>
                <input
                  type="range"
                  min="30"
                  max="95"
                  step="5"
                  value={parlayFilters.minConfidence}
                  onChange={(e) => setParlayFilters(prev => ({ ...prev, minConfidence: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>30%</span>
                  <span>50%</span>
                  <span>70%</span>
                  <span>95%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
            {[2, 3, 4, 5, 'GPT Decides'].map((legs) => (
              <button
                key={legs}
                onClick={() => generateParlay(legs === 'GPT Decides' ? null : legs)}
                disabled={parlayLoading}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {parlayLoading ? '...' : `${legs} ${legs === 'GPT Decides' ? '' : 'Leg'}`}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-400 bg-gray-800/50 rounded-lg p-3">
            💡 <strong>No BS Mode:</strong> AI creates diverse, intelligent parlays using your filters. 
            Memory system prevents duplicate suggestions. LFG! 🚀
          </div>
        </div>

        {/* Parlay Results */}
        {parlayData && (
          <div className="space-y-6">
            {parlayData.success ? (
              <>
                {/* Available Picks Summary */}
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h5 className="font-bold mb-2">Available High-Confidence Picks: {parlayData.available_picks?.length || 0}</h5>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm">
                    {parlayData.available_picks?.slice(0, 6).map((pick, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-700/50 rounded">
                        <span>{pick.pick}</span>
                        <span className="text-green-400">{pick.confidence}%</span>
                      </div>
                    ))}
                    {parlayData.available_picks?.length > 6 && (
                      <div className="text-gray-400 text-center col-span-2">
                        +{parlayData.available_picks.length - 6} more picks...
                      </div>
                    )}
                  </div>
                </div>

                {/* Generated Parlays */}
                {parlayData.parlay_recommendations?.parlays ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {parlayData.parlay_recommendations.parlays.map((parlay, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-xl font-bold">{parlay.name || `Parlay ${index + 1}`}</h5>
                          <div className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">
                            {parlay.calculated_odds || parlay.estimated_odds}
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          {parlay.selected_pick_details?.map((pick, pickIndex) => (
                            <div key={pickIndex} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                              <div>
                                <div className="font-medium">{pick.pick}</div>
                                <div className="text-sm text-gray-400">{pick.game}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-400 font-bold">{pick.confidence}%</div>
                                <div className="text-sm text-gray-400">{pick.odds > 0 ? '+' : ''}{pick.odds}</div>
                              </div>
                            </div>
                          )) || parlay.picks?.map((pick, pickIndex) => (
                            <div key={pickIndex} className="p-3 bg-gray-800/50 rounded-lg">
                              <div className="font-medium">{pick}</div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Risk Level:</span>
                            <span className={`font-bold ${
                              parlay.risk_level === 'low' ? 'text-green-400' :
                              parlay.risk_level === 'medium' ? 'text-yellow-400' : 'text-red-400'
                            }`}>{parlay.risk_level?.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Confidence Score:</span>
                            <span className="text-blue-400 font-bold">{parlay.confidence_score}%</span>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                          <div className="text-sm text-gray-300">{parlay.reasoning}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                    <div className="text-gray-300 mb-2">
                      {parlayData.parlay_recommendations?.raw_response || 'No parlays generated'}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 text-center">
                <div className="text-red-400 font-bold mb-2">Error Generating Parlays</div>
                <div className="text-gray-300">{parlayData.error || parlayData.message}</div>
                {parlayData.picks_available && (
                  <div className="mt-3 text-sm text-gray-400">
                    Available picks: {parlayData.picks_available.length}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!parlayData && !parlayLoading && (
          <div className="bg-gray-800/50 rounded-xl p-8 text-center">
            <Layers3 className="w-16 h-16 mx-auto mb-4 text-gray-500" />
            <h4 className="text-xl font-bold mb-2">Ready to Build Smart Parlays</h4>
            <p className="text-gray-400">Click a button above to generate AI-powered parlay combinations using today's high-confidence picks.</p>
          </div>
        )}
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <span>System Analytics</span>
        </h3>
        <p className="text-gray-400">Performance metrics and historical analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h4 className="text-lg font-bold mb-4">Win Rate Trend</h4>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <LineChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </div>

        {/* ROI Distribution */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h4 className="text-lg font-bold mb-4">ROI Distribution</h4>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400">68.4%</div>
            <div className="text-sm text-gray-400">Overall Win Rate</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400">+24.7%</div>
            <div className="text-sm text-gray-400">Total ROI</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400">342</div>
            <div className="text-sm text-gray-400">Total Bets</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-2xl font-bold text-purple-400">$8,420</div>
            <div className="text-sm text-gray-400">Net Profit</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWeatherEdge = () => (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <CloudRain className="w-6 h-6 text-white" />
          </div>
          <span>Weather Edge</span>
        </h3>
        <p className="text-gray-400">Weather-based betting advantages</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {predictionData?.detailed_predictions?.filter(game => game.environmental?.weather_impact).map((game, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
            <h4 className="text-lg font-bold mb-4">{game.game_info.away_team} @ {game.game_info.home_team}</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Thermometer className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Temperature</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {game.environmental.weather_impact.temperature || game.environmental.weather_impact.temp || 'N/A'}°F
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs text-gray-400">Wind Speed</span>
                </div>
                <div className="text-xl font-bold text-white">{game.environmental.weather_impact.wind_speed || 0} mph</div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="text-sm text-blue-400 font-medium mb-1">Weather Impact</div>
              <div className="text-xs text-gray-300">
                {game.environmental.weather_impact.conditions} • Humidity: {game.environmental.weather_impact.humidity}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTools = () => (
    <div className="p-4 lg:p-6">
      <div className="mb-6">
        <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <span>Betting Tools</span>
        </h3>
        <p className="text-gray-400">Advanced tools and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bankroll Management */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-green-400" />
            <span>Bankroll Management</span>
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Current Bankroll</label>
              <input
                type="number"
                value={bankroll}
                onChange={(e) => setBankroll(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400">Risk Tolerance</label>
              <select
                value={riskTolerance}
                onChange={(e) => setRiskTolerance(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="conservative">Conservative (1-2%)</option>
                <option value="moderate">Moderate (3-5%)</option>
                <option value="aggressive">Aggressive (6-10%)</option>
              </select>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <div className="text-sm text-purple-400 font-medium">Kelly Criterion</div>
              <div className="text-xs text-gray-300 mt-1">
                Optimal bet sizing based on edge and bankroll
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-yellow-400" />
            <span>Alert Settings</span>
          </h4>
          
          <div className="space-y-3">
            {Object.entries(alertSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <button
                  onClick={() => setAlertSettings({ ...alertSettings, [key]: !value })}
                  className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                    value ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <span className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="text-sm text-gray-400">Auto-Refresh Interval</label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
              className="w-full mt-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value={60000}>1 minute</option>
              <option value={300000}>5 minutes</option>
              <option value={600000}>10 minutes</option>
              <option value={1800000}>30 minutes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Main App Render
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Sidebar - Desktop */}
        <div className={`hidden lg:flex ${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 flex-col`}>
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                <CircleDot className="w-7 h-7 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    MLB ELITE
                  </h1>
                  <p className="text-xs text-gray-400 font-medium tracking-wider">
                    PREDICTIONS v{predictionData?.meta?.version || '6.0'}
                  </p>
                </div>
              )}
            </div>
            {sidebarOpen && predictionData && (
              <div className="mt-4">
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
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard', badge: null },
              { id: 'predictions', icon: Target, label: 'Today\'s Picks', badge: predictionData?.meta?.total_predictions },
              { id: 'nrfi', icon: Crosshair, label: 'NRFI Bets', badge: nrfiData?.betting_opportunities?.nrfi_bets?.length || 0 },
              { id: 'props', icon: Sparkles, label: 'Strikeout Props', badge: nrfiData?.betting_opportunities?.strikeout_props?.length || 0 },
              { id: 'homers', icon: Rocket, label: 'Homer Picks', badge: (batterData?.homer_predictions?.length || nrfiData?.homer_predictions?.length || 0) },
              { id: 'hits', icon: TrendingUp, label: 'Hit Picks', badge: batterData?.hits_predictions?.length || 0 },
              { id: 'parlays', icon: Layers3, label: 'Parlay Builder', badge: null },
              { id: 'tracking', icon: Trophy, label: 'Performance', badge: null },
              { id: 'live', icon: Activity, label: 'Live Games', badge: notifications },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics', badge: null },
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
                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`ml-auto px-2 py-1 rounded-full text-xs font-bold ${
                        typeof item.badge === 'number' && item.badge > 0
                          ? 'bg-red-500 text-white'
                          : item.badge === 'HOT'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-600 text-gray-300'
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
                  <p className="text-xs text-gray-400">System: {predictionData?.meta?.system_name || 'MLB System'}</p>
                </div>
                <Settings className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          )}
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gray-900/95 backdrop-blur-xl">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none bg-gray-800"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              
              {/* Mobile Logo */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <CircleDot className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      MLB ELITE
                    </h1>
                    <p className="text-xs text-gray-400 font-medium tracking-wider">
                      PREDICTIONS v{predictionData?.meta?.version || '6.0'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {[
                  { id: 'dashboard', icon: BarChart3, label: 'Dashboard', badge: null },
                  { id: 'predictions', icon: Target, label: 'Today\'s Picks', badge: predictionData?.meta?.total_predictions },
                  { id: 'nrfi', icon: Crosshair, label: 'NRFI Bets', badge: nrfiData?.betting_opportunities?.nrfi_bets?.length || 0 },
                  { id: 'props', icon: Sparkles, label: 'Strikeout Props', badge: nrfiData?.betting_opportunities?.strikeout_props?.length || 0 },
                  { id: 'homers', icon: Rocket, label: 'Homer Picks', badge: (batterData?.homer_predictions?.length || nrfiData?.homer_predictions?.length || 0) },
                  { id: 'hits', icon: TrendingUp, label: 'Hit Picks', badge: batterData?.hits_predictions?.length || 0 },
                  { id: 'parlays', icon: Layers3, label: 'Parlay Builder', badge: null },
                  { id: 'tracking', icon: Trophy, label: 'Performance', badge: null },
                  { id: 'live', icon: Activity, label: 'Live Games', badge: notifications },
                  { id: 'analytics', icon: TrendingUp, label: 'Analytics', badge: null },
                  { id: 'weather', icon: CloudRain, label: 'Weather Edge', badge: null },
                  { id: 'tools', icon: Settings, label: 'Tools', badge: null }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                      selectedTab === item.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className={`ml-auto px-2 py-1 rounded-full text-xs font-bold ${
                        typeof item.badge === 'number' && item.badge > 0
                          ? 'bg-red-500 text-white'
                          : item.badge === 'HOT'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-600 text-gray-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:block p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="ml-12 lg:ml-0">
                  <h2 className="text-xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    MLB Elite Predictions
                  </h2>
                  <p className="text-gray-400 flex flex-wrap items-center gap-2 lg:gap-4 text-xs lg:text-base">
                    <span>{predictionData?.summary?.date || 'Today'}</span>
                    <span className="hidden sm:flex items-center space-x-1">
                      <Clock className="w-3 lg:w-4 h-3 lg:h-4" />
                      <span>System v{predictionData?.meta?.version || '6.0'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Target className="w-3 lg:w-4 h-3 lg:h-4" />
                      <span>{predictionData?.meta?.total_predictions || predictionData?.detailed_predictions?.length || 0} Games</span>
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 lg:space-x-4">
                {/* System Status */}
                <div className="hidden md:flex items-center space-x-2 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold text-sm">SYSTEM ACTIVE</span>
                </div>

                {/* Quick Stats */}
                <div className="hidden lg:flex items-center space-x-4 bg-gray-800/50 px-4 py-2 rounded-xl">
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">+{formatCurrency(predictionData?.summary?.total_expected_profit || 0)}</div>
                    <div className="text-xs text-gray-400">Expected $</div>
                  </div>
                  <div className="w-px h-8 bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-yellow-400 font-bold text-lg">{predictionData?.summary?.average_gpt_confidence?.toFixed(1) || '0.0'}%</div>
                    <div className="text-xs text-gray-400">Avg Confidence</div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`p-2 rounded-lg transition-colors ${
                      autoRefresh ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                  >
                    <RefreshCw className={`w-5 h-5 ${autoRefresh ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>

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

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto">
            {renderContent()}
          </main>

          {/* Scrolling Ticker */}
          <div className="bg-gray-900/95 backdrop-blur-xl border-t border-gray-800 py-2 overflow-hidden">
            <div className="flex animate-[scroll_30s_linear_infinite]">
              <div className="flex items-center space-x-8 px-4 whitespace-nowrap">
                {/* Ticker Items */}
                {predictionData && (
                  <>
                    <span className="text-sm text-gray-400">
                      <span className="text-green-400 font-bold">SYSTEM EV:</span> +{(predictionData.summary.total_system_ev * 100).toFixed(1)}%
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-400">
                      <span className="text-yellow-400 font-bold">HOT BATTERS:</span> {predictionData.summary.total_scorching_batters}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-400">
                      <span className="text-blue-400 font-bold">AVG CONFIDENCE:</span> {predictionData.summary.average_overall_confidence.toFixed(1)}%
                    </span>
                    <span className="text-gray-400">•</span>
                  </>
                )}
                {nrfiData && (
                  <>
                    <span className="text-sm text-gray-400">
                      <span className="text-purple-400 font-bold">NRFI PLAYS:</span> {nrfiData.betting_opportunities?.nrfi_bets?.length || 0}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-400">
                      <span className="text-orange-400 font-bold">HOMER PICKS:</span> {(batterData?.homer_predictions?.length || nrfiData?.homer_predictions?.length || 0)}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-400">
                      <span className="text-blue-400 font-bold">HIT PICKS:</span> {batterData?.hits_predictions?.length || 0}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-400">
                      <span className="text-cyan-400 font-bold">STRIKEOUT PROPS:</span> {nrfiData.betting_opportunities?.strikeout_props?.length || 0}
                    </span>
                    <span className="text-gray-400">•</span>
                  </>
                )}
                {/* Repeat for continuous scroll */}
                {predictionData && (
                  <>
                    <span className="text-sm text-gray-400">
                      <span className="text-green-400 font-bold">SYSTEM EV:</span> +{(predictionData.summary.total_system_ev * 100).toFixed(1)}%
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-400">
                      <span className="text-yellow-400 font-bold">HOT BATTERS:</span> {predictionData.summary.total_scorching_batters}
                    </span>
                    <span className="text-gray-400">•</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bet Slip Modal */}
        {betSlipOpen && (
          <div className="fixed top-16 lg:top-20 right-4 lg:right-6 w-80 max-w-[calc(100vw-2rem)] bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl z-50">
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
            <div className="p-4 max-h-[60vh] overflow-y-auto">
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
                          onClick={() => removeBet(bet.id)}
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
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="number"
                          placeholder="Stake ($)"
                          className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                          onChange={(e) => {
                            const newBets = [...currentBets];
                            newBets[index].stake = parseFloat(e.target.value) || 0;
                            newBets[index].potential = calculatePayout(newBets[index].stake, newBets[index].odds);
                            setCurrentBets(newBets);
                          }}
                        />
                        <button
                          onClick={() => {
                            const newBets = [...currentBets];
                            newBets[index].stake = bet.kellyBet;
                            newBets[index].potential = calculatePayout(bet.kellyBet, bet.odds);
                            setCurrentBets(newBets);
                          }}
                          className="px-2 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 rounded text-xs font-medium"
                          title="Use Kelly Criterion"
                        >
                          Kelly
                        </button>
                      </div>
                      {bet.stake > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Potential:</span>
                          <span className="text-green-400 font-bold">{formatCurrency(bet.potential)}</span>
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
              <div className="p-4 lg:p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl lg:text-2xl font-bold">Detailed Game Analysis</h2>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-4 lg:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  {/* Left Column - Game Info & Analysis */}
                  <div className="space-y-4 lg:space-y-6">
                    <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-bold mb-4">Game Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Game ID:</span>
                          <span className="font-mono text-white text-sm lg:text-base">{selectedGame.game_info.game_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Venue:</span>
                          <span className="text-white">{selectedGame.game_info.venue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Series Context:</span>
                          <span className="text-white">{selectedGame.real_mlb_context?.series_context || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Predicted Winner:</span>
                          <span className="text-green-400 font-bold capitalize">
                            {selectedGame.gpt_analysis.predicted_winner} ({selectedGame.gpt_analysis.predicted_winner === 'away' ? selectedGame.game_info.away_team : selectedGame.game_info.home_team})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-bold mb-4">System Metrics</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 lg:p-4 bg-gray-700 rounded-lg">
                          <div className="text-xl lg:text-2xl font-bold text-green-400">{selectedGame.system_metrics.overall_confidence.toFixed(1)}%</div>
                          <div className="text-xs lg:text-sm text-gray-400">Overall Confidence</div>
                        </div>
                        <div className="text-center p-3 lg:p-4 bg-gray-700 rounded-lg">
                          <div className="text-xl lg:text-2xl font-bold text-blue-400">{selectedGame.gpt_analysis.confidence}%</div>
                          <div className="text-xs lg:text-sm text-gray-400">GPT Confidence</div>
                        </div>
                        <div className="text-center p-3 lg:p-4 bg-gray-700 rounded-lg">
                          <div className="text-xl lg:text-2xl font-bold text-yellow-400">+{(selectedGame.system_metrics.expected_roi * 100).toFixed(1)}%</div>
                          <div className="text-xs lg:text-sm text-gray-400">Expected ROI</div>
                        </div>
                        <div className="text-center p-3 lg:p-4 bg-gray-700 rounded-lg">
                          <div className="text-xl lg:text-2xl font-bold text-purple-400">{selectedGame.system_metrics.edge_strength}</div>
                          <div className="text-xs lg:text-sm text-gray-400">Edge Strength</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-bold mb-4">Betting Recommendations</h3>
                      <div className="space-y-3">
                        {selectedGame.gpt_analysis.betting_recommendations?.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-300 text-sm lg:text-base">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Advanced Analysis */}
                  <div className="space-y-4 lg:space-y-6">
                    <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-bold mb-4">Hot Batter Analysis</h3>
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

                    <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-bold mb-4">MLB Context</h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-gray-700 rounded-lg">
                          <div className="text-gray-400 text-sm">Bullpen Advantage</div>
                          <div className="text-white font-medium">{selectedGame.real_mlb_context?.bullpen_advantage || 'N/A'}</div>
                        </div>
                        <div className="p-3 bg-gray-700 rounded-lg">
                          <div className="text-gray-400 text-sm">Recent Form</div>
                          <div className="text-white font-medium">{selectedGame.real_mlb_context?.recent_form_advantage || 'N/A'}</div>
                        </div>
                        <div className="p-3 bg-gray-700 rounded-lg">
                          <div className="text-gray-400 text-sm">Venue Advantage</div>
                          <div className="text-white font-medium">{selectedGame.real_mlb_context?.venue_advantage || 'N/A'}</div>
                        </div>
                      </div>
                    </div>

                    {selectedGame.environmental?.weather_impact && (
                      <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                        <h3 className="text-lg lg:text-xl font-bold mb-4 flex items-center space-x-2">
                          <CloudRain className="w-5 h-5" />
                          <span>Weather Conditions</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-blue-400">{selectedGame.environmental.weather_impact.temperature || selectedGame.environmental.weather_impact.temp || 'N/A'}°F</div>
                            <div className="text-sm text-gray-400">Temperature</div>
                          </div>
                          <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-cyan-400">{selectedGame.environmental.weather_impact.wind_speed || 0} mph</div>
                            <div className="text-sm text-gray-400">Wind Speed</div>
                          </div>
                          <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <div className="text-lg font-bold text-gray-400">{selectedGame.environmental.weather_impact.humidity || 0}%</div>
                            <div className="text-sm text-gray-400">Humidity</div>
                          </div>
                          <div className="text-center p-3 bg-gray-700 rounded-lg">
                            <div className="text-sm font-bold text-white capitalize">{selectedGame.environmental.weather_impact.conditions || 'Unknown'}</div>
                            <div className="text-sm text-gray-400">Conditions</div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-800 rounded-xl p-4 lg:p-6">
                      <h3 className="text-lg lg:text-xl font-bold mb-4">Key Factors</h3>
                      <div className="space-y-2">
                        {selectedGame.gpt_analysis.key_factors?.map((factor, index) => (
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
                <div className="mt-6 lg:mt-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20 p-4 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-bold mb-4 flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-purple-400" />
                    <span>Complete AI Analysis</span>
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-sm lg:text-base">{selectedGame.gpt_analysis.reasoning}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Panel */}
        {showNotifications && (
          <div className="fixed top-16 lg:top-20 right-4 lg:right-6 w-80 lg:w-96 max-w-[calc(100vw-2rem)] bg-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700 shadow-2xl z-50">
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
                    <p className="text-white text-sm">System v{predictionData?.meta?.version || '6.0'} loaded successfully</p>
                    <p className="text-gray-400 text-xs mt-1">{predictionData?.meta?.total_predictions || 0} games analyzed</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full mt-2 bg-yellow-400"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{predictionData?.summary?.total_scorching_batters || 0} hot batters detected</p>
                    <p className="text-gray-400 text-xs mt-1">Avg {((predictionData?.summary?.total_scorching_batters || 0) / (predictionData?.meta?.total_predictions || 1)).toFixed(1)} per game</p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full mt-2 bg-purple-400"></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">NRFI data loaded: {nrfiData?.betting_opportunities?.nrfi_bets?.length || 0} plays available</p>
                    <p className="text-gray-400 text-xs mt-1">Premium plays: {nrfiData?.summary?.expected_value?.premium_plays || 0}</p>
                  </div>
                </div>
              </div>
              {autoRefresh && (
                <div className="p-4 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 rounded-full mt-2 bg-blue-400 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Auto-refresh enabled</p>
                      <p className="text-gray-400 text-xs mt-1">Next update in {Math.floor(refreshInterval / 60000)} minutes</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>


    </div>
  );
};

export default MLBPredictionsApp;