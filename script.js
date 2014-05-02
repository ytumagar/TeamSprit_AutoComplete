
// ==UserScript==
// @name        Teamsprit Utility
// @namespace   http://www.ytumagar.com/teamsprit
// @description Teamsprit utility
// @include     https://teamspirit.ap0.visual.force.com/apex/AtkWorkTimeView*
// @version     1
// ==/UserScript==

var start = "9:45";
var end = "19:45";
var dist = 20;

//////////////////////////
var startTime = "startTime";
var endTime = "endTime";
var dialogInputTime = "dialogInputTime";
var dialogNote = "dialogNote";
var dialogNoteText2 = "dialogNoteText2";

var getRandTimeStr = function(baseTime, distMin){
  var hh, mm;
  var dt;
  var distRnd;

  var re = /^(\d?\d):(\d\d)$/;
  if (re.test(baseTime)){
    hh = RegExp.$1;
    mm = RegExp.$2;
    dt = new Date(2014,0,1,hh,mm,0,0);
    distRnd = Math.round((Math.random() - 0.5)*2*(distMin/5))*5;
    dt = new Date(dt.getTime() + distRnd * 1000 * 60);
    return dt.getHours() + ":" + dt.getMinutes();
  } else {
    return "";
  }

};


var getElement = function(id){
  return document.getElementById(id);
};

var log = function(msg){
    console.log("%c"+msg, "background-color:#5bb75b;color:white");
};

var setStartTime = function(){
  var elem = getElement(startTime);
  if (elem.value===""){
    elem.value = getRandTimeStr(start, dist); 
  }
};

var setEndTime = function(){
  var elem = getElement(endTime);
  if (elem.value===""){
    elem.value = getRandTimeStr(end, dist); 
  }  

};

var setNote = function(){
  var elem = getElement(dialogNoteText2);
  if (elem.value === "") {
    elem.value='打刻漏れ';
  }
};

var moBodyFunc = function(mutationRecords){
  for (var i=0;i<mutationRecords.length;i++){
    var nodeID = mutationRecords[i].addedNodes[0].id;
    if (nodeID === 'dialogInputTime'){
      log('dialogInputTime added.');
      moDivTime.observe(getElement(dialogInputTime), {childList: true, subtree: true});
      setStartTime();
      setEndTime();
    }else if(nodeID === dialogNote){
      log('dialogNote added.');
      moDivNote.observe(getElement(dialogNote), {attributes: true, attributeOldValue: true});
      setNote();
    }
  } 
};

var moDivTimeFunc = function(mutationRecords){
  for (var i=0;i<mutationRecords.length;i++){
    if (mutationRecords[i].addedNodes.length === 0) continue;
    var nodeID = mutationRecords[i].addedNodes[0].id;
    if (nodeID === 'startTime'){
      log('startTime added.');
      setStartTime();
    } else if (nodeID === 'endTime'){
      setEndTime();
    }
  }
};

var moDivNoteFunc = function(mutationRecords){
  for (var i=0;i<mutationRecords.length;i++){
    var rec = mutationRecords[i];
    if (rec.attributeName ==="class"){
      var target = rec.target;
      if ((rec.oldValue === "dijitDialog") && target.getAttribute("class").indexOf('dijitDialogFocused') > 0){
        setNote();
      }
      
    }
  }
};

var moBody = new MutationObserver(moBodyFunc);
var moDivTime = new MutationObserver(moDivTimeFunc);
var moDivNote = new MutationObserver(moDivNoteFunc);

moBody.observe(document.getElementsByTagName('body')[0], {childList: true});
