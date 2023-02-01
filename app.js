let loc = document.querySelector(".location");
let content_container = document.querySelector(".content-container");
let content = document.querySelector(".content");
let result = document.querySelector(".result");
let city_name = document.querySelector(".city");
let current_weather = document.querySelector(".current-weather");
let max_temp = document.querySelector(".max-temp");
let min_temp = document.querySelector(".min-temp");

const locate = async (city) => {
    let obj = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + city);
    let jsonData = await obj.json();
    return jsonData;
}

const get_weather = async (latitude, longitude) => {
    let temp = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=` + latitude + `&longitude=` + longitude + `&hourly=temperature_2m&current_weather=true&timezone=auto`);
    let data = await temp.json();
    return data;
}

const get_daily_weather = async (latitude, longitude) => {
    let temp = await fetch(`https://seasonal-api.open-meteo.com/v1/seasonal?latitude=` + latitude + `&longitude=` + longitude + `&daily=temperature_2m_max,temperature_2m_min`);
    let data = await temp.json();
    return data;
}

const format_weather = async (x, y, city, country) => {
    let weather = await get_weather(x, y);
    let daily_data = await get_daily_weather(x, y);
    let maximum_temp_val = daily_data.daily.temperature_2m_max_member01[0];
    let minimum_temp_val = daily_data.daily.temperature_2m_min_member01[0]
    result.style.display = "none";
    content_container.style.display = "initial";
    city = city.replace(/%20/g, " ");
    country = country.replace(/%20/g, " ");
    city_name.innerHTML = city + ", " + country;
    current_weather.innerHTML = "Current Weather : " + weather.current_weather.temperature + "&deg;" + "C";
    max_temp.innerHTML = "Maximum Temperature : " + maximum_temp_val + "&deg;" + "C";
    min_temp.innerHTML = "Minimum Temperature : " + minimum_temp_val + "&deg;" + "C";
    return x, y;
}

const update = async (text) => {
    let city = text.target.value;
    city = city.replace(" ", "%20");
    let data = await locate(city);
    result.style.display = "initial";
    result.innerHTML = "";
    if (data.results != undefined) {
        let len = data.results.length;
        for (let i = 0; i < len; i++) {
            let city_name_f = data.results[i].name;
            let country_name_f = data.results[i].country;
            city_name_f = city_name_f.replace(/ /g, "%20");
            country_name_f = country_name_f.replace(/ /g, "%20");
            result.innerHTML = result.innerHTML + `<li><a class="city-name" href="#" onclick=format_weather(` + data.results[i].latitude + `,` + data.results[i].longitude + `,` + `"` + city_name_f + `"` + `,"` + country_name_f + `")` + ` >` + data.results[i].name + "," + data.results[i].country + "<br/>";
        }
    }
}

loc.addEventListener("input", update);

