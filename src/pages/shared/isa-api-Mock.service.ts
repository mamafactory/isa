import { Injectable } from '@angular/core';


@Injectable()
export class IsaApiMock {

    test : string = "gela fredag";
   
    constructor() { }

    getCoordinates(){
       return this.test;
    }


}