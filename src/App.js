import { useState, useEffect } from "react";
import axios from "axios";

const ViewCountry = ({ country }) => {
  return (
    <div>
      <h3>{country.name.common}</h3>
      <ul>
        Capital:
        {country.capital.map((cap, i) => {
          return <li key={i}>{cap}</li>;
        })}
      </ul>
      <p>Area: {country.area}</p>
      <ul>
        <span>languages:</span>
        {Object.keys(country.languages).map((lang, i) => {
          return <li key={i}>{country.languages[lang]}</li>;
        })}
      </ul>
      <img src={country.flags.png} alt="flag" />
      <p>Weather in {country.name.common}</p>
      <p>Temperature: {country.weather.temp} Celcius</p>
      <p>wind: {country.weather.wind_speed} m/s</p>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showCountry, setShowCountry] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setData(response.data);
      setLoading(false);
    });
  }, []);

  const handleWeather = async (lon, lat) => {
    const api_key = process.env.REACT_APP_SECRET_WEATHER_KEY;
    return await axios.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily&appid=${api_key}`
    );
  };

  const searchItems = (searchValue) => {
    setSearchInput(searchValue);
  };

  const filteredData = data.filter((item) => {
    return item.name.common.toLowerCase().includes(searchInput.toLowerCase());
  });

  const handleClick = async (country) => {
    console.log(country);
    const newC = filteredData.find((c) => c.name.common === country);
    console.log(newC);
    console.log(showCountry);
    const res = await handleWeather(newC.latlng[1], newC.latlng[0]);
    setShowAll(true);
    setShowCountry({ ...newC, weather: res.data.current });
  };

  return (
    <div>
      <div>
        find countries :{" "}
        <input
          value={searchInput}
          onChange={(e) => searchItems(e.target.value)}
        />
      </div>
      <div>
        <ul>
          {filteredData.length === 1 && !showAll ? (
            filteredData.map((item, i) => {
              return (
                <div key={i}>
                  <h3>{item.name.common}</h3>
                  <ul>
                    Capital:
                    {item.capital.map((cap, i) => {
                      return <li key={i}>{cap}</li>;
                    })}
                  </ul>
                  <p>Area: {item.area}</p>
                  <ul>
                    <span>languages:</span>
                    {Object.keys(item.languages).map((lang, i) => {
                      return <li key={i}>{item.languages[lang]}</li>;
                    })}
                  </ul>
                  <img src={item.flags.png} alt="flag" />
                </div>
              );
            })
          ) : filteredData.length <= 10 ? (
            filteredData.map((item) => {
              return (
                <li key={item.name.common}>
                  {item.name.common}
                  <button onClick={() => handleClick(item.name.common)}>
                    Show
                  </button>
                </li>
              );
            })
          ) : searchInput !== "" && filteredData.length >= 10 ? (
            <p>Too many matches, specify another filter</p>
          ) : null}
        </ul>
      </div>
      {
        <div>
          {showAll && Object.entries(showCountry).length && searchInput ? (
            <div>
              <ViewCountry country={showCountry} />
            </div>
          ) : null}
        </div>
      }
    </div>
  );
};

export default App;
