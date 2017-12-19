
// 合并两个对象
function mix(des, src) {
    for (var i in src) {
        if (! (i in des)) {
            des[i] = src[i];
        }
    }
    return des;
}

function Ellipse(svg) {
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
        borderOpacity: 1,
		padding: 0
    };
}

Ellipse.prototype = {
	init: function (params) {
		this.data = mix(params || {}, this.defaultOptions);

        this.data.width = this.data.width || this.data.canvasWidth - this.data.padding * 2;
		this.data.height = this.data.height || this.data.canvasHeight - this.data.padding * 2;

        
		this.data.top = +this.data.top + Number(this.data.padding) || +this.data.top + this.data.height / 2 + Number(this.data.padding);
		this.data.left = +this.data.left + Number(this.data.padding) || +this.data.left + this.data.width / 2 + Number(this.data.padding); 
        this.data.borderWidth = Number(this.data.borderWidth) > 0 ? Number(this.data.borderWidth) : 0;
        
        this.data.width = +this.data.width + this.data.borderWidth <= this.data.canvasWidth ? this.data.width : this.data.width - 2*this.data.borderWidth;
        this.data.height = +this.data.height + this.data.borderWidth <= this.data.canvasHeight ? this.data.height : this.data.height - 2*this.data.borderWidth;

        this.data.oriWidth = this.data.width;
        this.data.oriHeight = this.data.height;
        this.data.oriCanvasWidth = this.data.canvasWidth;
        this.data.oriCanvasHeight = this.data.canvasHeight;
        this.data.oriTop = this.data.top;
        this.data.oriLeft = this.data.left;


		this.render();
	},

    update: function (params) {
        var diffW = params.canvasWidth - this.data.oriCanvasWidth;
		var diffH = params.canvasHeight - this.data.oriCanvasHeight;

        this.data.width = +this.data.oriWidth + diffW > 0 ? (+this.data.oriWidth + diffW) : 0;
        this.data.height = +this.data.oriHeight + diffH > 0 ? (+this.data.oriHeight + diffH) : 0;
        this.data.top = +this.data.oriTop + diffH/2;
        this.data.left = +this.data.oriLeft + diffW/2;

        this.render();
    },

	render: function () {
		var data = this.data;
		var me = this;
		this.svg.select('g').remove();
        this.contentWrap = this.svg.append('svg:g')
            .attr('font-family', this.data.fontFamily)
            .attr('text-anchor', 'middle');
        
        this.ellipse = this.contentWrap.append('ellipse')
		    .attr('rx', data.width / 2)
		    .attr('ry', data.height / 2)
		    .attr('fill', data.fillColor)
		    .attr('transform', 'translate(' + data.left + ',' + data.top +') rotate(' + data.rotate + ')')	    
		    .on('click', function () {
                if (me.data.url) {
                    window.open(me.data.url);
                }
            });
        this.border = this.contentWrap.append('ellipse')
            .attr('rx', data.width / 2 + data.borderWidth /2)
            .attr('ry', data.height / 2 + data.borderWidth/2)
            .attr('fill', 'transparent')
            .attr('stroke', data.borderColor)
            .attr('stroke-opacity', data.borderOpacity)
            .attr('stroke-width', data.borderWidth)
            .attr('transform', 'translate(' + data.left + ',' + data.top +') rotate(' + data.rotate + ')')      
            .on('click', function () {
                if (me.data.url) {
                    window.open(me.data.url);
                }
            });
		
	},

	
};