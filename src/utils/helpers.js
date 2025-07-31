// src/utils/helpers.js

/**
 * Validate prediction data structure
 */
export const validatePredictionData = (data) => {
    if (!data || typeof data !== 'object') {
      return false;
    }
  
    // Check for required top-level properties
    const hasValidMeta = data.meta && typeof data.meta === 'object';
    const hasValidSummary = data.summary && typeof data.summary === 'object';
    
    // Check for predictions in either format
    const hasDetailedPredictions = Array.isArray(data.detailed_predictions);
    const hasSummaryPredictions = Array.isArray(data.predictions);
    
    if (!hasValidMeta) {
      console.warn('Invalid prediction data: missing or invalid meta');
      return false;
    }
  
    if (!hasValidSummary) {
      console.warn('Invalid prediction data: missing or invalid summary');
      return false;
    }
  
    if (!hasDetailedPredictions && !hasSummaryPredictions) {
      console.warn('Invalid prediction data: missing predictions array');
      return false;
    }
  
    return true;
  };
  
  /**
   * Format team names consistently
   */
  export const formatTeamName = (teamCode) => {
    const teamNames = {
      'TB': 'Tampa Bay Rays',
      'NYY': 'New York Yankees',
      'ATL': 'Atlanta Braves',
      'CIN': 'Cincinnati Reds',
      'TEX': 'Texas Rangers',
      'SEA': 'Seattle Mariners',
      'LAD': 'Los Angeles Dodgers',
      'SF': 'San Francisco Giants',
      'BOS': 'Boston Red Sox',
      'HOU': 'Houston Astros',
      'CHC': 'Chicago Cubs',
      'STL': 'St. Louis Cardinals',
      'MIA': 'Miami Marlins',
      'COL': 'Colorado Rockies',
      'PIT': 'Pittsburgh Pirates',
      'CLE': 'Cleveland Guardians',
      'NYM': 'New York Mets',
      'PHI': 'Philadelphia Phillies',
      'WSN': 'Washington Nationals',
      'MIL': 'Milwaukee Brewers',
      'MIN': 'Minnesota Twins',
      'KC': 'Kansas City Royals',
      'CHW': 'Chicago White Sox',
      'DET': 'Detroit Tigers',
      'OAK': 'Oakland Athletics',
      'LAA': 'Los Angeles Angels',
      'ARI': 'Arizona Diamondbacks',
      'SD': 'San Diego Padres',
      'TOR': 'Toronto Blue Jays',
      'BAL': 'Baltimore Orioles'
    };
    
    return teamNames[teamCode] || teamCode;
  };
  
  /**
   * Calculate confidence color based on percentage
   */
  export const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    if (confidence >= 60) return 'text-orange-400';
    return 'text-red-400';
  };
  
  /**
   * Format currency values
   */
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  /**
   * Format odds display
   */
  export const formatOdds = (odds) => {
    if (typeof odds !== 'number') return 'N/A';
    return odds > 0 ? `+${odds}` : `${odds}`;
  };
  
  /**
   * Calculate Kelly criterion bet size
   */
  export const calculateKellyBetSize = (winProbability, odds, maxBetPercentage = 0.25) => {
    if (typeof winProbability !== 'number' || typeof odds !== 'number') {
      return 0;
    }
  
    const decimalOdds = odds > 0 ? (odds / 100) + 1 : (100 / Math.abs(odds)) + 1;
    const kellyFraction = (winProbability * decimalOdds - 1) / (decimalOdds - 1);
    
    // Cap at maximum bet percentage
    return Math.max(0, Math.min(kellyFraction, maxBetPercentage));
  };
  
  /**
   * Generate unique ID for games
   */
  export const generateGameId = (awayTeam, homeTeam, date) => {
    return `${awayTeam}_${homeTeam}_${date}`;
  };
  
  /**
   * Parse game string into teams
   */
  export const parseGameString = (gameString) => {
    const parts = gameString.split(' @ ');
    if (parts.length !== 2) {
      return { away: 'AWAY', home: 'HOME' };
    }
    return { away: parts[0], home: parts[1] };
  };
  
  /**
   * Get time until game start
   */
  export const getTimeUntilGame = (gameTime) => {
    const now = new Date();
    const gameDate = new Date(gameTime);
    const diffMs = gameDate - now;
    
    if (diffMs <= 0) return 'Game Started';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  /**
   * Sort predictions by confidence
   */
  export const sortPredictionsByConfidence = (predictions) => {
    return [...predictions].sort((a, b) => {
      const confidenceA = a.system_metrics?.overall_confidence || 0;
      const confidenceB = b.system_metrics?.overall_confidence || 0;
      return confidenceB - confidenceA;
    });
  };
  
  /**
   * Filter predictions by criteria
   */
  export const filterPredictions = (predictions, filters) => {
    return predictions.filter(prediction => {
      // Filter by recommendation
      if (filters.recommendation && filters.recommendation !== 'all') {
        if (prediction.system_metrics?.bet_recommendation !== filters.recommendation) {
          return false;
        }
      }
      
      // Filter by edge strength
      if (filters.edgeStrength && filters.edgeStrength !== 'all') {
        if (prediction.system_metrics?.edge_strength !== filters.edgeStrength) {
          return false;
        }
      }
      
      // Filter by minimum confidence
      if (filters.minConfidence) {
        const confidence = prediction.system_metrics?.overall_confidence || 0;
        if (confidence < filters.minConfidence) {
          return false;
        }
      }
      
      // Filter by team
      if (filters.team && filters.team !== 'all') {
        const { away_team, home_team } = prediction.game_info;
        if (away_team !== filters.team && home_team !== filters.team) {
          return false;
        }
      }
      
      return true;
    });
  };