/**
 * 
 */

var APIKey = "36ed3e59aaf336b6e453ae2df6a178b2";
var city = "Toronto";
var temp;
var condition;

window.onload=getTime();
window.onload=currentTemp;

document.getElementById("request").addEventListener("click",currentTemp);

document.getElementById("C").addEventListener("click",function(){
	document.getElementById("temperature").innerHTML=temp+"&#8451";
});

document.getElementById("F").addEventListener("click",function(){
	document.getElementById("temperature").innerHTML= Math.round(temp*9/5+32)+"&#8457";
});


function currentTemp(){
	var request = new XMLHttpRequest();
	
	request.onreadystatechange=function (){
		if (request.readyState == 4 && request.status == 200){
			var data= request.response;
			var json = JSON.parse(data,function(key,value){
				return value;
			});
			condition = json.weather[0].description;
			document.getElementById("condition").innerHTML= condition;
			document.getElementById("location").innerHTML= json.name;
			temp = Math.round(json.main.temp-273.15); // in Celsius
			document.getElementById("temperature").innerHTML=temp+"&#8451";
			iconSelection(condition,"currentIcon");
		}
	}
	
	city= document.getElementById("city").value;
	request.open("POST","http://api.openweathermap.org/data/2.5/weather?q=" +
			city +
			"&APPID="+APIKey,true);
	request.send();
	forecast()
}

function forecast(){
	var request = new XMLHttpRequest();
	
	request.onreadystatechange=function (){
		if (request.readyState == 4 && request.status == 200){
			var data= request.response;
			var json = JSON.parse(data,function(key,value){
				return value;
			});
			var predict=json.list;
			var sum=0;
			var count=0;
			for(var i = 0; i< predict.length; ++i){
				sum += predict[i].main.temp;
				if (i%8 == 7 || count ==4){
					if (count==4){
						var temp = Math.round(predict[i-1].main.temp-273.15); // temperature in C
						document.getElementById("fT5").innerHTML=temp+"&#8451"+"/"+Math.round(temp*9/5+32)+"&#8457";
						document.getElementById("cd5").innerHTML="Humidity:"+predict[i].main.humidity+" | Wind Speed:"
						+predict[i].wind.speed;
						document.getElementById("w5").innerHTML= predict[i].dt_txt.substring(0,10);
						iconSelection(predict[i].weather[0].description,"icon5")
					}
					
					var temp = Math.round((sum/8)-273.15); // temperature in C
					if (count==0){
						document.getElementById("fT1").innerHTML=temp+"&#8451"+"/"+Math.round(temp*9/5+32)+"&#8457";
						document.getElementById("cd1").innerHTML="Humidity:"+predict[i].main.humidity+" | Wind Speed:"
							+predict[i].wind.speed;
						document.getElementById("w1").innerHTML= predict[i-1].dt_txt.substring(0,10);
						iconSelection(predict[i-1].weather[0].description,"icon1")
					}
					
					if (count==1){
						document.getElementById("fT2").innerHTML=temp+"&#8451"+"/"+Math.round(temp*9/5+32)+"&#8457";
						document.getElementById("cd2").innerHTML="Humidity:"+predict[i].main.humidity+" | Wind Speed:"
																+predict[i].wind.speed;
						document.getElementById("w2").innerHTML= predict[i-1].dt_txt.substring(0,10);
						iconSelection(predict[i-1].weather[0].description,"icon2")
					}
					if (count==2){
						document.getElementById("fT3").innerHTML=temp+"&#8451"+"/"+Math.round(temp*9/5+32)+"&#8457";
						document.getElementById("cd3").innerHTML="Humidity:"+predict[i].main.humidity+" | Wind Speed:"
						+predict[i].wind.speed;
						document.getElementById("w3").innerHTML= predict[i-1].dt_txt.substring(0,10);
						iconSelection(predict[i-1].weather[0].description,"icon3")
					}
					if (count==3){
						document.getElementById("fT4").innerHTML=temp+"&#8451"+"/"+Math.round(temp*9/5+32)+"&#8457";
						document.getElementById("cd4").innerHTML="Humidity:"+predict[i].main.humidity+" | Wind Speed:"
						+predict[i].wind.speed;
						document.getElementById("w4").innerHTML= predict[i-1].dt_txt.substring(0,10);
						iconSelection(predict[i-1].weather[0].description,"icon4")
					}
					
					sum=0;
					++count;
				}

			}
		}
	}
	
	city= document.getElementById("city").value;
	request.open("POST","http://api.openweathermap.org/data/2.5/forecast?q=" +
			city +
			"&APPID="+APIKey,true);
	request.send();
}

function iconSelection(condition,icon){
	if (condition == "clear sky"){
		document.getElementById(icon).className = "wi wi-day-sunny";
	}
	if (condition.indexOf("clouds") > -1){
		document.getElementById(icon).className = "wi wi-cloud";
	}
	if (condition.indexOf("rain") >-1){
		document.getElementById(icon).className = "wi wi-showers";
	}
	if (condition.indexOf("snow") >-1){
		document.getElementById(icon).className = "wi wi-snow";
	}
	if (condition.indexOf("thunderstorm") >-1){
		document.getElementById(icon).className = "wi wi-day-thunderstorm";
	}
	
}

function getTime(){
	var date = new Date();
	var hour=date.getHours();
	var minutes= date.getMinutes();
	document.getElementById("date").innerHTML =date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
	if (minutes <10){
		document.getElementById("time").innerHTML = hour +":0"+minutes;
	}
	if (minutes >=10){
		document.getElementById("time").innerHTML = hour +":"+minutes;
	}
}