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
  updateFlag = true;
  oneToOneFlag = true;

  // chart
  chartItem3;
  chartItem4;
  chartItem8;

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

  // number
  percentSentiment : number;
  percentSentimentTime : number;
  minSentimentTime : number;
  minTime : number;
  maxSentimentTime : number;
  maxTime : number;

  ngOnInit() {
    // set json
    this.sentiments = (<any>sentiments).data;
    this.sentimentsHour = (<any>sentimentsHour).data;
    this.sentimentsDay = (<any>sentimentsDay).data;
    this.sentimentsWeek = (<any>sentimentsWeek).data;    

    let sentiment = this.getSentiment();
    let sentimentTime = this.getSentimentTime(this.time);
    this.percentSentiment = sentiment.percent_sentiment;
    this.percentSentimentTime = sentimentTime.percent_sentiment;
    this.minSentimentTime = sentimentTime['min_sentiment_per_' + this.time];
    this.minTime = sentimentTime['min_sentiment_' + this.time];
    this.maxSentimentTime = sentimentTime['max_sentiment_per_' + this.time];
    this.maxTime = sentimentTime['max_sentiment_' + this.time];
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
    let sentimentTime = this.getSentimentTime(this.time);
    let tag = 'sentiment_by_' + this.time;
    let categories = sentimentTime[tag].map( a => a[this.time] );
    let tag1 = 'percent_sentiment_per_' + this.time;
    let sentiments = sentimentTime[tag].map(a => Math.round(a[tag1] * 1000) / 1000);
    let tag2 = 'total_comments_per_' + this.time;
    let comments = sentimentTime[tag].map(a => a[tag2]);
    let tag3 = 'negative_per_' + this.time;
    let negative = sentimentTime[tag].map(a => a[tag3]);
    let tag4 = 'positive_per_' + this.time;
    let positive = sentimentTime[tag].map(a => a[tag4]);
    let tag5 = 'neutral_per_' + this.time;
    let neutral = sentimentTime[tag].map(a => a[tag5]);

    this.chartItem8 = {
      chart: {
          zoomType: 'xy'
      },
      title: {
          text: 'Average Monthly Temperature and Rainfall in Tokyo'
      },
      subtitle: {
          text: 'Source: WorldClimate.com'
      },
      xAxis: [{
          categories: categories,
          crosshair: true,
          name: '{value} a',
          labels: {
            enabled: true,
            format : '{value}'
          },
          title : {
            text: "hour before"
          }
      }],
      yAxis: [{ // Primary yAxis
          labels: {
              format: '{value}',
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          },
          title: {
              text: 'sentiment',
              style: {
                  color: Highcharts.getOptions().colors[1]
              }
          },
      }, { // Secondary yAxis
          title: {
              text: 'comments',
              style: {
                  color: Highcharts.getOptions().colors[0]
              }
          },
          labels: {
              format: '{value}',
              style: {
                  color: Highcharts.getOptions().colors[0]
              }
          },
          opposite: true
      }],
      plotOptions: {
          column: {
              stacking: 'normal',
          }
      },
      tooltip: {
          shared: true,
      },
      legend: {
          layout: 'vertical',
          align: 'center',
          x: 0,
          verticalAlign: 'bottom',
          y: 0,
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
      },
      series: [{
        name: 'Positive Comments',
        type: 'column',
        yAxis: 1,
        data: positive,
        tooltip: {
            valueSuffix: ''
        }
      },{
        name: 'Neutral Comments',
        type: 'column',
        yAxis: 1,
        data: neutral,
        tooltip: {
          valueSuffix: ''
        }
      },{
        name: 'Negative Comments',
        type: 'column',
        yAxis: 1,
        data: negative,
        tooltip: {
            valueSuffix: ''
        }
    }, {
        name: 'Sentiment',
        type: 'spline',
        data: sentiments,
        tooltip: {
            valueSuffix: ''
        }
      }]
    }
  }
}
