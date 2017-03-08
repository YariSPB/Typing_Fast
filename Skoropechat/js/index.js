// https://github.com/YariSPB/Speed-typing-lesson
$(document).ready(function () {

  var textStr = [ // массив с печатныеми заданиями
                  [ // level 1
                    ["ff jjjj ff jj fff jjj fj fj jjf fff jj"],
                    ["ff jjf fjfj fffj jjjf ffjj fj ff jf"]
                  ], // level 1
                  [ // level 2
                    ["dd kk dk dk kd kd ddd kkd ddk dkk dd"],
                    ["kk dddd kkkk ddkk kkdd kdd kddd dk kk"]
                  ], // level 2
                  [ // level 3
                    ["ff ddd jjjj kkkk df df jk jk jjj ff"],
                    ["dd jjkk kkdd fdfd jkjk dfjk dfjk kk"],
                    ["jk dfdf dfjj jjfd kkjj dfjk ddkd dk"]
                  ], // level 3

                ];
  var pressCounter= 0; // счетчик печати символов в пределах одной строки
  var lineNum = 0; // счетчик строки задания
  $("#wellId").html(textStr[0][0][0]);
  $("#well2Id").html(textStr[0][1][0]);
  $(".smallstuff").html(textStr[0][1][0].slice(0,4));


  var Typing = "la";
  var htmlDone = '';// отмечаем? то что было отпечатано
  var typedKey="";// нажатая кпопка
  var milisecArray=[]; // getMilisecToArraY(milisecArray)// массив, который хранит время нажатия кнопок
  var speedRate = 0; // 0-100
  var CPMMAX = 900; // typing speed, world record is around 900, Characters per minute
  var timer;
  var time;
  var victory100=0; // нужно набрать 100 балов, чтобы пройти уровень
  var WinTime = 5*1000; // 10 sec or 10 000 milisec
  var typingSpeedGoal= 200;
  var mistakesCounter = 0;
  var WinState=0; // 1 is after victory
  var currentLevel=0; // must increment each time  I win
  var totalNumberOfLevels= textStr.length;
  var updateRate = 100;
  var soundKey = document.getElementById("soundKeyId");
  var caret = document.getElementById("soundCaretId"); // mistake sound
  var toCountAverageSpeedInputs= 8;
    var correctColor = "#0073e6";
    var wrongColor="#cc6600";
    var taskColor="#4da6ff";
var myReccomendationSpeed=200;
        // $("#buttonSetRecomId").html("Играть на рекомедованной скорости 200 знаков в минуту!");

  $("#check3Id").html(typingSpeedGoal);
  $( "#inputId").attr("placeholder",typingSpeedGoal);
    $("#gameCommentId").html("Печатай быстро и без ошибок!");
  setcolortoKey(textStr[0][0][0][0],taskColor);

//>>>>FOLLOWTYPING<<<<<<
 var followTyping = function(myStr, n, keyTyped){
   var strDone  = myStr.slice(n-1,n);
   var strThis = myStr.slice(n,n+1);
   var strNext = myStr.slice(n+1);

     setcolortoKey(strDone.slice(-1),"white"); //убрать эффект из предыдущей
     setcolortoKey(strThis,taskColor);
     changeFingers(strThis,strNext.slice(0,1));

   var htmlThis = "<span id=\"spanThisId\">"+strThis+"</span>";
   var htmlNext = "<span id=\"spanNextId\">"+strNext+"</span>";

   if ( strDone == keyTyped){
       soundKey.pause();
        soundKey.currentTime = 0;
        soundKey.play();
     htmlDone+= "<span id=\"spanDoneCorrectId\">"+strDone+"</span>";
     CSS_Plugcolor(keyTyped,correctColor);
       }
   else{ // MISTAKE
       caret.pause();
        caret.currentTime = 0;
        caret.play();
     mistakesCounter++;
    htmlDone+= "<span id=\"spanDoneWrongId\">"+strDone+"</span>";
    CSS_Plugcolor(keyTyped,wrongColor);
       }
    var htmlLine = htmlDone+htmlThis+htmlNext;
  $("#wellId").html(htmlLine);

  return;
 } ; // foolowTyping Funca
  //>>>>END FOLLOWTYPING<<<<<<

//>>>>RESET funca <<<<
 function reset(levelArg){
     clearInterval(timerVisualScaleCPM);
   victory100=0;
   currentLevel = levelArg;
   $("#wellId").html(textStr[levelArg][0][0]);
   $("#well2Id").html(textStr[levelArg][1][0]);
   $(".smallstuff").html(textStr[levelArg][1][0].slice(0,4));
    pressCounter = 0;
    htmlDone = '';
   $("div#keyboardId button").css ("background", "white");
    followTyping(textStr[levelArg][0][0], 0, '');

    lineNum = 0;
    milisecArray=[];

    timerVisualScaleCPM = setInterval(function(){
   visualScaleCPM();
    },updateRate);

    $("#well3Id").html(0);
    WinState=0;

 }  //>>>>RESET funca<<<<
 //>>>>RESET funca<<<<


 //>>>>RESET<<<<
  $("#resetId").on("click", function() {
   reset(currentLevel);
     }); // reset on clickrtrt
 //>>>>RESET<<<<

  followTyping(textStr[currentLevel][0][0], 0,'');

 function getKey(){ // возвращает нажатую на клавиутуре кнопку, символ.
    if (event.which == null) { // IE
      if (event.keyCode < 32) {return null;}
        else {// спец. символ
      Typing+= String.fromCharCode(event.keyCode);
      var currentSymbol = String.fromCharCode(event.keyCode);
   //   $("#responseId").html(Typing);
      return currentSymbol;
        }
  } else

  if (event.which != 0 && event.charCode != 0) { // все кроме IE
    if (event.which < 32) {return null;} // спец. символ
    else
    {
      Typing+= String.fromCharCode(event.keyCode);
   // $("#responseId").html(Typing);
      var currentSymbol = String.fromCharCode(event.keyCode);

    return currentSymbol;
    } // остальные
  }

  return null;
 } // getKey Funca
 // >>>>getKey Funca<<<<<<<


 //>>>>>>NEXTLINE<<<<<<<<<<<<<
 function nextLine(obj){ // loopStrings(textStr)   [currentLevel]
    // caret.play();
  if (lineNum+1< obj[currentLevel].length){
    lineNum+=1;
    htmlDone = '';
   $("#wellId").html(obj[currentLevel][lineNum][0]);
   if (lineNum+1< obj[currentLevel].length){
      $("#well2Id").html(obj[currentLevel][lineNum+1][0]);
       $(".smallstuff").html(obj[currentLevel][lineNum+1][0].slice(0,4));
       }
    else{
     $("#well2Id").html(obj[currentLevel][0][0]);
     $(".smallstuff").html(obj[currentLevel][0][0].slice(0,4));
    }
    pressCounter = 0;
    //setcolortoKey(obj[currentLevel][lineNum][0][0],taskColor);
    followTyping(obj[currentLevel][lineNum][0], 0, '');

    return;
   }
   lineNum=0;
   htmlDone = '';
   $("#wellId").html(obj[currentLevel][lineNum][0]);
   $("#well2Id").html(obj[currentLevel][lineNum+1][0]);
   $(".smallstuff").html(obj[currentLevel][lineNum+1][0].slice(0,4));
    pressCounter = 0;
    followTyping(obj[currentLevel][lineNum][0], 0, '');

   return;
 } //loopString
 //>>>>>>NEXTLINE<<<<<<<<<<<<<

// >>>Creating timing array in miliseconds<<<
function getMilisecToArray(arr){//записывает текущее время в массив в милисекундах
  var d = new Date;
  var t = d.getTime();
  arr.push(t);
}
  // >>>  getMilisecToArraY  <<<

  // >>>  getAverageSpeed  <<< //  возвращает скорость печати в знаках в минуту
 function  getAverageSpeed(arr,numOfPlugs){ // arr  - это массив исходных данных, numOfPlugs - это кол-во элементов с конца массива для расчета скорости печати.
   if (arr.length<numOfPlugs){return 0;}
   //else {return 5;}

   var arrShort = [];//arr.slice(arr.length-numOfPlugs);
   for (var i=arr.length-numOfPlugs+1; i<arr.length;i++){
     arrShort.push(arr[i]-arr[i-1]);
   } // for loop
  // alert(arrShort[0]+" "+arrShort[1]+" "+arrShort[2]+" "+arrShort[3]);
   var d = new Date;
   var t = d.getTime();

   var typingPause = t-arr[arr.length-1];
  // alert("typing pause"+typingPause);
   var average = arrShort.reduce(function(a,b){return a+b;},0)/(numOfPlugs-1);
   //alert("average of 5 is: "+ average);
   if (typingPause< average){
      return Math.round(60*1000/average);
   }
     average = (arrShort.reduce(function(a,b){return a+b;},0)+ typingPause)/(numOfPlugs);
     return Math.round(60*1000/average);

 }
  // >>>  getAverageSpeed  <<<

// >>>  AdjustSpeedScale <<<
function   adjustSpeedScale(frequencyMiliSec){
  var bla = "5";
   timer = setInterval(function() {
  speedRate = Math.round(getAverageSpeed(milisecArray,4)/CPMMAX*100);
    //bla+="5";
   $("#well3Id").html(speedRate+"\%");
  }, frequencyMiliSec);

 // clearInterval(timer)
}
// >>>  AdjustSpeedScale <<<

 adjustSpeedScale(500);

// >>>  ifIWonThisGame <<<
function ifIWonThisGame(){
  $("#wellId").html("Уровень пройден! Молодчина ты моя!");
    $("#gameCommentId").html("Жжешь!");
 $(".smallstuff").html('');
    $( "#progressRedId").attr("style","min-width: 1%; width:100\%");
    $( "#progressRedId").html("100\%");
  // clearInterval(time);
  WinState=1;
  if (currentLevel == totalNumberOfLevels-1){
    $("#gameCommentId").html("Вы прошли ВСЮ ИГРУ!!!");
    return;
  }
  currentLevel++;
  var sec3 = 3;

   $("#gameCommentId").html("Следующий уровень начнется через "+sec3+" сек");
  var thisTimer = setInterval(function(){
    sec3--;
 if (sec3==-1){
      //ниже записываем промежутки быстрой печати для расчета рекоменд скорости
    /* function getTimeIntervals(arr){
         var arrMid=arr;
         var res=[];
         var a=0;
         var b=0;
        while (arrMid.length>2) {
             a = arrMid.pop();
             b = arrMid.pop();
         res.push(a-b);
           // alert("data  "+res);
        }
         //alert("res length:  "+res.length);
         //alert("milisec length:   "+arr.length);
         return res;
     }
     function getAverageTypingSpeed(arr){
         var res=getTimeIntervals(arr);
         var res2=res.slice(-10);
         var len=res2.length;
         var Redu= res2.reduce(function(a,b){return a+b},0);
        // alert("final res length:  "+ len);
         //alert("res reduced:  "+Redu);
         return Math.round(60000/Redu*len);
     }
     myReccomendationSpeed =getAverageTypingSpeed(milisecArray);
     //alert(myReccomendationSpeed);
     $("#buttonSetRecomId").html("Играть на рекомедованной для Вас скорости: "+myReccomendationSpeed+" знаков в минуту!");
     */
     //выше записываем промежутки быстрой печати для расчета рекоменд скорости

      reset(currentLevel);
      clearInterval(thisTimer);
    }
    else{
      $("#gameCommentId").html("Следующий уровень начнется через "+sec3+" сек");
    }

  },1000);


}
// >>> end ifIWonThisGame <<<


 // >>>  visualScaleCPM in squares<<<
function visualScaleCPM(){
    var html = '';
    var speedRate;
  speedRate = getAverageSpeed(milisecArray,toCountAverageSpeedInputs);

    function repeat(s, n){
    var a = [];
    while(a.length < n){
        a.push(s);
    }
    return a.join('');
} // repeat
   //var step=0.05;
   //var x ;
    var xxx;
    if (speedRate>=typingSpeedGoal){
     // x = 20;
     xxx=100;
    }
    else{
    // x= Math.round(speedRate/typingSpeedGoal/step);
      xxx=  Math.round(speedRate/typingSpeedGoal*100);
    }
    $( "#progressValuesId").attr("style","min-width: 1%; width:"+xxx+"\%");
   //html=repeat("<span id=\"spanScaleId\">_</span><span> </span>", x);
   //html+=repeat("<span id=\"spanScaleLowId\">_</span><span> </span>", 20-x);

    //>>>> Local RED area fucntion  <<<<
    adjustVictory100(speedRate/*,typingSpeedGoal*/,updateRate);
    if (victory100>=100){
      clearInterval(timerVisualScaleCPM); // last added
      ifIWonThisGame();
      return;//last added
     // alert("We won!");
     }
   // var redStep = 0.125;
    //var y;
   // y= Math.round(victory100/100/redStep);

    // if (y>8){
     // y = 8;
   // }
    //>>>> Local RED area fucntion  <<<<
     $( "#progressRedId").attr("style","min-width: 1%; width:"+victory100+"\%");
    $( "#progressRedId").html(victory100+"\%");
  // html+=repeat("<span id=\"spanHoldId\">___</span><span> </span>", y);
   //html+=repeat("<span id=\"spanHoldLowId\">___</span><span> </span>", 8-y);
   //$("#well5Id").html(html);
  }

// }
  // >>>  END visualScaleCPM in squares<<<
 var timerVisualScaleCPM = setInterval(function(){
   visualScaleCPM();
 },updateRate);


  // >>>  adjustVictory100  <<<

  function adjustVictory100 (typingSpeed/*,goalSpeed*/,rateOfUpdate){
    var littleSteps = WinTime/rateOfUpdate;
      if (victory100<0){
        victory100=0;
          $("#gameCommentId").html("Печатай быстро и без ошибок!");
         }
      if (typingSpeed>=typingSpeedGoal){
      victory100+=100/littleSteps;
      $("#gameCommentId").html("Молодец! Поддерживай этот темп печати!");
      //arrOfQuickness.push(milisecArray[milisecArray.length-1]-milisecArray[milisecArray.length-2]); // добавляем скорост печати в массив рекоменд скорости
        }
      else {
         // $("#gameCommentId").html("Расслабляемся?");
        victory100-= 2*100/littleSteps;
        if (victory100<0){
        victory100=0;
         }
      }
      if (mistakesCounter>0){
          $("#gameCommentId").html("Ошибаешься, товарищ! Давай почище!");
          var bka=setTimeout(function(){
           $("#gameCommentId").html("Набирай скорость, но без ошибок!");
          },2000);
       victory100-= 30*mistakesCounter*100/littleSteps;
        mistakesCounter=0;
        if (victory100<0){
        victory100=0;
         }
      }
    return victory100;
  } // >>>  END adjustVictory100  <<<

  // >>>  END adjustVictory100  <<<

  // >>>  setGoalSpeed <<<
   $("#buttonMinusId").on("click",function(){
     typingSpeedGoal=typingSpeedGoal-10;
     $( "#inputId").attr("placeholder",typingSpeedGoal);
       document.getElementById("inputId").value =typingSpeedGoal;
    $("#check3Id").html(typingSpeedGoal);
       return;
   });
   $("#buttonPlusId").on("click",function(){
     typingSpeedGoal=typingSpeedGoal+10;
     $( "#inputId").attr("placeholder",typingSpeedGoal);
       document.getElementById("inputId").value =typingSpeedGoal;
    $("#check3Id").html(typingSpeedGoal);
   // $("#buttonPlusId").removeClass('active');
       return;
   });

  $("#buttonOkId").on("click",function(){
     var inputValue= $( "#inputId").val();
    typingSpeedGoal = parseInt(inputValue);
    $( "#inputId").attr("placeholder",typingSpeedGoal);
    $("#check3Id").html(typingSpeedGoal);
      return;
   // reset(currentLevel);
    });

$("#buttonSetRecomId").on("click",function(){
    typingSpeedGoal=myReccomendationSpeed;
     $( "#inputId").attr("placeholder",200);
       document.getElementById("inputId").value =200;
    $("#check3Id").html(200);
       return;
   });


  // >>>  END setGoalSpeed <<<




 //  группа функций, которые высвечивают нужные клавиши на клаиатуре
// >>>   CSS_KeyPlug <<<
function CSS_Plugcolor(mySymbol,mycolor){// some Symbol like strin
    var numbarAscii = mySymbol.charCodeAt(0);
    var jquerString="\#"+"button_"+numbarAscii+"_Id";
$(jquerString).css ("border", "2px solid "+mycolor);
$(jquerString).trigger("click");
//$(jquerString).css ("border-radius", "2px");
//$(jquerString).css ("left", "3px");
//$(jquerString).css ("down", "3px");

var timer=setTimeout(function(){
$(jquerString).css ("border", "");
//setcolortoKey(mySymbol,taskColor);
//$(jquerString).css ("right", "3px");
//$(jquerString).css ("up", "3px");
},500);
}


function setcolortoKey(mySymbol,mycolor){
        var numbarAscii = mySymbol.charCodeAt(0);
        var jquerString="\#"+"button_"+numbarAscii+"_Id";
        $(jquerString).css ("background-color", mycolor);
    }

function changeFingers(mySymbol,nextSymbol){
   // alert(mySymbol.charCodeAt(0));
    var arrLeft='qwertasdfgzxcvb';
    var pathToImg="pictures/fingers/fingers_"+mySymbol.charCodeAt(0)+".png";
    if ( mySymbol.charCodeAt(0)=== 32 ){
        {
            if (arrLeft.indexOf(nextSymbol) === -1 ){
                pathToImg="pictures/fingers/fingers_"+mySymbol.charCodeAt(0)+"_Left"+".png";
            }
            else{
                pathToImg="pictures/fingers/fingers_"+mySymbol.charCodeAt(0)+"_Right"+".png";
            }
        }

        }
    $("#fingersId").attr("src",pathToImg);
}


// >>>   END CSS_KeyPlug <<<

// >>>   совушки <<<
    var animalShifter = 1;
 var sovushkiTimer=setInterval(function(){
     if (victory100<=0){
        shiftAnimal();

    }
     else{
      shiftAnimal();
         var time1 = setTimeout(function(){
                        shiftAnimal();
                                },250);
     var time2 = setTimeout(function(){
                        shiftAnimal();
                                },500);
    var time3 = setTimeout(function(){
                        shiftAnimal();
                                },750);

     }
     return;

 },1000);
    function shiftAnimal(){
      if (animalShifter ===1){
       $("#animalShiftId").attr("src","pictures/sovi_1.png");
        animalShifter=2;
      }
        else{
          $("#animalShiftId").attr("src","pictures/sovi_2.png");
        animalShifter=1;
        }
        return;
    }

// >>>   END совушки<<<

  //>>>>>>>>>>>>>>>>>>>>>>>>
  $(document).keypress(function() {
    if (WinState!=1){
    // event.type должен быть keypress
    if (getKey() === null){
      return;
    }
    else{
      pressCounter++;
       /* soundKey.pause();
        soundKey.currentTime = 0;
        soundKey.play(); */
      //CSS_Plugcolor(getKey());
      getMilisecToArray(milisecArray);
      $("#well4Id").html(getAverageSpeed(milisecArray,4));
      followTyping(textStr[currentLevel][lineNum][0], pressCounter,getKey());
      if (pressCounter === textStr[currentLevel][lineNum][0].length){
        nextLine(textStr);
      } // if

    } // else
    }// if win state

  });// end of keycode

  // >>>> Level Click Setup <<<<<<<

  $("#level1Id").on("click", function() {
   reset(0);
     });
    $("#level2Id").on("click", function() {
   reset(1);
     });
    $("#level3Id").on("click", function() {
   reset(2);
     });



// >>>> End Level Click Setup <<<<<<<


 //$("#responseId").html(Typing);


   }); // doc ready funca
