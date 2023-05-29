// Function to fetch temperature data
function fetchTemperatureData() {
  $.ajax({
    url: '/recevoirInfos',  // Replace with the actual endpoint to fetch temperature data from the server
    type: 'GET',
    dataType: 'json',
    success: function (response) {
      // Update the HTML element with the temperature data
      $('#etiquetteTemp').text(response.temperature);
      $('#etiquettepourcentageOuverture').text(response.pourcentageOuverture);
      if (response.alerte != '') {
        $('#etiquettepourAlerte').text(response.alerte);
      }else{
        $('#etiquettepourAlerte').text('');
      }
      creerWidgetImage(response.pourcentageOuverture);

    },
    error: function (error) {
      console.error('Error fetching temperature data:', error);
    }
  });
}

// Periodically fetch temperature data every 1 seconds
setInterval(fetchTemperatureData, 1000);

// Function to send telemetry when "Automatique" button is clicked
function sendTelemetry(action) {
  var telemetryData = null;
  if (action != undefined) {
    const percentageInput = document.getElementById("entreePourcentage");
    const percentage = parseInt(percentageInput.value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      // Handle invalid percentage input
      return;
    }

    telemetryData = {
      action: action,
      pourcentage: percentage,
    };
  } else {
    telemetryData = {
      controle: "Automatique",
    };
  }
  $.ajax({
    type: "POST",
    url: "/envoyerControle",
    data: JSON.stringify(telemetryData),
    contentType: "application/json; charset=utf-8", // <- this is what you should add
  });
}
function changerMethode(methode) {
  // Enable or disable buttons based on the selected method
  if (methode === "Auto") {
    boutonOuvrir.disabled = true;
    boutonFermer.disabled = true;
    sendTelemetry();
  } else if (methode === "Manuelle") {
    boutonOuvrir.disabled = false;
    boutonFermer.disabled = false;
  }

  // Add your logic here
}

function creerWidgetImage(percent) {
  var image = document.getElementById("etiquetteImage");
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");
  var img = new Image();
  img.src = "images/battery.png";

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);

    var imageData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    var data = imageData.data;

    var nRows = Math.floor((canvas.height * percent) / 100);
    var rows = [];

    for (var i = canvas.height - nRows; i < canvas.height; i++) {
      rows.push(i);
    }

    for (var y = 0; y < canvas.height; y++) {
      for (var x = 0; x < canvas.width; x++) {
        var index = (y * canvas.width + x) * 4;

        if (rows.includes(y)) {
          data[index] = 0; // Red channel
          data[index + 1] = 255; // Green channel
          data[index + 2] = 0; // Blue channel
          // Leave alpha channel as it is
        }
      }
    }

    context.putImageData(imageData, 0, 0);
    image.src = canvas.toDataURL();
  };
}