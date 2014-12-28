require(["seed-js/Seed"], function(S){

  var Paper = S.extend({
  	options : {
  		width : 1000,
  		height : 400,
  		pos : [0,0]
  	},

  	"+init" : function(){
  		this.raphael = Raphael(10, 50, 320, 200);
  	}
  });

  var paper = new Paper();
  
  var Phys = S.extend({
  	options : {
  		time : 0,
  		pos : [0,0],
  		speed : [0,0],
  		size : [0,0]// in his own referentiel
  	},
  	draw : function(paperRaph, ref){
  		this.drawing = this.drawRaph(paperRaph, ref)
  	},

  	drawRaph : function(paperRaph, ref){
  		var relativeSpeed = [this.speed[0] - ref.obj.speed[0], this.speed[1] - ref.obj.speed[1]];
  		
  		var size = [lorentz.getContracted(relativeSpeed, ref.limitSpeed, this.size[0]),lorentz.getContracted(relativeSpeed, ref.limitSpeed, this.size[1])];

  		var pos = [relativeSpeed[0]*ref.time, relativeSpeed[1]*ref.time];

  		return paperRaph.rect(pos[0]-size[0]/2 + ref.pos[0], pos[1]-size[1]/2 + ref.pos[1], size[0], size[1]);
  	},

  	setTime : function(time){
  		this.time = time;
  	},

  	start : function(){
  		
  	}

  });

  var lorentz = {
  	getContracted : function(v,c,base){
  		return base*Math.sqrt(1-v*v/c*c)
  	}
  };

  var Train = Phys.extend({
  	"+options" : {
  		size : [50,10],
  		pos : [0,100],
  		speed : [10,0]
  	}
  });

  var Home = Phys.extend({
  	"+options" : {
  		size : [50,30],
  		pos : [0,0],
  		speed : [0,0]
  	}
  });

  var Anim = S.extend({
  	options : {
  		ref : null,
  		elems : [],
  		paper : paper,
  		interval : 1000,
  		iteration : 0,
  		limitSpeed : 20
  	},

  	addElem : function(elem){
  		this.elems.push(elem);
  	},

  	setRef : function(phys){
  		this.ref = {};
  		this.ref.obj = phys;
  		this.ref.pos = [this.paper.width/2, this.paper.height];
  		this.ref.limitSpeed = this.limitSpeed;
  		this.addElem(phys);

  	},

  	draw : function(){
  		var paperRaph = this.paper.raphael, ref = this.ref;

  		this.elems.map(function(e){
  			e.draw(paperRaph, ref);
  		});
  	},

  	start : function(){
  		this.elems.map(function(e){
  			e.start();
  		});

  		setInterval(this.tick.bind(this), this.interval);
  	},

  	tick : function(){
  		this.iteration++;
  		var limitSpeed = this.ref.limitSpeed;
  		var time = this.iteration*this.interval;
  		var limitSpeed = this.limitSpeed;

  		this.ref.time = time;

  		this.elems.map(function(e){
  			var relativeSpeed = Math.sqrt(e.relativeSpeed[0]*e.relativeSpeed[0]+e.relativeSpeed[1]*e.relativeSpeed[1]);
  			e.setTime(lorentz.getContracted(relativeSpeed, limitSpeed, time));
  		});

  		this.draw();
  	}

  });

  var train = new Train();

  var home = new Home(); 

  var anim = new Anim();

  anim.setRef(home);

  anim.addElem(train);

  anim.draw();

  anim.start();
});
