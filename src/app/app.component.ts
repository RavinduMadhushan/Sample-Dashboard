import { HttpClient } from "@angular/common/http";
import { Component, ViewChild } from "@angular/core";
import { element } from "@angular/core/src/render3";

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
} from "ng-apexcharts";
import { error } from "selenium-webdriver";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};

// import { ChartDataset, ChartOptions, ChartType } from "chart.js";
// import { Color, BaseChartDirective, Label, MultiDataSet } from "ng2-charts";

import { ApiServiceService } from "./api-service.service";
import { CacheService } from "./cache.service";
import { State } from "./state";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  title = "SampleProgramme";
  data;
  dataLabels = [];
  dataValues = [];
  max = 10;
  last = 0;
  next = this.max;
  back = this.last;
  oprational: number;
  nonOperatinal: number;

  items = [
    { label: "10", value: 10 },
    { label: "20", value: 20 },
    { label: "50", value: 50 },
  ];
  selectedMax: { label: string; value: number };

  states: State[] = [];

  constructor(
    private api: ApiServiceService,
    private http: HttpClient,
    private cache: CacheService
  ) {}

  ngOnInit() {
    this.data = this.cache.getItem(this.cacheKeyPattern());
    this.selectedMax = this.items[0];
    this.loadData();
    // this.states.push(new State(this.last, this.max));
  }

  drawChart() {
    this.oprational = 0;
    this.nonOperatinal = 0;
    this.dataLabels = [];
    this.dataValues = [];
    console.log(this.data);
    for (let index = 0; index < this.data.length; index++) {
      let element = this.data[index];
      this.dataLabels.push(element.AssetCategoryID);
      this.dataValues.push(parseInt(element.AssetCategoryKey));
      console.log(element.OperationalStatus);
      if (element.OperationalStatus == "Operational") {
        this.oprational += 1;
      } else {
        this.nonOperatinal += 1;
      }
    }
    this.chartOptions = {
      series: [
        {
          name: "AssetCategoryKey",
          data: this.dataValues,
        },
      ],
      chart: {
        height: 420,
        type: "bar",
      },
      plotOptions: {
        bar: {
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: 0,
        style: {
          fontSize: "15px",
          colors: ["#304758"],
        },
      },

      xaxis: {
        categories: this.dataLabels,
        position: "top",
        labels: {
          offsetY: -18,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
          },
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
        },
      },
      fill: {
        colors: ["#6495ED"],
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: true,
        },
      },
      title: {
        text: "Equipment Type",
        floating: 0,
        offsetY: 390,
        align: "center",
        style: {
          color: "#6495ED",
          fontSize: "22px",
        },
      },
    };
  }

  onValueChange() {
    this.max = this.selectedMax.value;
    this.loadData();
    this.states.push(new State(this.last, this.max));
  }

  loadData() {
    if (!this.cache.getItem(this.cacheKeyPattern())) {
      this.getDataFromAPI(this.max, this.last);
    } else {
      this.getDataFromCache();
    }
  }

  nextValue() {
    this.states.push(new State(this.last, this.max));
    this.last = this.last + this.max;
    this.loadData();
  }

  previousValue() {
    if (this.states.length == 0) {
      alert("No History");
    }
    const previousState: State = this.states.pop();
    this.last = previousState.last;
    this.max = previousState.max;
    this.loadData();
  }

  getDataFromAPI(max, last) {
    this.api.getAll({ max: max, last: last }).subscribe(
      (data) => {
        this.data = data;
        this.cache.setItem(
          this.max + "_" + this.last,
          JSON.stringify(this.data)
        );

        this.drawChart();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  /*   checkcacheKeyPattern() {
    if (!this.cache.getItem(this.cacheKeyPattern())) {
      this.data = this.cache.getItem(this.cacheKeyPattern());
    } else {
      this.loadData(this.max, this.last);
    }
  } */

  cacheKeyPattern() {
    return this.max + "_" + this.last;
  }

  getDataFromCache() {
    let cacheKey = this.cacheKeyPattern();
    this.data = this.cache.getItem(cacheKey);
    this.drawChart();
  }
}
