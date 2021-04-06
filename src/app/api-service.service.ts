import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiServiceService {
  baseUrl = environment.baseUrl;
  constructor(private http: HttpClient) {}

  getAll(data) {
    console.log("xxxxxxxxxx");
    return this.http.post(this.baseUrl + `/getAll`, data);
  }
}
