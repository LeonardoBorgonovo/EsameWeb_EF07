/**
 * Recupera i dati meteo attuali dall'API di Open-Meteo per le coordinate specificate
 * e aggiorna l'interfaccia utente con le informazioni ricevute.
 * @async
 * @function getWeather
 * @returns {void}
 */

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
    const codiceMeteo = data.current_weather.weathercode;


    const descrizioneMeteo = getWeatherDescription(codiceMeteo);
    const emojiMeteo = getWeatherEmoji(codiceMeteo); // Nuova funzione per ottenere l'emoji

    const weatherInfoDiv = document.getElementById("weather-info");
    weatherInfoDiv.innerHTML = `
        <h3>Meteo Attuale</h3>
        <p>Orario: ${ora}</p>
        <p>Temperatura: ${temperatura} °C ${emojiMeteo}</p>
        <p>Vento: ${vento} km/h</p>
        <p>Condizione: ${descrizioneMeteo}</p>
      `;
    // Puoi aggiungere altre informazioni dalla risposta dell'API, come la descrizione del tempo, l'umidità, ecc.
  } catch (error) {
    console.error("Errore durante la chiamata API:", error);
    weatherInfoDiv.textContent = "Errore durante il recupero dei dati meteo. Riprova più tardi.";
  }

  /**
 * Restituisce una descrizione testuale in italiano per un dato codice meteo.
 * @param {number} weatherCode - Il codice meteo numerico fornito dall'API.
 * @returns {string} Una descrizione testuale delle condizioni meteorologiche.
 */

  function getWeatherDescription(weatherCode) {
    switch (weatherCode) {
      case 0: return "Cielo sereno";
      case 1: case 2: case 3: return "Nuvoloso";
      case 45: case 48: return "Nebbia";
      case 51: case 53: case 55: return "Pioggerella";
      case 56: case 57: return "Pioggerella gelida";
      case 61: case 63: case 65: return "Pioggia";
      case 66: case 67: return "Pioggia gelida";
      case 71: case 73: case 75: return "Neve";
      case 77: return "Graupel";
      case 80: case 81: case 82: return "Rovesci di pioggia";
      case 85: case 86: return "Rovesci di neve";
      case 95: return "Temporale";
      case 96: case 99: return "Temporale con grandine";
      default: return "Informazioni non disponibili";
    }
  }

  function getWeatherEmoji(weatherCode) {
    switch (weatherCode) {
      case 0: return "☀️";   // Cielo sereno
      case 1: case 2: case 3: return "☁️​"; // Nuvoloso (emoji nuvola generica)
      case 45: case 48: return "🌫️";  // Nebbia
      case 51: case 53: case 55: return "🌦️";  // Pioggerella
      case 56: case 57: return "🧊";  // Pioggerella gelida (emoji ghiaccio)
      case 61: case 63: case 65: return "🌧️";  // Pioggia
      case 66: case 67: return "🥶";  // Pioggia gelida (emoji faccia fredda)
      case 71: case 73: case 75: return "🌨️​"; // Neve (emoji neve generica)
      case 77: return "🌨️";  // Graupel (nevischio)
      case 80: case 81: case 82: return "🌧️";  // Rovesci di pioggia
      case 85: case 86: return "❄️";  // Rovesci di neve (fiocco di neve)
      case 95: return "⛈️";  // Temporale
      case 96: case 99: return "🌩️";  // Temporale con grandine
      default: return "";      // Nessuna emoji predefinita
    }
  }
}