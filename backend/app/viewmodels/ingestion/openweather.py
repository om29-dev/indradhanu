import os
import requests

def fetch_weather(city: str, api_key: str = None):
    """Fetch weather from OpenWeather when api_key provided, otherwise return a synthetic fallback.

    This reduces reliance on an external API for development and demo runs.
    """
    if not api_key:
        # Synthetic fallback data for offline/demo use
        return {
            "city": city,
            "temperature": 298.15,
            "weather": "Clear",
            "source": "synthetic"
        }

    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}"
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        data = resp.json()
        data["source"] = "openweathermap"
        return data
    except Exception as e:
        # On error, return a small fallback so callers can continue to operate
        return {"city": city, "error": str(e), "source": "fallback"}
