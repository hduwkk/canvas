import jCommon from './jCommon'
let { __extends, jMin, jMax, jStddev, jTrueRange, jAverage, mixins } = jCommon

let jMath = {};
(function (jMath) {
  var averageE = (function () {
    function averageE(n1) {
      this.n1 = n1;
      this.factor = 2.0 / (n1 + 1);
      this.preLastValue = undefined;
      this.lastValue = undefined;
    }
    averageE.prototype.calculate = function (data) {
      var _a = this, lastValue = _a.lastValue, preLastValue = _a.preLastValue, factor = _a.factor;
      var result;
      if (lastValue === undefined) {
        result = this.preLastValue = this.lastValue = data;
      }
      else {
        this.preLastValue = lastValue;
        result = this.lastValue = lastValue + factor * (data - lastValue);
      }
      return result;
    }
    averageE.prototype.resetValue = function () {
      this.lastValue = this.preLastValue;
    }
    averageE.prototype.setParameter = function (n1) {
      this.n1 = n1;
      this.factor = 2.0 / (n1 + 1);
      this.preLastValue = undefined;
      this.lastValue = undefined;
    }
    return averageE;
  }());
  jMath.averageE = averageE;

  var averageS = (function () {
    function averageS(n1) {
      this.n1 = n1;
      this.tmpList = [];
    }
    averageS.prototype.addValue = function (data) {
      var _a = this, n1 = _a.n1;
      var result;
      if (this.tmpList.length > 0 && this.tmpList.length === n1) {
        this.tmpList.splice(0, 1);
      }
      this.tmpList.push(data);
      if (this.tmpList.length === n1) {
        result = jAverage(this.tmpList);
      } else {
        result = '-';
      }
      return result;
    }

    averageS.prototype.popValue = function () {
      this.tmpList.pop();
    }
    averageS.prototype.setParameter = function (n1) {
      this.n1 = n1;
      this.tmpList.splice(0, this.tmpList.length - 1);
    }
    return averageS;
  }());
  jMath.averageS = averageS;

  var maxValue = (function () {
    function maxValue(n1) {
      this.n1 = n1;
      this.tmpList = [];
    }
    maxValue.prototype.addValue = function (data) {
      var _a = this, n1 = _a.n1;
      var result;
      if (this.tmpList.length > 0 && this.tmpList.length === n1) {
        this.tmpList.splice(0, 1);
      }
      this.tmpList.push(data);
      if (this.tmpList.length === n1) {
        result = jMax(this.tmpList);
      } else {
        result = '-';
      }
      return result;
    }

    maxValue.prototype.popValue = function () {
      this.tmpList.pop();
    }
    maxValue.prototype.setParameter = function (n1) {
      this.n1 = n1;
      this.tmpList.splice(0, this.tmpList.length - 1);
    }
    return maxValue;
  }());
  jMath.maxValue = maxValue;

  var minValue = (function () {
    function minValue(n1) {
      this.n1 = n1;
      this.tmpList = [];
    }
    minValue.prototype.addValue = function (data) {
      var _a = this, n1 = _a.n1;
      var result;
      if (this.tmpList.length > 0 && this.tmpList.length === n1) {
        this.tmpList.splice(0, 1);
      }
      this.tmpList.push(data);
      if (this.tmpList.length === n1) {
        result = jMin(this.tmpList);
      } else {
        result = '-';
      }
      return result;
    }

    minValue.prototype.popValue = function () {
      this.tmpList.pop();
    }
    minValue.prototype.setParameter = function (n1) {
      this.n1 = n1;
      this.tmpList.splice(0, this.tmpList.length - 1);
    }
    return minValue;
  }());
  jMath.minValue = minValue;

})(jMath || (jMath = {}));

let jIndicator = {};
(function (jIndicator) {
  var Indicator = (function () {
    function Indicator(options) {
      this.name = options.name;
      this.datas = options.datas;
      this.isInMain = true;
      this.values = {};
      this.graphs = {};
    }
    Indicator.prototype.initialize = function () {
      // console.log('parent init');
    }
    Indicator.prototype.bindDatas = function (datas) {
      this.datas.splice(0);
      this.datas = datas;
      // console.log('bindDatas init COUNT:'+datas.length);
    }
    return Indicator;
  }());
  jIndicator.Indicator = Indicator;
})(jIndicator || (jIndicator = {}));

(function (jIndicator) {
  var SMA = (function (_super) {
    __extends(SMA, _super);
    function SMA(options) {
      _super.call(this, options);
      this.name = options.name;
      if (options.datas) {
        this.datas = options.datas.concat();
      }
      this.n1 = options.n1 || 5;
      this.n2 = options.n2 || 10;
      this.n3 = options.n3 || 20;
      this.color1 = options.color1 || 'rgba(219,169,83,.9)';
      this.color2 = options.color2 || 'rgba(99,179,243,.9)';
      this.color3 = options.color3 || 'rgba(223,140,201,.9)';
      this.isInMain = options.isInMain || true;
    }

    SMA.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.values = {};
      this.values['SMA' + this.n1] = [];
      this.values['SMA' + this.n2] = [];
      this.values['SMA' + this.n3] = [];
      this.graphs = {};
      this.graphs['SMA' + this.n1] = { color: this.color1, style: 'solidline' };
      this.graphs['SMA' + this.n2] = { color: this.color2, style: 'solidline' };
      this.graphs['SMA' + this.n3] = { color: this.color3, style: 'solidline' };
    };

    SMA.prototype.calculate = function () {
      var _a = this, datas = _a.datas, values = _a.values, n1 = _a.n1, n2 = _a.n2, n3 = _a.n3;
      if (values['SMA' + n1].length) {
        values['SMA' + n1].splice(0, values['SMA' + n1].length);
        values['SMA' + n2].splice(0, values['SMA' + n2].length);
        values['SMA' + n3].splice(0, values['SMA' + n3].length);
      }
      if (datas) {
        for (var i = 0; i < datas.length; i++) {
          this.generate(i);
        }
      }
      return this.values;
    }

    SMA.prototype.generate = function (i) {
      var _a = this, datas = _a.datas, values = _a.values, n1 = _a.n1, n2 = _a.n2, n3 = _a.n3;
      var result = {};
      if (i < n1) {
        values['SMA' + n1].push('-');
        result['SMA' + n1] = '-';
      } else {
        var sum = 0;
        for (var j = 0; j < n1; j++) {
          sum += datas[i - j].close;
        }
        result['SMA' + n1] = +(sum / n1).toFixed(6);
        values['SMA' + n1].push(result['SMA' + n1]);
      }
      if (i < n2) {
        values['SMA' + n2].push('-');
        result['SMA' + n2] = '-';
      } else {
        var sum = 0;
        for (var j = 0; j < n2; j++) {
          sum += datas[i - j].close;
        }
        result['SMA' + n2] = +(sum / n2).toFixed(6);
        values['SMA' + n2].push(result['SMA' + n2]);
      }
      if (i < n3) {
        values['SMA' + n3].push('-');
        result['SMA' + n3] = '-';
      } else {
        var sum = 0;
        for (var j = 0; j < n3; j++) {
          sum += datas[i - j].close;
        }
        result['SMA' + n3] = +(sum / n3).toFixed(6);
        values['SMA' + n3].push(result['SMA' + n3]);
      }
      return result;
    }

    SMA.prototype.appendBar = function (newBar) {
      if (!this.datas) {
        this.datas = [newBar];
      } else {
        this.datas.push(newBar);
      }
      return this.generate(this.datas.length - 1);
    }

    SMA.prototype.updateBar = function (newBar) {
      if (this.datas && this.datas.length > 0) {
        this.values['SMA' + this.n1].pop();
        this.values['SMA' + this.n2].pop();
        this.values['SMA' + this.n3].pop();
        this.datas.pop();
      }
      return this.appendBar(newBar);
    }

    return SMA;
  }(jIndicator.Indicator));

  function createSMA(options) {
    var defaultOptions = {
      name: 'SMA'
    };
    options = mixins({}, defaultOptions, options);
    var sma = new SMA(options);
    sma.initialize();
    return sma;
  }
  jIndicator.createSMA = createSMA;
  // EMA
  var EMA = (function (_super) {
    __extends(EMA, _super);
    function EMA(options) {
      _super.call(this, options);
      this.name = options.name;
      if (options.datas) {
        this.datas = options.datas.concat();
      }
      this.n1 = options.n1 || 5;
      this.n2 = options.n2 || 10;
      this.n3 = options.n3 || 20;
      this.color1 = options.color1 || 'rgba(219,169,83,.9)';
      this.color2 = options.color2 || 'rgba(99,179,243,.9)';
      this.color3 = options.color3 || 'rgba(223,140,201,.9)';
      this.avgE1 = new jMath.averageE(this.n1);
      this.avgE2 = new jMath.averageE(this.n2);
      this.avgE3 = new jMath.averageE(this.n3);
      this.isInMain = options.isInMain || true;
    }

    EMA.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.values = {};
      this.values['EMA' + this.n1] = [];
      this.values['EMA' + this.n2] = [];
      this.values['EMA' + this.n3] = [];
      this.graphs = {};
      this.graphs['EMA' + this.n1] = { color: this.color1, style: 'solidline' };
      this.graphs['EMA' + this.n2] = { color: this.color2, style: 'solidline' };
      this.graphs['EMA' + this.n3] = { color: this.color3, style: 'solidline' };
    };

    EMA.prototype.calculate = function () {
      var _a = this, datas = _a.datas, values = _a.values, n1 = _a.n1, n2 = _a.n2, n3 = _a.n3;
      this.avgE1.setParameter(n1);
      this.avgE2.setParameter(n2);
      this.avgE3.setParameter(n3);
      if (values['EMA' + n1].length) {
        values['EMA' + n1].splice(0, values['EMA' + n1].length);
        values['EMA' + n2].splice(0, values['EMA' + n2].length);
        values['EMA' + n3].splice(0, values['EMA' + n3].length);
      }
      if (datas) {
        for (var i = 0; i < datas.length; i++) {
          this.generate(i);
        }
      }
      return this.values;
    }

    EMA.prototype.generate = function (i) {
      var _a = this, datas = _a.datas, values = _a.values, n1 = _a.n1, n2 = _a.n2, n3 = _a.n3;
      var result = {};
      result['EMA' + n1] = this.avgE1.calculate(datas[i].close);
      result['EMA' + n2] = this.avgE2.calculate(datas[i].close);
      result['EMA' + n3] = this.avgE3.calculate(datas[i].close);
      values['EMA' + n1].push(result['EMA' + n1]);
      values['EMA' + n2].push(result['EMA' + n2]);
      values['EMA' + n3].push(result['EMA' + n3]);
      return result;
    }

    EMA.prototype.appendBar = function (newBar) {
      if (this.datas) {
        this.datas.push(newBar);
      } else {
        this.datas = [newBar];
      }
      return this.generate(this.datas.length - 1);
    }

    EMA.prototype.updateBar = function (newBar) {
      if (this.datas && this.datas.length > 0) {
        this.avgE1.resetValue();
        this.avgE2.resetValue();
        this.avgE3.resetValue();
        this.values['EMA' + this.n1].pop();
        this.values['EMA' + this.n2].pop();
        this.values['EMA' + this.n3].pop();
        this.datas.pop();
      }
      return this.appendBar(newBar);
    }
    return EMA;
  }(jIndicator.Indicator));

  function createEMA(options) {
    var defaultOptions = {
      name: 'EMA'
    };
    options = mixins({}, defaultOptions, options);
    var ema = new EMA(options);
    ema.initialize();
    return ema;
  }
  jIndicator.createEMA = createEMA;

  var VOL = (function (_super) {
    __extends(VOL, _super);
    function VOL(options) {
      _super.call(this, options);
      this.name = options.name;
      if (options.datas) {
        this.datas = options.datas.concat();
      }
      this.n1 = options.n1 || 7;
      this.n2 = options.n2 || 30;
      this.color1 = options.color1 || 'rgba(219,169,83,.9)';
      this.color2 = options.color2 || 'rgba(99,179,243,.9)';
      this.isInMain = options.isInMain || false;
    }

    VOL.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.values = {};
      this.values['VOL'] = [];
      this.values['MA' + this.n1] = [];
      this.values['MA' + this.n2] = [];
      this.graphs = {};
      this.graphs['VOL'] = { style: 'bar' };
      this.graphs['MA' + this.n1] = { color: this.color1, style: 'solidline' };
      this.graphs['MA' + this.n2] = { color: this.color2, style: 'solidline' };
    };

    VOL.prototype.calculate = function () {
      var _a = this, datas = _a.datas, values = _a.values, n1 = _a.n1, n2 = _a.n2;
      if (values['VOL'].length) {
        values['VOL'].splice(0, values['VOL'].length);
        values['MA' + n1].splice(0, values['MA' + n1].length);
        values['MA' + n2].splice(0, values['MA' + n2].length);
      }
      if (datas) {
        for (var i = 0; i < datas.length; i++) {
          this.generate(i);
        }
      }
      return this.values;
    }

    VOL.prototype.generate = function (i) {
      var _a = this, datas = _a.datas, values = _a.values, n1 = _a.n1, n2 = _a.n2;
      var result = {};
      result['VOL'] = datas[i].vol;
      values['VOL'].push(result['VOL']);
      if (i < n1) {
        values['MA' + n1].push('-');
        result['MA' + n1] = '-';
      } else {
        var sum = 0;
        for (var j = 0; j < n1; j++) {
          sum += datas[i - j].vol;
        }
        result['MA' + n1] = +(sum / n1).toFixed(6);
        values['MA' + n1].push(result['MA' + n1]);
      }
      if (i < n2) {
        values['MA' + n2].push('-');
        result['MA' + n2] = '-';
      } else {
        var sum = 0;
        for (var j = 0; j < n2; j++) {
          sum += datas[i - j].vol;
        }
        result['MA' + n2] = +(sum / n2).toFixed(6);
        values['MA' + n2].push(result['MA' + n2]);
      }
      return result;
    }

    VOL.prototype.appendBar = function (newBar) {
      if (this.datas) {
        this.datas.push(newBar);
      } else {
        this.datas = [newBar];
      }
      return this.generate(this.datas.length - 1);
    }
    VOL.prototype.updateBar = function (newBar) {
      if (this.datas && this.datas.length > 0) {
        this.values['VOL'].pop();
        this.values['MA' + this.n1].pop();
        this.values['MA' + this.n2].pop();
        this.datas.pop();
      }
      return this.appendBar(newBar);
    }
    return VOL;
  }(jIndicator.Indicator));

  function createVOL(options) {
    var defaultOptions = {
      name: 'VOL'
    };
    options = mixins({}, defaultOptions, options);
    var vol = new VOL(options);
    vol.initialize();
    return vol;
  }
  jIndicator.createVOL = createVOL;

  var MACD = (function (_super) {
    __extends(MACD, _super);
    function MACD(options) {
      _super.call(this, options);
      this.name = options.name;
      if (options.datas) {
        this.datas = options.datas.concat();
      }
      this.fastLength = options.fastLength || 12;
      this.slowLength = options.slowLength || 26;
      this.mLength = options.mLength || 9;
      this.color1 = options.color1 || 'rgba(255,255,255,.9)';
      this.color2 = options.color2 || 'rgba(255,255,0,.9)';
      this.isInMain = options.isInMain || false;
      this.fastEMA = new jMath.averageE(this.fastLength);
      this.slowEMA = new jMath.averageE(this.slowLength);
      this.mEMA = new jMath.averageE(this.mLength);
    }

    MACD.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.values = {};
      this.values['DIF'] = [];
      this.values['DEA'] = [];
      this.values['MACD'] = [];
      this.graphs = {};
      this.graphs['DIF'] = { color: this.color1, style: 'solidline' };
      this.graphs['DEA'] = { color: this.color2, style: 'solidline' };
      this.graphs['MACD'] = { style: 'steam' };
    };
    MACD.prototype.calculate = function () {
      var _a = this, datas = _a.datas, values = _a.values, fastLength = _a.fastLength,
        slowLength = _a.slowLength, mLength = _a.mLength;
      this.fastEMA.setParameter(fastLength);
      this.slowEMA.setParameter(slowLength);
      this.mEMA.setParameter(mLength);
      if (values['MACD'].length) {
        values['MACD'].splice(0, values['MACD'].length);
        values['DIF'].splice(0, values['DIF'].length);
        values['DEA'].splice(0, values['DEA'].length);
      }
      if (datas) {
        for (var i = 0; i < datas.length; i++) {
          this.generate(i);
        }
      }
      return this.values;
    }

    MACD.prototype.generate = function (i) {
      var _a = this, datas = _a.datas, values = _a.values;
      // console.log(this.fastEMA.calculate(datas[i].close))
      var difValue = this.fastEMA.calculate(datas[i].close) - this.slowEMA.calculate(datas[i].close);
      var avgValue = this.mEMA.calculate(difValue);
      var macdValue = difValue - avgValue;
      values['DIF'].push(difValue);
      values['DEA'].push(avgValue);
      values['MACD'].push(macdValue);
      return {
        DIF: difValue,
        DEA: avgValue,
        MACD: macdValue
      }
    }

    MACD.prototype.appendBar = function (newBar) {
      if (this.datas) {
        this.datas.push(newBar);
      } else {
        this.datas = [newBar];
      }

      return this.generate(this.datas.length - 1)
    }

    MACD.prototype.updateBar = function (newBar) {
      if (this.datas && this.datas.length > 0) {
        this.datas.pop();
        this.fastEMA.resetValue();
        this.slowEMA.resetValue();
        this.mEMA.resetValue();

        this.values['DIF'].pop();
        this.values['DEA'].pop();
        this.values['MACD'].pop();
      }
      return this.appendBar(newBar)
    }
    return MACD;
  }(jIndicator.Indicator));

  function createMACD(options) {
    var defaultOptions = {
      name: 'MACD'
    };
    options = mixins({}, defaultOptions, options);
    var macd = new MACD(options);
    macd.initialize();
    return macd;
  }
  jIndicator.createMACD = createMACD;

  //BOLL
  var BOLL = (function (_super) {
    __extends(BOLL, _super);
    function BOLL(options) {
      _super.call(this, options);
      this.name = options.name;
      if (options.datas) {
        this.datas = options.datas.concat();
      }
      this.len = options.len || 26;
      this.offset = options.offset || 2;
      this.color1 = options.color1 || 'rgba(255,255,0,.9)';
      this.color2 = options.color2 || 'rgba(255,255,255,.9)';
      this.color3 = options.color3 || 'rgba(255,0,255,.9)';
      this.isInMain = options.isInMain || true;
      this.valList = [];
    }

    BOLL.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.values = {};
      this.values['UP'] = [];
      this.values['MID'] = [];
      this.values['DOWN'] = [];
      this.graphs = {};
      this.graphs['UP'] = { color: this.color1, style: 'solidline' };
      this.graphs['MID'] = { color: this.color2, style: 'solidline' };
      this.graphs['DOWN'] = { color: this.color3, style: 'solidline' };
    };
    BOLL.prototype.calculate = function () {
      var _a = this, datas = _a.datas, values = _a.values;
      if (values['UP'].length) {
        values['UP'].splice(0, values['UP'].length);
        values['MID'].splice(0, values['MID'].length);
        values['DOWN'].splice(0, values['DOWN'].length);
      }
      if (datas) {
        for (var i = 0; i < datas.length; i++) {
          this.generate(i);
        }
      }
      return this.values;
    }

    BOLL.prototype.generate = function (i) {
      var _a = this, datas = _a.datas, values = _a.values, len = _a.len;
      // console.log(this.fastEMA.calculate(datas[i].close))
      if (this.valList === len) {
        this.valList.splice(0, 1);
      }
      this.valList.push(datas[i].close);
      var upVal = '-'
      var midVal = '-'
      var downVal = '-'
      if (i >= len - 1) {
        var ma = jAverage(this.valList);
        var md = jStddev(this.valList);
        upVal = ma + this.offset * md;
        midVal = ma;
        downVal = ma - this.offset * md;
      }
      values['UP'].push(upVal);
      values['MID'].push(midVal);
      values['DOWN'].push(downVal);
      return {
        UP: upVal,
        MID: midVal,
        DOWN: downVal
      }
    }

    BOLL.prototype.appendBar = function (newBar) {
      if (this.datas) {
        this.datas.push(newBar);
      } else {
        this.datas = [newBar];
      }
      return this.generate(this.datas.length - 1)
    }

    BOLL.prototype.updateBar = function (newBar) {
      if (this.datas && this.datas.length > 0) {
        this.datas.pop();
        this.valList.pop();
        this.values['UP'].pop();
        this.values['MID'].pop();
        this.values['DOWN'].pop();
      }
      return this.appendBar(newBar)
    }
    return BOLL;
  }(jIndicator.Indicator));

  function createBOLL(options) {
    var defaultOptions = {
      name: 'BOLL'
    };
    options = mixins({}, defaultOptions, options);
    var boll = new BOLL(options);
    boll.initialize();
    return boll;
  }
  jIndicator.createBOLL = createBOLL;

  //DMI
  var DMI = (function (_super) {
    __extends(DMI, _super);
    function DMI(options) {
      _super.call(this, options);
      this.name = options.name;
      if (options.datas) {
        this.datas = options.datas.concat();
      }
      this.nlen = options.len || 14;
      this.mlen = options.mlen || 6;
      this.color1 = options.color1 || 'rgba(204,204,204,.9)';
      this.color2 = options.color2 || 'rgba(255,255,0,.9)';
      this.color3 = options.color3 || 'rgba(255,0,255,.9)';
      this.color4 = options.color4 || 'rgba(0,153,255,.9)';
      this.isInMain = options.isInMain || false;
      this.atr = new jMath.averageS(this.nlen);
      this.adx = new jMath.averageS(this.nlen);
      this.pdm = new jMath.averageS(this.nlen);
      this.mdm = new jMath.averageS(this.nlen);
      this.adxValue = '-';
    }

    DMI.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.values = {};
      this.values['PDI'] = [];
      this.values['MDI'] = [];
      this.values['ADX'] = [];
      this.values['ADXR'] = [];
      this.graphs = {};
      this.graphs['PDI'] = { color: this.color1, style: 'solidline' };
      this.graphs['MDI'] = { color: this.color2, style: 'solidline' };
      this.graphs['ADX'] = { color: this.color3, style: 'solidline' };
      this.graphs['ADXR'] = { color: this.color4, style: 'solidline' };

    };
    DMI.prototype.calculate = function () {
      var _a = this, datas = _a.datas, values = _a.values;
      this.atr.setParameter(this.nlen);
      this.adx.setParameter(this.nlen);
      this.pdm.setParameter(this.nlen);
      this.mdm.setParameter(this.nlen);
      if (values['PDI'].length) {
        values['PDI'].splice(0, values['PDI'].length);
        values['MDI'].splice(0, values['MDI'].length);
        values['ADX'].splice(0, values['ADX'].length);
        values['ADXR'].splice(0, values['ADXR'].length);
      }
      if (datas) {
        for (var i = 0; i < datas.length; i++) {
          this.generate(i);
        }
      }
      //console.log(JSON.stringify(this.values))
      return this.values;
    }

    DMI.prototype.generate = function (i) {
      var _a = this, datas = _a.datas, values = _a.values;
      var trValue = 0;
      var atrValue = 0;
      var pdmValue = 0;
      var mdmValue = 0;
      var avePdm = 0;
      var aveMdm = 0;
      var pdi = 0;
      var mdi = 0;
      var dx = 0;
      var adxRValue = 0;
      if (i === 0) {
        trValue = datas[i].high - datas[i].low;
      } else {
        trValue = jTrueRange(datas[i - 1].close, datas[i].high, datas[i].low);
        var highSpan = datas[i].high - datas[i - 1].high;
        pdmValue = (highSpan > 0 ? highSpan : 0);
        var lowSpan = datas[i - 1].low - datas[i].low;
        mdmValue = (lowSpan > 0 ? lowSpan : 0);
        if (pdmValue >= mdmValue)
          mdmValue = 0;
        else
          pdmValue = 0;
      }
      atrValue = this.atr.addValue(trValue);
      avePdm = this.pdm.addValue(pdmValue);
      aveMdm = this.mdm.addValue(mdmValue);
      if (avePdm !== '-') {
        pdi = avePdm * 100 / atrValue;
        mdi = aveMdm * 100 / atrValue;
        dx = Math.abs(pdi - mdi) * 100 / (pdi + mdi);
        this.adxValue = this.adx.addValue(dx);
        if (values['ADX'].length > 0) {
          var offset = values['ADX'].length - this.mlen;
          if (offset < 0) {
            offset = 0;
          }
          adxRValue = values['ADX'][offset] / 2 + this.adxValue / 2;
        } else {
          adxRValue = '-';
        }
      } else {
        pdi = '-';
        mdi = '-';
        this.adxValue = '-';
        adxRValue = '-';
      }

      values['PDI'].push(pdi);
      values['MDI'].push(mdi);
      values['ADX'].push(this.adxValue);
      values['ADXR'].push(adxRValue);

      return {
        PDI: pdi,
        MDI: mdi,
        ADX: this.adxValue,
        ADXR: adxRValue
      }
    }

    DMI.prototype.appendBar = function (newBar) {
      if (this.datas) {
        this.datas.push(newBar);
      } else {
        this.datas = [newBar];
      }
      return this.generate(this.datas.length - 1)
    }

    DMI.prototype.updateBar = function (newBar) {
      if (this.datas && this.datas.length > 0) {
        this.datas.pop();
        this.values['PDI'].pop();
        this.values['MDI'].pop();
        this.values['ADX'].pop();
        this.values['ADXR'].pop();
        this.atr.popValue();
        this.adx.popValue();
        this.pdm.popValue();
        this.mdm.popValue();
      }
      return this.appendBar(newBar)
    }
    return DMI;
  }(jIndicator.Indicator));

  function createDMI(options) {
    var defaultOptions = {
      name: 'DMI'
    };
    options = mixins({}, defaultOptions, options);
    var dmi = new DMI(options);
    dmi.initialize();
    return dmi;
  }
  jIndicator.createDMI = createDMI;

  //DMA
  var DMA = (function (_super) {
    __extends(DMA, _super);
    function DMA(options) {
      _super.call(this, options);
      this.name = options.name;
      if (options.datas) {
        this.datas = options.datas.concat();
      }
      this.n1 = options.n1 || 10;
      this.n2 = options.n2 || 50;
      this.n3 = options.n3 || 6;
      this.color1 = options.color1 || 'rgba(204,204,204,.9)';
      this.color2 = options.color2 || 'rgba(255,255,0,.9)';
      this.isInMain = options.isInMain || false;
      this.mac1 = new jMath.averageS(this.n1);
      this.mac2 = new jMath.averageS(this.n2);
      this.madma = new jMath.averageS(this.n3)
    }

    DMA.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.values = {};
      this.values['DMA'] = [];
      this.values['MADMA'] = [];
      this.graphs = {};
      this.graphs['DMA'] = { color: this.color1, style: 'solidline' };
      this.graphs['MADMA'] = { color: this.color2, style: 'solidline' };

    };
    DMA.prototype.calculate = function () {
      var _a = this, datas = _a.datas, values = _a.values;
      this.mac1.setParameter(this.n1);
      this.mac2.setParameter(this.n2);
      this.madma.setParameter(this.n3);
      if (values['DMA'].length) {
        values['DMA'].splice(0, values['DMA'].length);
        values['MADMA'].splice(0, values['MADMA'].length);
      }
      if (datas) {
        for (var i = 0; i < datas.length; i++) {
          this.generate(i);
        }
      }
      //console.log(JSON.stringify(this.values))
      return this.values;
    };
    DMA.prototype.generate = function (i) {
      var _a = this, datas = _a.datas, values = _a.values, n1 = _a.n1, n2 = _a.n2, n3 = _a.n3;
      var dmaValue = '-';
      var madmaValue = '-';
      if (i >= n1 && i >= n2) {
        var mac1Value = this.mac1.addValue(datas[i].close);
        var mac2Value = this.mac2.addValue(datas[i].close);
        dmaValue = mac1Value - mac2Value;
        madmaValue = this.madma.addValue(dmaValue);

      } else {
        this.mac1.addValue(datas[i].close);
        this.mac2.addValue(datas[i].close);
      }

      values['DMA'].push(dmaValue);
      values['MADMA'].push(madmaValue);
      return {
        DMA: dmaValue,
        MADMA: madmaValue
      }
    };
    DMA.prototype.appendBar = function (newBar) {
      if (this.datas) {
        this.datas.push(newBar);
      } else {
        this.datas = [newBar];
      }
      return this.generate(this.datas.length - 1)
    };
    DMA.prototype.updateBar = function (newBar) {
      if (this.datas && this.datas.length > 0) {
        this.datas.pop();
        this.values['DMA'].pop();
        this.values['MADMA'].pop();
        this.mac1.popValue();
        this.mac2.popValue();
        this.madma.popValue();
      }
      return this.appendBar(newBar)
    }
    return DMA;
  }(jIndicator.Indicator));

  function createDMA(options) {
    var defaultOptions = {
      name: 'DMA'
    };
    options = mixins({}, defaultOptions, options);
    var dma = new DMA(options);
    dma.initialize();
    return dma;
  }
  jIndicator.createDMA = createDMA;

  //KDJ
  var KDJ = (function (_super) {
    __extends(KDJ, _super);
    function KDJ(options) {
      _super.call(this, options);
      this.name = options.name;
      if (options.datas) {
        this.datas = options.datas.concat();
      }
      this.nLen = options.nLen || 9;
      this.maLen1 = options.maLen1 || 3;
      this.maLen2 = options.maLen2 || 3;
      this.color1 = options.color1 || 'rgba(0,155,255,.9)';
      this.color2 = options.color2 || 'rgba(255,204,102,.9)';
      this.color3 = options.color3 || 'rgba(255,153,255,.9)';
      this.isInMain = false;
      this.kList = [];
      this.dList = [];
      this.hh = new jMath.maxValue(this.nLen);
      this.ll = new jMath.minValue(this.nLen);
      this.rsv = '-';
      this.preRsv = '-';
      this.isInit = false;
      this.isInitK = false;
      this.thisK = '-';
      this.thisD = '-';
      this.thisJ = '-';
      this.preK = '-';
      this.preD = '-';
    }

    KDJ.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.values = {};
      this.values['K'] = [];
      this.values['D'] = [];
      this.values['J'] = [];
      this.graphs = {};
      this.graphs['K'] = { color: this.color1, style: 'solidline' };
      this.graphs['D'] = { color: this.color2, style: 'solidline' };
      this.graphs['J'] = { color: this.color3, style: 'solidline' };

    };
    KDJ.prototype.calculate = function () {
      var _a = this, datas = _a.datas, values = _a.values;
      this.hh.setParameter(this.nLen);
      this.ll.setParameter(this.nLen);
      if (values['K'].length) {
        values['K'].splice(0, values['K'].length);
        values['D'].splice(0, values['D'].length);
        values['J'].splice(0, values['J'].length);
      }
      if (datas) {
        for (var i = 0; i < datas.length; i++) {
          this.generate(i);
        }
      }
      return this.values;
    };
    KDJ.prototype.generate = function (i) {
      var _a = this, datas = _a.datas, values = _a.values, n1 = _a.n1, n2 = _a.n2, n3 = _a.n3;
      var highestH = this.hh.addValue(datas[i].high);
      var lowestL = this.ll.addValue(datas[i].low);
      if (highestH === '-' || highestH - lowestL === 0) {
        this.rsv = this.preRsv;
      } else {
        this.rsv = 100 * (datas[i].close - lowestL) / (highestH - lowestL);
        if (!this.isInit) {
          if (this.thisK !== '-') {
            this.preK = this.thisK;
            this.thisK = this.preK * (this.maLen1 - 1) / this.maLen1 + this.rsv * 1 / this.maLen1;
            if (this.dList.length < this.maLen2) {
              this.dList.push(this.thisK);
            }
          }
          if (!this.isInitK) {
            if (this.kList.length < this.maLen1) {
              this.kList.push(this.rsv);
            }
            if (this.kList.length === this.maLen1) {
              this.isInitK = true;
              this.thisK = jAverage(this.kList);
              this.dList.push(this.thisK);
            }
          }

          if (this.dList.length > 0 && this.dList.length == this.maLen2) {
            this.thisD = jAverage(this.dList);
            this.isInit = true;
          }
          this.rsv = '-';
        } else {
          this.preK = this.thisK;
          this.thisK = this.preK * (this.maLen1 - 1) / this.maLen1 + this.rsv * 1 / this.maLen1;
          this.preD = this.thisD;
          this.thisD = this.preD * (this.maLen2 - 1) / this.maLen2 + this.thisK * 1 / this.maLen2;
          this.thisJ = 3 * this.thisK - 2 * this.thisD;
        }
      }
      this.preRsv = this.rsv;

      values['K'].push(this.thisK);
      values['D'].push(this.thisD);
      values['J'].push(this.thisJ);
      return {
        K: this.thisK,
        D: this.thisD,
        J: this.thisJ
      }
    };
    KDJ.prototype.appendBar = function (newBar) {
      if (this.datas) {
        this.datas.push(newBar);
      } else {
        this.datas = [newBar];
      }
      return this.generate(this.datas.length - 1)
    };
    KDJ.prototype.updateBar = function (newBar) {
      if (this.datas && this.datas.length > 0) {
        this.datas.pop();
        this.values['K'].pop();
        this.values['D'].pop();
        this.values['J'].pop();
        this.kList.pop();
        this.dList.pop();
        this.hh.popValue();
        this.ll.popValue();
      }
      return this.appendBar(newBar)
    }
    return KDJ;
  }(jIndicator.Indicator));

  function createKDJ(options) {
    var defaultOptions = {
      name: 'KDJ'
    };
    options = mixins({}, defaultOptions, options);
    var kdj = new KDJ(options);
    kdj.initialize();
    return kdj;
  }
  jIndicator.createKDJ = createKDJ;
  // TRIX
  var TRIX = (function (_super) {
    __extends(TRIX, _super);
    function TRIX(options) {
      _super.call(this, options);
      this.name = options.name;
      if (options.datas) {
        this.datas = options.datas.concat();
      }
      this.n1 = options.n1 || 12;
      this.n2 = options.n2 || 20;
      this.color1 = options.color1 || 'rgba(219,169,83,.9)';
      this.color2 = options.color2 || 'rgba(99,179,243,.9)';
      this.avgE = new jMath.averageE(this.n1);
      this.avgS = new jMath.averageS(this.n2);
      this.isInMain = false;
      this.preTr = '-';
    }

    TRIX.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.values = {};
      this.values['TRIX'] = [];
      this.values['MATRIX'] = [];
      this.graphs = {};
      this.graphs['TRIX'] = { color: this.color1, style: 'solidline' };
      this.graphs['MATRIX'] = { color: this.color2, style: 'solidline' };
    };

    TRIX.prototype.calculate = function () {
      var _a = this, datas = _a.datas, values = _a.values, n1 = _a.n1, n2 = _a.n2;
      this.avgE.setParameter(n1);
      this.avgS.setParameter(n2);
      if (values['TRIX'].length) {
        values['TRIX'].splice(0, values['TRIX'].length);
        values['MATRIX'].splice(0, values['MATRIX'].length);
      }
      if (datas) {
        for (var i = 0; i < datas.length; i++) {
          this.generate(i);
        }
      }
      //console.log(JSON.stringify(this.values))
      return this.values;
    }

    TRIX.prototype.generate = function (i) {
      var _a = this, datas = _a.datas, values = _a.values;
      var tr = this.avgE.calculate(datas[i].close);
      var trix = '-';
      var matrix = '-';
      if (this.preTr !== '-' && this.preTr !== 0) {
        trix = (tr - this.preTr) / this.preTr * 1000;
        matrix = this.avgS.addValue(trix);
      }
      this.preTr = tr;
      values['TRIX'].push(trix);
      values['MATRIX'].push(matrix);
      return {
        TRIX: trix,
        MATRIX: matrix
      };
    }

    TRIX.prototype.appendBar = function (newBar) {
      if (this.datas) {
        this.datas.push(newBar);
      } else {
        this.datas = [newBar];
      }
      return this.generate(this.datas.length - 1);
    }

    TRIX.prototype.updateBar = function (newBar) {
      if (this.datas && this.datas.length > 0) {
        this.avgE.resetValue();
        this.avgS.popValue();
        this.values['TRIX'].pop();
        this.values['MATRIX'].pop();
        this.datas.pop();
      }
      return this.appendBar(newBar);
    }
    return TRIX;
  }(jIndicator.Indicator));

  function createTRIX(options) {
    var defaultOptions = {
      name: 'TRIX'
    };
    options = mixins({}, defaultOptions, options);
    var trix = new TRIX(options);
    trix.initialize();
    return trix;
  }
  jIndicator.createTRIX = createTRIX;

})(jIndicator || (jIndicator = {}));

export default jIndicator;