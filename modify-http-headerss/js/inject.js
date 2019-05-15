Date.prototype.getTimezoneOffset=function(){
  var myarray=new Array("120","140","160","180","200","220","240","260");
  alert("this website try to load your timezone information");
  return myarray[Math.floor(Math.random()*8)];
  //Math.random().toString(36).substr(2)
}

Object.defineProperty(navigator, 'plugins', {
	writeable: true,
  configurable: true,
  enumerable: true,
  value: ["works","1"]
})
var myarray=new Array("120","140","160","180","200","220","240","260");
Object.defineProperty(screen, 'height', {
	writeable: true,
  configurable: true,
  enumerable: true,
  value: myarray[Math.floor(Math.random()*8)]
})
Object.defineProperty(screen, 'width', {
	writeable: true,
  configurable: true,
  enumerable: true,
  value: myarray[Math.floor(Math.random()*8)]
})
Object.defineProperty(screen, 'colorDepth', {
	writeable: true,
  configurable: true,
  enumerable: true,
  value: myarray[Math.floor(Math.random()*8)]
})

CanvasRenderingContext2D.prototype.getImageData = function(a) {
      return function() {
        console.log("Context");
        spoofFromContext(this,a);
        return a.apply(this, arguments);
      };
    }(CanvasRenderingContext2D.prototype.getImageData);


    HTMLCanvasElement.prototype.toDataURL=(function(){
        var original = HTMLCanvasElement.prototype.toDataURL;
        return function() {
            spoof(this);
            return original.apply(this,arguments);
        };
    })();


    function spoof(canvas){
        	var ctx = canvas.getContext("2d");
            spoofFromContext(ctx);
    }

    function spoofFromContext(ctx,a){
        	if(!a) a = ctx.getImageData;
 			var data = a.call(ctx,0, 0, ctx.canvas.width, ctx.canvas.height);
            for(var c=0; c<data.data.length; c=c+4){
                var r = data.data[c];
                var g = data.data[c+1];
                var b = data.data[c+2];
                var a = data.data[c+3];

                if(a!=0){
                    data.data[c]=r-Math.random();
                    data.data[c+1]=g-Math.random();
                    data.data[c+2]=b-Math.random();
                    data.data[c+3]=a-Math.random();
                }
         	}
            ctx.putImageData(data, 0, 0);
            console.log("Spoofed");
    }
