// src/services/predictionService.js

import { validatePredictionData } from '../utils/helpers.js';

class PredictionService {
  constructor() {
    this.cache = new Map();
    this.subscribers = new Set();
    this.currentData = null;
    this.lastUpdate = null;
  }

  /**
   * Subscribe to data updates
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers of data changes
   */
  notify(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  /**
   * Load prediction data from various sources
   */
  async loadPredictions(source = 'latest') {
    try {
      let data;

      if (source === 'latest') {
        // In production, this would fetch from your API
        data = await this.fetchLatestPredictions();
      } else if (source.startsWith('http')) {
        // Load from URL
        data = await this.fetchFromUrl(source);
      } else if (typeof source === 'object') {
        // Direct object
        data = source;
      } else {
        // Load from local file or cache
        data = await this.loadFromCache(source);
      }

      if (!validatePredictionData(data)) {
        throw new Error('Invalid prediction data format');
      }

      this.currentData = data;
      this.lastUpdate = new Date();
      this.cache.set(data.meta.date, data);

      // Notify subscribers
      this.notify(data);

      return data;
    } catch (error) {
      console.error('Error loading predictions:', error);
      throw error;
    }
  }

  /**
   * Fetch latest predictions from API
   */
  async fetchLatestPredictions() {
    // In production, replace with your actual API endpoint
    const response = await fetch('/api/predictions/latest');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Fetch predictions from URL
   */
  async fetchFromUrl(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Load from cache or local storage
   */
  async loadFromCache(key) {
    // Check memory cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Check localStorage
    try {
      const cached = localStorage.getItem(`predictions_${key}`);
      if (cached) {
        const data = JSON.parse(cached);
        this.cache.set(key, data);
        return data;
      }
    } catch (error) {
      console.warn('Error loading from localStorage:', error);
    }

    throw new Error(`No cached data found for key: ${key}`);
  }

  /**
   * Save predictions to cache
   */
  savePredictions(data, key) {
    try {
      const cacheKey = key || data.meta.date;
      this.cache.set(cacheKey, data);

      // Save to localStorage for persistence
      localStorage.setItem(`predictions_${cacheKey}`, JSON.stringify(data));

      return true;
    } catch (error) {
      console.error('Error saving predictions:', error);
      return false;
    }
  }

  /**
   * Get current prediction data
   */
  getCurrentData() {
    return this.currentData;
  }

  /**
   * Get specific game prediction
   */
  getGamePrediction(gameId) {
    if (!this.currentData) return null;

    return this.currentData.detailed_predictions.find(
      game => game.game_info.game_id === gameId
    );
  }

  /**
   * Filter predictions by criteria
   */
  filterPredictions(criteria = {}) {
    if (!this.currentData) return [];

    let predictions = [...this.currentData.detailed_predictions];

    // Filter by bet recommendation
    if (criteria.recommendation) {
      predictions = predictions.filter(
        game => game.system_metrics.bet_recommendation === criteria.recommendation
      );
    }

    // Filter by edge strength
    if (criteria.edgeStrength) {
      predictions = predictions.filter(
        game => game.system_metrics.edge_strength === criteria.edgeStrength
      );
    }

    // Filter by minimum confidence
    if (criteria.minConfidence) {
      predictions = predictions.filter(
        game => game.system_metrics.overall_confidence >= criteria.minConfidence
      );
    }

    // Filter by team
    if (criteria.team) {
      predictions = predictions.filter(
        game => game.game_info.away_team === criteria.team ||
                game.game_info.home_team === criteria.team
      );
    }

    // Filter by hot batters threshold
    if (criteria.minHotBatters) {
      predictions = predictions.filter(
        game => game.primary_edges.hot_batter_system.scorching_batters >= criteria.minHotBatters
      );
    }

    return predictions;
  }

  /**
   * Get summary statistics
   */
  getSummaryStats() {
    if (!this.currentData) return null;

    const predictions = this.currentData.detailed_predictions;

    return {
      totalGames: predictions.length,
      averageConfidence: predictions.reduce((sum, game) =>
        sum + game.system_metrics.overall_confidence, 0) / predictions.length,
      strongEdges: predictions.filter(game =>
        ['ELITE', 'STRONG'].includes(game.system_metrics.edge_strength)).length,
      recommendedBets: predictions.filter(game =>
        game.system_metrics.bet_recommendation !== 'PASS').length,
      totalHotBatters: predictions.reduce((sum, game) =>
        sum + game.primary_edges.hot_batter_system.scorching_batters, 0),
      totalExpectedEV: predictions.reduce((sum, game) =>
        sum + game.system_metrics.total_system_ev, 0),
      averageROI: predictions.reduce((sum, game) =>
        sum + game.system_metrics.expected_roi, 0) / predictions.length
    };
  }

  /**
   * Get top betting opportunities
   */
  getTopOpportunities(limit = 5) {
    if (!this.currentData) return [];

    return this.currentData.detailed_predictions
      .filter(game => game.system_metrics.bet_recommendation !== 'PASS')
      .sort((a, b) => b.system_metrics.overall_confidence - a.system_metrics.overall_confidence)
      .slice(0, limit);
  }

  /**
   * Generate betting recommendations for a game
   */
  generateRecommendations(gameId) {
    const game = this.getGamePrediction(gameId);
    if (!game) return [];

    const recommendations = [];
    const { system_metrics, gpt_analysis, primary_edges } = game;

    // Main moneyline bet
    if (system_metrics.bet_recommendation !== 'PASS') {
      recommendations.push({
        type: 'MONEYLINE',
        team: gpt_analysis.predicted_winner === 'away' ?
          game.game_info.away_team : game.game_info.home_team,
        confidence: system_metrics.overall_confidence,
        units: this.calculateUnits(system_metrics),
        reasoning: `${system_metrics.edge_strength} edge detected`,
        expectedROI: system_metrics.expected_roi
      });
    }

    // Run total recommendations based on hot batters
    if (primary_edges.hot_batter_system.scorching_batters >= 3) {
      recommendations.push({
        type: 'TOTAL_RUNS',
        bet: 'OVER',
        confidence: Math.min(85, system_metrics.overall_confidence - 5),
        units: 1,
        reasoning: `${primary_edges.hot_batter_system.scorching_batters} hot batters identified`,
        expectedROI: 0.05
      });
    }

    // First inning no run (placeholder - you can expand this)
    if (system_metrics.overall_confidence >= 75) {
      recommendations.push({
        type: 'FIRST_INNING_NO_RUN',
        bet: 'YES',
        confidence: 70,
        units: 1,
        reasoning: 'Strong starting pitching matchup',
        expectedROI: 0.03
      });
    }

    return recommendations;
  }

  /**
   * Calculate recommended units based on Kelly criterion
   */
  calculateUnits(metrics) {
    const maxUnits = 5;
    const baseUnits = metrics.kelly_bet_size * 100;

    // Adjust based on edge strength
    let multiplier = 1;
    switch (metrics.edge_strength) {
      case 'ELITE': multiplier = 1.5; break;
      case 'STRONG': multiplier = 1.2; break;
      case 'MODERATE': multiplier = 1.0; break;
      case 'WEAK': multiplier = 0.5; break;
    }

    return Math.min(maxUnits, Math.max(0.5, baseUnits * multiplier));
  }

  /**
   * Export predictions data
   */
  exportData(format = 'json') {
    if (!this.currentData) return null;

    switch (format) {
      case 'json':
        return JSON.stringify(this.currentData, null, 2);

      case 'csv':
        return this.convertToCSV(this.currentData);

      case 'summary':
        return this.generateSummaryReport();

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Convert to CSV format
   */
  convertToCSV(data) {
    const headers = [
      'Game ID',
      'Away Team',
      'Home Team',
      'Venue',
      'Predicted Winner',
      'Overall Confidence',
      'GPT Confidence',
      'Edge Strength',
      'Bet Recommendation',
      'Expected ROI',
      'Hot Batters',
      'Pitcher Quality Advantage'
    ];

    const rows = data.detailed_predictions.map(game => [
      game.game_info.game_id,
      game.game_info.away_team,
      game.game_info.home_team,
      game.game_info.venue,
      game.gpt_analysis.predicted_winner,
      game.system_metrics.overall_confidence.toFixed(1),
      game.gpt_analysis.confidence,
      game.system_metrics.edge_strength,
      game.system_metrics.bet_recommendation,
      (game.system_metrics.expected_roi * 100).toFixed(1) + '%',
      game.primary_edges.hot_batter_system.scorching_batters,
      game.primary_edges.pitcher_quality.advantage
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  /**
   * Generate summary report
   */
  generateSummaryReport() {
    if (!this.currentData) return '';

    const stats = this.getSummaryStats();
    const topOpportunities = this.getTopOpportunities(3);

    return `
MLB PREDICTIONS SUMMARY REPORT
==============================
Date: ${this.currentData.meta.date}
System: ${this.currentData.meta.system_name} v${this.currentData.meta.version}

OVERVIEW
--------
Total Games Analyzed: ${stats.totalGames}
Average Confidence: ${stats.averageConfidence.toFixed(1)}%
Strong Edges: ${stats.strongEdges}
Recommended Bets: ${stats.recommendedBets}
Total Hot Batters: ${stats.totalHotBatters}
Expected EV: +${(stats.totalExpectedEV * 100).toFixed(1)}%

TOP OPPORTUNITIES
-----------------
${topOpportunities.map((game, i) => `
${i + 1}. ${game.game_info.away_team} @ ${game.game_info.home_team}
   Prediction: ${game.gpt_analysis.predicted_winner.toUpperCase()}
   Confidence: ${game.system_metrics.overall_confidence.toFixed(1)}%
   Edge: ${game.system_metrics.edge_strength}
   Recommendation: ${game.system_metrics.bet_recommendation}
`).join('')}

Generated: ${new Date().toLocaleString()}
    `.trim();
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();

    // Clear localStorage
    Object.keys(localStorage)
      .filter(key => key.startsWith('predictions_'))
      .forEach(key => localStorage.removeItem(key));
  }

  /**
   * Get cache info
   */
  getCacheInfo() {
    return {
      memoryCache: this.cache.size,
      currentData: !!this.currentData,
      lastUpdate: this.lastUpdate,
      subscribers: this.subscribers.size
    };
  }
}

// Create singleton instance
const predictionService = new PredictionService();

// Auto-load sample data for development
if (process.env.NODE_ENV === 'development') {
  // You can uncomment this to auto-load sample data
  // predictionService.loadPredictions(sampleMLBData);
}

export default predictionService;
