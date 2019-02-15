let __extends = (this && this.__extends) || function (d, b) {
  for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

//数学函数
function jMax(arr) {
  return Math.max.apply(null, arr);
}
function jMin(arr) {
  return Math.min.apply(null, arr);
}
function jAverage(arr) {
  var sum = eval(arr.join("+"));
  return ~~(sum / arr.length * 100) / 100;
}
function jStddev(arr) {
  var sum = function (x, y) { return x + y; };
  var square = function (x) { return x * x; };
  var mean = arr.reduce(sum) / arr.length;
  var deviations = arr.map(function (x) { return x - mean; });
  return Math.sqrt(deviations.map(square).reduce(sum) / (arr.length - 1));
}

function jTrueRange(preClose, curHigh, curLow) {
  return Math.max(preClose, curHigh) - Math.min(preClose, curLow);
}

function mixins(target) {
  var sources = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    sources[_i - 1] = arguments[_i];
  }
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }
  var output = Object(target);
  for (var index = 0; index < sources.length; index++) {
    var source = sources[index];
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
}

function arrayObjectIndexOf(array, property, expectedValue) {
  var len = array.length;
  for (var i = 0; i < len; i++) {
    if (array[i][property] === expectedValue) {
      return i;
    }
  }
  return -1;
}

//深度复制
function deepCopy(source) {
  var result = {}
  for (var key in source) {
    result[key] = typeof source[key] === 'object' ? deepCopy(source[key]) : source[key]
  }
  return result
}

//获取元素长宽
function getElementSize(element) {
  var cHeight = 0, cWidth = 0;
  if (window.getComputedStyle) {
    cHeight = window.getComputedStyle(element, null).getPropertyValue('height');
    cWidth = window.getComputedStyle(element, null).getPropertyValue('width');
  } else {
    cHeight = element.currentStyle['height'];
    cWidth = element.currentStyle['width'];
    if (cHeight == 'auto') {
      cHeight = element.offsetHeight;
    }
    if (cWidth == 'auto') {
      cWidth = element.offsetWidth;
    }
  }
  return { width: parseFloat(cWidth.replace('px', '')), height: parseFloat(cHeight.replace('px', '')) };
}
//转换周期为数字
function convertCycleToNumber(cycle) {
  var cycleSign = cycle[cycle.length - 1]
  var cycleNumber = cycle.substr(0, cycle.length - 1)
  if (cycleSign === 'H') {
    cycleNumber = cycleNumber * 60
  } else if (cycleSign === 'D') {
    cycleNumber = cycleNumber * 60 * 24
  } else if (cycleSign === 'W') {
    cycleNumber = cycleNumber * 60 * 24 * 7
  } else if (cycleSign === 'U') {
    cycleNumber = cycleNumber * 60 * 24 * 30
  } else if (cycleSign === 'Y') {
    cycleNumber = cycleNumber * 60 * 24 * 365
  }
  return cycleNumber
}

function ConvertToRealDateTime(exchange, tradeDay, time) {
  if (time.length == 5) {
    time = time + ':00';
  }
  var realDay = new Date(tradeDay.substr(0, 4) + '-' + tradeDay.substr(4, 2) + '-' + tradeDay.substr(6, 2) + ' ' + time);
  var dayOfWeek = realDay.getDay();
  if (exchange == "DCE" || exchange == "SHFE" || exchange == "INE" || exchange == "ZENGKING") {
    if (time >= "20:59:00") {
      if (dayOfWeek == 1)
        realDay.setTime(realDay.getTime() - 1000 * 60 * 60 * 24 * 3);  //tradeDay.AddDays(-3).ToString("yyyyMMdd");
      else
        realDay.setTime(realDay.getTime() - 1000 * 60 * 60 * 24 * 1);  //tickData.RealDay = tradeDay.AddDays(-1).ToString("yyyyMMdd");
    } else if (time >= "00:00:00" && time <= "02:30:00") {
      if (dayOfWeek == 1)
        realDay.setTime(realDay.getTime() - 1000 * 60 * 60 * 24 * 2);//tickData.RealDay = tradeDay.AddDays(-2).ToString("yyyyMMdd");
    }
  }
  //var month = realDay.getMonth() + 1;
  //var day = realDay.getDate();
  return realDay; //new Date(realDay.getFullYear()+ '-' +(month>9?month:'0'+month) + '-' + (day>9?day:'0'+day) + ' ' + time);
}

function ClearCache() {
  ContractKLineObj.splice(0)
}

//根据Tick生成Bar数据
function GenerateBarData(tickData, cycle, listener) {
  if (tickData) {
    var realTime = ConvertToRealDateTime(tickData.Exchange, tickData.TradingDay, tickData.UpdateTime);// new Date(fields[13]);
    var year = realTime.getFullYear()
    var month = realTime.getMonth() + 1
    var date = realTime.getDate()
    var hour = realTime.getHours()
    var minute = realTime.getMinutes()
    if (cycle === '1M')
      DealWithMultiCycle(tickData, '1M', 1, GetDate1(year, month, date, hour, minute, 1), listener);
    else if (cycle === '3M')
      DealWithMultiCycle(tickData, '3M', 3, GetDate1(year, month, date, hour, minute, 3), listener);
    else if (cycle === '5M')
      DealWithMultiCycle(tickData, '5M', 5, GetDate1(year, month, date, hour, minute, 5), listener);
    else if (cycle === '15M')
      DealWithMultiCycle(tickData, '15M', 15, GetDate1(year, month, date, hour, minute, 15), listener);
    else if (cycle === '30M')
      DealWithMultiCycle(tickData, '30M', 30, GetDate1(year, month, date, hour, minute, 30), listener);
    else if (cycle === '1H')
      DealWithMultiCycle(tickData, '1H', 1, GetDate2(year, month, date, hour, "00", 1), listener);
    else if (cycle === '2H')
      DealWithMultiCycle(tickData, '2H', 2, GetDate2(year, month, date, hour, "00", 2), listener);
    else if (cycle === '4H')
      DealWithMultiCycle(tickData, '4H', 4, GetDate2(year, month, date, hour, "00", 4), listener);
    else if (cycle === '6H')
      DealWithMultiCycle(tickData, '6H', 6, GetDate2(year, month, date, hour, "00", 6), listener);
    else if (cycle === '12H')
      DealWithMultiCycle(tickData, '12H', 12, GetDate2(year, month, date, hour, "00", 12), listener);
    else if (cycle === '1D')
      DealWithMultiCycle(tickData, '1D', 1, GetDate3(year, month, date), listener);
  }
}


//处理实时Bar数据
var ContractKLineObj = []

function CheckInOneCycleMinute(realTime, curTime, cycleNum) {
  var year1 = realTime.getFullYear()
  var month1 = realTime.getMonth() + 1
  var date1 = realTime.getDate()
  var hour1 = realTime.getHours()
  var minute1 = realTime.getMinutes()

  var year2 = curTime.getFullYear()
  var month2 = curTime.getMonth() + 1
  var date2 = curTime.getDate()
  var hour2 = curTime.getHours()
  var minute2 = curTime.getMinutes()

  var minuteTotal1 = year1 * 365 * 24 * 60 + month1 * 30 * 24 * 60 + date1 * 24 * 60 + hour1 * 60 + minute1;
  var minuteTotal2 = year2 * 365 * 24 * 60 + month2 * 30 * 24 * 60 + date2 * 24 * 60 + hour2 * 60 + minute2;

  if ((minuteTotal1 - minuteTotal2) <= cycleNum) {
    return true;
  }

  return false;
}

function CheckInOneCycleHour(realTime, curTime, cycleNum) {
  var year1 = realTime.getFullYear()
  var month1 = realTime.getMonth() + 1
  var date1 = realTime.getDate()
  var hour1 = realTime.getHours()

  var year2 = curTime.getFullYear()
  var month2 = curTime.getMonth() + 1
  var date2 = curTime.getDate()
  var hour2 = curTime.getHours()

  var hourTotal1 = year1 * 365 * 24 + month1 * 30 * 24 + date1 * 24 + hour1;
  var hourTotal2 = year2 * 365 * 24 + month2 * 30 * 24 + date2 * 24 + hour2;

  if ((hourTotal1 - hourTotal2) <= cycleNum) {
    return true;
  }
  return false;
}

function CheckInOneCycleDay(realTime, curTime, cycleNum) {
  var year1 = realTime.getFullYear()
  var month1 = realTime.getMonth() + 1
  var date1 = realTime.getDate()

  var year2 = curTime.getFullYear()
  var month2 = curTime.getMonth() + 1
  var date2 = curTime.getDate()

  var dayTotal1 = year1 * 365 + month1 * 30 + date1;
  var dayTotal2 = year2 * 365 + month2 * 30 + date2;

  if ((dayTotal1 - dayTotal2) <= cycleNum) {
    return true;
  }

  return false;
}

function DealWithMultiCycle(tickData, cycle, cycleNum, dbRealTime, listener) {
  var realTime = ConvertToRealDateTime(tickData.Exchange, tickData.TradingDay, tickData.UpdateTime);
  //var year = realTime.getFullYear()
  //var month = realTime.getMonth() + 1
  var date = realTime.getDate()
  var hour = realTime.getHours()
  var minute = realTime.getMinutes()
  var lastPrice = tickData.LastPrice; //parseFloat(fields[5]);
  var lastVolume = tickData.Volume; //parseFloat(fields[6]);
  var openInst = tickData.OpenInterest;
  //var dayVolume = tickData.Volume; //parseFloat(fields[8]);

  var contract = tickData.Contract;// fields[0];
  var key = contract + '_' + cycle;
  var curTime = undefined;

  if (ContractKLineObj.hasOwnProperty(key)) {
    //if (Math.abs(dayVolume - ContractKLineObj[key].StartVolume) < 0.000000001){
    //     return;
    //}
    curTime = new Date(ContractKLineObj[key].dateTime);
    var flag1;

    if (cycle.indexOf('M') !== -1) {
      flag1 = ((curTime.getMinutes() !== minute && minute % cycleNum === 0) || !CheckInOneCycleMinute(realTime, curTime, cycleNum));
    }
    else if (cycle.indexOf('H') !== -1) {
      flag1 = ((curTime.getHours() !== hour && hour % cycleNum === 0) || !CheckInOneCycleHour(realTime, curTime, cycleNum));
    }
    else if (cycle.indexOf('D') !== -1) {
      flag1 = ((curTime.getDate() !== date && date % cycleNum === 0) || !CheckInOneCycleDay(realTime, curTime, cycleNum));
    }
    else {
      flag1 = (curTime.getMinutes() !== minute && minute % cycleNum === 0);
    }

    if (flag1) {
      //var curDayVolume = ContractKLineObj[key].StartVolume;
      //UpsertToDB(curModel, ContractKLineObj[key]);
      ContractKLineObj[key] = {
        contract: contract,
        cycle: cycle,
        open: lastPrice,
        high: lastPrice,
        low: lastPrice,
        close: lastPrice,
        vol: 0,
        openInst: openInst,
        startVolume: lastVolume,//dayVolume - lastVolume
        dateTime: dbRealTime + ':00'
      };
      listener(ContractKLineObj[key], true)
      //UpsertToDB(curModel, ContractKLineObj[key]);
    }
    else {
      ContractKLineObj[key].vol = lastVolume - ContractKLineObj[key].startVolume;

      if (ContractKLineObj[key].high < lastPrice) {
        ContractKLineObj[key].high = lastPrice;
      }

      if (ContractKLineObj[key].low > lastPrice) {
        ContractKLineObj[key].low = lastPrice;
      }
      ContractKLineObj[key].close = lastPrice;
      ContractKLineObj[key].openInst = openInst;
      //UpsertToDB(curModel, ContractKLineObj[key]);
      listener(ContractKLineObj[key], false)
    }
  }
  else {
    ContractKLineObj[key] = {
      contract: contract,
      cycle: cycle,
      open: lastPrice,
      high: lastPrice,
      low: lastPrice,
      close: lastPrice,
      vol: 0,
      openInst: openInst,
      startVolume: lastVolume,//dayVolume - lastVolume,
      dateTime: dbRealTime + ':00'
    };
    listener(ContractKLineObj[key], false)
    //UpsertToDB(curModel, ContractKLineObj[key]);
  }

}

function GetDate1(year, month, date, hour, minute, cycleNum) {

  var x = parseInt(minute / cycleNum);
  var minute = x * cycleNum;

  var yearStr = year.toString();
  var monthStr = month.toString();
  var dateStr = date.toString();
  var hourStr = hour.toString();
  var minuteStr = minute.toString();

  if (monthStr.length < 2) { monthStr = '0' + monthStr; }
  if (dateStr.length < 2) { dateStr = '0' + dateStr; }
  if (hourStr.length < 2) { hourStr = '0' + hourStr; }
  if (minuteStr.length < 2) { minuteStr = '0' + minuteStr; }

  return yearStr + '-' + monthStr + '-' + dateStr + ' ' + hourStr + ':' + minuteStr;
}

function GetDate2(year, month, date, hour, minute, cycleNum) {
  var x = parseInt(hour / cycleNum);
  var hour = x * cycleNum;
  var yearStr = year.toString();
  var monthStr = month.toString();
  var dateStr = date.toString();
  var hourStr = hour.toString();
  var minuteStr = minute.toString();

  if (monthStr.length < 2) { monthStr = '0' + monthStr; }
  if (dateStr.length < 2) { dateStr = '0' + dateStr; }
  if (hourStr.length < 2) { hourStr = '0' + hourStr; }
  if (minuteStr.length < 2) { minuteStr = '0' + minuteStr; }

  return yearStr + '-' + monthStr + '-' + dateStr + ' ' + hourStr + ':' + minuteStr;
}

function GetDate3(year, month, date) {
  var yearStr = year.toString();
  var monthStr = month.toString();
  var dateStr = date.toString();

  if (monthStr.length < 2) { monthStr = '0' + monthStr; }
  if (dateStr.length < 2) { dateStr = '0' + dateStr; }

  return yearStr + '-' + monthStr + '-' + dateStr;
}

export default {
  __extends,
  jMax,
  jMin,
  jAverage,
  jStddev,
  jTrueRange,
  mixins,
  arrayObjectIndexOf,
  ClearCache,
  GenerateBarData,
  ConvertToRealDateTime,
  convertCycleToNumber,
  getElementSize,
  deepCopy
};