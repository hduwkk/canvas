import jCommon from './jCommon'
import baseChart from './jChart'

let { __extends, deepCopy, getElementSize, convertCycleToNumber, mixins, arrayObjectIndexOf } = jCommon
//TickChart
var jChart;
(function (jChart) {
  var TickLine = (function (_super) {
    __extends(TickLine, _super);
    function TickLine(options) {
      _super.call(this, options);
      this.timeTemplates = options.timeTemplates;
      this.datas = options.datas;
      if (this.datas && this.datas.length > 0) {
        this.lastData = this.datas[this.datas.length - 1];
      }
      this.volumeMulitiple = options.volumeMulitiple;
      this.priceTick = options.priceTick;
      this.decLen = 0;
      var values = this.priceTick.toString().split('.');
      if (values.length > 1) {
        this.decLen = values[1].length;
      }
      var chartSize = getElementSize(this.container)
      this.width = chartSize.width;
      this.height = chartSize.height;
      //this.top = options.top || 0;
      this.figureWidth = this.width;
      this.figureHeight = this.height - 15;
      this.basePrice = options.basePrice;
      this.riseColor = options.riseColor || 'rgba(177,24,18,1)';
      this.fallColor = options.fallColor || 'rgba(47,140,85,1)';
      this.lastLineColor = options.lastLineColor || 'rgba(0,255,255,1)';
      this.crossLineColor = options.crossLineColor || '#616163';
      this.crossTextColor = options.crossTextColor || 'white';
      this.lastTextColor = options.lastTextColor || 'white';
      this.avgLineColor = options.avgLineColor || '#b67e27';
      this.volLineColor = options.volLineColor || 'rgba(210,210,0,1)';
      this.openInstLineColor = options.openInstLineColor || '#bdbdbf';

      this.generateDatas();
      this.resetValue();
    }

    TickLine.prototype.initialize = function () {
      _super.prototype.initialize.call(this);
      this.top = this.container.offsetTop - document.body.scrollTop;
      this.left = this.container.offsetLeft;
      this.drawGrid();
      this.drawPriceLine();
      this.drawAxisText();
    };
    TickLine.prototype.drawGrid = function () {
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, grid = _a.grid, width = _a.width, height = _a.height,
        figureWidth = _a.figureWidth, figureHeight = _a.figureHeight;
      // console.log('width:'+width+',height:'+height);
      /*ctx.beginPath();
      this.drawRect({
        x: 0,
        y: 1,
        width: figureWidth - 1,
        height: height - 2,
        color: grid.color,
        isFill: false,
        size: 1
      });*/
      ctx.beginPath();
      this.drawLine({
        color: grid.color,
        size: 1,
        startPoint: [51, 0],
        points: [[51, height]]
      });
      ctx.beginPath();
      this.drawLine({
        color: grid.color,
        size: 1,
        startPoint: [width - 50, 0],
        points: [[width - 50, height]]
      });
      ctx.beginPath();
      var baseHeight = this.calcY(this.basePrice);
      this.drawLine({
        color: grid.color,
        size: 2,
        startPoint: [50, baseHeight],
        points: [[width - 50, baseHeight]]
      });
      ctx.beginPath();
      var subHeight = Math.round(this.height * 0.7);
      this.drawLine({
        color: grid.color,
        size: 2,
        startPoint: [1, subHeight - 15 * dpr],
        points: [[this.figureWidth - 1, subHeight - 15 * dpr]]
      }, true);
    };

    TickLine.prototype.calcY = function (price) {
      return this.height * 0.7 - (price - this.floorPrice) * this.unitY;
    };

    TickLine.prototype.calcPrice = function (y) {
      return (this.height * 0.7 - y) / this.unitY + this.floorPrice;
    };

    TickLine.prototype.calcVolY = function (price) {
      return this.height - price * this.unitVolY;
    };

    TickLine.prototype.calcVolPrice = function (y) {
      return Math.round((this.height - y) / this.unitVolY);
    };

    TickLine.prototype.calcOIY = function (price) {
      return this.height - (price - this.oiFloorPrice) * this.unitOIY;
    };
    TickLine.prototype.drawPriceLine = function () {
      var _a = this, ctx = _a.ctx, unitX = _a.unitX;
      var datas = this.datas;
      var points = [];
      var avgPoints = [];
      var oiPoints = [];
      var totalPrice = 0;
      var preData = null;

      if (!this.lastData) {
        this.drawText('无主图数据', [this.width / 2, (this.height * 0.7) / 2 - 20], this.textColor);
        this.drawText('无副图数据', [this.width / 2, (this.height * 0.7 + this.height * 0.3 / 2)], this.textColor);
      } else {
        for (var i = 0; i < datas.length; i++) {
          if (!datas[i].close) continue;
          var price = datas[i].close;
          var openInst = datas[i].openInst;
          var vol = datas[i].vol;
          if (price == undefined && i > 0 && datas[i].dateTime < this.lastData.dateTime) {
            price = preData.close;
            openInst = preData.openInst;
            vol = 0;
          } else {
            preData = datas[i];
          }
          points.push([unitX * i + 50, this.calcY(price)]);
          totalPrice += price;
          var avgPrice = totalPrice / points.length;
          datas[i].avgPrice = avgPrice;
          avgPoints.push([unitX * i + 50, this.calcY(avgPrice)]);
          oiPoints.push([unitX * i + 50, this.calcOIY(openInst) - 16]);
          if (this.lastData.dateTime == datas[i].dateTime) {
            this.lastData.avgPrice = avgPrice;
          }
          var volColor = this.textColor;
          if (datas[i].close < datas[i].open) {
            volColor = this.fallColor;
          } else if (datas[i].close > datas[i].open) {
            volColor = this.riseColor;
          }
          ctx.beginPath();
          this.drawLine({
            color: volColor,
            size: 1,
            startPoint: [unitX * i + 50, this.height - 16],
            points: [[unitX * i + 50, this.calcVolY(vol) - 16]]
          });
        }
        //console.log('n1:'+ points.length+',n2:'+avgPoints.length)
        //画均线
        //console.log(avgPoints)
        ctx.beginPath();
        this.drawLine({
          color: this.lastLineColor,
          size: 1,
          startPoint: points.splice(0, 1)[0],
          points: points
        });
        ctx.beginPath();
        this.drawLine({
          color: this.avgLineColor,
          size: 1,
          startPoint: avgPoints.splice(0, 1)[0],
          points: avgPoints
        });

        ctx.beginPath();
        this.drawLine({
          color: this.openInstLineColor,
          size: 1,
          startPoint: oiPoints.splice(0, 1)[0],
          points: oiPoints
        }, true);

        if (!this.isShowCrossLine && this.lastData) {
          this.drawTitleText({
            price: this.lastData.close,
            avgPrice: this.lastData.avgPrice,
            vol: this.lastData.vol,
            openInst: this.lastData.openInst
          });
        }
      }
    };

    TickLine.prototype.drawCrossLine = function (e) {
      var dpr = this.dpr;
      var ctx = this.ctx;
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.crossLineColor;
      this.ctx.lineWidth = 1;
      this.ctx.setLineDash([5, 10]);
      var curY = (e.clientY - this.top) * dpr + 0.5;
      var curData = {};
      if (curY <= this.height - 15) {
        this.ctx.moveTo(51 + 0.5, curY);
        this.ctx.lineTo((this.width - 49 + 0.5) * dpr, curY);
        this.drawRect({
          x: (this.width - 50),
          y: e.clientY - this.top + 0.5 - 8,
          isFill: true,
          fillColor: this.crossLineColor,
          noBorder: true,
          size: 1,
          width: 50,
          height: 15
        });
        var curPrice = 0;
        if (curY < this.height * 0.7 - 15 * dpr) {
          curPrice = this.calcPrice(curY / dpr);
        } else {
          curPrice = this.calcVolPrice((curY + 15) / dpr);
        }
        curData.price = curPrice;
        var cPWidth = ctx.measureText(curPrice.toFixed(this.decLen)).width / dpr;
        this.drawText(curPrice.toFixed(this.decLen), [this.width - 25 * dpr - cPWidth / 2, e.clientY - this.top + 0.5 + 3], this.crossTextColor);
      }

      var dataIndex = Math.floor((e.clientX - 50 - this.left) / this.unitX) - 3;
      if (dataIndex >= 0 && dataIndex < this.datas.length) {
        var dtStr = this.datas[dataIndex].dateTime;
        var date = new Date(dtStr);
        var hour = date.getHours();
        var minute = date.getMinutes();
        dtStr = (date.getMonth() + 1) + '/' + date.getDate() + ' ' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute);
        var barX = Math.floor(this.unitX * dataIndex + 50);
        this.ctx.moveTo(barX * dpr + 0.5, 0 + 0.5);
        this.ctx.lineTo(barX * dpr + 0.5, this.height * dpr + 0.5 - 15);

        var dateWidth = ctx.measureText(dtStr).width / dpr;
        var fillWidth = dateWidth * 1.2;
        var span = (fillWidth - dateWidth) / 2;
        this.drawRect({
          x: barX + 0.5 - fillWidth / 2,
          y: this.height - 15,
          isFill: true,
          fillColor: this.crossLineColor,
          noBorder: true,
          size: 1,
          width: fillWidth,
          height: 15
        })
        this.drawText(dtStr, [barX + 0.5 - fillWidth / 2 + span, this.height - 3], this.crossTextColor);
        if (this.datas[dataIndex].close) {
          this.drawTitleText({
            price: this.datas[dataIndex].close.toFixed(this.decLen),
            avgPrice: this.datas[dataIndex].avgPrice.toFixed(this.decLen),
            vol: this.datas[dataIndex].vol,
            openInst: this.datas[dataIndex].openInst
          });
        }
      } else {
        if (this.lastData.close) {
          this.drawTitleText({
            price: this.lastData.close.toFixed(this.decLen),
            avgPrice: this.lastData.avgPrice.toFixed(this.decLen),
            vol: this.lastData.vol,
            openInst: this.lastData.openInst
          });
        }
      }
      this.ctx.stroke();
    }

    TickLine.prototype.drawTitleText = function (data) {
      var ctx = this.ctx, height = this.height;
      if (data.price) {
        //画标题
        var mt0 = this.title;
        var titleWidth = ctx.measureText(mt0).width;
        this.drawText(mt0, [60, 20], this.textColor);
        var mt1 = '分时线 ' + parseFloat(data.price).toFixed(this.decLen);
        this.drawText(mt1, [70 + titleWidth, 20], this.lastLineColor);
        var mt2 = '均线 ' + parseFloat(data.avgPrice).toFixed(this.decLen);
        titleWidth += ctx.measureText(mt1).width
        this.drawText(mt2, [80 + titleWidth, 20], this.avgLineColor);
        var st1 = '成交量 ' + data.vol + ' ';
        var st2 = '持仓量 ' + data.openInst + ' ';
        titleWidth = ctx.measureText(st1).width
        this.drawText(st1, [60, height * 0.7 + 3], this.volLineColor);
        this.drawText(st2, [70 + titleWidth, height * 0.7 + 3], this.openInstLineColor);
      }
    }

    TickLine.prototype.drawAxisText = function () {
      if (!this.lastData) return;
      var _a = this, ctx = _a.ctx, dpr = _a.dpr, width = _a.width, height = _a.height;
      var _b = this, roofPrice = _b.roofPrice, floorPrice = _b.floorPrice, basePrice = _b.basePrice;
      //主图
      var baseWidth = ctx.measureText(basePrice).width / dpr;
      var baseHeight = Math.round(this.calcY(basePrice) + 4);
      this.drawText(basePrice, [50 - baseWidth - 4, baseHeight], this.textColor);
      this.drawText('+0.00%', [width - 49, baseHeight], this.textColor);
      var curY = baseHeight;
      var curPrice = basePrice;
      var count = 0;
      var span = (this.roofPrice - this.floorPrice) / 10;
      span = Math.floor(span / this.priceTick);
      while (true) {
        curPrice += this.priceTick * span;
        curY = this.calcY(curPrice);
        if (count > 7 || curPrice > roofPrice || curY <= 0) {
          break;
        }
        var priceWidth = ctx.measureText(curPrice.toFixed(this.decLen)).width / dpr;
        this.drawText(curPrice.toFixed(this.decLen), [50 - priceWidth - 4, curY], this.riseColor);
        this.drawText('+' + ((curPrice - basePrice) / basePrice * 100).toFixed(this.decLen) + '%', [width - 49, curY], this.riseColor);
        count++;
      }
      curY = baseHeight;
      curPrice = basePrice;
      count = 0;

      while (true) {
        curPrice -= this.priceTick * span;
        curY = this.calcY(curPrice);
        if (count > 7 || curPrice < floorPrice + this.priceTick * 5 || curY >= this.height * 0.6) {
          break;
        }
        curPrice = curPrice.toFixed(this.decLen)
        priceWidth = ctx.measureText(curPrice).width / dpr;
        this.drawText(curPrice, [50 - priceWidth - 4, curY], this.fallColor);
        this.drawText(((curPrice - basePrice) / basePrice * 100).toFixed(2) + '%', [width - 49, curY], this.fallColor);
        count++;
      }
      //附图左栏成交量
      var curVol = 0;
      var spanVol = Math.round(this.volRoofPrice / 6);
      if (spanVol <= 0) spanVol = 1;
      while (curVol < this.volRoofPrice - spanVol) {
        if (curVol > 0) {
          var priceWidth = ctx.measureText(curVol).width / dpr;
          this.drawText(curVol, [50 - priceWidth - 4, this.calcVolY(curVol)], this.volLineColor);
        }
        curVol += spanVol;
      }
      //附图右栏持仓量
      var curOI = this.oiFloorPrice;
      var spanOI = Math.round((this.oiRoofPrice - this.oiFloorPrice) / 6);
      if (spanOI <= 0) spanOI = 1;
      while (curOI < this.oiRoofPrice) {
        if (curOI > this.oiFloorPrice) {
          var priceStr = curOI;
          if (curOI > 100000) {
            priceStr = (priceStr / 10000).toFixed(1) + '万';
          }
          //var priceWidth = ctx.measureText(priceStr).width;
          this.drawText(priceStr, [this.width - 48, this.calcOIY(curOI)], this.oiLineColor);
        }
        curOI += spanOI;
      }
      //画最后一个价格线
      //var lastBar = this.datas[this.datas.length - 1];
      var closeHeight = this.calcY(this.lastData.close);
      var barColor = this.crossLineColor;
      if (this.lastData.close < this.lastData.open) {
        barColor = this.fallColor;
      } else if (this.lastData.close > this.lastData.open) {
        barColor = this.riseColor;
      }
      //console.log(this.fallColor,this.riseColor,barColor)
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = barColor;
      this.ctx.setLineDash([2, 4]);
      this.ctx.moveTo(50 * dpr + 0.5, closeHeight * dpr + 0.5);
      this.ctx.lineTo((this.width - 50) * dpr + 0.5, closeHeight * dpr + 0.5);
      this.drawRect({
        x: this.width - 50,
        y: closeHeight - 7,
        isFill: true,
        fillColor: barColor,
        noBorder: true,
        size: 1,
        width: 50,
        height: 15
      }, true);
      var lastPrice = this.lastData.close.toFixed(this.decLen)
      var priceWidth = this.ctx.measureText(lastPrice).width / dpr;
      this.drawText(lastPrice, [this.width - 25 * dpr - priceWidth / 2, closeHeight + 5], this.lastTextColor)
      this.ctx.restore();

    }
    TickLine.prototype.generateDatas = function () {
      var realDatas = [];
      var now = new Date();
      var nowDay = now.getDay()
      var nowHour = now.getHours()

      this.timeTemplates.sort((a, b) => {
        var curTime = a[0]
        var nextTime = b[0]
        if (nextTime < curTime) {
          return true
        }
      })
      var len = this.timeTemplates.length
      if (this.timeTemplates[len - 1] > '20:00') {
        var tmp = this.timeTemplates[len - 1];
        this.timeTemplates.splice(len - 1, 1);
        this.timeTemplates.unshift(tmp);
      }

      for (var i = 0; i < this.timeTemplates.length; i++) {
        var realDay = new Date(now.toString());
        var tdetails = this.timeTemplates[i];
        var isDealedTime = false
        if (nowDay === 1) {
          if (nowHour < 20) {
            if (tdetails[0] >= '00:00:00' && tdetails[1] < '03:00:00') {
              realDay.setTime(now.getTime() - 1000 * 60 * 60 * 24 * 2);
              isDealedTime = true;
            } else if (tdetails[0] >= '20:00:00') {
              realDay.setTime(now.getTime() - 1000 * 60 * 60 * 24 * 3);
              isDealedTime = true;
            }
          }
        } else if (nowDay === 5) {
          if (nowHour >= 20) {
            if (tdetails[0] >= '00:00:00' && tdetails[1] < '03:00:00') {
              realDay.setTime(now.getTime() + 1000 * 60 * 60 * 24);
              isDealedTime = true;
            } else if (tdetails[0] >= '04:00:00' && tdetails[1] <= '20:00:00') {
              realDay.setTime(now.getTime() + 1000 * 60 * 60 * 24 * 3);
              isDealedTime = true;
            }
          }
        } else if (nowDay === 6) {
          if (tdetails[0] >= '20:00:00') {
            realDay.setTime(now.getTime() - 1000 * 60 * 60 * 24 * 1);
            isDealedTime = true;
          }
        } else if (nowDay === 0) {
          if (tdetails[0] >= '20:00:00') {
            realDay.setTime(now.getTime() - 1000 * 60 * 60 * 24 * 2);
            isDealedTime = true;
          }
        }
        if (!isDealedTime) {
          if (nowHour < 20) {
            if (tdetails[0] >= '20:00:00') {
              realDay.setTime(now.getTime() - 1000 * 60 * 60 * 24);
            }
          } else {
            if (tdetails[0] >= '00:00:00' && tdetails[1] < '20:00:00') {
              realDay.setTime(now.getTime() + 1000 * 60 * 60 * 24);
            }
          }
        }
        var dateStr = realDay.getFullYear() + '-' + (realDay.getMonth() + 1) + '-' + realDay.getDate();
        var startTime = new Date(dateStr + ' ' + tdetails[0]);
        var endTime = new Date(dateStr + ' ' + tdetails[1]);
        while (startTime < endTime) {
          startTime.setTime(startTime.getTime() + 1000 * 60);
          var month = realDay.getMonth() + 1;
          var day = realDay.getDate();
          var minute = startTime.getMinutes();
          var hour = startTime.getHours();

          var curTime = realDay.getFullYear() + '-' + (month > 9 ? month : '0' + month) + '-' + (day > 9 ? day : '0' + day)
            + ' ' + (hour > 9 ? hour : '0' + hour) + ':' + (minute > 9 ? minute : '0' + minute) + ':00';
          var data = { dateTime: curTime };
          if (this.datas && this.datas.length > 0) {
            for (var j = 0; j < this.datas.length; j++) {
              if (this.datas && this.datas.length > 0 && this.datas[j].dateTime == data.dateTime) {
                data = this.datas[j];
                this.datas.splice(j, 1);
                break;
              }
            }
          }
          realDatas.push(data);
        }
      }
      this.datas = realDatas;
    }
    TickLine.prototype.updateBar = function (barData) {
      var tmpBarData = deepCopy(barData);
      for (var i = 0; i < this.datas.length; i++) {
        var curData = this.datas[i];
        if (tmpBarData.dateTime == curData.dateTime) {
          this.lastData = tmpBarData;
          this.datas[i] = tmpBarData;
          var high = tmpBarData.high;
          var low = tmpBarData.low;
          var vol = tmpBarData.vol;
          var openInst = tmpBarData.openInst;

          if (!this.floorPrice || low < this.floorPrice) {
            this.floorPrice = low - 15 * this.priceTick;
          }
          if (!this.roofPrice || high > this.roofPrice) {
            this.roofPrice = low + 15 * this.priceTick;
          }
          if (!this.volRoofPrice || vol > this.volRoofPrice) {
            this.volRoofPrice = vol * 5;
          }
          if (!this.oiRoofPrice || openInst > this.oiRoofPrice) {
            this.oiRoofPrice = openInst + openInst * 0.1;
          }
          if (!this.oiFloorPrice || openInst < this.oiFloorPrice) {
            this.oiFloorPrice = openInst - openInst * 0.1;
          }

          var mainHeight = this.height * 0.7;
          var subHeight = this.height * 0.3;
          this.unitY = mainHeight / (this.roofPrice - this.floorPrice);
          this.unitVolY = subHeight / this.volRoofPrice;
          this.unitOIY = subHeight / (this.oiRoofPrice - this.oiFloorPrice);

          //console.log(this.oiRoofPrice, this.oiFloorPrice)
          //console.log(i, this.lastData.dateTime)
          this.ctx.clearRect(0, 0, this.width, this.height);
          this.initialize();
          if (this.isShowCrossLine) {
            this.drawCrossLine(this.curMouseE);
          }
          break;
        }
      }
    };
    TickLine.prototype.resetValue = function (width, height) {
      var chartSize = (width && height) ? {width, height} : getElementSize(this.container)
      this.decLen = 0;
      var values = this.priceTick.toString().split('.');
      if (values.length > 1) {
        this.decLen = values[1].length;
      }
      this.width = chartSize.width;
      this.height = chartSize.height;
      this.figureWidth = this.width;
      this.figureHeight = this.height - 15;
      this.unitX = (this.figureWidth - 100) / this.datas.length;
      this.floorPrice = this.basePrice - 15 * this.priceTick; // this.datas[0].close;
      this.roofPrice = this.basePrice + 15 * this.priceTick; //this.datas[0].close;
      this.volRoofPrice = this.datas[0].vol;
      this.oiFloorPrice = this.datas[0].openInst;
      this.oiRoofPrice = this.datas[0].openInst;
      for (var i = 1; i < this.datas.length; i++) {
        if (!this.datas[i].close) continue;
        var close = this.datas[i].close;
        var vol = this.datas[i].vol;
        var openInst = this.datas[i].openInst;
        if (!this.floorPrice || close < this.floorPrice + 15 * this.priceTick) {
          this.floorPrice = close - 15 * this.priceTick;
        }
        if (!this.roofPrice || close > this.roofPrice - 15 * this.priceTick) {
          this.roofPrice = close + 15 * this.priceTick;
        }
        if (!this.volRoofPrice || vol > this.volRoofPrice) {
          this.volRoofPrice = vol;
        }
        if (!this.oiFloorPrice || openInst < this.oiFloorPrice) {
          this.oiFloorPrice = openInst;
        }
        if (!this.oiRoofPrice || openInst > this.oiRoofPrice) {
          this.oiRoofPrice = openInst;
        }
      }

      this.volRoofPrice += Math.round(this.volRoofPrice / 20);
      var oiSpan = (this.oiRoofPrice - this.oiFloorPrice) / 20;
      this.oiRoofPrice += oiSpan;
      this.oiFloorPrice -= oiSpan;
      var mainHeight = this.height * 0.7;
      var subHeight = this.height * 0.3;
      this.unitY = mainHeight / (this.roofPrice - this.floorPrice);
      this.unitVolY = subHeight / this.volRoofPrice;
      this.unitOIY = subHeight / (this.oiRoofPrice - this.oiFloorPrice);
    }

    TickLine.prototype.reset = function (title, basePrice, priceTick, volumeMultiple, timeTemplates, datas) {
      this.datas.splice(0);
      this.datas = datas;
      this.timeTemplates = timeTemplates;
      this.generateDatas();
      this.title = title;
      this.basePrice = basePrice;
      this.priceTick = priceTick;
      this.volumeMulitiple = volumeMultiple;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.resetValue();
      this.initialize();
    }

    TickLine.prototype.resize = function (width, height) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.resetValue(width, height);
      this.initialize();
      return {width: this.width, height: this.height}
    }

    return TickLine;
  }(baseChart.Chart));

  function createTickChart(options) {
    var defaultOptions = {
      grid: {
        x: 4,
        y: 4,
        color: 'rgba(195,195,195,0.2)'
      },
      lastLineColor: 'rgba(0,255,255,1)',//rgba(85,170,48,1)
      avgLineColor: '#ba8329',//rgba(85,170,48,0.3)
      volLineColor: '#ba8329',//rgba(252,63,29,1)
      openInstLineColor: '#bdbdbf'//rgba(252,63,29,0.3)
    };
    options = mixins({}, defaultOptions, options);

    var tLine = new TickLine(options);
    tLine.initialize();
    tLine.canvas.addEventListener('dblclick', function () {

    })
    tLine.canvas.addEventListener('mousedown', function (e) {
      if (tLine.lastData) {
        if (!tLine.isShowCrossLine) {
          tLine.isShowCrossLine = true;
        } else {
          tLine.isShowCrossLine = false;
          tLine.ctx.clearRect(0, 0, tLine.width, tLine.height);
          tLine.initialize();
        }
        //tLine.preMouseDownX = e.clientX;
      }
    })
    tLine.canvas.addEventListener('mouseup', function (e) {
      //if (!bLine.isDblClicked) {
      //tLine.isMouseDown = false;
      //}
    })
    tLine.canvas.addEventListener('mousemove', function (e) {
      tLine.curMouseE = e;
      if (tLine.lastData && tLine.isShowCrossLine) {
        tLine.ctx.clearRect(0, 0, tLine.width, tLine.height);
        tLine.initialize();
        tLine.drawCrossLine(e);
      }
    })
    return tLine;
  }
  jChart.createTickChart = createTickChart;
})(jChart || (jChart = {}));
export default jChart;