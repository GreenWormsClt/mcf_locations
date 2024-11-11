document.getElementById("districtSelect").addEventListener("change", async function() {
    const district = document.getElementById("districtSelect").value;
    const villageSelect = document.getElementById("villageSelect");

    if (!district) {
        villageSelect.innerHTML = '<option value="">Select Village</option>';
        return;
    }

    // Fetch villages without coordinates for the selected district
    const response = await fetch(`https://script.google.com/macros/s/AKfycbx_4-sp6aC2bqDMC9KG2dvWonZrgM4weGpRFXNbNdFOgurLKcZKZkSGgiRm3NcvtCr_Fw/exec?districtName=${district}`);
    const result = await response.json();

    // Populate village dropdown
    villageSelect.innerHTML = '<option value="">Select Village</option>';
    result.villages.forEach(village => {
        const option = document.createElement("option");
        option.value = village;
        option.textContent = village;
        villageSelect.appendChild(option);
    });
});

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

            // Call Google Apps Script API to save coordinates
            const response = await fetch("https://script.google.com/macros/s/AKfycbx_4-sp6aC2bqDMC9KG2dvWonZrgM4weGpRFXNbNdFOgurLKcZKZkSGgiRm3NcvtCr_Fw/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    districtName: selectedDistrict,
                    villageName: selectedVillage,
                    latitude: lat,
                    longitude: long
                })
            });

            const result = await response.json();
            document.getElementById("status").textContent = result.message;

            // Remove the selected option from the village list
            villageSelect.remove(villageSelect.selectedIndex);

        }, function(error) {
            document.getElementById("status").textContent = "Error fetching location.";
        });
    } else {
        document.getElementById("status").textContent = "Geolocation is not supported by this browser.";
    }
});
