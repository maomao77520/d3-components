// 合并两个对象
function mix(des, src) {
	for (var i in src) {
		if (! (i in des)) {
			des[i] = src[i];
		}
	}
	return des;
}

function Circle(svg) {
	this.svg = svg;
	this.defaultOptions = {
		width: 900,
		height: 900,
		fontFamily: 'microsoft yahei',
		title: '健康度',
	    position: 2, //1-上左，2-上中，3-上右，4-下左，5-下中，6-下右
	    padding: 0,
	    margin: 0,
	    borderType: 0, // 0-无，1-实线，2-虚线，3-点状线
	    borderColor: '#e2e2e2',
	    borderWidth: 10,
	    isShowTitle: 1, // 0-hide, 1-show
	    textColor: '#fff',
	    titleColor: '#000',
	    textSize: 58,
	    titleSize: 26,
	    titlePadding: 0,
	    backgroundColor: '#eee',
	    titleWeight: 1,
	    // range: [
	    //     [0, 100],[101, 200],[201, 300]
	    // ],
	    // rangeColor: [
	    //     ['#56c63e', '#288326'], 
	    //     ['#f9c557', '#cf571b'], 
	    //     ['#e3231e', '#9e180d']
	    // ],
	    fillColor1: '#56c63e',
	    fillColor2: '#288326',
	    lightCx: '5%',
	    lightCy: '5%',
	    lightR: '110%'
	};
}

Circle.prototype = {
	init: function (params) {
		this.data = mix(params || {}, this.defaultOptions);
		this.data.borderWidth = Number(this.data.borderWidth) > 0 ? Number(this.data.borderWidth) : 0;
        this.data.left = this.data.left || this.data.width / 2;
        if (this.data.top === undefined || this.data.top === '') {
            if (!this.data.isShowTitle) {
                this.data.top = this.data.height / 2;
            }
            else if (this.data.position <= 3) {
                this.data.top = (Number(this.data.height) + this.data.titleSize * 3 / 2 + Number(this.data.titlePadding)) / 2;
            }
            else {
                this.data.top = (Number(this.data.height) - this.data.titleSize * 3 / 2 - Number(this.data.titlePadding)) / 2;
            }
        }

        if (!this.data.radius) {
        	this.getRadius();
        }
        
		// 是否显示标题
	    if (this.data.isShowTitle == 0) {
	    	this.data.title = '';
	    }
	    // 边框类型
        if (this.data.borderType == 0) {
            this.data.borderWidth = 0;
        }
        else if (this.data.borderType == 2) {
        	this.data.dasharray = this.data.borderWidth + ',' +  this.data.borderWidth;
        }

        // 数值保留小数位数
        if (this.data.floatNum !== '' && this.data.floatNum !== undefined) {
        	this.data.text = Number(this.data.text).toFixed(+this.data.floatNum);
        }

        // 处理数值区段对应的颜色
        if (this.data.range && this.data.rangeColor) {
        	for (var i = 0; i < this.data.range.length; i++) {
        		if (+this.data.text >= +this.data.range[i][0] 
        			&& +this.data.text <= +this.data.range[i][1]
        			&& this.data.rangeColor[i]) {
	        			this.data.fillColor1 = this.data.rangeColor[i][0];
	        			this.data.fillColor2 = this.data.rangeColor[i][1];
	        		    break;
        		}
        	}
        }

        this.data.fontRatio = this.data.textSize / this.data.radius;
        this.data.oriRadius = this.data.radius;
        this.data.oriWidth = this.data.width;
        this.data.oriHeight = this.data.height;
        this.data.oriTop = this.data.top;
        this.data.leftRatio = this.data.left / this.data.width;

        this.render();
	},

    // 拖拽时调用，按比例缩放
	update: function (params) {
		var d = this.data;
		var diffW = params.width - d.oriWidth;
		var diffH = params.height - d.oriHeight;
		if (diffW < 0 && diffH < 0) {
			var diff = Math.abs(diffW) < Math.abs(diffH) ? diffH : diffW;
		}
		else {
			var diff = diffW > diffH ? diffH : diffW;
		}
        this.data.radius = (+d.oriRadius + diff/2) > 0 ? (+d.oriRadius + diff/2) : 0;
        this.data.textSize = d.fontRatio * this.data.radius;

        this.data.left = this.data.leftRatio * this.data.width;
        this.data.top = (+d.oriTop + diffH / 2) > 0 ? (+d.oriTop + diffH / 2) : 0;

        this.render();
	},

    render: function () {
    	this.svg.select('g').remove();
		this.contentWrap = this.svg.append('svg:g')
		    .attr('font-family', this.data.fontFamily);
    	var me = this;   	

        // 背景颜色
        var rect = me.contentWrap.append('rect')
            .attr('width', me.data.width)
            .attr('height', me.data.height)
            .attr('fill', me.data.backgroundColor);

        // 圆形边框处理
	    if (this.data.borderType) {
	    	this.renderBorder();
	    	    
	    }
        // 标题
        if (me.data.isShowTitle) {
            this.renderTitle();
        }
        this.renderCircle();
    },

    

    // 渲染标题
    renderTitle: function () {
    	var me = this;
    	this.title = this.contentWrap.append('text')
    	    .attr('id', 'my-circle-title')
			.attr('transform', function () {
				return me.setPosition();
			})
			.attr('dominant-baseline', function () {
				if (me.data.position <= 3) {
					return 'text-after-edge'
				}
				else {
					return 'text-before-edge'
				}
			})
			.attr('text-anchor', function () {
				if (+me.data.position === 1 || +me.data.position === 4) {
					return 'right'
				}
				else if (+me.data.position === 3 || +me.data.position === 6) {
					return 'left'
				}
				else {
					return 'middle'
				}
			})
			.attr('fill', me.data.titleColor)
			.attr('font-size', me.data.titleSize)
			.attr('font-weight', function () {
                if (me.data.titleWeight == 1) {
                    return 400;
                }
                return 600;
            })
			.text(me.data.title);
    },

    // 渲染边框
    renderBorder: function () {
    	var me = this;
    	this.border = this.contentWrap.append('circle')
		    .attr('cx', me.data.left)
			.attr('cy', me.data.top)
			.attr('r', +me.data.radius + me.data.borderWidth / 2)
			.attr('fill', 'transparent')
			.attr('stroke-width', me.data.borderWidth)
			.attr('stroke', me.data.borderColor)
			.on('click', function () {
				if (me.data.url) {
		        	window.open(me.data.url);
				}
			});
		if (this.data.borderType == 2) {
			this.border.attr('stroke-dasharray', this.data.dasharray);
		}
    },

    // 渲染圆形区域
    renderCircle: function () {
    	var me = this;
    	var gradientData = [
		    {
		        offset: '0%',
		        stopColor: this.data.fillColor1
		    },
		    {
		        offset: '100%',
		        stopColor: this.data.fillColor2
		    }
		];
    	// 渐变色定义，用于实现光效
    	var defs = me.contentWrap.append('defs').append('radialGradient')
		    .attr('id', 'my-circle-grad')
		    .attr('cx', me.data.lightCx)
		    .attr('cy', me.data.lightCy)
		    .attr('r', me.data.lightR)
		    .selectAll('stop')
		    .data(gradientData)
		    .enter()
		    .append('stop')
		    .attr('offset', function (d) {return d.offset})
		    .attr('stop-opacity', function (d) {return d.opacity})
		    .attr('stop-color', function (d) {return d.stopColor});
    	// 圆形渲染
	    this.circle = this.contentWrap.append('circle')
		    .attr('cx', me.data.left)
			.attr('cy', me.data.top)
			.attr('r', me.data.radius)
			.attr('fill', 'url(#my-circle-grad)')
			.on('click', function () {
				if (me.data.url) {
		        	window.open(me.data.url);
				}
			});

        // 圆形内数值
	    this.text = this.contentWrap.append('text')
			.attr('fill', me.data.textColor)
			.attr('font-size', me.data.textSize)
			.text(me.data.text)
			.attr('dominant-baseline', 'text-after-edge')			
	        .attr('text-anchor', 'middle')
		    .attr('x', me.data.left)
			.attr('y', function () {
				var box = d3.select(this).node().getBBox();
		    	return +me.data.top + box.height / 2;
		    });
    },

    // 计算圆形半径
	getRadius: function () {
		var d = this.data;
		var top = d.top;
		var left = d.left;
		var right = d.width - left;
		var bottom = d.height - top;

        var min = top;
        var arr = [top, bottom, left, right];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] < min) {
            	min = arr[i];
            }
        }

		this.data.radius = min - this.data.padding * 2 - this.data.margin * 2;
		if (this.data.borderType >= 1) {
			this.data.radius = this.data.radius - this.data.borderWidth;
		}
	},

    // 设置标题的位置  
	setPosition: function (radius) {
		var d = this.data;
		radius = +radius || +d.radius;
		switch (+d.position) {
			case 1: 
			    return 'translate(' + (d.left - radius) + ',' + (d.top - radius - d.borderWidth - d.titlePadding) + ')';
			    break;
			case 2:
			    return 'translate(' + (d.left) + ',' + (d.top - radius - d.borderWidth - d.titlePadding) + ')';
			    break;
			case 3:
				return 'translate(' + (+d.left + radius) + ',' + (d.top - radius - d.borderWidth - d.titlePadding) + ')';
			    break;
			case 4:
			    return 'translate(' + (d.left - radius) + ',' + ((+d.top) + radius + (+d.borderWidth) + (+d.titlePadding)) + ')';
			    break;
			case 5:
				return 'translate(' + (d.left) + ',' + (+d.top + radius + (+d.borderWidth) + (+d.titlePadding)) + ')';
			    break;
			case 6:
			    return 'translate(' + (+d.left + radius) + ',' + (+d.top + radius + (+d.borderWidth) + (+d.titlePadding)) + ')';
			    break;
			default:
			    return 'translate(' + (d.left) + ',' + (d.top - radius - d.borderWidth - d.titlePadding) + ')';
			    break;
		}
	}
};







