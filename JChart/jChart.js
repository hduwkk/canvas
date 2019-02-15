//图形基类
var jChart;
(function (jChart) {
  var Chart = (function () {
    function Chart(options) {
      this.canvas = document.getElementById(options.id);
      this.container = document.getElementById(options.containerId);
      this.isDblClicked = true;
      this.isShowCrossLine = false;
      this.isMouseDown = false;
      this.isDrawUsrLine = false;
      this.isUsrMouseOver = false;
      this.usrLineId = 0;
      this.usrCount = 0;
      this.usrLineType = 'line1';
      this.usrLines = [];
      this.usrDrawCount = 0;
      this.usrPreIndex = 0;
      this.usrPrePrice = 0;
      this.usrDrawParam = {};
      this.startIndex = 0;
      this.title = options.title || '';
      this.cycle = options.cycle || '1M';
      this.preStartIndex = 0;
      this.preMouseDownX = 0;
      this.preMouseE = undefined;
      this.curMouseE = undefined;
      this.top = options.top || 0;
      this.left = options.left || 0;
      this.offsetTop = options.offsetTop || 0;
      this.offsetLeft = options.offsetLeft || 0;
      this.width = options.width || document.body.clientWidth;
      this.height = options.height || document.body.clientHieght;
      this.textOffsetY = options.textOffsetY || 2;
      this.subChartHeight = this.height / 4;
      this.axisTextHeight = options.axisTextHeight || 10;
      this.figureOffsetY = options.figureOffsetY || 20;
      this.figureOffsetX = options.figureOffsetX || 20;
      this.figureWidth = this.width - 100;
      this.figureHeight = this.height - this.subChartHeight - this.axisTextHeight;
      this.figureOffsetHeight = this.figureHeight - this.figureOffsetY;
      this.grid = options.grid;
      this.font = options.font || '11px 微软雅黑';
      this.textColor = options.textColor || '#aaaaaa';
      this.lineColor = options.lineColor || 'grey';
      this.crossLineColor = options.crossLineColor || '#585858';
      this.crossFillColor = options.crossFillColor || '#585858';
      this.crossTextColor = options.crossTextColor || 'white';
      this.usrLineColor = options.usrLineColor || '#999';
      this.usrFillColor = options.usrFillColor || '#1b262d';
      this.lastTextColor = options.lastTextColor || 'white';
      this.lastLineColor = options.lastLineColor
      this.minPrice = 0;
      this.indicators = [];
      this.selectedMainIndicator = options.selectedMainIndicator || 'SMA';
      this.selectedSubIndicator = options.selectedSubIndicator || 'VOL';
      this.mainIndicator = null;
      this.subIndicator = null;
      this.subMaxPrice = 0;
      this.subMinPrice = 0;
    }
    Chart.prototype.initContext = function () {
      var dpr = Math.max(window.devicePixelRatio || 1, 1);
      var ctx = this.canvas.getContext('2d');
      ctx.translate(0.5, 0.5)
      if (dpr !== 1) {
        ctx.scale(dpr, dpr);
      }
      this.ctx = ctx;
      this.dpr = dpr;
    };
    Chart.prototype.initialize = function () {
      this.initContext();
      this.canvas.style.width = this.width + 'px';
      this.canvas.style.height = this.height + 'px';
      this.canvas.width = this.width * this.dpr;
      this.canvas.height = this.height * this.dpr;
    };
    Chart.prototype.drawLine = function (line, needStroke) {
      console.log(line, 'line')
      if (line.points.length > 0) {
        if (needStroke === void 0) { needStroke = true; }
        var _a = this, ctx = _a.ctx, dpr = _a.dpr;
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.size || 1;
        var spanPoint = ctx.lineWidth == 1 ? 0.5 : 0;
        ctx.moveTo(line.startPoint[0] * dpr + spanPoint, line.startPoint[1] * dpr + spanPoint);
        line.points.forEach(function (point) {
          ctx.lineTo(point[0] * dpr + spanPoint, point[1] * dpr + spanPoint);
        });
        if (needStroke) {
          ctx.stroke();
        }
      }
    };
    Chart.prototype.drawRect = function (rect, needStroke) {
      if (needStroke === void 0) { needStroke = true; }
      var _a = this, ctx = _a.ctx, dpr = _a.dpr;
      ctx.strokeStyle = rect.color;
      ctx.lineWidth = rect.size || 1;
      var spanPoint = ctx.lineWidth == 1 ? 0.5 : 0;
      if (rect.isFill) {
        ctx.fillStyle = rect.fillColor || this.usrFillColor;
        ctx.fillRect(rect.x * dpr, rect.y * dpr, rect.width * dpr, rect.height * dpr);
        if (!rect.noBorder) {
          ctx.rect((rect.x - 1) * dpr + spanPoint, (rect.y - 1) * dpr + spanPoint, (rect.width + 1) * dpr, (rect.height + 1) * dpr);
        }
      } else {
        ctx.rect(rect.x * dpr + spanPoint, rect.y * dpr + spanPoint, rect.width * dpr, rect.height * dpr);
      }
      if (needStroke) {
        ctx.stroke();
      }
    };
    Chart.prototype.drawDashedLine = function (p1, p2, size) {
      if (size === void 0) { size = 2; }
      var _a = this, ctx = _a.ctx, dpr = _a.dpr;
      var diffX = p2[0] - p1[0];
      var diffY = p2[1] - p1[1];
      var dashes = Math.floor(Math.sqrt(diffX * diffX + diffY * diffY) / size);
      var dashX = diffX / dashes;
      var dashY = diffY / dashes;
      var q = 0;
      ctx.moveTo(p1[0] * dpr + 0.5, p1[1] * dpr + 0.5);
      while (q++ < dashes) {
        p1[0] += dashX;
        p1[1] += dashY;
        ctx[q % 2 === 0 ? 'moveTo' : 'lineTo'](p1[0] * dpr + 0.5, p1[1] * dpr + 0.5);
      }
      ctx[q % 2 === 0 ? 'moveTo' : 'lineTo'](p2[0] * dpr + 0.5, p2[1] * dpr + 0.5);
    };
    Chart.prototype.drawArrowLine = function (line, needStroke) {
      var _a = this, ctx = _a.ctx, dpr = _a.dpr;
      var fromX = line.startPoint[0];
      var fromY = line.startPoint[1];
      var toX = line.endPoint[0];
      var toY = line.endPoint[1];
      if (!needStroke) needStroke = true;
      var isReverse = typeof (line.isReverse) != 'undefined' ? line.isReverse : false;
      var theta = typeof (line.theta) != 'undefined' ? line.theta : 30;
      var headlen = typeof (line.theta) != 'undefined' ? line.headlen : 10;
      var width = typeof (line.width) != 'undefined' ? line.width : 1;
      var color = line.color ? line.color : this.textColor;
      var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
        angle1 = (angle + theta) * Math.PI / 180,
        angle2 = (angle - theta) * Math.PI / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
      ctx.beginPath();
      var arrowX = fromX - topX,
        arrowY = fromY - topY;
      if (isReverse) {
        // Reverse length on the other side
        ctx.moveTo(Math.round(arrowX) * dpr + 0.5, Math.round(arrowY) * dpr + 0.5);
        ctx.lineTo(Math.round(fromX) * dpr + 0.5, Math.round(fromY) * dpr + 0.5);
        arrowX = fromX - botX;
        arrowY = fromY - botY;
        ctx.lineTo(Math.round(arrowX) * dpr + 0.5, Math.round(arrowY) * dpr + 0.5);
      }
      ctx.moveTo(Math.round(fromX) * dpr + 0.5, Math.round(fromY) * dpr + 0.5);
      ctx.lineTo(Math.round(toX) * dpr + 0.5, Math.round(toY) * dpr + 0.5);

      arrowX = toX + topX;
      arrowY = toY + topY;
      ctx.moveTo(Math.round(arrowX) * dpr + 0.5, Math.round(arrowY) * dpr + 0.5);
      ctx.lineTo(Math.round(toX) * dpr + 0.5, Math.round(toY) * dpr + 0.5);
      arrowX = toX + botX;
      arrowY = toY + botY;
      ctx.lineTo(Math.round(arrowX) * dpr + 0.5, Math.round(arrowY) * dpr + 0.5);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      if (needStroke) {
        ctx.stroke();
      }
    };
    Chart.prototype.drawText = function (text, point, textColor, textAlign) {
      if (textColor === void 0) { textColor = this.textColor; }
      var _a = this, ctx = _a.ctx, dpr = _a.dpr;
      ctx.font = this.font.replace(/(\d+)(px|em|rem|pt)/g, function (matched, m1, m2) {
        return m1 * dpr + m2;
      });
      ctx.fillStyle = textColor;
      ctx.textAlign = textAlign ? textAlign : 'start'
      ctx.fillText(text, Math.round(point[0]) * dpr, Math.round(point[1]) * dpr);
    };
    Chart.prototype.drawRound = function (round) {
      var _a = this, ctx = _a.ctx, dpr = _a.dpr;
      ctx.beginPath();
      ctx.arc(round.point[0] * dpr, round.point[1] * dpr, round.radius * dpr, 0, 2 * Math.PI);
      ctx.closePath();
      if (round.isStroke) {
        ctx.strokeStyle = round.borderColor;
        ctx.stroke();
      }
      if (round.isFill) {
        ctx.fillStyle = round.fillColor;
        ctx.fill();
      }
    };
    Chart.prototype.drawCycle = function (round) {
      var _a = this, ctx = _a.ctx, dpr = _a.dpr;
      ctx.lineWidth = 1;
      ctx.strokeStyle = round.borderColor;

      ctx.beginPath();
      ctx.arc(round.point[0] * dpr, round.point[1] * dpr, round.radius * dpr, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.arc((round.point[0]) * dpr, round.point[1] * dpr, (round.radius - 1) * dpr, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = round.fillColor;
      ctx.fill();
    };

    Chart.prototype.drawIndicators = function () {
      var _a = this;
      if (this.indicators.length) {
        this.indicators.forEach(function (el, i) {
          if (el.isInMain && el.name === _a.selectedMainIndicator) {
            _a.drawIndicatorToMain(el);
            _a.mainIndicator = el;
          } else if (!el.isInMain && el.name === _a.selectedSubIndicator) {
            _a.drawIndicatorToSub(el);
            _a.subIndicator = el;
          }
        });
      }
    };

    Chart.prototype.drawIndicatorToMain = function (indicator) {
      var _a = this, ctx = _a.ctx, startIndex = _a.startIndex,
        displayCount = _a.displayCount, unitX = _a.unitX, roofPrice = _a.roofPrice;
      for (var key in indicator.values) {
        var graph = indicator.graphs[key];
        if (indicator.values.hasOwnProperty(key)) {
          var points = [];
          var prices = indicator.values[key];
          var len = prices.length - startIndex;
          var count = Math.min(len, displayCount);
          for (var i = startIndex; i < startIndex + count; i++) {
            points.push([unitX * (i - startIndex) + 15, prices[i] > roofPrice ? NaN : this.calcY(prices[i])])
          }
          if (graph.style === 'solidline') {
            ctx.beginPath();
            this.drawLine({
              color: graph.color,
              size: 1,
              startPoint: points.splice(0, 1)[0],
              points: points
            });
          }
        };
      }
    }

    Chart.prototype.drawIndicatorToSub = function (indicator) {
      var _a = this, ctx = _a.ctx, datas = _a.datas, startIndex = _a.startIndex,
        displayCount = _a.displayCount, unitX = _a.unitX,
        subChartHeight = _a.subChartHeight, textOffsetY = _a.textOffsetY,
        width = _a.width, height = _a.height, figureWidth = _a.figureWidth,
        dpr = _a.dpr;
      var isDrawedAxisY;

      var len = undefined;
      var count = undefined;
      var maxPrice = undefined;
      var minPrice = undefined;
      for (var key in indicator.values) {
        var prices = indicator.values[key];
        len = prices.length - startIndex;
        count = Math.min(len, displayCount);
        for (var i = startIndex; i < startIndex + count; i++) {
          if (prices[i] !== '-') {
            if (maxPrice === undefined || prices[i] > maxPrice)
              maxPrice = prices[i];
            if (minPrice === undefined || prices[i] < minPrice)
              minPrice = prices[i];
          }
        }
      }
      if (maxPrice === minPrice) {
        minPrice = maxPrice - 1;
      }
      this.subMaxPrice = maxPrice;
      this.subMinPrice = minPrice;
      var subUnitY = (subChartHeight - textOffsetY - 18) / (maxPrice - minPrice);
      for (var key in indicator.values) {
        var graph = indicator.graphs[key];
        if (indicator.values.hasOwnProperty(key)) {
          var prices = indicator.values[key];
          if (!isDrawedAxisY) {
            var multiNum = maxPrice / 10000 > 1000 ? 10000 : 1
            var spanPrice = (maxPrice - minPrice) / 4;
            var fieldWidth = ctx.measureText((maxPrice / multiNum).toFixed(0)).width
            var fontWidth = 60 - fieldWidth / 2 + figureWidth;
            var spanHeight = subChartHeight / 4;
            for (var i = 1; i < 4; i++) {
              var curSubPrice = parseFloat(((minPrice + spanPrice * (4 - i)) / multiNum).toFixed(2));
              if (curSubPrice > 100000) {
                curSubPrice = Math.round(curSubPrice / 10000, 2) + '万'
              }
              var priceWidth = this.ctx.measureText(curSubPrice.toString()).width / dpr;
              var curHeight = this.figureHeight + spanHeight * i;
              //this.drawText('-', [20 + figureWidth, curHeight]);
              this.drawText(curSubPrice, [width - 25 - priceWidth / 2, curHeight]);
              //this.drawText('-', [95 + figureWidth, curHeight]);
            }
            isDrawedAxisY = true;
          }

          if (graph.style === 'solidline') {
            var points = [];
            for (var i = 0; i < count; i++) {
              var barX = unitX * i + unitX / 2 + 10;
              currentSubHeight = Math.round(height - (prices[i + startIndex] - minPrice) * subUnitY);
              if (currentSubHeight === height) {
                currentSubHeight = height - 1;
              }
              points.push([barX, currentSubHeight - 18]);
            }
            ctx.beginPath();
            this.drawLine({
              color: graph.color,
              size: 1,
              startPoint: points.splice(0, 1)[0],
              points: points
            });
          } else if (graph.style === 'bar') {
            var currentSubHeight;
            for (var i = 0; i < count; i++) {
              //var barX = unitX * i + unitX / 2 + 10;
              var barX = Math.floor(unitX * i + unitX / 2 + 10);
              var barWidth = Math.floor(unitX * 5 / 8);
              this.barWidth = barWidth
              console.log('barWidth', barWidth)
              if (barWidth % 2 !== 0) {
                barWidth += 1
              }
              currentSubHeight = Math.round(height - (prices[i + startIndex] - minPrice) * subUnitY);
              if (currentSubHeight === height) {
                currentSubHeight = height - 1;
              }
              ctx.beginPath();
              var openPrice = datas[i + this.startIndex].open;
              var closePrice = datas[i + this.startIndex].close;
              var preClosePrice = datas[(i + this.startIndex - 1 > 0 ? i + this.startIndex - 1 : 0)].close;
              var color = this.getBarColor(datas, i + this.startIndex);

              if ((closePrice > openPrice || (openPrice == closePrice && closePrice >= preClosePrice))
                && this.displayCount <= 150) {
                this.drawRect({
                  x: barX - barWidth / 2,
                  y: height - 18,
                  width: barWidth,
                  color: color,
                  height: currentSubHeight - height,
                  isFill: false,
                  size: 1
                })
              } else {
                this.drawRect({
                  x: barX - barWidth / 2,
                  y: height - 18,
                  width: barWidth,
                  color: color,
                  fillColor: color,
                  height: currentSubHeight - height,
                  isFill: true,
                  noBorder: true,
                  size: 1
                })
                /*this.drawLine({
                      color: color,
                      size: barWidth,
                      startPoint: [barX, height - 18],
                      points: [[barX, currentSubHeight - 18]]
                  });*/
              }
            }
          } else if (graph.style === 'steam') {
            // subChartHeight
            //var steamUnitY = (subChartHeight - textOffsetY - 18) / 2
            var currentSubHeight;
            for (var i = 0; i < count; i++) {
              var barX = unitX * i + unitX / 2 + 10;
              if (prices[i + startIndex] > 0)
                currentSubHeight = Math.round(height - (prices[i + startIndex] - minPrice) * subUnitY);
              else
                currentSubHeight = Math.round(height - Math.abs(prices[i + startIndex] - minPrice) * subUnitY);
              if (currentSubHeight === height) {
                currentSubHeight = height - 1;
              }
              ctx.beginPath();
              var steamColor = _a.riseColor;
              if (prices[i + startIndex] <= 0) {
                steamColor = _a.fallColor;
              }
              this.drawLine({
                color: steamColor,
                size: 1,
                startPoint: [Math.round(barX), height + Math.round(minPrice * subUnitY) - 18],
                points: [[Math.round(barX), currentSubHeight - 18]]
              });

            }
          }
        }
      }
			/*if (!this.isDblClicked) {
				this.drawText('量：'+(prices[count - 1 + this.startIndex] / multiNum).toFixed(0), [10, height - subChartHeight], this.textColor)
			}*/
    }
    return Chart;
  }());
  jChart.Chart = Chart;
})(jChart || (jChart = {}));
export default jChart;