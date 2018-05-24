import { Component, OnInit } from '@angular/core';
import { BaseService } from '../services/base.service';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Storage } from '../services/storage.service';
import { Utilities } from '../services/utilities.service';
import { ERR_MISSING_API_KEY, ERR_LOCATION_UNSUPPORTED, ERR_FAILED_ANTIPODE, ERR_SERVICE_FAILED_ANTIPODE, ERR_API_ERROR_SESSION_UNAVAILABLE, ERR_API_ERROR_SESSION_AVAILABLE } from '../../config';

const WEATHER_KEY = "weatherList";

declare var M : any;

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  base: BaseService;
  weatherList: any = [];
  loader: boolean = false;

  constructor(
    protected http: HttpClient,
  ) {
    this.base = new BaseService(http);
  }

  ngOnInit() {
    this.loader = true;
    //Get client's location (longtitude and latitude)
    navigator.geolocation.getCurrentPosition(res => { this.success(res); }, this.fail);
  }

  //If navigator able to get location
  success(position) {
    let lon = position.coords.longitude;
    let lat = position.coords.latitude;
    
    this.base.get(lon, lat).subscribe(res => {

      if(!res && res.length === 0) {
        this.weatherList = Storage.get(WEATHER_KEY);
        this.displayAPIError();
        return;
      } 

      this.weatherList = res;
      Storage.set(WEATHER_KEY, this.weatherList);
      
      this.getAntipodeTemperature(lon, lat);
      this.loader = false;

    },
    (err: HttpErrorResponse) => {

      this.weatherList = Storage.get(WEATHER_KEY);
      
      if(err.error.error.error) {
        this.toastDisplay(ERR_MISSING_API_KEY);
        this.loader = false;
        return;
      }

      this.displayAPIError();
      this.loader = false;

    });
  }

  //If navigator fails to get location
  fail() {
    this.toastDisplay(ERR_LOCATION_UNSUPPORTED);
  }

  //Get the direct opposite location of your current location
  getAntipodeTemperature(current_lon, current_lat) {
    
    //Formulas of calculating antipode values based on current location
    let antipode_values = Utilities.getAntipodeValues(current_lon, current_lat);

    if(!antipode_values && antipode_values.length < 1) {
      this.toastDisplay(ERR_FAILED_ANTIPODE);
      return;
    }

    this.base.get(antipode_values.antipode_lon, antipode_values.antipode_lat).subscribe(res => {
      if(!res && res.length < 1) {
        this.toastDisplay(ERR_SERVICE_FAILED_ANTIPODE);
        return;
      }

      this.weatherList.push(res[0]);

      Storage.clear(WEATHER_KEY);
      Storage.set(WEATHER_KEY, this.weatherList);
    });
  }

  displayAPIError() {
    if(this.weatherList && this.weatherList.length > 0) {
      this.toastDisplay(ERR_API_ERROR_SESSION_AVAILABLE);
    } else{
      this.toastDisplay(ERR_API_ERROR_SESSION_UNAVAILABLE);
    }

    this.loader = false;
  }

  toastDisplay(text) {
    if(!text) {
      return;
    }
    M.toast({html: text});
  }
}
