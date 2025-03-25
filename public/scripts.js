document.getElementById('updateOdds').addEventListener('click', function() {
    const houseFavor = document.getElementById('houseFavor').value;
    // Send house favor update to backend (adjust game logic accordingly)
    fetch('/updateHouseFavor', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ houseFavor: houseFavor })
    })
    .then(response => response.json())
    .then(data => {
        alert('House odds updated');
    });
});
