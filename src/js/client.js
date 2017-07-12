import React from "react";
import ReactDOM from "react-dom";
var $ = require('jquery');

var get_weather_icon = function (icon){
	if (icon == "Clouds")
		return "wi wi-cloudy";
	else if (icon == "Rain")
		return "wi wi-showers";
	else if (icon == "Clear")
		return "wi wi-day-sunny"
	else if (icon == "Wind")
		return "wi wi-cloudy-windy"
	else if (icon == "Snow")
		return "wi wi-snowflake-cold"
}

function getDayOfWeek(date) {
  	var gsDayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
	var d = new Date(date);
	var dayName = gsDayNames[d.getDay()];
	return dayName;
}

class Weather extends React.Component{
	constructor(){
		super();
		this.state= {
			color:"yellow",
		}
	}

	render(){
		return(<div className={"weather_current"+" "+this.state.color} onClick={this._changeColor.bind(this)}> 
			<i className={get_weather_icon(this.props.condition)}></i>
			<h1> {this.props.condition}</h1>
			<h2> {this.props.temperature}</h2>
			<h2> {this.props.humidity}</h2>
		</div>);
	}

	_changeColor(){
		if (this.state.color == 'yellow')
			this.setState({color: 'green'});
		else 
			this.setState({color: 'yellow'});
	}
}

class Forecast extends React.Component{
	constructor(){
		super();

	}

	render(){
		let count=0;
		return(
			// reference this element as element as input , and store in the property this._input  
			<ul className="weather_forecast" onClick={this._toggle_handler.bind(this)} ref={(input) => this._input = input}> 
				{this.props.data.map((input)=>{
					return (
					<li key={++count} >
						<h2> {getDayOfWeek(input.date) +" " +input.date}</h2>
						<i className={get_weather_icon(input.condition)}></i>
						<h5>{input.condition}</h5>
						<h2> {Math.round(input.temperature-273.15)} <i className="wi wi-celsius"></i></h2>
						<h2> {input.humidity}</h2>
						<h6> {input.time}</h6>
					</li>);
				})}
			</ul>
		);
	}
	_toggle_handler(){
		this.props.onClick(this.props.dataId);
	}

}

class Layout extends React.Component {
  constructor(){
  	super();
  	this.weather = {
		APIKey: "078b696568e88cb4bd2c6fb3e75ccaa4",
		currentWeather : function(city="Toronto",forecast) {
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
		showDetails: false, 
		detail_page: 0,
	}
  }
  
  render(){
  	//wait for ajax request to fully loaded
  	if (this.state.weather_forecast){
  		let arr = this.state.weather_forecast;
  		let count=0;

  		let details;
		if (this.state.showDetails){
			details = <div class="detail_forecasts"> 
			      <Forecast data={arr[this.state.detail_page]} onClick={this._toggle.bind(this)}/>;	 	 
			</div>;
		}

	    return (
	      <div class="page-container">
	      	 <form onSubmit={this._formHandler.bind(this)}>
				<input type="text" placeholder="City" ref={(input) => this._city = input} />
				<input type="submit" value ="submit" /> 
			</form>

	      	 <Weather condition={this.state.current_weather.condition} temperature={this.state.current_weather.temperature} 
	      	 	humidity={this.state.current_weather.humidity} />

	      	 <div id="forecastDisplay" >
		      	{arr.map(data_group_by_dates =>{ 
		      		// onclick , pass the _toggle function as argument. bind this component to the function.
			      	return (<Forecast data={data_group_by_dates} dataId={count} key={++count} onClick={this._toggle.bind(this)}/>);	 	 
		     	 })}
		     </div>
		     {details}
		  </div>              	
	    );
	}
	else return (<div>Loading</div>);
  }
  // toggles a div box 
  _toggle(event){
		this.setState({showDetails:!this.state.showDetails,detail_page:event});
		console.log(event);
	}

  _formHandler(event){
  	event.preventDefault();
  	let city = this._city.value;
  	this._getWeatherInfo(city);
  	this._getWeatherForcast(city);
  	console.log(city);
  }

  _getWeatherInfo(city){
	let promise = this.weather.currentWeather(city,false);
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

  _getWeatherForcast(city){
  	let promise = this.weather.currentWeather(city,true);
	let obj = this;
	let arr= [];
	promise.done (function(result){
		let result_list= result.list;
		let groups_dates = [];//grouping weather forecast info base on dates 
		let current_date = result_list[0].dt_txt.split(" ")[0];//get only the date of weather forecast , without time
		for (let i=0; i< result_list.length;++i){
			let list_item=result_list[i] 
			// fetch same data into group_dates array 
			if( current_date === list_item.dt_txt.split(" ")[0]){
				groups_dates.push({
					temperature:list_item.main.temp,
					humidity:list_item.main.humidity,
					condition:list_item.weather[0].main,
					date: current_date,
					time: list_item.dt_txt.split(" ")[1],
				});
			}
			else {
				//push it to result array then reset variables 
				arr.push (groups_dates);
				current_date = list_item.dt_txt.split(" ")[0];
				groups_dates = [];
				groups_dates.push({
					temperature:list_item.main.temp,
					humidity:list_item.main.humidity,
					condition:list_item.weather[0].main,
					date: current_date,
					time: list_item.dt_txt.split(" ")[1],
				});
			}
		}
		arr.push (groups_dates);//push the last group-date array into the result list 
		obj.setState({weather_forecast:arr});
	}).fail(function(error){console.log(error);});
  			
  }

  componentDidMount(){
  	//write geolocation detection here 
  	this._getWeatherInfo("Toronto");
  	this._getWeatherForcast("Toronto");
  }
}

const app = document.getElementById('app');
ReactDOM.render(<Layout/>, app);