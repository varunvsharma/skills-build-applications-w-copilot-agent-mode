import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespace
    ? `https://${codespace}-8000.app.github.dev/api/leaderboards/`
    : '/api/leaderboards/';

  useEffect(() => {
    setLoading(true);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setLeaderboard(results);
        console.log('Leaderboard endpoint:', endpoint);
        console.log('Fetched leaderboard:', results);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setLoading(false);
      });
  }, [endpoint]);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title display-6 mb-4">🏆 Leaderboard</h2>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="alert alert-info">No leaderboard data available yet. Start competing!</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((l, i) => (
                  <tr key={l.id || i}>
                    <td>
                      {i === 0 && '🥇 '}
                      {i === 1 && '🥈 '}
                      {i === 2 && '🥉 '}
                      <strong>#{i + 1}</strong>
                    </td>
                    <td><strong>{l.team ? l.team.name : 'Team'}</strong></td>
                    <td><span className="badge bg-primary rounded-pill">{l.points} pts</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default Leaderboard;
