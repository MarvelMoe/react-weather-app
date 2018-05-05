import React from 'react';
import axios from 'axios';
import './css/index.css';

const weatherIcons =
  [
    'v1525070599/cloud-one_iiddgh.svg',
    'v1525070596/cloud-three_isrrou.svg',
    'v1525070596/slightly-cloudy-day_ljjffu.svg',
    'v1525070596/thunder_hw7uyx.svg',
    'v1525070596/night_vywgej.svg',
    'v1525070596/slightly-cloudy-night_xchkwe.svg',
    'v1525070596/sunny_iygrqv.svg',
    'v1525140183/snowy.svg',
    'v1525140275/sunset.svg',
    'v1525140275/sunrise.svg',
    'v1525139860/windy.svg'
  ];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { location: '', degree: '', forecast: [], main: '' }
  }

  temperatureConverter = (degree) => {
    return Math.round(degree * 9 / 5 + 32)
  }

  componentDidMount() {
    this.getWeather();
  }

  getWeather = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(this.successWeather, this.errorWeather);
    }
  }

  successWeather = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const url = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=c00cca645196f43959e6a78d0ae0bdaa&units=metric`;

    axios.get(url).then((res) => {
      const data = res.data;
      const temp = this.temperatureConverter(data.main.temp);
      const tempC = Math.round(data.main.temp);
      let imgSource = `http://openweathermap.org/img/w/${ data.weather[0].icon }.png`;
      debugger;

      this.setState({ location: `${data.name}, ${data.sys.country}`, degree: temp, main: data.weather[0].main, img: imgSource })
    })

    const urlDuplicate = `https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast?appid=c00cca645196f43959e6a78d0ae0bdaa&lat=${latitude}&lon=${longitude}&units=metric&cnt=8`
    let weatherList = [];

    axios.get(urlDuplicate).then(( res ) => {
      res.data.list.forEach((obj) => {
        var utc = obj.dt;
        var d = new Date(0);
        d.setUTCSeconds(utc);
        let hour = d.getHours();
        if(hour < 13 && hour >= 0) {
          hour = `${hour} AM`
        } else {
          hour = `${hour - 12} PM`
        }
        let img = "http://res.cloudinary.com/marvel451/image/upload/v1525070596/slightly-cloudy-day_ljjffu.svg";
        const temp = this.temperatureConverter(obj.main.temp);
        const description = obj.weather[0].main;
        weatherList.push({hour, temp, description});
      })
      this.setState({ forecast: weatherList });
    })

  }

   registerUser = () => {
      var x = document.forms["updates"]["sms"].value;
      if (x == "" || isNaN(x) ) {
          alert("Please give us your number");
          return false;
      } 
      else {
        alert("You have been registered!")
      }
  }

  errorWeather = (er) => {
      return er;
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <img src='http://res.cloudinary.com/marvel451/image/upload/v1525133241/sun-cloud_s558lu.png'  className="app-logo" alt="logo" />
          <h1 className="app-title">weathur.ly</h1>
          <p className="app-intro"> We found you in </p>
          <h2>{this.state.location} </h2>
        </header>

        <section className="app-weather">
          <h2 className="app-temp">{ this.state.degree }  </h2>
          <p className="app-over">{ this.state.main }</p>
          <div className="grid-container">
            { this.state.forecast.map(( obj ) => {
              console.log(obj)
              return <div>
                        <p className={'app-time'}> { obj.hour } </p>
                        <p className={`app-degrees`}> <span> { obj.temp } F </span> </p>
                        <img src="http://res.cloudinary.com/marvel451/image/upload/v1525070596/slightly-cloudy-day_ljjffu.svg" className="app-icons"/>
                    </div>
            })}
          </div>
        </section>

        <section className="app-sms">
          <h4> Register for SMS alerts for this location</h4>

          <form className="form-inline" onSubmit={(e) => {this.registerUser(); e.preventDefault();}}  name="updates">
            <input  type="text" name="sms" placeholder="555-555-555" /><br />
            <button type="submit" className="btn btn-primary">Get alerts </button>
          </form>

       
        </section>


      </div>
    );
  }
}

export default App;