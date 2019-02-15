import jCommon from './jCommon'
import jIndicator from './jIndicator'
import baseChart from './jChart'

let { __extends, deepCopy, getElementSize, convertCycleToNumber, mixins, arrayObjectIndexOf } = jCommon
let jChart = {};
(function (jChart) {
  var MLColors;
  (function (MLColors) {
    MLColors[MLColors["Yellow"] = 0] = "Yellow";
    MLColors[MLColors["Blue"] = 1] = "Blue";
    MLColors[MLColors["Pink"] = 2] = "Pink";
    MLColors[MLColors["Green"] = 3] = "Green";
  })(MLColors || (MLColors = {}));
  var COLOR = {
    YELLOW: 'rgba(219,169,83,.9)',
    BLUE: 'rgba(99,179,243,.9)',
    PINK: 'rgba(223,140,201,.9)',
    GREEN: 'rgba(151,192,57,.9)'
  };
  var KLine = (function (_super) {
    __extends(KLine, _super);
    function KLine(options) {
      _super.call(this, options);
      this.datas = options.datas;
      this.displayCount = options.displayCount;
      this.indicators = options.indicators;
      var count = 0;
      for (var i = 0; i < this.indicators.length; i++) {
        var indicator = this.indicators[i];
        if (!this.mainIndicator && indicator.isInMain) {
          this.mainIndicator = indicator;
          count++;
        }
        else if (!this.subIndicator && !indicator.isInMain) {
          this.subIndicator = indicator;
          count++;
        }
        if (count == 2) {
          break;
        }
      }
      this.volumeMulitiple = options.volumeMulitiple;
      this.priceTick = options.priceTick;
      this.decLen = 0;
      if (this.priceTick) {
        var values = this.priceTick.toString().split('.');
        if (values.length > 1) {
          this.decLen = values[1].length;
        }
      }
      this.riseColor = options.riseColor || 'rgba(177,24,18,1)';
      this.fallColor = options.fallColor || 'rgba(47,140,85,1)';
      this.lastLineColor = options.lastLineColor || 'rgba(0,255,255,1)';
      this.crossLineColor = options.crossLineColor || '#616163';
      this.crossTextColor = options.crossTextColor || 'white';
      this.lastTextColor = options.lastTextColor || 'white';
      this.resetValue();
    }
    KLine.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      var _this = this;
      this.top = this.container.offsetTop - document.body.scrollTop;
      this.left = this.container.offsetLeft;

      if (!_this.datas || _this.datas.length === 0) {
        this.drawText('无主图数据', [this.width / 2, (this.height * 0.7) / 2], this.textColor);
        this.drawText('无副图数据', [this.width / 2, (this.height * 0.7 + this.height * 0.3 / 2)], this.textColor);
      } else {
        _this.drawGrid();
        _this.setRange();
        _this.drawAxisYText();
        _this.drawPriceBar();
        _this.drawIndicators();
        if (_this.usrLines.length > 0) {
          _this.usrLines.forEach(function (el, i) {
            if (!(el.id === _this.usrLineId && _this.isMouseDown && _this.isUsrMouseOver)) {
              switch (el.type) {
                case 'line1': _this.drawUsrLine1(el.param); break;
                case 'line2': _this.drawUsrLine2(el.param); break;
                case 'line3': _this.drawUsrLine3(el.param); break;
                case 'line4': _this.drawUsrLine4(el.param); break;
                case 'line5': _this.drawUsrLine5(el.param); break;
                case 'line6': _this.drawUsrLine5(el.param); break;
                case 'line7': _this.drawUsrLine8(el.param); break;
                case 'line8': _this.drawUsrLine8(el.param); break;
                case 'line9': _this.drawUsrLine3(el.param); break;
              }
            }
          })
        }
      }
    };

    KLine.prototype.setRange = function () {
      if (!this.datas || this.datas.length === 0) return;
      if (this.startIndex >= this.datas.length) {
        this.startIndex = this.datas.length - 1
      }
      var len = this.datas.length - this.startIndex;
      var count = Math.min(len, this.displayCount);

      var maxPrice = this.datas[this.startIndex].high;
      var minPrice = this.datas[this.startIndex].low;

      for (var i = this.startIndex + 1; i < this.startIndex + count; i++) {
        if (this.datas[i].high > maxPrice)
          maxPrice = this.datas[i].high;
        if (this.datas[i].low < minPrice)
          minPrice = this.datas[i].low;
      }
      if (maxPrice === minPrice) {
        maxPrice = maxPrice + maxPrice * 0.5
        minPrice = maxPrice - maxPrice * 0.5
      }

      if (this.mainIndicator !== null) {
        for (var key in this.mainIndicator.values) {
          var prices = this.mainIndicator.values[key];
          for (var i = this.startIndex + 1; i < this.startIndex + count; i++) {
            if (prices[i] !== '-') {
              if (prices[i] > maxPrice)
                maxPrice = prices[i];
              if (prices[i] < minPrice)
                minPrice = prices[i];
            }
          }
        }
      }
      this.minPrice = minPrice;
      this.roofPrice = maxPrice;
      this.floorPrice = minPrice;
      this.unitY = (this.figureOffsetHeight - 20 - this.figureHeight / 6) / (this.roofPrice - this.minPrice);
    }

    KLine.prototype.drawGrid = function () {
      var _a = this, ctx = _a.ctx, grid = _a.grid,
        width = _a.width, height = _a.height,
        figureHeight = _a.figureHeight;
			/*ctx.beginPath();
			this.drawRect({
            	x: 0,
            	y: 1,
            	width: width - 1,
            	height: height - 2,
            	color: grid.color,
            	isFill: false,
            	size: 1
			});*/
      ctx.beginPath();
      if (grid.size > 0) {
        this.drawRect({
          x: 0,
          y: 0,
          width: (width - 1),
          height: (height - 2),
          color: grid.color,
          isFill: false,
          size: 1
        });
      }
      ctx.beginPath();
      this.drawLine({
        color: grid.color,
        size: 1,
        startPoint: [0, figureHeight - 18],
        points: [[width, figureHeight - 18]]
      });
      ctx.beginPath();
      this.drawLine({
        color: grid.color,
        size: 1,
        startPoint: [width - 50, 1],
        points: [[width - 50, height]]
      }, true);
      if (this.datas) {
        this.drawGridX();
      }

    };
    KLine.prototype.calcY = function (price) {
      if (price < this.minPrice) {
        price = this.minPrice;
      }
      return this.figureHeight - Math.abs(price - this.minPrice) * this.unitY - this.figureHeight / 6;
    };
    KLine.prototype.drawPriceBar = function () {
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, datas = _a.datas;
      if (datas.length === 0) return;
      var len = datas.length - this.startIndex;
      var count = Math.min(len, this.displayCount);
      var unitX = _a.unitX;

      var isDrawHigh = false;
      var isDrawLow = false;
      for (var i = 0; i < count; i++) {
        var openPrice = datas[i + this.startIndex].open;
        var highPrice = datas[i + this.startIndex].high;
        var lowPrice = datas[i + this.startIndex].low;
        var closePrice = datas[i + this.startIndex].close;
        var barX = Math.floor(unitX * i + unitX / 2 + 10);
        var barWidth = Math.floor(unitX * 5 / 8);
        if (barWidth % 2 !== 0) {
          barWidth += 1
        }
        var barColor = this.getBarColor(datas, i + this.startIndex);
        ctx.beginPath();
        var openHeight = this.calcY(openPrice);
        var closeHeight = this.calcY(closePrice);
        var highHeight = this.calcY(highPrice);
        var lowHeight = this.calcY(lowPrice);
        if (highPrice === _a.roofPrice && !isDrawHigh) {
          isDrawHigh = true;
          var span = 5;
          if (barX > this.width / 2) {
            var roofWidth = ctx.measureText(_a.roofPrice).width;
            span = -roofWidth - 5;
          }
          this.drawText(_a.roofPrice, [barX + span, highHeight], this.textColor);
        } else if (lowPrice === _a.floorPrice && !isDrawLow) {
          isDrawLow = true;
          var span = 5;
          if (barX > this.width / 2) {
            var floorWidth = ctx.measureText(_a.floorPrice).width;
            span = -floorWidth - 5;
          }
          this.drawText(_a.floorPrice, [barX + span, lowHeight + 10], this.textColor);
        }
        if (closePrice > openPrice && this.displayCount <= 150) {
          this.drawLine({
            color: barColor,
            size: 1,
            startPoint: [barX, highHeight],
            points: [[barX, closeHeight]]
          }, false);
          this.drawLine({
            color: barColor,
            size: 1,
            startPoint: [barX, openHeight],
            points: [[barX, lowHeight]]
          });
        } else {
          this.drawLine({
            color: barColor,
            size: 1,
            startPoint: [barX, highHeight],
            points: [[barX, lowHeight]]
          });
        }
        ctx.beginPath();

        if (openHeight === closeHeight) {
          this.drawLine({
            color: barColor,
            size: 1,
            startPoint: [barX - barWidth / 2, openHeight],
            points: [[barX + barWidth / 2, closeHeight]]
          });
        }
        else {
          if (closePrice > openPrice && this.displayCount <= 150) {
            this.drawRect({
              x: barX - barWidth / 2,
              y: openHeight,
              width: barWidth,
              height: closeHeight - openHeight,
              isFill: false,
              size: 1
            })
          } else {
            this.drawRect({
              x: barX - barWidth / 2,
              y: openHeight,
              width: barWidth,
              height: closeHeight - openHeight,
              fillColor: barColor,
              isFill: true,
              noBorder: true,
              size: 1
            })
          }
        }
        if (i === count - 1) {
          this.ctx.save();
          this.ctx.beginPath();
          this.ctx.strokeStyle = barColor;
          this.ctx.setLineDash([2, 4]);
          this.ctx.moveTo(0 + 0.5, closeHeight * dpr + 0.5);
          this.ctx.lineTo((this.width - 40) * dpr + 0.5, closeHeight * dpr + 0.5);
          this.drawRect({
            x: this.width - 49,
            y: closeHeight - 7,
            isFill: true,
            fillColor: barColor,
            noBorder: true,
            size: 1,
            width: 50,
            height: 15
          }, true);
          var lastPrice = this.datas[this.datas.length - 1].close;
          var priceWidth = this.ctx.measureText(parseFloat(lastPrice).toFixed(this.decLen)).width / dpr;
          this.drawText(parseFloat(lastPrice).toFixed(this.decLen), [this.width - 25 - priceWidth / 2, closeHeight + 5], this.lastTextColor)
          this.ctx.restore();
          //this.drawText('→' + this.datas[this.datas.length-1].close, [this.figureWidth + 20, closeHeight], this.lastColor)
        }
      }
      if (!this.isShowCrossLine) {
        this.drawTitleText(this.datas.length - 1)
      }
    };

    KLine.prototype.getMlColor = function (mlList) {
      var mlColor;
      if (typeof mlList.color === 'undefined') {
        var index = arrayObjectIndexOf(this.mainLineLists, 'title', mlList.title);
        mlColor = COLOR[MLColors[index].toUpperCase()];
      }
      else if (typeof mlList.color === 'number') {
        mlColor = COLOR[MLColors[mlList.color].toUpperCase()];
      }
      else {
        mlColor = mlList.color.toString();
      }
      return mlColor;
    };
    KLine.prototype.drawMlLegend = function (index) {
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, mainLineLists = _a.mainLineLists,
        figureWidth = _a.figureWidth, figureOffsetY = _a.figureOffsetY;
      var len = mainLineLists.length;
      var dot = {
        radius: 3,
        paddingLeft: 10,
        paddingRight: 3
      };
      var text;
      var textWidth_1;
      var prices;
      var lastPrice;
      for (var i = len - 1, textWidth_1 = 0; i >= 0; i--) {
        var title = mainLineLists[i].title;
        ctx.font = this.font;
        prices = mainLineLists[i].prices.filter(function (price) {
          return Boolean(price);
        });
        if (!prices.length) {
          continue;
        }
        if (index === undefined) {
          index = prices.length - 1;
        }
        lastPrice = prices[index];
        text = title + " " + lastPrice;
        textWidth_1 += ctx.measureText(text).width;
        this.drawText(text, [figureWidth - textWidth_1, figureOffsetY - 5]);
        this.drawRound({
          point: [figureWidth - textWidth_1 - dot.radius - dot.paddingRight, figureOffsetY - 5 - dot.radius],
          radius: dot.radius,
          isFill: true,
          fillColor: this.getMlColor(mainLineLists[i])
        });
        textWidth_1 += dot.radius * 2 + dot.paddingLeft + dot.paddingRight;
      }
    };
    KLine.prototype.drawAxisYText = function () {
      this.ctx.beginPath();
      var spanPrice = (this.roofPrice - this.floorPrice) / this.grid.y;
      for (var i = 0; i <= this.grid.y; i++) {
        var curHeight = Math.round(this.figureHeight - Math.abs((this.roofPrice - spanPrice * i) - this.floorPrice) * this.unitY - this.figureHeight / 6) + 4
        var curPrice = (this.roofPrice - spanPrice * i).toFixed(this.decLen);
        var priceWidth = this.ctx.measureText(curPrice).width / this.dpr;
        this.drawText(curPrice, [this.width - 25 - priceWidth / 2, curHeight]);
      }
      this.ctx.stroke();
    };
    KLine.prototype.drawGridX = function () {
      var _this = this;
      window.KLine = this
      var _a = this, ctx = _a.ctx, displayCount = _a.displayCount;
      var datas = this.datas;
      var len = datas.length - this.startIndex;
      var count = Math.min(len, displayCount);
      if (count <= 2) {
        return;
      }

      var cycleNumber = convertCycleToNumber(this.cycle)
      //console.log(this.cycle, cycleNumber)
      this.ctx.beginPath();
      if (cycleNumber < 10) {
        var hourDates = [];
        for (var i = 2; i < count - 2; i++) {
          if (datas[i + this.startIndex].dateTime.substr(0, 13) !== datas[i + this.startIndex - 1].dateTime.substr(0, 13)) {
            console.log(datas[i + this.startIndex])
            hourDates.push({
              text: datas[i + this.startIndex].dateTime.substr(11, 5),
              index: i
            });
          }
        }
        for (var j = 1; j < hourDates.length; j++) {
          if (hourDates[j].index - hourDates[j - 1].index < 7) {
            hourDates.splice(j, 1);
          }
        }
        hourDates.forEach(function (date) {
          _this.drawGridTextX(date.text, date.index);
        });
      }
      else if (cycleNumber < 60) {
        var hourDates = [];
        for (var i = 2; i < count - 2; i++) {
          if (datas[i + this.startIndex].dateTime.substr(0, 10) !== datas[i + this.startIndex - 1].dateTime.substr(0, 10)) {
            hourDates.push({
              text: datas[i + this.startIndex].dateTime.substr(0, 10),
              index: i
            });
          }
        }
        for (var j = 1; j < hourDates.length; j++) {
          if (hourDates[j].index - hourDates[j - 1].index < 7) {
            hourDates.splice(j, 1);
          }
        }
        hourDates.forEach(function (date) {
          _this.drawGridTextX(date.text, date.index);
        });
      }
      else if (cycleNumber < 60 * 24 * 20) {
        var cycle = this.cycle;
        var dayDates = [];
        for (var i = 2; i < count - 2; i++) {
          if (datas[i + this.startIndex].dateTime.substr(0, 7) !== datas[i + this.startIndex - 1].dateTime.substr(0, 7)) {
            dayDates.push({
              text: datas[i + this.startIndex].dateTime.substr(0, 7),
              index: i
            });
          }
        }
        for (var j = 1; j < dayDates.length; j++) {
          if (dayDates[j].index - dayDates[j - 1].index < 7) {
            dayDates.splice(j, 1);
          }
        }
        dayDates.forEach(function (date, i) {
          var cycleSign = convertCycleToNumber(cycle)
          if (cycleSign <= 60 * 25 || (cycleSign > 60 * 25 && i % 3 === 0)) {
            _this.drawGridTextX(date.text, date.index);
          }
        });
      } else {
        var monthDates = [];
        for (var i = 2; i < count - 2; i++) {
          if (datas[i + this.startIndex].dateTime !== datas[i + this.startIndex - 1].dateTime) {
            monthDates.push({
              text: datas[i + this.startIndex].split('-')[0],
              index: i
            });
          }
        }
        monthDates.forEach(function (date) {
          _this.drawGridTextX(date.text, date.index);
        });
      }
      this.ctx.stroke()
    };
    KLine.prototype.drawGridTextX = function (date, index) {
      var _a = this, displayCount = _a.displayCount,
        height = _a.height, figureWidth = _a.figureWidth;
      var unitX = Math.round(figureWidth / displayCount);
      var axisY = height;
      var dt = /^[\d]{2}:[\d]{2}$/.test(date) ? date : new Date(date);
      if (dt instanceof Date) {
        var dtStr = (dt.getMonth() + 1) + '/' + dt.getDate()
      } else {
        var dtStr = dt
      }
      // console.log(`${dtStr}, index: ${index}, ${unitX * index}, ${unitX * index - 15} .`)   
      this.drawText(dtStr, [unitX * index + unitX - 15 + 17 / 2, axisY - 5], undefined, 'center');
    };

    KLine.prototype.getBarColor = function (bars, index) {
      var _a = this, riseColor = _a.riseColor, fallColor = _a.fallColor;
      var openPrice = bars[index].open;
      var closePrice = bars[index].close;
      if (closePrice > openPrice) {
        return riseColor;
      }
      else if (closePrice < openPrice) {
        return fallColor;
      }
      else {
        if (index === 0) {
          return this.textColor;
        }
        else {
          var preClosePrice = bars[index - 1].close;
          return closePrice > preClosePrice ? riseColor : fallColor;
        }
      }
    };

    KLine.prototype.clearUsrLines = function () {
      this.isDrawUsrLine = false;
      this.isUsrMouseOver = false;
      this.usrLines.splice(0, this.usrLines.length);
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.initialize();
    };

    KLine.prototype.setUsrLine = function (lineType) {
      this.isDrawUsrLine = true;
      if (lineType === 'line1' || lineType === 'line4') {
        this.usrDrawCount = 1;
      } else {
        this.usrDrawCount = 2;
      }
      this.usrLineType = lineType;
      this.usrDrawParam = {};
      this.usrLineId = 0;
    };

    KLine.prototype.drawUsrLine1 = function (param) {
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, unitX = _a.unitX, startIndex = _a.startIndex;
      ctx.beginPath();
      ctx.strokeStyle = this.usrLineColor;
      var barX = unitX * (param.x1 - startIndex) + unitX / 2 + 10;
      ctx.lineWidth = 1;
      var curY = this.calcY(param.price1)
      ctx.moveTo(0 + 0.5, curY * dpr + 0.5);
      ctx.lineTo((this.figureWidth) * dpr + 0.5, curY * dpr + 0.5);
      ctx.stroke();
      if (!param.isHidePoint) {
        this.drawCycle({
          point: [barX, curY],
          radius: 6,
          fillColor: this.usrFillColor,
          borderColor: this.usrLineColor
        })
      }
    };

    KLine.prototype.drawUsrLine2 = function (param) {
      //console.log(JSON.stringify(param))
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, unitX = _a.unitX, startIndex = _a.startIndex;
      var barX1 = unitX * (param.x1 - startIndex) + unitX / 2 + 10;
      var curY = this.calcY(param.price1);
      if (!param.isHidePoint) {
        this.drawCycle({
          point: [barX1, curY],
          radius: 6,
          fillColor: this.usrFillColor,
          borderColor: this.usrLineColor
        })
      }
      if (param.x2) {
        var barX2 = unitX * (param.x2 - startIndex) + unitX / 2 + 10;
        ctx.beginPath();
        ctx.strokeStyle = this.usrLineColor;
        ctx.lineWidth = 1;
        ctx.moveTo((barX1 + 6) * dpr + 0.5, curY * dpr + 0.5);
        ctx.lineTo(barX2 * dpr + 0.5, curY * dpr + 0.5);
        ctx.stroke();
        if (!param.isHidePoint) {
          this.drawCycle({
            point: [barX2, curY],
            radius: 6,
            fillColor: this.usrFillColor,
            borderColor: this.usrLineColor
          })
        }
      }
    };

    KLine.prototype.drawUsrLine3 = function (param) {
      //console.log(JSON.stringify(param))
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, unitX = _a.unitX, startIndex = _a.startIndex;
      var barX1 = unitX * (param.x1 - startIndex) + unitX / 2 + 10;
      var curY = this.calcY(param.price1);
      if (!param.isHidePoint) {
        this.drawCycle({
          point: [barX1, curY],
          radius: 6,
          fillColor: this.usrFillColor,
          borderColor: this.usrLineColor
        })
      }
      ctx.beginPath();
      ctx.strokeStyle = this.usrLineColor;
      ctx.lineWidth = 1;
      ctx.moveTo((barX1 + 6) * dpr + 0.5, curY * dpr + 0.5);
      var endX = this.figureWidth;
      if (param.x2 && param.x2 < param.x1) {
        endX = 0;
      }
      ctx.lineTo(endX * dpr + 0.5, curY * dpr + 0.5);
      ctx.stroke();
      if (param.x2) {
        var barX2 = unitX * (param.x2 - startIndex) + unitX / 2 + 10;
        if (!param.isHidePoint) {
          this.drawCycle({
            point: [barX2, curY],
            radius: 6,
            fillColor: this.usrFillColor,
            borderColor: this.usrLineColor
          })
        }
      }
      if (param.isShowPrice) {
        this.drawText(param.price1, [barX1 + 5, curY + 12], this.textColor);
      }
    };

    KLine.prototype.drawUsrLine4 = function (param) {
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, unitX = _a.unitX, startIndex = _a.startIndex;
      ctx.beginPath();
      ctx.strokeStyle = this.usrLineColor;
      var barX = unitX * (param.x1 - startIndex) + unitX / 2 + 10;
      ctx.lineWidth = 1;
      var curY = this.calcY(param.price1)
      ctx.moveTo(barX * dpr + 0.5, 0 + 0.5);
      ctx.lineTo(barX * dpr + 0.5, (this.figureHeight - this.figureOffsetY + 2) * dpr + 0.5);
      ctx.stroke();
      if (!param.isHidePoint) {
        this.drawCycle({
          point: [barX, curY],
          radius: 6,
          fillColor: this.usrFillColor,
          borderColor: this.usrLineColor
        })
      }
    };

    KLine.prototype.drawUsrLine5 = function (param) {
      //console.log(JSON.stringify(param))
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, unitX = _a.unitX, startIndex = _a.startIndex;

      var barX1 = unitX * (param.x1 - startIndex) + unitX / 2 + 10;
      var curY1 = this.calcY(param.price1);
      if (param.x2) {
        var barX2 = unitX * (param.x2 - startIndex) + unitX / 2 + 10;
        var curY2 = this.calcY(param.price2);
        var a = (curY2 - curY1) / (barX2 - barX1);
        var b = curY1 - a * barX1;
        ctx.beginPath();
        ctx.strokeStyle = this.usrLineColor;
        ctx.lineWidth = 1;
        var tmpX = (parseFloat(param.x1) < parseFloat(param.x2) ? 0 : this.figureWidth + 20);
        if (param.isStartX)
          ctx.moveTo(barX1 * dpr + 0.5, curY1 * dpr + 0.5);
        else
          ctx.moveTo(tmpX * dpr + 0.5, (a * tmpX + b) * dpr + 0.5);
        var tmpY = (parseFloat(param.price1) > parseFloat(param.price2) ? (this.figureHeight - this.figureOffsetY + 2) : 0);
        ctx.lineTo(((tmpY - b) / a) * dpr + 0.5, tmpY * dpr + 0.5);
        ctx.stroke();
        if (!param.isHidePoint) {
          this.drawCycle({
            point: [barX2, curY2],
            radius: 6,
            fillColor: this.usrFillColor,
            borderColor: this.usrLineColor
          })
        }
      }
      if (!param.isHidePoint) {
        this.drawCycle({
          point: [barX1, curY1],
          radius: 6,
          fillColor: this.usrFillColor,
          borderColor: this.usrLineColor
        })
      }
    };

    KLine.prototype.drawUsrLine8 = function (param) {
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, unitX = _a.unitX, startIndex = _a.startIndex;
      var barX1 = unitX * (param.x1 - startIndex) + unitX / 2 + 10;
      var curY1 = this.calcY(param.price1);
      /*var cycleY1 = curY1;
      if (param.x2 && param.price2 > param.price1)
        cycleY1 += 2;
      else if (param.x2 && param.price2 < param.price1)
        cycleY1 -= 2;*/
      if (param.x2) {
        var barX2 = unitX * (param.x2 - startIndex) + unitX / 2 + 10;
        var curY2 = this.calcY(param.price2);
        if (param.isShowArrow) {
          this.drawArrowLine({
            startPoint: [barX1, curY1],
            endPoint: [barX2, curY2]
          })
        } else {
          ctx.beginPath();
          ctx.strokeStyle = this.usrLineColor;
          ctx.lineWidth = 1;
          ctx.moveTo(Math.round(barX1) * dpr + 0.5, Math.round(curY1) * dpr + 0.5);
          ctx.lineTo(Math.round(barX2) * dpr + 0.5, Math.round(curY2) * dpr + 0.5);
          ctx.stroke();
        }

        if (!param.isHidePoint) {
          this.drawCycle({
            point: [barX2, curY2],
            radius: 6,
            fillColor: this.usrFillColor,
            borderColor: this.usrLineColor
          })
        }
      }
      if (!param.isHidePoint) {
        this.drawCycle({
          point: [barX1, curY1],
          radius: 6,
          fillColor: this.usrFillColor,
          borderColor: this.usrLineColor
        })
      }
    };

    KLine.prototype.updateBar = function (barData) {
      var tmpData = deepCopy(barData)
      if (!this.datas) {
        this.datas = [barData];
      } else {
        var lastData = this.datas[this.datas.length - 1];
        var isUpdate = false;
        if (lastData && lastData.dateTime === tmpData.dateTime) {
          if (lastData.open !== tmpData.open || lastData.high !== tmpData.high
            || lastData.low !== tmpData.low || lastData.close !== tmpData.close) {
            this.datas[this.datas.length - 1].high = tmpData.high;
            this.datas[this.datas.length - 1].low = tmpData.low;
            this.datas[this.datas.length - 1].close = tmpData.close;
            this.datas[this.datas.length - 1].vol = tmpData.vol;
            this.datas[this.datas.length - 1].amount = tmpData.amount;
            this.datas[this.datas.length - 1].openInst = tmpData.openInst;
            isUpdate = true;
          }
          //console.log(JSON.stringify())
          //console.log(this.mainIndicator)
          if (this.mainIndicator !== null) {
            this.mainIndicator.updateBar(tmpData);
          }
          this.subIndicator.updateBar(tmpData);
          /*this.mainLineLists.forEach(function(el, i) {
            SMA.UpdateMA(el.prices, _this.datas, el.params)
          })*/
        } else {
          // console.log('new bar:'+this.startIndex)
          //console.log(this.mainIndicator)
          this.datas.push(tmpData);
          if (this.mainIndicator !== null) {
            this.mainIndicator.appendBar(tmpData);
          }
          if (this.subIndicator !== null) {
            this.subIndicator.appendBar(tmpData);
          }
					/*this.mainLineLists.forEach(function(el, i) {
						SMA.AppendMA(el.prices, el.prices.length, _this.datas, el.params)
					})*/
          this.startIndex += 1;
          isUpdate = true;
        }

        if (isUpdate) {
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.initialize();
          if (this.isShowCrossLine) {
            this.drawLengeAndLine(this.preMouseE);
          }
          //console.log(JSON.stringify(barData))
        }
      }
    };

    KLine.prototype.changeTheme = function (themeType) {
      if (themeType === 1) {
        this.grid.color = '#ddd'
      } else {
        this.grid.color = 'rgba(51,51,51,1)'
      }
      this.initialize();
    }

    KLine.prototype.resetValue = function (width, height) {
      this.decLen = 0;
      if (this.priceTick) {
        var values = this.priceTick.toString().split('.');
        if (values.length > 1) {
          this.decLen = values[1].length;
        }
      }
      var chartSize = (width && height) ? {width, height} : getElementSize(this.container)
      this.width = chartSize.width;
      this.height = chartSize.height;
      this.subChartHeight = this.height / 4;
      this.figureWidth = this.width - 50;
      this.figureHeight = this.height - this.subChartHeight - this.axisTextHeight;

      this.figureOffsetHeight = this.figureHeight - this.figureOffsetY;
      this.volumeTopHeight = this.height - this.subChartHeight + this.textOffsetY;
      //console.log(this.displayCount)
      this.unitX = (this.figureWidth - 20) / this.displayCount;
      //console.log(this.width, this.figureWidth, this.unitX *this.displayCount )
      var totalCount = this.datas ? this.datas.length : 0;
      this.startIndex = this.preStartIndex = (this.displayCount > totalCount ? 0 : totalCount - this.displayCount);
    }

    KLine.prototype.reset = function (title, cycle, priceTick, volumeMultiple, datas) {
      this.datas.splice(0);
      this.datas = datas;
      this.title = title;
      this.cycle = cycle;
      this.priceTick = priceTick;
      this.volumeMulitiple = volumeMultiple;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.resetValue();
      this.resetIndicator();
      this.initialize();
    }

    KLine.prototype.resize = function (width, height) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.resetValue(width, height);
      this.initialize();
      console.log('width: ', this.width, 'height: ', this.height)
      return {
        width: this.width,
        height: this.height
      }
    }

    KLine.prototype.changeDisplayCount = function (step) {
      if (this.displayCount > 50 || step > 0) {
        // console.log(step)
        this.displayCount = this.displayCount + step * 10;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.resetValue();
        this.initialize();
      }
    };

    KLine.prototype.resetIndicator = function () {
      for (var i = 0; i < this.indicators.length; i++) {
        var indicator = this.indicators[i];
        indicator.bindDatas(this.datas);
        indicator.calculate();
      }
    }

    KLine.prototype.changeIndicator = function (indicatorName, isMain) {
      if ((isMain && indicatorName === this.selectedMainIndicator)
        || (!isMain && indicatorName === this.selectedSubIndicator)) {
        return;
      }
      else {
        for (var i = 0; i < this.indicators.length; i++) {
          var indicator = this.indicators[i];
          if ((isMain && indicator.name === this.selectedMainIndicator)
            || (!isMain && indicator.name === this.selectedSubIndicator)) {
            this.indicators.splice(i, 1);
            break;
          }
        }
        if (indicatorName !== '无') {
          var indicator = null;
          if (indicatorName === 'VOL') {
            indicator = jIndicator.createVOL({
              datas: this.datas
            });
          } else if (indicatorName === 'SMA') {
            indicator = jIndicator.createSMA({
              datas: this.datas
            });
          } else if (indicatorName === 'EMA') {
            indicator = jIndicator.createEMA({
              datas: this.datas
            });
          } else if (indicatorName === 'BOLL') {
            indicator = jIndicator.createBOLL({
              datas: this.datas
            });
          } else if (indicatorName === 'MACD') {
            indicator = jIndicator.createMACD({
              datas: this.datas
            });
          } else if (indicatorName === 'DMI') {
            indicator = jIndicator.createDMI({
              datas: this.datas
            });
          } else if (indicatorName === 'DMA') {
            indicator = jIndicator.createDMA({
              datas: this.datas
            });
          } else if (indicatorName === 'KDJ') {
            indicator = jIndicator.createKDJ({
              datas: this.datas
            });
          } else if (indicatorName === 'TRIX') {
            indicator = jIndicator.createTRIX({
              datas: this.datas
            });
          }
          if (indicator !== null) {
            indicator.calculate();
            if (isMain) {
              this.mainIndicator = indicator;
              this.selectedMainIndicator = indicator.name
            }
            else {
              this.subIndicator = indicator;
              this.selectedSubIndicator = indicator.name
            }
            this.indicators.push(indicator);
          }
        } else {
          this.selectedMainIndicator = '';
          this.mainIndicator = null;
        }
        this.initialize();
      }
    }

    KLine.prototype.drawTitleText = function (realIndex) {
      var _a = this, dpr = _a.dpr;
      var spanHeight = 0;
      if (this.width < 900) {
        spanHeight = 13;
      }
      this.drawText(this.title
        + '  开 ' + this.datas[realIndex].open.toFixed(this.decLen)
        + '  高 ' + this.datas[realIndex].high.toFixed(this.decLen)
        + '  低 ' + this.datas[realIndex].low.toFixed(this.decLen)
        + '  收 ' + this.datas[realIndex].close.toFixed(this.decLen),
        [10, 14], this.textColor);
      //kLine.drawText(kLine.dates[dataIndex + kLine.startIndex], [100, 14], '#aaaaaa');
      var dot = {
        radius: 3,
        paddingLeft: 10,
        paddingRight: 3
      };
      var textWidth = 0;
      var mainIndicator = this.mainIndicator;
      //console.log(mainIndicator)
      if (mainIndicator !== null) {
        for (var key in mainIndicator.values) {
          var graph = mainIndicator.graphs[key];
          if (mainIndicator.values.hasOwnProperty(key)) {
            var prices = mainIndicator.values[key];
            //drawLenge
            var lengePrice = '-';
            if (prices.length > 0)
              lengePrice = prices[realIndex] === '-' ? '-' : parseFloat(prices[realIndex]).toFixed(this.decLen)
            var text = key + " " + lengePrice;
            var curWidth = 0;
            if (spanHeight > 0) {
              curWidth = textWidth + 20;
              textWidth += this.ctx.measureText(text).width / dpr;
            } else {
              textWidth += this.ctx.measureText(text).width / dpr;
              curWidth = this.figureWidth - textWidth;
            }
            this.drawText(text, [curWidth, this.figureOffsetY - 5 + spanHeight], graph.color);
            this.drawRound({
              point: [curWidth - dot.radius - dot.paddingRight, this.figureOffsetY - 6 - dot.radius + spanHeight],
              radius: dot.radius,
              isFill: true,
              fillColor: graph.color
            });
            textWidth += dot.radius * 2 + dot.paddingLeft + dot.paddingRight;
          };
        }
      }
      textWidth = 10;
      var subIndicator = this.subIndicator;
      if (subIndicator != null) {
        for (var key in subIndicator.values) {
          var graph = subIndicator.graphs[key];
          if (subIndicator.values.hasOwnProperty(key)) {
            var prices = subIndicator.values[key];
            //drawLenge
            var lengeValue = '-'
            if (prices.length > realIndex) {
              lengeValue = prices[realIndex] > 10000 ? prices[realIndex] / 10000 : prices[realIndex];
            }
            if (lengeValue !== '-')
              lengeValue = lengeValue.toFixed(2);
            var text = key + " " + lengeValue;
            var curColor = this.textColor;
            if (graph.color)
              curColor = graph.color;
            this.drawText(text, [textWidth, this.height - this.subChartHeight], curColor);
            textWidth += this.ctx.measureText(text).width + 5;
          };
        }
      }
    }

    KLine.prototype.drawLengeAndLine = function (e) {
      if (!this.datas || this.datas.length === 0) return;
      var dpr = this.dpr;
      var curPrice = 0;
      var dataIndex = 0;
      var realIndex = 0;
      if (e === undefined) {
        dataIndex = this.displayCount;
        realIndex = this.datas.length - 1;
        curPrice = this.datas[realIndex].close.toFixed(this.decLen);
      } else {
        curPrice = Math.abs(((e.clientY - this.top - this.figureHeight + this.figureHeight / 6) / this.unitY - this.minPrice)).toFixed(this.decLen);
        dataIndex = Math.floor((e.clientX - 15 - this.left) / this.unitX);
        if (dataIndex < 0) dataIndex = 0;
        realIndex = dataIndex + this.startIndex >= this.datas.length ? this.datas.length - 1 : dataIndex + this.startIndex;
      }
      var displayDate = this.datas[realIndex].dateTime;

      var cycleNumber = convertCycleToNumber(this.cycle)
      if (cycleNumber > 60 * 24)
        displayDate = displayDate.substr(0, 10);
      else
        displayDate = displayDate.substr(0, 16);
      var barX = Math.floor(this.unitX * dataIndex + this.unitX / 2 + 10);

      if (dataIndex + this.startIndex < this.datas.length) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.crossLineColor;
        this.ctx.lineWidth = 1;
        var realY = e.clientY - this.top;
        if (realY >= 0 && realY <= this.figureHeight) {
          this.ctx.setLineDash([5, 10])
          this.ctx.moveTo(0 + 0.5, (e.clientY - this.top) * dpr + 0.5);
          this.ctx.lineTo((this.width - 50) * dpr + 0.5, (e.clientY - this.top) * dpr + 0.5);
          this.drawRect({
            x: (this.width - 49),
            y: (e.clientY - 8 - this.top),
            isFill: true,
            fillColor: this.crossFillColor,
            noBorder: true,
            size: 1,
            width: 50,
            height: 15
          }, true)
          var priceWidth = this.ctx.measureText(parseFloat(curPrice).toFixed(this.decLen)).width / dpr;
          this.drawText(parseFloat(curPrice).toFixed(this.decLen), [this.width - 25 - priceWidth / 2, e.clientY + 4 - this.top], this.crossTextColor)
        } else {
          this.ctx.setLineDash([5, 10])
          this.ctx.moveTo(0 + 0.5, (e.clientY - this.top) * dpr + 0.5);
          this.ctx.lineTo((this.width - 50) * dpr + 0.5, (e.clientY - this.top) * dpr + 0.5);

          this.drawRect({
            x: (this.width - 49),
            y: (e.clientY - 8 - this.top),
            isFill: true,
            fillColor: this.crossFillColor,
            noBorder: true,
            size: 1,
            width: 50,
            height: 15
          }, true)

          var subPrice = this.subMinPrice;
          var curSubHeight = parseFloat(this.height + this.top + 10 - this.textOffsetY - 18 - e.clientY);
          //console.log(curSubHeight, this.height, this.top, this.textOffsetY, e.clientY)
          if (curSubHeight > 0) {
            var subUnitY = (this.subChartHeight - this.textOffsetY - 18) / (this.subMaxPrice - this.subMinPrice);
            subPrice = curSubHeight / subUnitY + this.subMinPrice
          }
          subPrice = parseFloat(subPrice.toFixed(2));
          if (subPrice > 100000) {
            subPrice = parseFloat((subPrice / 10000).toFixed(2)) + '万'
          }
          var subPriceWidth = this.ctx.measureText(subPrice.toString()).width / dpr;
          this.drawText(subPrice, [this.width - 25 - subPriceWidth / 2, e.clientY + 4 - this.top], this.crossTextColor)
        }

        var dtStr = displayDate;
        var date = new Date(dtStr);
        var hour = date.getHours();
        var minute = date.getMinutes();
        dtStr = (date.getMonth() + 1) + '/' + date.getDate() + ' ' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute);
        //var dateWidth = this.ctx.measureText(displayDate).width / dpr;
        var dateWidth = this.ctx.measureText(dtStr).width / dpr;
        var fillWidth = dateWidth * 1.2;
        var fillSpan = (fillWidth - dateWidth) / 2;
        this.drawRect({
          x: barX + 0.5 - fillWidth / 2,
          y: (this.height - 16),
          size: 1,
          isFill: true,
          noBorder: true,
          fillColor: this.crossFillColor,
          width: (dateWidth + 10),
          height: 14
        }, true);

        this.drawText(dtStr, [barX + 0.5 - fillWidth / 2 + fillSpan, this.height - 4], this.crossTextColor);
        this.ctx.moveTo(barX * dpr + 0.5, 0 + 0.5);
        this.ctx.lineTo(barX * dpr + 0.5, (this.height - 18) * dpr + 0.5);
        this.ctx.stroke();
        this.ctx.restore();
      }

      this.drawTitleText(realIndex);
    }

    KLine.prototype.drawUsrLines = function (e) {
      var _a = this, top = _a.top, figureHeight = _a.figureHeight, unitX = _a.unitX, unitY = _a.unitY, minPrice = _a.minPrice,
        startIndex = _a.startIndex, isDrawUsrLine = _a.isDrawUsrLine, usrLineType = _a.usrLineType, usrDrawParam = _a.usrDrawParam,
        usrPreIndex = _a.usrPreIndex, usrPrePrice = _a.usrPrePrice, usrDrawCount = _a.usrDrawCount;
      if (!this.datas || this.datas.length === 0) return;
      var curPrice = Math.abs((e.clientY - top - figureHeight + figureHeight / 6) / unitY - minPrice).toFixed(2);
      var dataIndex = Math.floor((e.clientX - 15) / unitX);
      if (dataIndex < 0) dataIndex = 0;
      var realIndex = startIndex + dataIndex
      var curY = e.clientY - top;
      if (isDrawUsrLine) {
        if (usrLineType === 'line1' || usrLineType === 'line4') {
          this.usrDrawParam = {
            isHidePoint: false,
            x1: realIndex,
            price1: curPrice
          };
          if (usrLineType === 'line1') {
            this.drawUsrLine1(usrDrawParam);
          } else {
            this.drawUsrLine4(usrDrawParam);
          }

        } else {
          var curX1 = 0;
          var curX2 = 0;
          var curPrice1 = 0;
          var curPrice2 = 0;
          if (usrDrawCount === 2) {
            curX1 = realIndex;
            curX2 = undefined;
            curPrice1 = curPrice;
          } else if (usrDrawCount === 1) {
            if (usrLineType === 'line5' || usrLineType === 'line6' || usrLineType === 'line7' || usrLineType === 'line8') {
              curX1 = usrDrawParam.x1;
              curPrice1 = usrDrawParam.price1;
              curX2 = realIndex;
              curPrice2 = curPrice;
            } else {
              curX1 = usrDrawParam.x1;
              curX2 = realIndex;
              curPrice1 = curPrice;
            }
          } else {
            var offsetX = 0;
            var offsetY = 0;
            if (usrPreIndex > 0) {
              offsetX = usrPreIndex - realIndex;
              offsetY = usrPrePrice - curPrice;
            }
            this.usrPreIndex = realIndex;
            this.usrPrePrice = curPrice;

            curX1 = usrDrawParam.x1 - offsetX;
            curX2 = usrDrawParam.x2 - offsetX;
            curPrice1 = usrDrawParam.price1 - offsetY;
            curPrice2 = usrDrawParam.price2 - offsetY;
          }

          this.usrDrawParam = {
            isHidePoint: false,
            x1: curX1,
            x2: curX2,
            price1: curPrice1,
            price2: curPrice2,
            isStartX: usrLineType === 'line6',
            isShowArrow: usrLineType === 'line7',
            isShowPrice: usrLineType === 'line9'
          }
          if (usrLineType === 'line5' || usrLineType === 'line6' || usrLineType === 'line7' || usrLineType === 'line8') {
            var x1 = unitX * (curX1 - startIndex) + unitX / 2 + 10;
            var y1 = this.calcY(curPrice1);
            var x2 = unitX * (curX2 - startIndex) + unitX / 2 + 10;
            var y2 = this.calcY(curPrice2);
            var a = (y2 - y1) / (x2 - x1);
            var b = y1 - a * x1;
            this.usrDrawParam.a = a;
            this.usrDrawParam.b = b;
          }
          if (usrLineType === 'line2')
            this.drawUsrLine2(usrDrawParam);
          else if (usrLineType === 'line3' || usrLineType === 'line9')
            this.drawUsrLine3(usrDrawParam);
          else if (usrLineType === 'line5' || usrLineType === 'line6')
            this.drawUsrLine5(usrDrawParam);
          else if (usrLineType === 'line7' || usrLineType === 'line8')
            this.drawUsrLine8(usrDrawParam);
        }
      } else {
        if (!this.isMouseDown) {
          for (var i = 0; i < this.usrLines.length; i++) {
            var el = this.usrLines[i];
            var lineY = this.calcY(el.param.price1);
            var isOnLine = false;
            if (el.type === 'line1') {
              isOnLine = curY > lineY - 5 && curY < lineY + 5;
            } else if (el.type === 'line2') {
              isOnLine = curY > lineY - 5 && curY < lineY + 5
                && realIndex > el.param.x1 && realIndex < el.param.x2;
            } else if (el.type === 'line3' || el.type === 'line9') {
              if (el.param.x1 > el.param.x2) {
                isOnLine = curY > lineY - 5 && curY < lineY + 5
                  && realIndex > 0 && realIndex < el.param.x1;
              } else {
                isOnLine = curY > lineY - 5 && curY < lineY + 5
                  && realIndex > el.param.x1 && this.datas.length;
              }
            } else if (el.type === 'line4') {
              isOnLine = realIndex === el.param.x1;
            } else if (el.type === 'line7' || el.type === 'line8' || el.type === 'line5' || el.type === 'line6') {
              var x = unitX * (realIndex - startIndex) + unitX / 2 + 10;
              var y = this.calcY(curPrice);
              var result = el.param.a * x + el.param.b;
              isOnLine = y > result - 5 && y < result + 5;
            }
            if (isOnLine) {
              el.param.isHidePoint = false;
              this.isUsrMouseOver = true;
              this.usrDrawParam = deepCopy(el.param);
              this.usrLineType = el.type;
              this.usrLineId = el.id;
              break;
            } else {
              el.param.isHidePoint = true;
              this.isUsrMouseOver = false;
            }
          }
        }
      }
    }
    return KLine;
  }(baseChart.Chart));

  function createKChart(options) {
    var defaultOptions = {
      displayCount: 50,
      grid: {
        x: 0,
        y: 4,
        color: 'rgba(195,195,195,0.2)'
      }
    };
    options = mixins({}, defaultOptions, options);
    var kLine = new KLine(options);
    kLine.initialize();

    // 这个并不会被触发 ...
    kLine.canvas.addEventListener('mousedown', function (e) {
      if (e.button === 2) {
        if (kLine.isUsrMouseOver) {
          for (var i = 0; i < kLine.usrLines.length; i++) {
            if (kLine.usrLines[i].id === kLine.usrLineId) {
              kLine.isUsrMouseOver = false;
              kLine.isDrawUsrLine = false;
              kLine.usrLines.splice(i, 1);
              break;
            }
          }
        }
      }
    })

    kLine.canvas.addEventListener('mousedown', function (e) {
      var isNeedRedraw = false;
      if (!kLine.isShowCrossLine) {
        kLine.isShowCrossLine = true;
      } else {
        kLine.isShowCrossLine = false;
        isNeedRedraw = true;
      }
      if (kLine.isDrawUsrLine) {
        isNeedRedraw = true;
      }

      kLine.isMouseDown = true;
      kLine.preMouseDownX = e.clientX;

      if (kLine.isDrawUsrLine) {
        kLine.usrDrawCount--;
        if (kLine.usrDrawCount === 0) {
          kLine.usrDrawParam.isHidePoint = true;
          kLine.usrCount++;
          kLine.usrLines.push({
            id: kLine.usrCount,
            type: kLine.usrLineType,
            param: deepCopy(kLine.usrDrawParam)
          });
          kLine.isDrawUsrLine = false;
        }
      }
      if (kLine.isUsrMouseOver) {
        kLine.isDrawUsrLine = true;
      }

      if (isNeedRedraw) {
        kLine.ctx.clearRect(0, 0, kLine.width, kLine.height);
        kLine.initialize();
      }
    })

    kLine.canvas.addEventListener('mouseup', function (e) {
      console.log('up up up')
      kLine.isMouseDown = false;
      kLine.preStartIndex = kLine.startIndex;
      kLine.usrPreIndex = 0;
      if (kLine.isUsrMouseOver) {
        for (var i = 0; i < kLine.usrLines.length; i++) {
          if (kLine.usrLines[i].id === kLine.usrLineId) {
            kLine.isUsrMouseOver = false;
            kLine.isDrawUsrLine = false;
            kLine.usrLines[i].param = deepCopy(kLine.usrDrawParam);
            break;
          }
        }
      }
    })

    kLine.canvas.addEventListener('mousemove', function (e) {
      kLine.preMouseE = e;
      //drag1
      if (kLine.isMouseDown && !kLine.isUsrMouseOver) {
        kLine.ctx.clearRect(0, 0, kLine.width, kLine.height);
        kLine.initialize();
        var offset = kLine.preMouseDownX - e.clientX;
        if (offset !== 0) {
          kLine.startIndex = kLine.preStartIndex + offset;

          if (kLine.startIndex <= 0) {
            kLine.startIndex = kLine.preStartIndex = 0;
          } else if (kLine.startIndex >= kLine.datas.length) {
            kLine.startIndex = kLine.preStartIndex = kLine.datas.length - 1;
          }
        }
      } else if (kLine.isDrawUsrLine) {
        kLine.ctx.clearRect(0, 0, kLine.width, kLine.height);
        kLine.initialize();
      } else {
        if (kLine.isShowCrossLine) {
          kLine.ctx.clearRect(0, 0, kLine.width, kLine.height);
          kLine.initialize();
          kLine.drawLengeAndLine(e);
        }
      }
      kLine.drawUsrLines(e);
    })

    return kLine;
  }
  jChart.createKChart = createKChart;

})(jChart || (jChart = {}));

export default jChart;