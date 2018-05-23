import { Component, OnInit } from '@angular/core';
import { BaseService } from './services/base.service';
import { HttpClient } from "@angular/common/http";
import { Storage } from './services/storage.service';

const WEATHER_KEY = "weatherList";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  base: BaseService;
  loader = false;
  weatherList = [];

  constructor(
    protected http: HttpClient,
  ) {
    this.base = new BaseService(http);
  }

  ngOnInit(){
    this.loader = true;

    //Get client's location (longtitude and latitude)
    navigator.geolocation.getCurrentPosition(res => { this.success(res); }, this.fail);
  }

  success(position) {
    let lon = position.coords.longitude;
    let lat = position.coords.latitude;
    
    this.base.get(lon, lat).subscribe(res => {
      if(!res || res.length === 0) {
        this.weatherList = Storage.get(WEATHER_KEY);
      } 
      this.weatherList = res;
      Storage.set(WEATHER_KEY, this.weatherList);
      this.getAntipodeTemp(lon, lat);
      this.loader = false;
    });
  }

  fail() {
    alert("Sorry, your browser does not support geolocation services.");
  }

  getAntipodeTemp(current_lon, current_lat) {
    let antipode_lon = 0;
    if(current_lon > 0) {
      antipode_lon = current_lon - 180;  
    }else {
      antipode_lon = current_lon + 180;
    }
    let antipode_lat = -(current_lat);
    console.log(current_lon)
    console.log(current_lat)
    console.log(antipode_lon)
    console.log(antipode_lat)
    this.base.get(antipode_lon, antipode_lat).subscribe(res => {
      if(!res) {
        return;
      }

      if(res.length < 1) {
        return;
      }
      
      this.weatherList.push(res[0]);

      Storage.clear(WEATHER_KEY);
      Storage.set(WEATHER_KEY, this.weatherList);
    });
  }
}
