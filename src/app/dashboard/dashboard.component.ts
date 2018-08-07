import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as sentiments from '../../assets/sentiment.json';
import * as sentimentsHour from '../../assets/sentiment-by-hour.json';
import * as sentimentsDay from '../../assets/sentiment-by-day.json';
import * as sentimentsWeek from '../../assets/sentiment-by-week.json';
import { MatTabChangeEvent } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  // highchart
  Highcharts = Highcharts;
  chartItem3;
  chartItem4;
  chartItem8;
  updateFlag = true;
  oneToOneFlag = true;

  // json
  sentiments; 
  sentimentsHour;
  sentimentsDay;
  sentimentsWeek;

  // tabs
  tabIndex: number = 0;

  categories = ['Global', 'News', 'Sports', 'Music', 'Science']

  category: string = this.categories[this.tabIndex];

  // select item2
  time: string = 'hour';
  viewValue : string = 'Last 24 Hours';

  times = [
    {value: 'hour', viewValue: 'Last 24 Hours'},
    {value: 'day', viewValue: 'Last 7 Days'},
    {value: 'week', viewValue: 'Last 5 Weeks'}
  ];

  percentSentiment : number;
  percentSentimentTime : number 

  ngOnInit() {
    // set json
    this.sentiments = (<any>sentiments).data;
    this.sentimentsHour = (<any>sentimentsHour).data;
    this.sentimentsDay = (<any>sentimentsDay).data;
    this.sentimentsWeek = (<any>sentimentsWeek).data;    

    console.log(this.sentiments);
    // item6
    let sentiment = this.getSentiment();
    let sentimentTime = this.getSentimentTime(this.time);
    this.percentSentiment = sentiment.percent_sentiment;
    this.percentSentimentTime = sentimentTime.percent_sentiment;
    this.setGraph();
  }

  // item6
  onSelectChange(event : MatTabChangeEvent) {
    // item6
    this.category = this.categories[event.index];
    let sentiment = this.getSentiment();
    this.percentSentiment = sentiment.percent_sentiment;
    // this.drawGraph();
    this.setGraph();
  }

  // item2
  onSelectChangeTime(event : any) {
    this.viewValue = this.times.find((a) => {
      return a.value === this.time
    }).viewValue;
    let sentimentTime = this.getSentimentTime(this.time);
    this.percentSentimentTime = sentimentTime.percent_sentiment;
    // this.drawGraph();
    this.setGraph();
  }

  setGraph() {
    this.setItem3();
    this.setItem4();
    this.setItem8();
  }

  getSentiment() {
    let sentiment = this.sentiments.find((a) => {
      return a._id === this.category; 
    });
    return sentiment;
  }

  getSentimentTime(time : string) {
    let sentiment;
    if (time === 'hour') {
      sentiment = this.sentimentsHour.find((a) => {
        return a._id === this.category
      })
    } else if (time === 'day') {
      sentiment = this.sentimentsDay.find((a) => {
        return a._id === this.category
      })
    } else { // Week
      sentiment = this.sentimentsWeek.find((a) => {
        return a._id === this.category
      })
    }
    return sentiment;
  }

  setItem3() {
    let sentimentTime = this.getSentimentTime(this.time);

    let data = [
      {
        name : 'Neutral',
        y : sentimentTime.neutral
      },
      {
        name : 'Positive',
        y : sentimentTime.positive        
      },
      {
        name : 'Negative',
        y : sentimentTime.negative        
      }
    ]

    this.chartItem3 = { 
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor:'rgba(255, 255, 255, 0.0)',
        animation: true
      },
      title: {
        text: 'Percentage sentiment in ' + this.viewValue
      },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              textOutline: false, 
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
            }
          }
        }
      },
      series: [{
        name: 'Percentage',
        colorByPoint: true,
        innerSize: '50%',
        data: data
      }]
    }
  }

  setItem4() {
    let sentiment = this.getSentiment();

    let data = [
      {
        name : 'Neutral',
        y : sentiment.neutral
      },
      {
        name : 'Positive',
        y : sentiment.positive        
      },
      {
        name : 'Negative',
        y : sentiment.negative        
      }
    ]

    console.log(data);

    this.chartItem4 = { 
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor:'rgba(255, 255, 255, 0.0)'
      },
      title: {
        text: 'Percentage Sentiment in All Time'
      },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              textOutline: false, 
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
            }
          }
        }
      },
      series: [{
        name: 'Percentage',
        colorByPoint: true,
        innerSize: '50%',
        data: data
      }]
    }
  }

  setItem8() {
    this.chartItem8 = { 
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor:'rgba(255, 255, 255, 0.0)'
      },
      title: {
        text: 'Percentage Sentiment in All Time'
      },
      credits: {
        enabled: false
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              textOutline: false, 
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
            }
          }
        }
      },
      series: [{
        name: 'Percentage',
        colorByPoint: true,
        innerSize: '50%',
        data: [{
          name : "a",
          y : 1
        }]
      }]
    }

    // this.chartItem8 = {
    //   chart: {
    //     renderTo: 'container',
    //     type: 'column'
    //   },
    //   title: {
    //       text: 'Restaurants Complaints'
    //   },
    //   xAxis: {
    //       categories: ['Overpriced', 'Small portions', 'Wait time', 'Food is tasteless', 'No atmosphere', 'Not clean', 'Too noisy', 'Unfriendly staff']
    //   },
    //   yAxis: [{
    //       title: {
    //           text: ''
    //       }
    //   }, {
    //       title: {
    //           text: ''
    //       },
    //       minPadding: 0,
    //       maxPadding: 0,
    //       max: 100,
    //       min: 0,
    //       opposite: true,
    //       labels: {
    //           format: "{value}%"
    //       }
    //   }],
    //   series: [{
    //       type: 'pareto',
    //       name: 'Pareto',
    //       yAxis: 1,
    //       zIndex: 10,
    //       baseSeries: 1
    //   }, {
    //       name: 'Complaints',
    //       type: 'column',
    //       zIndex: 2,
    //       data: [755, 222, 151, 86, 72, 51, 36, 10]
    //   }]
    // }
  }
}
