let searchInput = document.querySelector('.weather_search');
let city = document.querySelector('.weather_city');
let humidity = document.querySelector('.weather_indicator--humidity>.value');
let pressure = document.querySelector('.weather_indicator--pressure>.value');
let wind = document.querySelector('.weather_indicator--wind>.value');
let image = document.querySelector('.weather_image');
let temperature = document.querySelector('.weather_temperature>.value');
let day = document.querySelector('.weather_day')
let forcastBlock = document.querySelector('.weather_forcast');
let weatherAPIkey='86d9b473438bb159b19e9b67a24252ac';
let suggsetion = document.querySelector('#suggestion')
let weatherBaseEndpoint='https://api.openweathermap.org/data/2.5/weather?units=metric&appid='+weatherAPIkey;
let forcastBaseEndpoint = 'https://api.openweathermap.org/data/2.5/forecast?units=metric&appid='+weatherAPIkey
let cityBaseEndpoint = 'https://api.teleport.org/api/cities/?search='

let weatherImages = [
     {
        url:'images/clear-sky.png',
        ids:[800]
     },
     {
        url:'images/mist.png',
        ids:[701,711,721,731,741,751,761,762,771,781]
    },
    {
        url:'images/broken-clouds.png',
        ids:[803,804]
    },
    {
        url:'images/rain.png',
       ids:[500,501,502,503,504]
    }, 
    {
        url:'images/scattered-clouds.png',
        ids:[802]
    },
    {
        url:'images/few-clouds.png',
        ids:[801]
    },
    {
        url:'images/shower-rain.png',
       ids:[520,,521,522,531,300,301,302,310,311,312,31314,321]
    },
    {
        url:'images/snow.png',
        ids:[511,600,601,602,611,612,613,615,616,620,621,622]
    },
    {
        url:'images/thunderstorm.png',
        ids:[200,201,202,210,211,212,221,230,231,232 ]
    },

    ];


let getWeatherByCity = async (citystring)=>{
    let city;
    if(citystring.includes(',')){
        city = citystring.substring(0,citystring.indexOf(',')) ;
        city = city + citystring.substring(citystring.lastIndexOf(','));

    }else{
        city = citystring;
    }

    let endpoint = weatherBaseEndpoint + '&q=' + city;
    let response =  await fetch(endpoint);
    if(response.status !==200){
        alert('city not found');
        return;
    }
    let weather = await response.json()
    return weather;   
}
let weatherforcity = async(city) => {
    let weather = await getWeatherByCity(city);
        console.log(weather);
        let cityID = weather.id;
        updatCurrentCityweather(weather);
        let forcast = await getForcastByCityID(cityID);
        updateForcast(forcast);


}
searchInput.addEventListener('keydown',async(e)=>{
    if (e.keyCode === 13){
      weatherforcity(searchInput.value)

    }
})
let init = () =>{
    weatherforcity('rissani').then(()=>document.body.style.filter='blur(0)');
}
init();
updatCurrentCityweather = (data)=>{
    city.textContent=data.name + ',' + data.sys.country;
    day.textContent = weeksday();
    humidity.textContent = data.main.humidity;
    pressure.textContent = data.main.pressure;
    let deg = data.wind.deg;
    let windDirection;
    if(deg >45 && deg <=135){
        windDirection = "East";
    } else if(deg >135 && deg <=225){
        windDirection = "south";
    }   else if(deg >225 && deg <=315){ 
        windDirection = "West";
    }
    else{
        windDirection = "North";
    }
    wind.textContent = windDirection + ',' + data.wind.speed;
    temperature.textContent = data.main.temp<0 ? '-'+ Math.round(data.main.temp):
                                                    Math.round(data.main.temp  );
    let imgID = data.weather[0].id;
    console.log(data.weather[0].id);
    weatherImages.forEach(obj => {
        if (obj.ids.includes(imgID)){
            image.src = obj.url;
        }
    });
    //image.src = weatherImages[5].url;
    
}

 
let weeksday = (dt = new Date().getTime()) =>{
    return new Date(dt).toLocaleDateString('en-EN',{'weekday':'long'});
} 
let getForcastByCityID = async(id)=>{
    let endpoint = forcastBaseEndpoint + '&id='+id;
    let result = await fetch(endpoint);
    let forcast = await result.json();
    let forcastList = forcast.list;
    let daily = [];
    forcastList.forEach(day => {
        let date = new Date( day.dt_txt.replace(' ','T'));
        let hours = date.getHours();
        if(hours===12){
            daily.push(day);
        }
    });
    return daily;

}
let updateForcast = (forcast)=>{
    forcastBlock.innerHTML='';
    forcast.forEach(day=>{
        let iconurl = 'http://openweathermap.org/img/wn/' + day.weather[0].icon + '@2x.png';
        let dayname = weeksday(day.dt*1000);
        let temperature =day.main.temp<0 ? '-'+ Math.round(day.main.temp):
                              Math.round(day.main.temp);
        let forcastitem = `
        <article class="weather_forcast_item">
        <img src="${iconurl}" alt="${day.weather[0].description}" class="weather_forcast_icon">
        <h3 class="weather_forcast_day">${dayname}</h3>
        <p class="weather_forcast_temperature"><span class="value">${temperature}</span>&deg;C</p>
    </article>
    `;
    forcastBlock.insertAdjacentHTML('beforeend',forcastitem);

            
});
}
searchInput.addEventListener('input',async()=>{
    let endpoint = cityBaseEndpoint + searchInput.value;
    let result = await(await fetch(endpoint)).json();
    suggsetion.innerHTML = '';
    let cities = result._embedded['city:search-results'];
    let length = cities.length >5? 5:cities.length;
    for(let i = 0;i<length;i++){
        let option = document.createElement('option');
        option.value = cities[i].matching_full_name;
        suggsetion.appendChild(option);
    }

});
