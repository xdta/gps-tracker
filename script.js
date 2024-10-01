let locations = [];

// Listen for the button click to record left or right location
document.getElementById('recordLeftBtn').addEventListener('click', () => {
    recordPosition('Left');
});
document.getElementById('recordRightBtn').addEventListener('click', () => {
    recordPosition('Right');
});

// Listen for the button click to clear locations (and download before clearing)
document.getElementById('clearBtn').addEventListener('click', () => {
    if (locations.length > 0) {
        downloadLocations(); // Download before clearing
        clearLocations();    // Then clear the locations
    } else {
        alert("No locations to clear.");
    }
});

function recordPosition(side) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const timestamp = new Date().toLocaleString(); // Get the current date and time

            // Save the new coordinates and timestamp to the locations array with the side label
            locations.push({ side, latitude, longitude, timestamp });

            // Display the updated list of coordinates with timestamps
            displayLocations();
        }, showError);
    } else {
        document.getElementById('output').innerHTML = "Geolocation is not supported by this browser.";
    }
}

function displayLocations() {
    let output = '<strong>Recorded Locations:</strong><br>';
    locations.forEach((location, index) => {
        output += `📿${index + 1}. ${location.side}: Latitude: ${location.latitude}, Longitude: ${location.longitude}, Time: ${location.timestamp}<br>`;
    });
    document.getElementById('output').innerHTML = output;

    // Save locations to localStorage so they persist across page reloads
    localStorage.setItem('locations', JSON.stringify(locations));
}

// Clear all recorded locations
function clearLocations() {
    if (confirm('Are you sure you want to clear all recorded locations? This cannot be undone.')) {
        locations = []; // Clear the array
        localStorage.removeItem('locations'); // Remove from localStorage
        document.getElementById('output').innerHTML = "All locations cleared.";
    }
}

// Download recorded locations as a .txt file
function downloadLocations() {
    if (locations.length === 0) {
        alert("No locations to download.");
        return;
    }

    let textContent = 'Recorded GPS Locations:\n\n';
    locations.forEach((location, index) => {
        textContent += `${index + 1}. ${location.side}: Latitude: ${location.latitude}, Longitude: ${location.longitude}, Time: ${location.timestamp}\n`;
    });

    // Create a blob and trigger a download
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'locations.txt'; // Set the file name
    document.body.appendChild(a); // Append the link to the document
    a.click(); // Trigger the download
    document.body.removeChild(a); // Remove the link after download
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('output').innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('output').innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('output').innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('output').innerHTML = "An unknown error occurred.";
            break;
    }
}

// Load previously saved locations from localStorage on page load
window.onload = () => {
    const savedLocations = localStorage.getItem('locations');
    if (savedLocations) {
        locations = JSON.parse(savedLocations);
        displayLocations();
    }
};
