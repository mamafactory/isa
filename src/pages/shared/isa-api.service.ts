import { Injectable } from '@angular/core';
import { Http/*, Response*/ } from '@angular/http';

@Injectable()
export class IsaApi {

    private baseUrl = 'https://isa-ionic-v2.firebaseio.com';
    constructor(private http: Http) { }

    getCoordinates(){
        return new Promise(resolve =>{
            this.http.get(`${this.baseUrl}/features/704/geometry.json`)
                .subscribe(res => resolve(res.json()));
           
        });
    }

}