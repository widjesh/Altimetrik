import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VinService {

  constructor(private _httpClient : HttpClient) { }
  api:string = 'http://localhost:3000/vin/';

  getByVin(vin:string):any{
   return this._httpClient.get(`${this.api}${vin}`);
  }
}
