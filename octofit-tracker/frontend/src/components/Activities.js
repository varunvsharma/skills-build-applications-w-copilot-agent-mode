import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const endpoint = codespace
    ? `https://${codespace}-8000.app.github.dev/api/activities/`
    : '/api/activities/';

  useEffect(() => {
    setLoading(true);
    fetch(endpoint)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setActivities(results);
        console.log('Activities endpoint:', endpoint);
        console.log('Fetched activities:', results);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setLoading(false);
      });
  }, [endpoint]);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h2 className="card-title display-6 mb-4">🏃 Activities</h2>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="alert alert-info">No activities found. Start logging your fitness activities!</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Type</th>
                  <th>Duration (min)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a, i) => (
                  <tr key={a.id || i}>
                    <td><strong>{a.type}</strong></td>
                    <td>{a.duration}</td>
                    <td>{a.date}</td>
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
export default Activities;
