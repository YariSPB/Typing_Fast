// Обзор функций
// Цель - научиться быстро печатать. Прохождение уровня при наборе целевой скорости печати (200 знаков в минуту, по умолчанию) и поддержание этой скорости печати без ошибок в течении некоторого времени (10 сек примерно).
// 1. ф-ция FOLLOWTYPING - бегунок, следит за набором текста, реагирует на ошибки.
//2. ф-ция reset - очищает переменные при переходе на нужный уровень.
//3/ ф-ция NEXTLINE - переключает строки внутри одного уровня, если строки закончились, начинает с первой заново по кругу.
// 4 ф-ция getAverageSpeed - считывает среднюю скорость печати в знаках в минуту, учитывает последние 8 кликов+ интервал после последнего клика.  
// 5 ф-ция ifIWonThisGame - при выигрыше переключает на следующий уровень
// 6 ф-ция visualScaleCPM - запускается с повторением. Анализирует данные и на основании их меняет параметры: скорость печати, сколько осталось до прохождения уровня и др
// 7 ф-ция adjustVictory100 - обновляет кол-во баллов. Нужно набрать 100, чтобы пройти уровень/ 
// прочие ф-ции

$(document).ready(function () {
// textSTR = это массив с уровнями игры.
    // в каждом уровне есть несколько строк, которые крутяться по кругу, пока уровень не пройден.
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
                    [ // level 4
                    ["ll ss ssll slsl lssl lsll ssl ss ls"],
                    ["ll slsl llsslsll ssl ssll slsl ls ss"]
                  ], // level 4
                  [ // level 5
                    ["jj ff kk dd ll ssssd df fj jk kl sdf sk"],
                    ["ks jf kd lslfl kl js kd jf sdfllk kkj jf"]
                  ], // level 5
                  [ // level 6
                    ["aa ;; ;;aa ;a;a a;;;a ;aa; a;aa a;"],
                    [";; ;a;a aa;;a;aa ;;a ;;aa ;a;a a;; ;;"]
                  ], // level 6
                    [ // level 7
                    ["ask dad all salads fall; lass as all"],
                    ["add salsa jaff kad; flask lass sad s;"],
                    ["ads fall alfa jak kaj dad ask llsd fk"]
                  ], // level 7
                    [ // level 8
                    ["gggg hhhh gg hh ggg hhh ggh hggh hh gh"]
                  ], // level 8
                    [ // level 9
                    ["glad glass gag had haha gal hal gaf hah"],
                    ["haha gaga glad hala hal hasha shash gl"]
                  ], // level 9
                          [ // level 10
                    ["glad dad had half a glass as salad; dad"],
                    ["shall ask glass flags had glass ask shall"],
                    ["flask had slash jaff"]
                  ], // level 10

                ];
  var pressCounter= 0; // счетчик печати символов в пределах одной строки
  var lineNum = 0; // счетчик строки задания
    // заполняем страничку данными первого уровня игры
  $("#wellId").html(textStr[0][0][0]);
  $("#well2Id").html(textStr[0][1][0]);
  $("#smallstuff").html(textStr[0][1][0].slice(0,4));


  var Typing = "la";
  var htmlDone = '';// отмечаем то, что было отпечатано розовым фоном
  var typedKey="";// нажатая кпопка
  var milisecArray=[]; // getMilisecToArraY(milisecArray)// массив, который хранит время нажатия кнопок
  var speedRate = 0; // 0-100
  var CPMMAX = 900; // typing speed, world record is around 900, Characters per minute
  var timer; // setInterval таймер
  var time; // setInterval таймер
  var victory100=0; // нужно набрать 100 балов, чтобы пройти уровень. Красная шкала
  var WinTime = 5*1000; // время непрерывной быстрой печати для выигрыша уровня 10 sec or 10 000 milisec
  var typingSpeedGoal= 200; // предустановленная цель печати знаков в минуту. Среднестатистическая
  var mistakesCounter = 0; // счетчик ошибок
  var WinState=0; // 1 в случае победы
  var currentLevel=0; // счетчик прохойденных уровней
  var totalNumberOfLevels= textStr.length;
  var updateRate = 100; // кол-во сверок данных в промежутке var WinTime
  var soundKey = document.getElementById("soundKeyId");// звук печати
  var caret = document.getElementById("soundCaretId"); // звук ошибки
  var toCountAverageSpeedInputs= 8; // кол-во нажиманий клавиатуры для подсчета средней скорости печати
    var correctColor = "#0073e6"; // цвет правильной печати 
    var wrongColor="#cc6600";// цвет ошибки
    var taskColor="#4da6ff";//
var myReccomendationSpeed=200;

$("#check3Id").html(typingSpeedGoal);
$( "#inputId").attr("placeholder",typingSpeedGoal);
$("#gameCommentId").html("Печатай быстро и без ошибок!");
  setcolortoKey(textStr[0][0][0][0],taskColor);
    
// Функция followTyping(бегунок) запускается после каждого нажатия клавиши клавиатуры. Она считывает нажатую кнопку, учиттывая текущую строку и место печати на строке.
// Меняет отображение строки по ходу печати, издает звуки печати,обнаруживает ошибки печати,  управляет визуализацией клавиатуры. 
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

       if ( strDone == keyTyped){ // если печатаем правильно
           soundKey.pause();
            soundKey.currentTime = 0;
            soundKey.play();
         htmlDone+= "<span id=\"spanDoneCorrectId\">"+strDone+"</span>";
         CSS_Plugcolor(keyTyped,correctColor);
           }
       else{ // если ошиблись
           caret.pause();
            caret.currentTime = 0;
            caret.play();
         mistakesCounter++;
        htmlDone+= "<span id=\"spanDoneWrongId\">"+strDone+"</span>";
        CSS_Plugcolor(keyTyped,wrongColor);
           }
        var htmlLine = htmlDone+htmlThis+htmlNext; // текущее отображение строки, меняется при каждом клике.
        $("#wellId").html(htmlLine);
        return;
    } ; // foolowTyping Funca
  //>>>>END FOLLOWTYPING<<<<<<
    
// Функция Reset : обнуляет счетчики и визуализации при обновлении уровня. входной параметр это уровень. 
//>>>>RESET funca <<<<
 function reset(levelArg){
        clearInterval(timerVisualScaleCPM); // прерывает регулярный анализ
       victory100=0; // сбивает победную красную шкалу
       currentLevel = levelArg; // устанавливает уровень
       $("#wellId").html(textStr[levelArg][0][0]);// выводит строку для печати
       $("#smallstuff").html(textStr[levelArg][1][0].slice(0,4));//показывает 3 первых символа следующей строки
        pressCounter = 0;//обнуляет счетчик нажатия клавиш 
        htmlDone = '';//очищает отображение строки
       $("div#keyboardId button").css ("background", "white"); // очищает визуализацию клавиатуры
        followTyping(textStr[levelArg][0][0], 0, ''); // настраивает бегунок в начало строки
        lineNum = 0; // выводит первую строку текущего уровня
        milisecArray=[]; // очищает массив с данными о времени кликов клавиатуры
        timerVisualScaleCPM = setInterval(function(){// запускает новый аналитический регулрный блок
                    visualScaleCPM();
                },updateRate);
        WinState=0;//обнуляет состояние победы в О
 }  //>>>>RESET funca<<<<
 //>>>>RESET funca<<<<

followTyping(textStr[currentLevel][0][0], 0,''); // первый запуск поводка для отображение начала строки

 function getKey(){ // возвращает нажатую на клавиутуре кнопку, символ.
    if (event.which == null) { // IE
          if (event.keyCode < 32) {return null;}
            else {// спец. символ
          Typing+= String.fromCharCode(event.keyCode);
          var currentSymbol = String.fromCharCode(event.keyCode);
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

//Функция nextLine: заменяет текущую строку на следующуу при подходе бегунка к концу строки. Если строк в уровне больше нет, то возвращает первую строку и так по кругу.. 
//Ссылается на текущий уровень. 
 //>>>>>>NEXTLINE<<<<<<<<<<<<<
 function nextLine(obj){ 
      if (lineNum+1< obj[currentLevel].length){//если еще есть строки в запасе
            lineNum+=1; // выводит следующую
            htmlDone = '';
            $("#wellId").html(obj[currentLevel][lineNum][0]);//выводит новую строку
            if (lineNum+1< obj[currentLevel].length){// проверяет уже через строку. если она есть то:
                    $("#smallstuff").html(obj[currentLevel][lineNum+1][0].slice(0,4));//выводит 3 первые символа
               }
            else{// если через строку уже конце, то выводит самую первую строку
                    $("#smallstuff").html(obj[currentLevel][0][0].slice(0,4));
            }
            pressCounter = 0;
            followTyping(obj[currentLevel][lineNum][0], 0, '');//ставит бегунок на начало строки
            return;
       }
       lineNum=0;//это в случае, если след строки не существует
       htmlDone = '';
       $("#wellId").html(obj[currentLevel][lineNum][0]);
       $("#smallstuff").html(obj[currentLevel][lineNum+1][0].slice(0,4));
        pressCounter = 0;
        followTyping(obj[currentLevel][lineNum][0], 0, '');
       return;
 } //loopString
 //>>>>>>NEXTLINE<<<<<<<<<<<<<

// >>>Создаем массив времени нажимания кнопок в милисекундах
function getMilisecToArray(arr){//записывает текущее время в массив в милисекундах
          var d = new Date;
          var t = d.getTime();
          arr.push(t);
    }
  // >>>  getMilisecToArraY  <<<
    
//Функция getAverageSpeed: берет последние numOfPlugs(кол-во) элементы массива и считает среднее. В нашем случае он считает среднее время между нажатиям кнопок. 
// >>>  getAverageSpeed  <<< //  возвращает скорость печати знаков в минуту
 function  getAverageSpeed(arr,numOfPlugs){ //
       if (arr.length<numOfPlugs){
           return 0;
       } // если не хватает данных для рассчета, ждем
       var arrShort = [];//
       for (var i=arr.length-numOfPlugs+1; i<arr.length;i++){
            arrShort.push(arr[i]-arr[i-1]);//наполняем массив целевыми данными
       } // for loop
       var d = new Date;
       var t = d.getTime();// сверяем текущее время, это нам понадобится
       var typingPause = t-arr[arr.length-1];// смотрим паузу после последнего клика
       var average = arrShort.reduce(function(a,b){
           return a+b;
       },0)/(numOfPlugs-1);//считаем среднюю скорость печати, но если !!
       if (typingPause< average){ // если после печати возникла длинная пауза, то уменьшам среднюю скорость печати. 
            return Math.round(60*1000/average);//возвращает кол-во знаков в минуту
       }
        average = (arrShort.reduce(function(a,b){return a+b;},0)+ typingPause)/(numOfPlugs);
        return Math.round(60*1000/average); //возвращает кол-во знаков в минуту

    }

    // Ф-ция ifIWonThisGame: запускается при прохождении уровня. Переводит на след уровень. Если все уровни пройдены, поздравляет с окончанием игры.  
// >>>  ifIWonThisGame <<<
function ifIWonThisGame(){
        $("#wellId").html("Уровень пройден! Молодец!");
        $("#gameCommentId").html("Так держать!");
        $("#smallstuff").html('');
        $( "#progressRedId").attr("style","min-width: 1%; width:100\%");
        $( "#progressRedId").html("100\%");
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
                  reset(currentLevel);
                  clearInterval(thisTimer);
            }
            else{
                    $("#gameCommentId").html("Следующий уровень начнется через "+sec3+" сек");
            }
        },1000);
}
// >>> end ifIWonThisGame <<<

// Ф-ция visualScaleCPM: сверяет среднюю скорость печати speedRate = getAverageSpeed
// На основании этих данных она двигает шкалы скорости печати и поддержки темпа печати. При наборе 100 баллов переводит на след уровень. 
 // >>>  visualScaleCPM in squares<<<
function visualScaleCPM(){
        var html = '';
        var speedRate;
        speedRate = getAverageSpeed(milisecArray,toCountAverageSpeedInputs);//сред скорость печати
        var xxx; // число для ввода в шкалу визуализации
        if (speedRate>=typingSpeedGoal){
            xxx=100; // если печатаем быстрее цели, то шкала заполненна на 100%
        }
        else{
            xxx=  Math.round(speedRate/typingSpeedGoal*100);
        }
        $( "#progressValuesId").attr("style","min-width: 1%; width:"+xxx+"\%");//шкала слева
        //>>>> Local RED area fucntion  <<<<
        adjustVictory100(speedRate,updateRate);// обновляем баллы победы, 0_100
        if (victory100>=100){ // если набрали 100 баллов
              clearInterval(timerVisualScaleCPM); // last added
              ifIWonThisGame();
              return;//last added
         }
        //>>>> Local RED area fucntion  <<<<
        $( "#progressRedId").attr("style","min-width: 1%; width:"+victory100+"\%");// шкала темпа справа
        $( "#progressRedId").html(victory100+"\%");
  }
  // >>>  END visualScaleCPM in squares<<<
    
 var timerVisualScaleCPM = setInterval(function(){ // запуск регулярной сверки данных, именно оно выявляет прохождение уровня
    visualScaleCPM();
 },updateRate);

//Ф-ция adjustVictory100 управляет баллами 0_100 победы. Если печатаем быстро, то добалвляет баллы, если ошибаемся, то срезает 30% баллов. 
  // >>>  adjustVictory100  <<<
  function adjustVictory100 (typingSpeed,rateOfUpdate){
        var littleSteps = WinTime/rateOfUpdate;
        if (victory100<0){
            victory100=0;
            $("#gameCommentId").html("Печатай быстро и без ошибок!");
        }
        if (typingSpeed>=typingSpeedGoal){
            victory100+=100/littleSteps;
            $("#gameCommentId").html("Молодец! Поддерживай темп печати!");
        }
        else {
            victory100-= 2*100/littleSteps;
            if (victory100<0){
                victory100=0;
            }
        }
        if (mistakesCounter>0){
            $("#gameCommentId").html("Не туда нажал! Бывает!");
            var bka=setTimeout(function(){
                $("#gameCommentId").html("Набирай скорость, но без ошибок!");
                },2000);
            victory100-= 20*mistakesCounter*100/littleSteps;
            mistakesCounter=0;
            if (victory100<0){
                victory100=0;
            }
        }
        return victory100;
  } 
// >>>  END adjustVictory100  <<<

// >>>  setGoalSpeed <<< устанавливаем целевую скорость печати при помощи jquery
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
    return;
});

$("#buttonOkId").on("click",function(){
    var inputValue= $( "#inputId").val();
    typingSpeedGoal = parseInt(inputValue);
    $( "#inputId").attr("placeholder",typingSpeedGoal);
    $("#check3Id").html(typingSpeedGoal);
    return;
});

$("#buttonSetRecomId").on("click",function(){
    typingSpeedGoal=myReccomendationSpeed;
    $( "#inputId").attr("placeholder",200);
    document.getElementById("inputId").value =200;
    $("#check3Id").html(200);
    return;
});
// >>>  END setGoalSpeed <<<

//  группа функций, которые высвечивают нужные клавиши на клавиатуре
    // >>>   CSS_KeyPlug <<<
function CSS_Plugcolor(mySymbol,mycolor){// some Symbol like strin
    var numbarAscii = mySymbol.charCodeAt(0);
    var jquerString="\#"+"button_"+numbarAscii+"_Id";
    $(jquerString).css ("border", "2px solid "+mycolor);
    $(jquerString).trigger("click");
    var timer=setTimeout(function(){
            $(jquerString).css ("border", "");
        },500);
}

function setcolortoKey(mySymbol,mycolor){
        var numbarAscii = mySymbol.charCodeAt(0);
        var jquerString="\#"+"button_"+numbarAscii+"_Id";
        $(jquerString).css ("background-color", mycolor);
    }

function changeFingers(mySymbol,nextSymbol){
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

  //Что происходит, если нажать клавишу?
    // записываем номер клика и время в массив. Двигаем бегунок. Переводим на след строку, когда нужно
  $(document).keypress(function() {
    if (WinState!=1){
            // event.type должен быть keypress
        if (getKey() === null){
            return;
        }
        else{
              pressCounter++;
              getMilisecToArray(milisecArray);
              followTyping(textStr[currentLevel][lineNum][0], pressCounter,getKey());
              if (pressCounter === textStr[currentLevel][lineNum][0].length){
                    nextLine(textStr);
              } // if
        } // else
    }// if win state
  });// end of keycode

// >>>> меняем уровни <<<<<<<
$("#level1Id").on("click", function() {
        reset(0);
     });
$("#level2Id").on("click", function() {
        reset(1);
     });
$("#level3Id").on("click", function() {
        reset(2);
     });
    $("#level4Id").on("click", function() {
        reset(3);
     });
    $("#level5Id").on("click", function() {
        reset(4);
     });
    $("#level6Id").on("click", function() {
        reset(5);
     });
    $("#level7Id").on("click", function() {
        reset(6);
     });
        $("#level8Id").on("click", function() {
        reset(7);
     });
        $("#level9Id").on("click", function() {
        reset(8);
     });
        $("#level10Id").on("click", function() {
        reset(9);
     });
// >>>> End Level Click Setup <<<<<<<

   }); // doc ready funca
