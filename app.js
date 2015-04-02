/**
 * Created by GuNs on 28-03-2015.
 */

(function(){

    var app = angular.module("calender", ['ngAnimate']);


    app.run(function($rootScope, $window){//Resize window listener
        $rootScope.windowWidth = $window.outerWidth;
        angular.element($window).bind('resize',function(){
            $rootScope.windowWidth = $window.outerWidth;
            $rootScope.$apply('windowWidth');
        });
    });

    app.filter('capitalize', function() {
        return function(input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
        }
    });

    app.filter('inWords', function () {
        return function (num) {
            if(!num){
                return 'No';
            }
            var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
            var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

            if ((num = num.toString()).length > 9) return num;
            n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!n) return; var str = '';
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
            str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
            return str;
        };
    });

    app.controller('calender',['$scope',function ($scope) {
        var vm=this;
        vm.today=moment();
        //Get events from http request whenever required, end date >= start date and time in 24hr format
        vm.events=[
            {
                name:"Finish Programming course",
                start:{
                    date:"28-03-2015",
                    time:"23:30"
                },
                end:{
                    date:"31-03-2015",
                    time:"2:30"
                }
            },
            {
                name:"Go to swimming",
                start:{
                    date:"29-03-2015",
                    time:"2:30"
                },
                end:{
                    date:"29-03-2015",
                    time:"2:50"
                }
            },
            {
                name:"Jogging",
                start:{
                    date:"29-03-2015",
                    time:"1:30"
                },
                end:{
                    date:"29-03-2015",
                    time:"2:30"
                }
            },
            {
                name:"Data Conference",
                start:{
                    date:"29-03-2015",
                    time:"06:30"
                },
                end:{
                    date:"29-03-2015",
                    time:"10:30"
                }
            },
            {
                name:"Watch football match",
                start:{
                    date:"30-03-2015",
                    time:"21:30"
                },
                end:{
                    date:"30-03-2015",
                    time:"23:30"
                }
            },
            {
                name:"Play FIFA",
                start:{
                    date:"30-03-2015",
                    time:"09:30"
                },
                end:{
                    date:"30-03-2015",
                    time:"10:30"
                }
            },
            {
                name:"Kenn Conference",
                start:{
                    date:"29-03-2015",
                    time:"18:30"
                },
                end:{
                    date:"05-04-2015",
                    time:"22:30"
                }
            },
            {
                name:"Go to Home",
                start:{
                    date:"03-04-2015",
                    time:"12:00"
                },
                end:{
                    date:"11-04-2015",
                    time:"12:30"
                }
            }
        ];
    }]);


    /*
    * Core Angular calender Code - Inspired from https://www.codementor.io/angularjs/tutorial/angularjs-calendar-directives-less-cess-moment-font-awesome
    * Customized for calender with day view
    * */
    app.directive("calendar", function() {
        return {
            restrict: "E",
            require: 'ngModel',
            templateUrl: "calendar.html",
            scope: {
                selected: "=",
                model: '=ngModel'
            },
            link: function(scope,element,attrs) {
                scope.selected = resetHMMSM(scope.selected || moment());
                scope.month = scope.selected.clone(); //cloning refers to same object memory
                scope.formatted=scope.selected.format('DD-MM-YYYY'); //Save formatted selected date for json comparison

                var start = scope.selected.clone();
                start.date(1); //selects first date of the month
                resetHMMSM(start.day(0));  //selects first day of the week of first day of month and resets day's time to 00:00:00:00:00

                thisMonth(scope, start, scope.month); //creates calender for that month

                scope.select = function(day) {
                        scope.selected = day.date.utc();
                        scope.formatted = scope.selected.format('DD-MM-YYYY');
                        if (scope.currentDate == day) //Show and hide all dates
                            scope.currentDate = '';
                        else
                            scope.currentDate = day;
                        return 1;
                };

                scope.next = function(d) {
                    if(!d) //clear current date if top header month controls are pressed, dont clear if next month date number is clicked, just change to next
                        scope.currentDate='';
                    var next = scope.month.clone();
                    resetHMMSM(next.month(next.month()+1).date(1));
                    scope.month.month(scope.month.month()+1);
                    thisMonth(scope, next, scope.month);
                };

                scope.previous = function(d) {
                    if(!d)
                        scope.currentDate='';
                    var previous = scope.month.clone();
                    resetHMMSM(previous.month(previous.month()-1).date(1));
                    scope.month.month(scope.month.month()-1);
                    thisMonth(scope, previous, scope.month);
                };

                //Custom functions for day view
                scope.currentDate='';
                createEvents(scope,scope.model);
                scope.hours=[];
                for(var _i=0;_i<24;_i++) //Generate hour array
                    scope.hours.push(_i);

                scope.transition= function (index) {
                    return {
                        'transition-delay':100+(600/23)*(index) + 'ms'
                    };
                };

                scope.nextday= function (day,index,week,track) {
                    //setTimeout(function () {
                    //    scope.$apply(function () {
                            if(index==6&&track!=week.length-1) {  //last day of the week
                                track = track + 1;
                                index=-1;
                            }
                            if((index==6&&track==week.length-1)||!week[track].days[index+1].isCurrentMonth){
                                scope.currentDate='';
                                scope.next(1);
                                return;
                            }
                                var t=angular.copy(day);  //Shallow to deep copy
                                scope.selected = t.date.utc().add(1,'d');
                                scope.formatted=scope.selected.format('DD-MM-YYYY');
                                scope.currentDate=week[track].days[index+1];
                        //});
                    //},0);
                };

                scope.prevday= function (day,index,week,track) {
                    //setTimeout(function () {
                    //    scope.$apply(function () {
                            if(index==0&&track!=0) {  //last day of the week
                                track = track - 1;
                                index=7;
                            }
                            if((index==0&&track==0)||!week[track].days[index-1].isCurrentMonth){
                                scope.currentDate='';
                                scope.previous(1);
                                return;
                            }
                                var t=angular.copy(day);  //Shallow to deep copy
                                scope.selected = t.date.utc().subtract(1,'d');
                                scope.formatted=scope.selected.format('DD-MM-YYYY');
                                scope.currentDate=week[track].days[index-1];
                        //});
                    //},0);
                };

                scope.fulldayCheck = function (item) {
                    return item.fullday === true;
                };

                scope.nonfulldayCheck = function (item) {
                    return item.fullday !== true;
                };

                scope.displayCreator = function (h,start) {
                        if(typeof start === 'object'){ //Might be called before creating events array, ignore if eventlist is not created.
                            return;
                        }
                        return (h==parseInt(start.split(':')[0]));
                };
            }
        };

        function resetHMMSM(date) {
            return date.utc().day(0).hour(0).minute(0).second(0).millisecond(0);
        }

        function thisMonth(scope, start, month) {
            scope.weeks = [];
            var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
            while (!done) {
                scope.weeks.push({ days: thisMonthWeeks(date.clone(), month) });
                date.add(1, "w");
                done = count++ > 2 && monthIndex !== date.month();
                monthIndex = date.month();
            }
        }

        function thisMonthWeeks(date, month) {
            var days = [];
            for (var i = 0; i < 7; i++) {
                days.push({
                    name: date.format("dd").substring(0, 1),
                    number: date.date(),
                    isCurrentMonth: date.month() === month.month(),
                    isToday: date.isSame(new Date(), "day"),
                    date: date
                });
                date = date.clone();
                date.add(1, "d");
            }
            return days;
        }

        //Custom funcs
        function createEvents(scope,events){
            var _events={};
            for (var i=0;i<events.length;i++){
                var start,x;
                var diff=moment(events[i].end.date, "DD-MM-YYYY").diff(moment(events[i].start.date, "DD-MM-YYYY"), 'days', true); // get event start and end difference
                if(diff == 0){  //Event for single day
                    start=events[i].start.date; //json key
                    if(!_events[start]) //if no json key array, create one
                        _events[start]=[];
                    x={};
                    x.start= events[i].start.time;
                    x.end= events[i].end.time;
                    x.name=events[i].name;
                    x.fullday=false;
                    x.color=Please.make_color({
                        base_color: 'rebeccapurple' //set your base color
                    });
                    _events[start].push(x);
                }
                else
                    if(diff > 0){  //Event for Multiple day
                        for( var j=0;j<=diff;j++){
                            if(j==0){
                                start=events[i].start.date; //json key
                                if(!_events[start]) //if no json key array, create one
                                    _events[start]=[];
                                x={};
                                x.start= events[i].start.time;
                                x.end= '23:59';
                                x.name=events[i].name;
                                x.fullday=false;
                                x.color=Please.make_color({
                                    base_color: 'rebeccapurple' //set your base color
                                });
                                _events[start].push(x);
                            }
                            else
                                if(j==diff){
                                    start=events[i].end.date; //json key
                                    if(!_events[start]) //if no json key array, create one
                                        _events[start]=[];
                                    x={};
                                    x.start= '00:00';
                                    x.end= events[i].end.time;
                                    x.name=events[i].name;
                                    x.fullday=false;
                                    x.color=Please.make_color({
                                        base_color: 'rebeccapurple' //set your base color
                                    });
                                    _events[start].push(x);
                                }
                                else{
                                    start=moment(events[i].start.date, "DD-MM-YYYY").add(j,'d').format('DD-MM-YYYY'); //json key
                                    if(!_events[start]) //if no json key array, create one
                                        _events[start]=[];
                                    x={};
                                    x.start= '00:00';
                                    x.end= '23:59';
                                    x.name=events[i].name;
                                    x.fullday=true;
                                    x.color=Please.make_color({
                                        base_color: 'rebeccapurple' //set your base color
                                    });
                                    _events[start].push(x);
                                }
                        }
                    }
            }
            scope.eventsList=_events; //Assign generated events
            console.log(_events);
        }
    });

    app.filter("eventForHour",function(){
        return function(event,num,isCalledByClass){
            //isCalledByClass is used to ignore ng-class condition calls and not to increment displayed count
            if(!isCalledByClass)
                if(num==0){
                    angular.forEach(event, function (e,i) {
                        e.displayed=0;
                    });
                }
            var x=[];
            angular.forEach(event, function (e,i) {
                var start_split= e.start.split(':');
                var end_split= e.end.split(':');
                //console.log(start_split,end_split,num)
                if(num>=parseInt(start_split[0])&&num<=parseInt(end_split[0])){
                    if(!isCalledByClass){
                        e.displayed++;
                    }
                    x.push(e);
                }
            });
            return x;
        }
    });

})();

/*
* Notes
* moment("11-04-2015", "DD-MM-YYYY").diff(moment("03-04-2015", "DD-MM-YYYY"), 'days', true)
 8
* */

/*
* Events output json
* {
 "29-03-2015": [
 {
 "start": "2:30",
 "end": "3:30",
 "name": "Go to swimming",
 "fullday": false
 },
 {
 "start": "1:30",
 "end": "2:30",
 "name": "Jogging",
 "fullday": false
 },
 {
 "start": "2:30",
 "end": "23:99",
 "name": "Kenn Conference",
 "fullday": false
 }
 ],
 "30-03-2015": [
 {
 "start": "00:00",
 "end": "23:99",
 "name": "Kenn Conference",
 "fullday": true
 }
 ],
 "31-03-2015": [
 {
 "start": "00:00",
 "end": "23:30",
 "name": "Kenn Conference",
 "fullday": false
 }
 ],
 "03-04-2015": [
 {
 "start": "12:00",
 "end": "23:99",
 "name": "Go to Home",
 "fullday": false
 }
 ],
 "04-04-2015": [
 {
 "start": "00:00",
 "end": "23:99",
 "name": "Go to Home",
 "fullday": true
 }
 ],
 "05-04-2015": [
 {
 "start": "00:00",
 "end": "23:99",
 "name": "Go to Home",
 "fullday": true
 }
 ],
 "06-04-2015": [
 {
 "start": "00:00",
 "end": "23:99",
 "name": "Go to Home",
 "fullday": true
 }
 ],
 "07-04-2015": [
 {
 "start": "00:00",
 "end": "23:99",
 "name": "Go to Home",
 "fullday": true
 }
 ],
 "08-04-2015": [
 {
 "start": "00:00",
 "end": "23:99",
 "name": "Go to Home",
 "fullday": true
 }
 ],
 "09-04-2015": [
 {
 "start": "00:00",
 "end": "23:99",
 "name": "Go to Home",
 "fullday": true
 }
 ],
 "10-04-2015": [
 {
 "start": "00:00",
 "end": "23:99",
 "name": "Go to Home",
 "fullday": true
 }
 ],
 "11-04-2015": [
 {
 "start": "00:00",
 "end": "12:30",
 "name": "Go to Home",
 "fullday": false
 }
 ]
 }
* */