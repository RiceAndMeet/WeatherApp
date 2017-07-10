import React from "react";
import ReactDOM from "react-dom";
var $ = require('jquery');

class Weather extends React.Component{
	render(){
		return(<div className="forecast"> 
			<h1> {this.props.condition}</h1>
			<h2> {this.props.temperature}</h2>
			<h2> {this.props.humidity}</h2>
		</div>);
	}
}
class Form extends React.Component{
	render(){
		return (
			<form onSubmit={this._handler.bind(this)}>
				<input type="text" placeholder="City" ref={(input) => this._city = input} />
				<input type="submit" value ="submit" /> 
			</form>
		);
	}
	_handler(event){
		event.preventDefault();
		this.props.enterCity(this._city);
		console.log(this._city.value);
	}
} 

class Layout extends React.Component {
  constructor(){
  	super();
  	this.weather = {
		APIKey: "078b696568e88cb4bd2c6fb3e75ccaa4",
		currentWeather : function(city,forecast) {
			let key= this.APIKey;
			let promise = $.Deferred();
			let url;
			if (forecast)
				url = 'http://api.openweathermap.org/data/2.5/forecast';
			else 	
				url = 'http://api.openweathermap.org/data/2.5/weather';
			
			$.ajax(url, {
				dataType : 'json',
				timeout: 3000,
				data : {'q': city, 'APPID': key},
				success: function(response){
					promise.resolve(response);
				}.bind(this),
				error: function (request, errorType, errorMessage){
					promise.reject("Ajax Call failed. Error Message:"+errorMessage +" ,error type:"+errorType);
				}.bind(this)			
			});
			return promise;
		}
	};
	this.state= {
		current_weather:{},
		weather_forecast:[],
		city: 'Toronto'
	}
  }
  
  render(){
  	if (this.state.weather_forecast){
  		let arr = this.state.weather_forecast;
  		let count=0;
	    return (
	      <div className="weather_forecast">
	      	 <Form enterCity= {this._enterCity.bind(this)} />
	      	 <Weather condition={this.state.current_weather.condition} temperature={this.state.current_weather.temperature} 
	      	 	humidity={this.state.current_weather.humidity} />
	      	{arr.map(data =>{
	      	 	return (<Weather condition={data.condition} temperature={data.temperature} 
	      	 	humidity={data.humidity} key={++count}/>);
	      	 	})
	      	}
		  </div>              	
	    );
	}else return (<div>Loading</div>);
  }

  _enterCity(city){
  	this.setState({city:city.value});
  }

  _getWeatherInfo(){
	let promise = this.weather.currentWeather("Toronto",false);
	let weather_current={};
	let obj = this;
	promise.done (function(result){
		obj.setState({current_weather:{
			temperature :result.main.temp,
			humidity : result.main.humidity,
			condition : result.weather[0].main}
		});
	}).fail(function(error){console.log(error);});

  }

  _getWeatherForcast(){
  	let promise = this.weather.currentWeather("Toronto",true);
	let obj = this;
	let arr= [];
	promise.done (function(result){
		let result_list= result.list;
		for (let i=0; i< result_list.length;++i){
			let list_item=result_list[i];
			arr.push({
				temperature:list_item.main.temp,
				humidity:list_item.main.humidity,
				condition:list_item.weather[0].main
			});
		}
		obj.setState({weather_forecast:arr});

	}).fail(function(error){console.log(error);});
  			
  }

  componentDidMount(){
  	this._getWeatherInfo();
  	this._getWeatherForcast();
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Layout/>, app);