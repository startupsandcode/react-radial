"using strict";

var React = require('react');
var ReactDOM = require('react-dom');

var Radial = React.createClass({
    getInitialState: function(){
        return {
            mouseX: 500 /2,
            mouseY: 500/2,
            width: 500
        };
    },
    mouseDown: function(event){
        event.preventDefault();
        this.setMousePosition(event);
        document.addEventListener('mousemove',this.mouseMove);
        document.addEventListener('mouseup',this.mouseUp);
    },
    mouseUp: function(event){
        document.removeEventListener('mousemove',this.mouseMove);
        document.removeEventListener('mouseup',this.mouseUp);
    },
    mouseMove: function(event){
        event.preventDefault();
        this.setMousePosition(event);
    },
    setMousePosition: function(event){
        var bounds = this.getCurrentBounds(event.clientX,event.clientY);
        var radius = this.state.width / 2;
        if ((bounds.mouseX < radius && bounds.mouseX < bounds.x) || (bounds.mouseX > radius && bounds.mouseX > bounds.x)){
            bounds.mouseX = bounds.x;
        }
        if ((bounds.mouseY < radius && bounds.mouseY < bounds.y) || (bounds.mouseY > radius && bounds.mouseY > bounds.y)){
            bounds.mouseY = bounds.y;
        }
        this.setState({ mouseX: bounds.mouseX, mouseY: bounds.mouseY});
    },
    getCurrentBounds: function(clientX,clientY){
        this.elmOffset = ReactDOM.findDOMNode(this).getBoundingClientRect();
        var x = clientX - this.elmOffset.left;
        var y = clientY - this.elmOffset.top;
        var radius = this.state.width / 2;
        var distanceX = x - radius;
        var distanceY = y - radius;
        var angle = Math.atan2(distanceY,distanceX);
        var xBound = radius + radius * Math.cos(angle);
        var yBound = radius + radius * Math.sin(angle);
        return { 
            x: xBound,
            y: yBound,
            mouseX: x,
            mouseY: y
        }
    },
    render: function(){
        var pointStyle = { 
            top: this.state.mouseY,
            left: this.state.mouseX
        };
        return (
            <div className="radial" onMouseDown={this.mouseDown}>
                <div className="point" style={pointStyle}></div>
            </div>
        );
    }
});

module.exports = Radial;