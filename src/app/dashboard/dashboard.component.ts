import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import * as sentiments from '../../assets/sentiment.json';
import * as sentimentsHour from '../../assets/sentiment-by-hour.json';
import * as sentimentsDay from '../../assets/sentiment-by-day.json';
import * as sentimentsWeek from '../../assets/sentiment-by-week.json';
import * as occurences from '../../assets/occurence.json';
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
  chartItem10;

  // json
  sentiments; 
  sentimentsHour;
  sentimentsDay;
  sentimentsWeek;
  occurence;

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

  colors = [
    '#4F8EEC', '#6FB47A', '#EE941B', '#E34B54','#975795', '#9E794F'
  ]

  // number
  percentSentiment : number;
  percentSentimentTime : number;
  minSentimentTime : number;
  minTime : number;
  maxSentimentTime : number;
  maxTime : number;
  words = [];

  ngOnInit() {
    // set json
    this.sentiments = (<any>sentiments).data;
    this.sentimentsHour = (<any>sentimentsHour).data;
    this.sentimentsDay = (<any>sentimentsDay).data;
    this.sentimentsWeek = (<any>sentimentsWeek).data;    
    this.occurence = (<any>occurences).data;

    let sentiment = this.getSentiment();
    let sentimentTime = this.getSentimentTime(this.time, this.category);
    this.percentSentiment = sentiment.percent_sentiment;
    this.percentSentimentTime = sentimentTime.percent_sentiment;
    this.minSentimentTime = sentimentTime['min_sentiment_per_' + this.time];
    this.minTime = sentimentTime['min_sentiment_' + this.time];
    this.maxSentimentTime = sentimentTime['max_sentiment_per_' + this.time];
    this.maxTime = sentimentTime['max_sentiment_' + this.time];
    let occurence = this.occurence.find((a) => {
      return a._id === this.category; 
    });
    this.words = occurence.words.map((a) => {
      return a.text;
    })

    this.setGraph();
  }

  // item6
  onSelectChange(event : MatTabChangeEvent) {
    // item6
    this.category = this.categories[event.index];
    let sentiment = this.getSentiment();
    this.percentSentiment = sentiment.percent_sentiment;
    let sentimentTime = this.getSentimentTime(this.time, this.category);
    this.percentSentimentTime = sentimentTime.percent_sentiment;
    this.minSentimentTime = sentimentTime['min_sentiment_per_' + this.time];
    this.minTime = sentimentTime['min_sentiment_' + this.time];
    this.maxSentimentTime = sentimentTime['max_sentiment_per_' + this.time];
    this.maxTime = sentimentTime['max_sentiment_' + this.time];
    this.setGraph();
    let occurence = this.occurence.find((a) => {
      return a._id === this.category; 
    });
    this.words = occurence.words.map((a) => {
      return a.text;
    })
  }

  // item2
  onSelectChangeTime(event : any) {
    this.viewValue = this.times.find((a) => {
      return a.value === this.time
    }).viewValue;
    let sentiment = this.getSentiment();
    this.percentSentiment = sentiment.percent_sentiment;
    let sentimentTime = this.getSentimentTime(this.time, this.category);
    this.percentSentimentTime = sentimentTime.percent_sentiment;
    this.minSentimentTime = sentimentTime['min_sentiment_per_' + this.time];
    this.minTime = sentimentTime['min_sentiment_' + this.time];
    this.maxSentimentTime = sentimentTime['max_sentiment_per_' + this.time];
    this.maxTime = sentimentTime['max_sentiment_' + this.time];
    this.setGraph();
  }

  setGraph() {
    this.setItem3();
    this.setItem4();
    this.setItem8();
    this.setItem10();
  }

  getSentiment() {
    let sentiment = this.sentiments.find((a) => {
      return a._id === this.category; 
    });
    return sentiment;
  }

  getSentimentTime(time : string, category) {
    let sentiment;
    if (time === 'hour') {
      sentiment = this.sentimentsHour.find((a) => {
        return a._id === category
      })
    } else if (time === 'day') {
      sentiment = this.sentimentsDay.find((a) => {
        return a._id === category
      })
    } else { // Week
      sentiment = this.sentimentsWeek.find((a) => {
        return a._id === category
      })
    }
    return sentiment;
  }

  setItem3() {
    let sentimentTime = this.getSentimentTime(this.time, this.category);

    let data = [
      {
        name : 'Positive',
        y : sentimentTime.positive,
        color : this.colors[0]
      },
      {
        name : 'Neutral',
        y : sentimentTime.neutral,
        color : this.colors[1]
      },
      {
        name : 'Negative',
        y : sentimentTime.negative,
        color : this.colors[2]
      }
    ]

    this.chartItem3 = { 
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor:null,
        animation: true,
        style: {
          fontFamily: 'Fira Sans',
          color: "#CBCAC6",
        }
      },
      title: {
        text: 'Percentage sentiment in ' + this.viewValue,
        align: 'left',
        style : {
          fontFamily: 'Fira Sans',
          color: "#CBCAC6",
          fontWeight: 'bold',
          align: 'center'
        }
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
              // color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
              color : this.colors,
              fontSize : '15px'
            },
          },
          borderColor : '#2A2A2A',
          showInLegend: true
        }
      },
      legend: {
        itemStyle: {
          color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
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
        name : 'Positive',
        y : sentiment.positive,
        color : this.colors[0]
      },
      {
        name : 'Neutral',
        y : sentiment.neutral,
        color : this.colors[1]
      },
      {
        name : 'Negative',
        y : sentiment.negative,
        color : this.colors[2]
      }
    ]

    console.log(data);

    this.chartItem4 = { 
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        backgroundColor:null,
        animation: true,
        style: {
          fontFamily: 'Fira Sans',
          color: "#CBCAC6",
        }
      },
      title: {
        text: 'Percentage Sentiment in All Time',
        align: 'left',
        style : {
          fontFamily: 'Fira Sans',
          color: "#CBCAC6",
          fontWeight: 'bold',
          align: 'center'
        }
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
              // color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
              color : this.colors,
              fontSize : '15px'
            }
          },
          showInLegend: true,
          borderColor : '#2A2A2A'
        }
      },
      legend: {
        itemStyle: {
          color: '#E0E0E3'
        },
        itemHoverStyle: {
            color: '#FFF'
        },
        itemHiddenStyle: {
            color: '#606063'
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
    let sentimentTime = this.getSentimentTime(this.time, this.category);
    console.log(sentimentTime);
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

    console.log(neutral);

    this.chartItem8 = {
      chart: {
          zoomType: 'xy',
          plotBackgroundColor: null,
          backgroundColor:null,
          animation: true,
          style: {
            fontFamily: 'Fira Sans',
            color: "#CBCAC6",
          },
          borderColor:null
      },
      title: {
          text: 'Comment Sentiment in ' + this.viewValue,
          align: 'left',
          style : {
            fontFamily: 'Fira Sans',
            color: "#CBCAC6",
            fontWeight: 'bold',
            align: 'center'
          }
      },
      credits: {
        enabled: false
      },
      xAxis: [{
          categories: categories,
          crosshair: true,
          name: '{value} a',
          labels: {
            enabled: true,
            format : '{value}',
            style : {
              color : '#CBCAC6'
            }
          },
          title : {
            text: this.time + " before",
            style : {
              fontFamily: 'Fira Sans',
              color: "#CBCAC6",
              fontWeight: 'bold',
              align: 'center'
            }
          }
      }],
      yAxis: [{ // Primary yAxis
          labels: {
              format: '{value}',
              style: {
                color: "#CBCAC6",
              }
          },
          title: {
              text: 'sentiment',
              style: {
                color: "#CBCAC6",
                fontFamily: 'Fira Sans',
                fontWeight: 'bold',
                align: 'center'
              }
          },
      }, { // Secondary yAxis
          title: {
              text: 'comments',
              style: {
                  color: "#CBCAC6",
                  fontFamily: 'Fira Sans',
                  fontWeight: 'bold',
                  align: 'center'
              }
          },
          labels: {
              format: '{value}',
              style: {
                color: "#CBCAC6",
              }
          },
          opposite: true
      }],
      plotOptions: {
          column: {
              stacking: 'normal',
              // borderWidth: 0 // < set this option
              borderColor : '#2A2A2A'
          },
          // series: {
          //   color : "red"
          // }
          candlestick: {
            lineColor: '#404048'
          },
          borderColor:'black'
      },
      tooltip: {
          shared: true,
      },
      legend: {
          layout: 'horizontal',
          align: 'center',
          x: 0,
          verticalAlign: 'bottom',
          y: 0,
          itemStyle: {
            color: '#E0E0E3'
          },
          itemHoverStyle: {
              color: '#FFF'
          },
          itemHiddenStyle: {
              color: '#606063'
          }
      },
      series: [{
        name: 'Positive Comments',
        type: 'column',
        yAxis: 1,
        data: positive,
        tooltip: {
            valueSuffix: ''
        },
        color : this.colors[0]
      },{
        name: 'Neutral Comments',
        type: 'column',
        yAxis: 1,
        data: neutral,
        tooltip: {
          valueSuffix: ''
        },
        color : this.colors[1]
      },{
        name: 'Negative Comments',
        type: 'column',
        yAxis: 1,
        data: negative,
        tooltip: {
            valueSuffix: ''
        },
        color : this.colors[2]
      },{
        name: 'Sentiment',
        type: 'spline',
        data: sentiments,
        tooltip: {
            valueSuffix: ''
        },
        color : this.colors[3]
      }]
    }
  }

  setItem10() {
    let sentimentTime = this.getSentimentTime(this.time, 'Global');
    let tag = 'sentiment_by_' + this.time;
    let categories = sentimentTime[tag].map( a => a[this.time] );

    let series = [];

    if (this.category === 'Global') {
      this.categories.forEach((category, index) => {
        let sentimentTime = this.getSentimentTime(this.time, category);
        let tag1 = 'percent_sentiment_per_' + this.time;
        let sentiments = sentimentTime[tag].map(a => Math.round(a[tag1] * 1000) / 1000);        
        
        let unit = {
          name: 'Sentiment ' + category,
          type: 'spline',
          data: sentiments,
          tooltip: {
            valueSuffix: ''
          },
          color : this.colors[index]
        }
        series.push(unit);
      });
    } else {
      let sentimentTime = this.getSentimentTime(this.time, 'Global');
      let tag1 = 'percent_sentiment_per_' + this.time;
      let sentiments = sentimentTime[tag].map(a => Math.round(a[tag1] * 1000) / 1000);        

      console.log(sentiments);

      let unit = {
        name: 'Sentiment ' + 'Global',
        type: 'spline',
        data: sentiments,
        tooltip: {
          valueSuffix: ''
        },
        color: this.colors[0]
      }

      series.push(unit);

      sentimentTime = this.getSentimentTime(this.time, this.category);
      tag1 = 'percent_sentiment_per_' + this.time;
      sentiments = sentimentTime[tag].map(a => Math.round(a[tag1] * 1000) / 1000);        

      unit = {
        name: 'Sentiment ' + this.category,
        type: 'spline',
        data: sentiments,
        tooltip: {
          valueSuffix: ''
        },
        color: this.colors[1]
      }

      series.push(unit);
    }

    console.log(series);
    
    this.chartItem10 = {
      chart: {
          zoomType: 'spline',
          style: {
            fontFamily: 'Fira Sans',
            color: "#CBCAC6",
          },
          backgroundColor:null,
      },
      title: {
          text: 'Comment Sentiment by Category in ' + this.viewValue,
          align: 'left',
          style : {
            fontFamily: 'Fira Sans',
            color: "#CBCAC6",
            fontWeight: 'bold',
            align: 'center'
          }
      },
      xAxis: [{
          categories: categories,
          crosshair: true,
          name: '{value} a',
          labels: {
            enabled: true,
            format : '{value}',
            style : {
              color : '#CBCAC6'
            }
          },
          title : {
            text: this.time + " before",
            style : {
              fontFamily: 'Fira Sans',
              color: "#CBCAC6",
              fontWeight: 'bold',
              align: 'center'
            }
          }
      }],
      yAxis: [{ // Primary yAxis
          labels: {
              format: '{value}',
              style: {
                color: "#CBCAC6",
              }
          },
          title: {
              text: 'sentiment',
              style: {
                color: "#CBCAC6",
              }
          },
      }],
      credits: {
        enabled: false
      },
      tooltip: {
          shared: true,
      },
      legend: {
          layout: 'horizontal',
          align: 'center',
          x: 0,
          verticalAlign: 'bottom',
          y: 0,
          itemStyle: {
            color: '#E0E0E3'
          },
          itemHoverStyle: {
              color: '#FFF'
          },
          itemHiddenStyle: {
              color: '#606063'
          }
      },
      series: series
    }
  }
}
