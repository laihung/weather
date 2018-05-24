import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { resolve } from "q";
import { HttpClient } from "@angular/common/http";
import { environment } from '../../environments/environment';
import { UrlResolver } from "@angular/compiler";

export class BaseService {

    constructor(protected http: HttpClient) { }

    server_url = environment.serverUrl;

    public get(lon, lat) {
        let url = `${this.server_url}${lon}/${lat}`;
        let remote = this.http.get(url)
            .catch(error => Observable.throw({ error }))
        return remote;
    }
}
