import React from 'react';
import { Trophy, BarChart3, Target, Calendar } from 'lucide-react';

const TrackingComponent = ({ trackingData }) => (
  <div className="p-4 lg:p-6">
    <div className="mb-6">
      <h3 className="text-2xl lg:text-3xl font-bold flex items-center space-x-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <span>Performance Tracking</span>
      </h3>
      <p className="text-gray-400">Track prediction accuracy and performance metrics</p>
    </div>

    {trackingData ? (
      <div className="space-y-6">
        {/* Overall Performance */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            <span>Overall Performance</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {trackingData.overall_performance?.accuracy_rate?.toFixed(1) || '0.0'}%
              </div>
              <div className="text-sm text-gray-400">Overall Accuracy</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">
                {trackingData.overall_performance?.total_predictions || 0}
              </div>
              <div className="text-sm text-gray-400">Total Predictions</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">
                {trackingData.overall_performance?.correct_predictions || 0}
              </div>
              <div className="text-sm text-gray-400">Correct</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-red-400">
                {trackingData.overall_performance?.incorrect_predictions || 0}
              </div>
              <div className="text-sm text-gray-400">Incorrect</div>
            </div>
          </div>
        </div>

        {/* By Prediction Type - Enhanced with NRFI */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-400" />
            <span>By Prediction Type</span>
          </h4>
          <div className="space-y-4">
            {/* Moneyline Performance */}
            {trackingData.by_prediction_type?.game_outcome && (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-400">💰 Moneyline Predictions</span>
                  <span className="text-sm text-gray-400">
                    {trackingData.by_prediction_type.game_outcome.total_predictions || 0} predictions
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex-1 bg-gray-600 rounded-full h-3">
                    <div 
                      className="bg-blue-400 h-3 rounded-full" 
                      style={{width: `${trackingData.by_prediction_type.game_outcome.accuracy_rate || 0}%`}}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-blue-400">
                    {(trackingData.by_prediction_type.game_outcome.accuracy_rate || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Avg Confidence: {(trackingData.by_prediction_type.game_outcome.average_confidence || 0).toFixed(1)}%
                </div>
              </div>
            )}
            
            {/* NRFI Performance */}
            {trackingData.by_prediction_type?.nrfi && (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-purple-400">🚫 NRFI Predictions</span>
                  <span className="text-sm text-gray-400">
                    {trackingData.by_prediction_type.nrfi.total_predictions || 0} predictions
                  </span>
                </div>
                <div className="flex items-center space-x-4 mb-2">
                  <div className="flex-1 bg-gray-600 rounded-full h-3">
                    <div 
                      className="bg-purple-400 h-3 rounded-full" 
                      style={{width: `${trackingData.by_prediction_type.nrfi.accuracy_rate || 0}%`}}
                    ></div>
                  </div>
                  <span className="text-lg font-bold text-purple-400">
                    {(trackingData.by_prediction_type.nrfi.accuracy_rate || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="text-xs text-gray-400">
                  Avg Confidence: {(trackingData.by_prediction_type.nrfi.average_confidence || 0).toFixed(1)}%
                </div>
              </div>
            )}

            {/* Other prediction types */}
            {trackingData.by_prediction_type && Object.entries(trackingData.by_prediction_type)
              .filter(([type]) => !['game_outcome', 'nrfi'].includes(type))
              .map(([type, data]) => (
              <div key={type} className="bg-gray-700/30 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold capitalize">{type.replace('_', ' ')}</span>
                  <span className="text-sm text-gray-400">{data.total_predictions || 0} predictions</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full" 
                      style={{width: `${data.accuracy_rate || 0}%`}}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{(data.accuracy_rate || 0).toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Analysis - Enhanced */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-yellow-400" />
            <span>Confidence Breakdown</span>
          </h4>
          
          {/* Overall Confidence Analysis */}
          {trackingData.confidence_analysis && (
            <div className="mb-6">
              <h5 className="text-lg font-semibold mb-3 text-gray-300">Overall Performance</h5>
              <div className="space-y-3">
                {Object.entries(trackingData.confidence_analysis)
                  .filter(([key]) => ['high', 'medium', 'low'].includes(key))
                  .map(([confidence, data]) => (
                  <div key={confidence} className="bg-gray-700/30 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold capitalize ${
                          confidence === 'high' ? 'text-green-400' : 
                          confidence === 'medium' ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {confidence === 'high' ? '🔥 High' : 
                           confidence === 'medium' ? '⚡ Medium' : '📊 Low'} Confidence
                        </span>
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                          {confidence === 'high' ? '80%+' : 
                           confidence === 'medium' ? '65-80%' : '<65%'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {data.total || 0} predictions
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1 bg-gray-600 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            confidence === 'high' ? 'bg-green-400' : 
                            confidence === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                          }`}
                          style={{width: `${data.accuracy || 0}%`}}
                        ></div>
                      </div>
                      <span className={`text-lg font-bold ${
                        confidence === 'high' ? 'text-green-400' : 
                        confidence === 'medium' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {(data.accuracy || 0).toFixed(1)}%
                      </span>
                    </div>
                    {data.avg_confidence && (
                      <div className="text-xs text-gray-400 mt-1">
                        Avg: {data.avg_confidence.toFixed(1)}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Moneyline by Confidence */}
          {trackingData.by_prediction_type?.moneyline_by_confidence && (
            <div>
              <h5 className="text-lg font-semibold mb-3 text-blue-400">💰 Moneyline by Confidence</h5>
              <div className="space-y-2">
                {Object.entries(trackingData.by_prediction_type.moneyline_by_confidence).map(([level, data]) => (
                  <div key={level} className="bg-blue-900/20 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-blue-300 capitalize">{level} Confidence</span>
                      <span className="text-sm text-gray-400">{data.total_predictions} picks</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full" 
                          style={{width: `${data.accuracy_rate || 0}%`}}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-blue-400">
                        {(data.accuracy_rate || 0).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Performance */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h4 className="text-xl font-bold mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            <span>Recent Performance</span>
          </h4>
          <div className="text-sm text-gray-400 mb-2">
            Last updated: {trackingData.meta?.generated_at ? new Date(trackingData.meta.generated_at).toLocaleString() : 'Unknown'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-lg font-bold text-blue-400 mb-2">💰 Moneyline Tracking</div>
              <div className="text-sm text-gray-300">
                {trackingData.by_prediction_type?.game_outcome ? 
                  `${trackingData.by_prediction_type.game_outcome.accuracy_rate?.toFixed(1) || 0}% accuracy on ${trackingData.by_prediction_type.game_outcome.total_predictions || 0} picks` :
                  'No moneyline data available yet'
                }
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4">
              <div className="text-lg font-bold text-purple-400 mb-2">🚫 NRFI Tracking</div>
              <div className="text-sm text-gray-300">
                {trackingData.by_prediction_type?.nrfi ? 
                  `${trackingData.by_prediction_type.nrfi.accuracy_rate?.toFixed(1) || 0}% accuracy on ${trackingData.by_prediction_type.nrfi.total_predictions || 0} picks` :
                  'No NRFI data available yet'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-12 text-gray-400">
        <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-xl">Performance tracking data not available</p>
        <p className="text-sm mt-2">Run the tracking system to generate performance metrics</p>
      </div>
    )}
  </div>
);

export default TrackingComponent;