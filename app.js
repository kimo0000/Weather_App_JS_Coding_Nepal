const popupEl = document.querySelector(".popup");
const inputName = document.querySelector("div input");
const btnWeather = document.querySelector(".or .search");
const btnCurrentLocation = document.querySelector(".or .search_by_location");
const weathOneDay = document.querySelector(".weath_app");
const boxes = document.querySelector(".box_content");

const API_Key = `e634413557b9f6ba626e1e7dc79fa79c`;

const createOneItem = (dateItem, name) => {
  console.log(dateItem, name);
  weathOneDay.innerHTML = ` <div class="weath_one">
                                    <p>${name} ( ${
    dateItem.dt_txt.split(" ")[0]
  } )</p>
                                    <p>Temperature: ${(
                                      dateItem.main.temp - 273
                                    ).toFixed(2)}C</p>
                                    <p>Wind: ${dateItem.wind.speed}M/S</p>
                                    <p>Humidity: ${dateItem.main.humidity}%</p>
                                </div>
                                <div class="weath_app_img">
                                    <img src="https://openweathermap.org/img/wn/${
                                      dateItem.weather[0].icon
                                    }@4x.png" alt="Images">
                                    <h4>${dateItem.weather[0].description}</h4>
                                </div>`;
};

const getDataToThePage = (dateItem) => {
  console.log(dateItem);
  boxes.innerHTML += `<div class="box">
                            <p>${dateItem.dt_txt.split(" ")[0]}</p>
                            <img src="https://openweathermap.org/img/wn/${
                              dateItem.weather[0].icon
                            }@2x.png" alt="Image">
                            <p>Temperature: ${(
                              dateItem.main.temp - 273.15
                            ).toFixed(2)} C</p>
                            <p>Wind: ${dateItem.wind.speed} M/S</p>
                            <p>Humidity: ${dateItem.main.humidity} %</p>
                        </div>`;
};

const getDataForDay = (name, lat, lon) => {
  const getDayData = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_Key}`;

  fetch(getDayData)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data.list[0].dt_txt);
      const arrayOfDate = [];
      const forFiveDay = data.list.filter((forecast) => {
        const getDifferentDate = new Date(forecast.dt_txt).getDate();
        // console.log(getDifferentDate)
        // console.log(forecast.dt_txt);
        if (!arrayOfDate.includes(getDifferentDate)) {
          return arrayOfDate.push(getDifferentDate);
        }
      });

      console.log(forFiveDay);

      inputName.value = "";
      weathOneDay.innerHTML = "";
      boxes.innerHTML = "";

      forFiveDay.forEach((dateItem, index) => {
        if (index === 0) {
          createOneItem(dateItem, name);
        } else {
          getDataToThePage(dateItem);
        }
      });
    })
    .catch(() => {
      popupEl.innerHTML = `This Name Of City <span>"${inputName.value}"</span> Is Do Not Exist!`;
      popupEl.classList.add("show");
      setTimeout(() => {
        popupEl.classList.remove("show");
      }, 3000);
    });
};

const getWeatherApp = () => {
  const cityName = inputName.value.trim();
  if (!cityName) return;
  const getAlldata = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_Key}`;
  fetch(getAlldata)
    .then((res) => res.json())
    .then((data) => {
      const { name, lat, lon } = data[0];
      getDataForDay(name, lat, lon);
    })
    .catch(() => {
      popupEl.innerHTML = `This Name Of City <span>"${inputName.value}"</span> Is Do Not Exist! Please Enter A Valid City Name`;
      popupEl.classList.add("show");
      setTimeout(() => {
        popupEl.classList.remove("show");
      }, 3000);
    });
};

const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log(position);
      const { latitude, longitude } = position.coords;
      const REVERSE_GEOLOCATION = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_Key}`;
      fetch(REVERSE_GEOLOCATION)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const { name, lat, lon } = data[0];
          getDataForDay(name, lat, lon);
        });
    },
    (error) => {
      console.log("Error");
      console.log(error);
      if (error.code === error.PERMISSION_DENIED) {
        popupEl.innerHTML = `Access Denieded Please Try Again !`;
        popupEl.classList.add("show");
        setTimeout(() => {
          popupEl.classList.remove("show");
        }, 3000);
      }
    }
  );
};

btnWeather.addEventListener("click", getWeatherApp);
btnCurrentLocation.addEventListener("click", getCurrentLocation);
