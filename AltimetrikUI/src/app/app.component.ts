import { Component } from "@angular/core";
import { VinService } from "./vin.service";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "AltimetrikUI";
  vinNumber: string;
  details: any;
  makes: any;
  models: any;
  city: string;
  url: string;
  constructor(
    private _vinService: VinService,
    public sanitizer: DomSanitizer
  ) {}

  OnInput(event: any) {
    this.vinNumber = event.target.value;
  }

  search() {
    this._vinService.getByVin(this.vinNumber).subscribe(data => {
      this.details = data.details;
      this.makes = data.makes;
      this.models = data.models;
      this.city = this.details[5].Value;
      this.url = `https://www.google.com/maps/embed/v1/place?q=${this.city}&key=AIzaSyAohNbXKpZKvgSeR02TC6BVjRUyLiv-1tA`;
    });
  }
}
