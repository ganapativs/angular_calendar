# angular_calendar
Angular Calendar with month and day traversal, event list(Currently day traversal limited to month)

#Demo
<a href="http://meetguns.com/angular_calender/" target="_blank">http://meetguns.com/angular_calender/</a>

#Require
Angular
Moment js

#Usage:
<code>
  <pre>
     &lt;div class="calender_wrap" ng-controller="calendar as cal" ng-cloak &gt;
         &lt;calendar selected="cal.today" ng-model="cal.events" &gt; &lt;/calendar &gt;
     &lt;/div &gt;
  </pre>
</code>

Get selected date:
{{cal.today.format('DD-MM-YYYY')}}

Events json sample:
<code><pre>
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
</pre></code>
