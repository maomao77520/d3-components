
// 合并两个对象
function mix(des, src) {
    for (var i in src) {
        if (! (i in des)) {
            des[i] = src[i];
        }
    }
    return des;
}

function Triangle(svg) {
    this.svg = svg;
    this.defaultOptions = {
        top: 0,
        left: 0,
        rotate: 0,
        title: '',
        url: '',
        fillColor: '#1dacfc',
        borderWidth: 0,
        borderColor: '#1dacfc',
        padding: 0
    };
}

Triangle.prototype = {
	init: function (params) {
		this.data = mix(params || {}, this.defaultOptions);

		this.data.width = this.data.width || this.data.canvasWidth - this.data.padding * 2;
		this.data.height = this.data.height || this.data.canvasHeight - this.data.padding * 2;

        this.data.left = Number(this.data.left) + Number(this.data.padding);
        this.data.top = Number(this.data.top) + Number(this.data.padding);

        this.data.oriWidth = this.data.width;
        this.data.oriHeight = this.data.height;
        this.data.oriCanvasWidth = this.data.canvasWidth;
        this.data.oriCanvasHeight = this.data.canvasHeight;

        if (+this.data.rotate == 0) {
            this.data.translateX = this.data.left;
            this.data.translateY = this.data.top;
        }
        else {
            this.resetCenter();
        }
        this.getVertices();

		this.render();
	},

	update: function (params) {
        var diffW = params.canvasWidth - this.data.oriCanvasWidth;
		var diffH = params.canvasHeight - this.data.oriCanvasHeight;

        this.data.width = +this.data.oriWidth + diffW > 0 ? (+this.data.oriWidth + diffW) : 0;
        this.data.height = +this.data.oriHeight + diffH > 0 ? (+this.data.oriHeight + diffH) : 0;
        this.getVertices();
        this.render();
	},

    // 由于浏览器不支持transform-origin属性，默认旋转中心位于左上角，通过计算调整旋转中心在图形中心，使用translate进行位移，只需确定左上角旋转的位置即可
    // 以左上角旋转后的位置与图形中心的连线为位斜边做一个直角三角形，通过三角函数可得到左上角旋转后的坐标
    // translate不会受到旋转角度的影响，可直接使用
    resetCenter: function () {
        var d = this.data;
        var temp = Math.PI / 2 - d.rotate*Math.PI/180 - Math.atan(d.height/d.width);
        var r = Math.sqrt(d.width/2 * d.width/2 + d.height/2 * d.height/2);
        var tempL = Math.sin(temp) * r;
        var tempT = Math.cos(temp) * r;
        this.data.translateX = this.data.left + d.width/2 - tempL;
        this.data.translateY = this.data.top + d.height / 2 -tempT;
    },

	getVertices: function () {
		this.data.top = Number(this.data.top);
		this.data.left = Number(this.data.left);
		this.data.borderWidth = Number(this.data.borderWidth) > 0 ? Number(this.data.borderWidth) : 0;
        this.data.vertice1 = (this.data.width / 2 ) + ',' + (this.data.borderWidth );
        this.data.vertice2 =  (this.data.borderWidth ) + ',' + (this.data.height - this.data.borderWidth / 2);
        this.data.vertice3 = (this.data.width - this.data.borderWidth ) + ',' + (this.data.height - this.data.borderWidth / 2);
	},

	render: function () {
		var data = this.data;
		var me = this;
		this.svg.select('g').remove();
		var d = 'M ' + data.vertice1 + ' L ' + data.vertice2 + ' L ' +  data.vertice3 + ' Z';
		var points = data.vertice1 + ' ' + data.vertice2 + ' ' +  data.vertice3;
        this.contentWrap = this.svg.append('svg:g')
            .attr('font-family', this.data.fontFamily)
            .attr('text-anchor', 'middle');

        this.triangle = this.contentWrap.append('path')
            .attr('d', d)
            .attr('fill', data.fillColor)
		    .attr('stroke', data.borderColor)
		    .attr('stroke-width', data.borderWidth) 
            .attr('transform', 'translate(' + data.translateX + ',' + data.translateY +') rotate(' + data.rotate + ')')
		    .on('click', function () {
                if (me.data.url) {
                    window.open(me.data.url);
                }
            });
        
        if (data.borderRadius) {
        	this.triangle.attr('stroke-linejoin', 'round');
        }
		
	}
};