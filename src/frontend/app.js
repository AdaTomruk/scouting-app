document.addEventListener('DOMContentLoaded', () => {
  const matchScoreForm = document.getElementById('match-score-form');
  const matchScoresList = document.getElementById('match-scores-list');
  const tbaDataButton = document.getElementById('tba-data-button');
  const tbaDataList = document.getElementById('tba-data-list');

  matchScoreForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(matchScoreForm);
    const matchScore = {
      team_number: formData.get('team_number'),
      match_number: formData.get('match_number'),
      score: formData.get('score'),
    };

    try {
      const response = await fetch('/match-scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(matchScore),
      });

      if (response.ok) {
        const savedMatchScore = await response.json();
        displayMatchScore(savedMatchScore);
      } else {
        console.error('Error saving match score:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving match score:', error);
    }
  });

  tbaDataButton.addEventListener('click', async () => {
    try {
      const response = await fetch('/tba/match-data', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const tbaData = await response.json();
        displayTbaData(tbaData);
      } else {
        console.error('Error fetching TBA data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching TBA data:', error);
    }
  });

  async function fetchMatchScores() {
    try {
      const response = await fetch('/match-scores', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const matchScores = await response.json();
        matchScores.forEach(displayMatchScore);
      } else {
        console.error('Error fetching match scores:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching match scores:', error);
    }
  }

  function displayMatchScore(matchScore) {
    const listItem = document.createElement('li');
    listItem.textContent = `Team ${matchScore.team_number} - Match ${matchScore.match_number}: ${matchScore.score}`;
    matchScoresList.appendChild(listItem);
  }

  function displayTbaData(tbaData) {
    tbaDataList.innerHTML = '';
    tbaData.forEach((data) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Match ${data.match_number}: ${data.score}`;
      tbaDataList.appendChild(listItem);
    });
  }

  fetchMatchScores();
});
