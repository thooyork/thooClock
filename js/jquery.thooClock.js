// thooClock, a jQuery Clock with alarm function
// by Thomas Haaf aka thooyork, http://www.smart-sign.com
// Twitter: @thooyork
// Version 0.9.20
// Copyright (c) 2013 thooyork

// MIT License, http://opensource.org/licenses/MIT


(function( $ ) {

    $.fn.thooClock = function(options) {
        
        this.each(function() {

        var cnv,
                ctx,
                el,
                defaults,
                settings,
                radius,
                dialColor,
                dialBackgroundColor,
                secondHandColor,
                minuteHandColor,
                hourHandColor,
                alarmHandColor,
                alarmHandTipColor,
                hourCorrection,
                x,
                y;

       defaults = {
                size:250,
                dialColor:'#000000',
                dialBackgroundColor:'transparent',
                secondHandColor:'#F3A829',
                minuteHandColor:'#222222',
                hourHandColor:'#222222',
                alarmHandColor:'#FFFFFF',
                alarmHandTipColor:'#026729',
                hourCorrection:'+0',
                alarmCount:1,
                showNumerals:true,
                sweepingMinutes:true,
                sweepingSeconds:true,
                numeralFont:'arial',
                brandFont:'arial'
            };

            settings = $.extend({}, defaults, options);

            el = this;

            el.size = settings.size;
            el.dialColor = settings.dialColor;
            el.dialBackgroundColor = settings.dialBackgroundColor;
            el.secondHandColor = settings.secondHandColor;
            el.minuteHandColor = settings.minuteHandColor;
            el.hourHandColor = settings.hourHandColor;
            el.alarmHandColor = settings.alarmHandColor;
            el.alarmHandTipColor = settings.alarmHandTipColor;
            el.hourCorrection = settings.hourCorrection;
            el.showNumerals = settings.showNumerals;
            el.numeralFont = settings.numeralFont;

            el.brandText = settings.brandText;
            el.brandText2 = settings.brandText2;
            el.brandFont = settings.brandFont;
            
            el.alarmCount = settings.alarmCount;
            el.alarmTime = settings.alarmTime;
            el.onAlarm = settings.onAlarm;
            el.offAlarm = settings.offAlarm;

            el.onEverySecond = settings.onEverySecond;

            el.sweepingMinutes = settings.sweepingMinutes;
            el.sweepingSeconds = settings.sweepingSeconds;

            x=0; //loopCounter for Alarm
            
            cnv = document.createElement('canvas');
            ctx = cnv.getContext('2d');

            cnv.width = this.size;
            cnv.height = this.size;
            //append canvas to element
            $(cnv).appendTo(el);

            radius = parseInt(el.size/2, 10);
            //translate 0,0 to center of circle:
            ctx.translate(radius, radius); 

            //set alarmtime from outside:
            
            $.fn.thooClock.setAlarm = function(newtime){
                el.alarmTime = checkAlarmTime(newtime);
            };

            $.fn.thooClock.clearAlarm = function(){
                    el.alarmTime = undefined;
                    startClock(0,0);
                    $(el).trigger('offAlarm');
            };


            function checkAlarmTime(newtime){
                var thedate;
                if(newtime instanceof Date){
                    //keep date object
                    thedate=newtime;
                }
                else{
                    //convert from string formatted like hh[:mm[:ss]]]
                    var arr = newtime.split(':');
                    thedate=new Date();
                    for(var i= 0; i <3 ; i++){
                        //force to int
                        arr[i]=Math.floor(arr[i]);
                        //check if NaN or invalid min/sec
                        if( arr[i] !==arr[i] || arr[i] > 59) arr[i]=0 ;
                        //no more than 24h
                        if( i==0 && arr[i] > 23) arr[i]=0 ;
                    }
                    thedate.setHours(arr[0],arr[1],arr[2]);
                }
                //alert(el.id);
                return thedate;
            };
        

            function toRadians(deg){
                return ( Math.PI / 180 ) * deg;
            }     

            function drawDial(color, bgcolor){
                var dialRadius,
                    dialBackRadius,
                    i,
                    ang,
                    sang,
                    cang,
                    sx,
                    sy,
                    ex,
                    ey,
                    nx,
                    ny,
                    text,
                    textSize,
                    textWidth,
                    brandtextWidth,
                    brandtextWidth2;

                dialRadius = parseInt(radius-(el.size/50), 10);
                dialBackRadius = radius-(el.size/400);

                ctx.beginPath();
                ctx.arc(0,0,dialBackRadius,0,360,false);
                ctx.fillStyle = bgcolor;
                ctx.fill();
                 
                for (i=1; i<=60; i+=1) {
                    ang=Math.PI/30*i;
                    sang=Math.sin(ang);
                    cang=Math.cos(ang);
                    //hour marker/numeral
                    if (i % 5 === 0) {
                        ctx.lineWidth = parseInt(el.size/50,10);
                        sx = sang * (dialRadius - dialRadius/9);
                        sy = cang * -(dialRadius - dialRadius/9);
                        ex = sang * dialRadius;
                        ey = cang * - dialRadius;
                        nx = sang * (dialRadius - dialRadius/4.2);
                        ny = cang * -(dialRadius - dialRadius/4.2);
                        text = i/5;
                        ctx.textBaseline = 'middle';
                        textSize = parseInt(el.size/13,10);
                        ctx.font = '100 ' + textSize + 'px ' + el.numeralFont;
                        textWidth = ctx.measureText (text).width;
                        ctx.beginPath();
                        ctx.fillStyle = color;

                        if(el.showNumerals){
                            ctx.fillText(text,nx-(textWidth/2),ny);
                        }
                    //minute marker
                    } else {
                       ctx.lineWidth = parseInt(el.size/100,10);
                        sx = sang * (dialRadius - dialRadius/20);
                        sy = cang * -(dialRadius - dialRadius/20);
                        ex = sang * dialRadius;
                        ey = cang * - dialRadius;
                    }

                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineCap = "round";
                    ctx.moveTo(sx,sy);
                    ctx.lineTo(ex,ey);
                    ctx.stroke();
                } 

                if(el.brandText !== undefined){
                    ctx.font = '100 ' + parseInt(el.size/28,10) + 'px ' + el.brandFont;
                    brandtextWidth = ctx.measureText (el.brandText).width;
                    ctx.fillText(el.brandText,-(brandtextWidth/2),(el.size/6)); 
                }

                if(el.brandText2 !== undefined){
                    ctx.textBaseline = 'middle';
                    ctx.font = '100 ' + parseInt(el.size/44,10) + 'px ' + el.brandFont;
                    brandtextWidth2 = ctx.measureText (el.brandText2).width;
                    ctx.fillText(el.brandText2,-(brandtextWidth2/2),(el.size/5)); 
                }

            }


            function twelvebased(hour){
                if(hour >= 12){
                    hour = hour - 12;
                }
                return hour;
            }



            function drawHand(length){
               ctx.beginPath();
               ctx.moveTo(0,0);
               ctx.lineTo(0, length * -1);
               ctx.stroke();
            }
            

            function drawSecondHand(milliseconds, seconds, color){
                var shlength = (radius)-(el.size/40);
                
                ctx.save();
                ctx.lineWidth = parseInt(el.size/150,10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;

                ctx.rotate( toRadians((milliseconds * 0.006) + (seconds * 6)));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size/80,10);
                ctx.shadowOffsetX = parseInt(el.size/200,10);
                ctx.shadowOffsetY = parseInt(el.size/200,10);

                drawHand(shlength);

                //tail of secondhand
                ctx.beginPath();
                ctx.moveTo(0,0);
                ctx.lineTo(0, shlength/15);
                ctx.lineWidth = parseInt(el.size/30,10);
                ctx.stroke();

                //round center
                ctx.beginPath();
                ctx.arc(0, 0, parseInt(el.size/30,10), 0, 360, false);
                ctx.fillStyle = color;

                ctx.fill();
                ctx.restore();
            }

            function drawMinuteHand(minutes, color){
                var mhlength = el.size/2.2;
                ctx.save();
                ctx.lineWidth = parseInt(el.size/50,10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
               
                if(!el.sweepingMinutes){
                    minutes.isInteger ? minutes : minutes = parseInt(minutes);
                }
                ctx.rotate( toRadians(minutes * 6));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size/50,10);
                ctx.shadowOffsetX = parseInt(el.size/250,10);
                ctx.shadowOffsetY = parseInt(el.size/250,10);

                drawHand(mhlength);
                ctx.restore();
            }

            function drawHourHand(hours, color){
                var hhlength = el.size/3;
                ctx.save();
                ctx.lineWidth = parseInt(el.size/25, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                ctx.rotate( toRadians(hours * 30));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size/50, 10);
                ctx.shadowOffsetX = parseInt(el.size/300, 10);
                ctx.shadowOffsetY = parseInt(el.size/300, 10);

                drawHand(hhlength);
                ctx.restore();
            }

            function timeToDecimal(time){
                var h,
                    m;
                if(time !== undefined){
                    h = twelvebased(time.getHours());
                    m = time.getMinutes();
                }
                return parseInt(h,10) + (m/60);
            }

            function drawAlarmHand(alarm, color, tipcolor){

                var ahlength = el.size/2.4;
                
                ctx.save();
                ctx.lineWidth = parseInt(el.size/30, 10);
                ctx.lineCap = "butt";
                ctx.strokeStyle = color;

                //decimal equivalent to hh:mm
                alarm = timeToDecimal(alarm);
                ctx.rotate( toRadians(alarm * 30));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size/55, 10);
                ctx.shadowOffsetX = parseInt(el.size/300, 10);
                ctx.shadowOffsetY = parseInt(el.size/300, 10);

                //drawHand(ahlength);

                ctx.beginPath();
                ctx.moveTo(0,0);
                ctx.lineTo(0, (ahlength-(el.size/10)) * -1);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = tipcolor;
                ctx.moveTo(0, (ahlength-(el.size/10)) * -1);
                ctx.lineTo(0, (ahlength) * -1);
                ctx.stroke();

                //round center
                ctx.beginPath();
                ctx.arc(0, 0, parseInt(el.size/24, 10), 0, 360, false);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.restore();
            }

            function timeCorrection(difference, unit) {
                var parts = difference.split('.');
                if (unit === 'hours') {
                    return hoursCorrection(parts[0]);
                } else if (unit === 'minutes') {
                    var minutes = parts[1];
                    if (!(+ minutes)) return 0;
                    return minutesCorrection(difference.charAt(0) + '0.' + minutes);
                }
            }

            function hoursCorrection(num){
                if(num !== '+0' && num !== ''){
                    if(num.charAt(0) === '+'){
                        //addNum
                        return + num.substring(1);
                    }
                    else{
                        //subNum
                        return - num.substring(1);
                    }
                }
                else{
                    return 0;
                }
            }

            function minutesCorrection(num) {
                var minutesInHours = Number(num);
                return minutesInHours ? minutesInHours * 60 : 0;
            }

            //listener
            if(el.onAlarm !== undefined){
            	$(el).on('onAlarm', function(e){
                	el.onAlarm();
                	e.preventDefault();
                	e.stopPropagation();
            	});
            }

            if(el.onEverySecond !== undefined){
                $(el).on('onEverySecond', function(e){
                    el.onEverySecond();
                    e.preventDefault();
                });
            }

            if(el.offAlarm !== undefined){
	            $(el).on('offAlarm', function(e){
    	            el.offAlarm();
        	        e.stopPropagation();
            	    e.preventDefault();
           		});
			}

            y=0;

            function startClock(x){
                var theDate,
                    ms,
                    s,
                    m,
                    hours,
                    mins,
                    h,
                    exth,
                    extm,
                    allExtM,
                    allAlarmM,
                    atime;

                theDate = new Date();
                s = theDate.getSeconds();
                el.sweepingSeconds ? ms = theDate.getMilliseconds() : ms = 0;
                mins = theDate.getMinutes();
                m = (mins + timeCorrection(el.hourCorrection, 'minutes')) + (s/60);
                hours = theDate.getHours();
                h = twelvebased(hours + timeCorrection(el.hourCorrection, 'hours')) + (m/60);

                ctx.clearRect(-radius,-radius,el.size,el.size);

                drawDial(el.dialColor, el.dialBackgroundColor);

                if(el.alarmTime !== undefined){
                    el.alarmTime = checkAlarmTime(el.alarmTime);
                    drawAlarmHand(el.alarmTime, el.alarmHandColor, el.alarmHandTipColor);
                }
                drawHourHand(h, el.hourHandColor);
                drawMinuteHand(m, el.minuteHandColor);
                drawSecondHand(ms, s, el.secondHandColor);

                //trigger every second custom event
                if(y !== s){
                    $(el).trigger('onEverySecond');
                    y = s;
                }
               
                if(el.alarmTime !== undefined){
                    allExtM = (el.alarmTime.getHours()*60*60) + (el.alarmTime.getMinutes() *60) + el.alarmTime.getSeconds();
                }

                allAlarmM = (hours*60*60) + (mins*60) + s;

                //alarmMinutes greater than passed Minutes;
                if(allAlarmM >= allExtM){
                    x+=1; 
                }
                //trigger alarm for as many times as i < alarmCount
                if(x <= el.alarmCount && x !== 0){
                   $(el).trigger('onAlarm');
                }
                
                window.requestAnimationFrame(function(){startClock(x)});

            }

            startClock(x);

   });//return each this;
  };     

}(jQuery));