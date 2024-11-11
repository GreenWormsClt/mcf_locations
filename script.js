// Function to send a JSONP request by creating a script tag
function jsonpRequest(url, callbackName) {
    const script = document.createElement("script");
    script.src = `${url}&callback=${callbackName}`;
    document.body.appendChild(script);
}

// Callback function to handle the JSONP response for villages
function handleVillagesResponse(response) {
    const villageSelect = document.getElementById("villageSelect");
    villageSelect.innerHTML = '<option value="">Select Village</option>';
    
    response.villages.forEach(village => {
        const option = document.createElement("option");
        option.value = village;
        option.textContent = village;
        villageSelect.appendChild(option);
    });

    document.getElementById("status").textContent = "Villages loaded successfully.";
}

// Event listener to fetch villages when a district is selected
document.getElementById("districtSelect").addEventListener("change", function() {
    const district = document.getElementById("districtSelect").value;
    if (!district) {
        document.getElementById("villageSelect").innerHTML = '<option value="">Select Village</option>';
        return;
    }

    const url = `https://script.google.com/macros/s/AKfycbwk2orrFg9bmu6tnshHTOAstkj-Eak189kgQgp-efE5DSEpyMSPJl5hwo6NRbyMMhvINQ/exec?districtName=${district}`;
    jsonpRequest(url, "handleVillagesResponse");
});

// Event listener for submitting coordinates
document.getElementById("fetchLocationBtn").addEventListener("click", async function() {
    const districtSelect = document.getElementById("districtSelect");
    const villageSelect = document.getElementById("villageSelect");
    const selectedDistrict = districtSelect.value;
    const selectedVillage = villageSelect.value;

    if (!selectedDistrict || !selectedVillage) {
        document.getElementById("status").textContent = "Please select both district and village.";
        return;
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async function(position) {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;

            // Prepare data for POST request
            const postData = {
                villageName: selectedVillage,
                districtName: selectedDistrict,
                latitude: lat,
                longitude: long
            };

            try {
                const response = await fetch(`https://script.google.com/macros/s/AKfycbwk2orrFg9bmu6tnshHTOAstkj-Eak189kgQgp-efE5DSEpyMSPJl5hwo6NRbyMMhvINQ/exec`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(postData)
                });

                const result = await response.json();
                document.getElementById("status").textContent = result.message;

                // Remove the selected option from the village list
                villageSelect.remove(villageSelect.selectedIndex);
            } catch (error) {
                document.getElementById("status").textContent = "Error saving location data.";
            }
        }, function(error) {
            document.getElementById("status").textContent = "Error fetching location.";
        });
    } else {
        document.getElementById("status").textContent = "Geolocation is not supported by this browser.";
    }
});
