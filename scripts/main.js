function handleResponse(res) {
  return res.json();
}

function ajax() {
  const apiUrl = "https://jsonplaceholder.typicode.com";

  const promise = fetch(`${apiUrl}/albums`);

  promise.then(handleResponse).then((albums) => {
    const userPromises = [];
    for (const album of albums) {
      const uPr = fetch(`${apiUrl}/users/${album.userId}`)
        .then(handleResponse)
        .then((user) => {
          album.user = user.username;
        });

      userPromises.push(uPr);
    }

    Promise.all(userPromises).then(() => buildAlbumHtml(albums));
  });

  function buildAlbumHtml(albums) {
    const fragment = document.createDocumentFragment();
    for (const album of albums) {
      const albumElem = document.createElement("dl");
      const titleElem = document.createElement("dt");
      const authorElem = document.createElement("dd");

      titleElem.innerText = album.title;
      // authorElem.innerText = album.userId;

      authorElem.innerText = "-" + album.user;
      albumElem.appendChild(titleElem);
      albumElem.appendChild(authorElem);

      fragment.appendChild(albumElem);
    }

    document.getElementById("albums").appendChild(fragment);
  }

  function weatherApp(position) {
    const tempMetric = `http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=f3967196c52ae3285bd1fda478eaf9f9`;
    const tempImperial = `http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=f3967196c52ae3285bd1fda478eaf9f9`;
    const storageValue = localStorage.getItem("selectedTemp");
    const icon = document.querySelector(".img");
    const minMax = document.querySelector(".min-max");
    const tempFeelsLike = document.querySelector(".temp-feelslike");
    if (storageValue === "celsius") {
      fetch(tempMetric)
        .then((response) => response.json())
        .then((data) => {
          icon.src = `http://openweathermap.org/img/wn/${data["weather"][0]["icon"]}@2x.png`;
          minMax.innerHTML = `Min-Temperature: ${data["main"]["temp_min"]}°C, Max-Temperature: ${data["main"]["temp_max"]}°C`;
          tempFeelsLike.innerHTML = `Temperature: ${data["main"]["temp"]}°C, Feels-Like  ${data["main"]["feels_like"]}°C`;
        });
    }
    if (storageValue === "fahrenheit") {
      fetch(tempImperial)
        .then((response) => response.json())
        .then((data) => {
          icon.src = `http://openweathermap.org/img/wn/${data["weather"][0]["icon"]}@2x.png`;
          minMax.innerHTML = `Min-Temperature: ${data["main"]["temp_min"]}°F, Max-Temperature: ${data["main"]["temp_max"]}°F`;
          tempFeelsLike.innerHTML = `Temperature: ${data["main"]["temp"]}°F, Feels-Like  ${data["main"]["feels_like"]}°F`;
        });
    }
  }

  function temp() {
    const storageName = "selectedTemp";
    const tempToggle = document.querySelector("[data-temp-toggle");
    const radios = tempToggle.querySelectorAll("[type=radio]");

    let savedValue;

    if (window.localStorage) {
      savedValue = localStorage.getItem(storageName);
    } else {
      savedValue = getValueFromCookie(storageName);
    }

    for (const radio of radios) {
      if (radio.value === savedValue) {
        radio.checked = true;
      }
      radio.addEventListener("change", handleRadioChange);
    }

    function handleRadioChange(e) {
      const temperature = e.target.value;

      if (window.localStorage) {
        localStorage.setItem(storageName, temperature);
      } else {
        document.cookie = `${storageName}=${temperature}`;
      }
    }
  }

  temp();

  function getValueFromCookie(name) {
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
      const [cName, cValue] = cookie.split("=");
      if (cName === name) {
        return cValue;
      }
    }
    return undefined;
  }

  function askCurrentLocation() {
    navigator.geolocation.getCurrentPosition(weatherApp);
  }

  askCurrentLocation();
}

ajax();
