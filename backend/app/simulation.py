from .models import SimulationParams, SimulationResults
import os, random, logging
import google.generativeai as genai

def run_simulation(params: SimulationParams) -> SimulationResults:
    prompt = f"""
    Simulate urban climate impact for scenario '{params.scenario}' with:
    Tree Cover: {params.treeCover}%, Albedo: {params.albedo}, Population Density: {params.populationDensity}, Rainfall: {params.rainfall} mm/hr, Wind Speed: {params.windSpeed} km/h, Humidity: {params.humidity}%, AQI: {params.aqi}

    Return ONLY a valid JSON object with these exact keys and values:
    - temperatureDelta: array of 24 float numbers (hourly values)
    - inundationArea: array of 24 float numbers (hourly values)
    - aqiData: array of 24 float numbers (hourly values)
    - humidityData: array of 24 float numbers (hourly values)
    - maxTemperature: float
    - maxInundation: float
    - maxAQI: float
    - maxHumidity: float
    - waterloggingRisk: string (low, medium, or high)

    Do NOT include any explanation, markdown, or extra text. Only output the JSON object. All arrays must have exactly 24 float values.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-2.5-flash-lite')
    import json
    response_text = None
    for attempt in range(2):
        try:
            response = model.generate_content(prompt)
            response_text = getattr(response, 'text', None)
            if response_text and response_text.strip():
                break
        except Exception:
            response_text = None
    try:
        if not response_text or not response_text.strip():
            raise ValueError('Empty response from Gemini')
        result = json.loads(response_text)
        def validate(arr):
            return isinstance(arr, list) and len(arr) == 24 and all(isinstance(x, (int, float)) for x in arr)
        if not (validate(result.get('temperatureDelta')) and validate(result.get('inundationArea')) and validate(result.get('aqiData')) and validate(result.get('humidityData'))):
            logging.warning('Gemini output invalid, using fallback random data.')
            raise ValueError('Invalid Gemini output')
        return SimulationResults(**result)
    except Exception as e:
        logging.error(f"Gemini simulation error: {e}")
        temperatureDelta = [random.uniform(20, 40) for _ in range(24)]
        inundationArea = [random.uniform(0, 500) for _ in range(24)]
        aqiData = [random.uniform(50, 200) for _ in range(24)]
        humidityData = [random.uniform(30, 90) for _ in range(24)]
        return SimulationResults(
            temperatureDelta=temperatureDelta,
            inundationArea=inundationArea,
            aqiData=aqiData,
            humidityData=humidityData,
            maxTemperature=max(temperatureDelta),
            maxInundation=max(inundationArea),
            maxAQI=max(aqiData),
            maxHumidity=max(humidityData),
            waterloggingRisk=random.choice(['low', 'medium', 'high'])
        )
