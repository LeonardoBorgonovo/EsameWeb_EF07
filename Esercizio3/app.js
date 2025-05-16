async function getWeather() {
      const latitudine = document.getElementById("latitude").value;
      const longitudine = document.getElementById("longitude").value;
      const weatherInfoDiv = document.getElementById("weather-info");

      // Mostra un messaggio di caricamento
      weatherInfoDiv.textContent = "Caricamento dati meteo...";

      try {
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitudine}&longitude=${longitudine}&current_weather=true`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`Errore HTTP! Stato: ${response.status}`);
        }

        const data = await response.json();

        // Estrai le informazioni rilevanti dalla risposta
        const temperatura = data.current_weather.temperature;
        const vento = data.current_weather.windspeed;
        const ora = data.current_weather.time;

        // Visualizza le informazioni nella pagina
        weatherInfoDiv.textContent = `Meteo alle coordinate ${latitudine}, ${longitudine} (${ora}): Temperatura: ${temperatura}°C, Vento: ${vento} m/s`;

        // Puoi aggiungere altre informazioni dalla risposta dell'API, come la descrizione del tempo, l'umidità, ecc.
      } catch (error) {
        console.error("Errore durante la chiamata API:", error);
        weatherInfoDiv.textContent = "Errore durante il recupero dei dati meteo. Riprova più tardi.";
      }
    }