import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, getDocs, addDoc, updateDoc, doc, increment } from 'firebase/firestore'; 

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false); 

  const name = "Jade C.";

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardRef = collection(db, 'leaderboard');
        const querySnapshot = await getDocs(leaderboardRef);

        const leaderboardData = [];

        querySnapshot.forEach((doc) => {
          leaderboardData.push({
            id: doc.id,
            name: doc.data().name,
            trips: doc.data().deliveries,
          });
        });

        leaderboardData.sort((a, b) => b.trips - a.trips);

        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard data: ", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitted(true);

    try {
      const existingPlayer = leaderboard.find(player => player.name.toLowerCase() === name.toLowerCase());

      if (existingPlayer) {
        const playerDocRef = doc(db, 'leaderboard', existingPlayer.id);
        await updateDoc(playerDocRef, {
          deliveries: increment(1),
        });
      } else {
        await addDoc(collection(db, 'leaderboard'), {
          name: name,
          deliveries: 1,
        });
      }

      const leaderboardRef = collection(db, 'leaderboard');
      const querySnapshot = await getDocs(leaderboardRef);

      const leaderboardData = [];
      querySnapshot.forEach((doc) => {
        leaderboardData.push({
          id: doc.id,
          name: doc.data().name,
          trips: doc.data().deliveries,
        });
      });

      leaderboardData.sort((a, b) => b.trips - a.trips);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error updating leaderboard: ', error);
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>

      <div className="stats-container">
        <h3>Your Total Impact</h3>
        <p><span role="img" aria-label="meal">🥘</span> Meals Rescued: 47</p>
        <p><span role="img" aria-label="co2">🌱</span> CO2 Reduced: 21.6 kg</p>
        <p><span role="img" aria-label="people">👩‍👩‍👧‍👦</span> People Fed: 25</p>
        <p><span role="img" aria-label="rescue">🚙</span> Rescue Trips: 12</p>
      </div>

      {!isSubmitted && (
        <button
          onClick={handleSubmit}
          className="leaderboard-submit"
          disabled={isSubmitted} 
        >
          Submit for {name}
        </button>
      )}

      {loading ? (
        <p>Loading leaderboard...</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Trips</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((player, index) => (
                <tr key={player.id}>
                  <td>{index + 1}</td>
                  <td>{player.name}</td>
                  <td>{player.trips}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No scores yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
