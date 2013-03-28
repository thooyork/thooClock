thooClock
=========

a jQuery analogue clock plugin with alarm function.

Implementation
--------------

<pre>
&lt;script language="javascript" type="text/javascript" src="http://code.jquery.com/jquery-latest.min.js"&gt;&lt;/script&gt; 
&lt;script language="javascript" type="text/javascript" src="js/jquery.thooClock.js"&gt;&lt;/script&gt;  	

&lt;script language="javascript" type="text/javascript"&gt;
  $('#myDIV').thooClock();
&lt;/script&gt;  
</pre>

Options
-------
<pre>
 $('#myDIV').thooClock({
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
    alarmTime:'14:25',
    showNumerals:true,
    brandText:'THOOYORK',
  	brandText2:'Germany',
    onAlarm:function(){
      //callback on Alarm
    },
    offAlarm:function(){
      //callback on Alarm end
    },
    onEverySecond:function(){
      //callback do sttuff every second
    }
 });
</pre>
