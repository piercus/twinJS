
  require.config({
    paths: {
        "inputex": "lib/inputex/",
        "jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min"
    }
  });

require([
  "seed-js/Seed", 
  "logger", 
  "inputex/src/inputex-requirejs/inputex-requirejs", 
  "inputex/src/inputex-string/inputex-string",
  "inputex/src/inputex-number/inputex-number",
  "inputex/src/inputex-form/inputex-form",
  "inputex/src/inputex-select/inputex-select",
  "inputex/src/inputex-multi/inputex-multi",
  "inputex/src/inputex/lang/inputex_fr"
], function(S, logger, I, StringField, NumberField, FormC, SelectField){

  //var limitSpeed = 50;

  var Paper = S.extend({
  	options : {
  		width : 600,
  		height : 400,
  		pos : [0,0]
  	},

  	"+init" : function(){
  		this.raphael = Raphael("anim", this.width, this.height);
      //  logger(this.raphael);
  	}
  });
  
  var paper = new Paper();

  var Rep = S.extend({
    options : {
        time : 0, 
        pos : [0,0],  
        speed : [0,0],
        phys : null,
        paper : paper,
        ref : null
    },

    "+init" : function(){

        this.setSpeedNorm();

        this.setPos(
            lorentz.getContracted(this.speed[0], this.ref.limitSpeed, this.phys.pos[0] - this.ref.obj.pos[0]) + this.ref.obj.pos[0],
            lorentz.getContracted(this.speed[1], this.ref.limitSpeed, this.phys.pos[1] - this.ref.obj.pos[1]) + this.ref.obj.pos[1]        
        );

        this.setSize();
    },

    setSpeedNorm : function(){

        this.speedNorm = Math.sqrt(this.speed[0]*this.speed[0]+this.speed[1]*this.speed[1]);

    },

    setSize : function(){
        this.setSpeedNorm();
       
      //  logger([this.speedNorm, this.ref.limitSpeed,this.phys.size[0],this.phys.size[1]]);
        this.size = [
            lorentz.getContracted(this.speed[0], this.ref.limitSpeed, this.phys.size[0]),
            lorentz.getContracted(this.speed[1], this.ref.limitSpeed, this.phys.size[1])
        ];
    },

    setPos : function(x, y){
      
        this.pos = [x, y];
    }
  });

  
  var Phys = S.extend({
  	options : {
  		time : 0,
      timePos : [0, -20],
  		pos : [0,0],
  		speed : [0,0],
      name : "unnamed",
      paper : paper,
      fill : "#555555",
      image : null,
      onClick : null,
  		size : [0,0]//,// in his own referentiel
      //reps : {}
  	},

    "+init" : function(o){

      this.initialOptions = {};
      
      for(var i in o) if(o.hasOwnProperty(i)){
        this.initialOptions[i] = o[i];
      }
      
    },

    setInitialOption : function(key,value){
      this.initialOptions[key] = value;
      this[key] = value;
    },

  	draw : function(paperRaph, ref){
        this.drawing || this.initDrawing(paperRaph, this.getRefRep(ref), ref.duration);
        this.updateTime();

  	},

    initDrawing : function(paperRaph, rep, duration){
      
      var st = paperRaph.set();

      var x = (rep.pos[0]-rep.size[0]/2 + rep.ref.pos[0]), 
          y = (rep.pos[1]-rep.size[1]/2 + rep.ref.pos[1]), 
          w = rep.size[0], 
          h = rep.size[1];

      if(this.image){
        st.push(paperRaph.image(this.image, x, y, w, h).attr({ fill : this.fill }));
      } else {
        st.push(paperRaph.rect(x, y, w, h).attr({ fill : this.fill }));
      }
      
      //console.log(x,y,w,h);

      st.push(paperRaph.path(this.getCrossPath(x, y, w, h)).attr({"stroke" : rep.ref.obj.name === this.name ? "blue" : "red"}));


      st.push(this.drawTime(paperRaph, rep.ref));

      st.hover(function(){
        st.attr({"stroke-width" : 4});
      },function(){
        st.attr({"stroke-width" : 1});
      });

      this.onClick && st.click(this.onClick);

      this.drawing = st;

      this.animateDrawing(paperRaph, rep, duration, x, y, w, h);
      
    },

    getCrossPath : function(x,y,w,h){
      return "M"+(x+w/2)+" "+(y+h/2)+"h"+w+"h"+(-2*w)+"h"+w+"v"+h+"v"+(-2*h);
    },

    animateDrawing : function(paperRaph, rep, duration, x, y, w, h){
      var params = {};
      if(rep.speed[0] !== 0) params["x"] =  rep.speed[0]*duration/1000+rep.pos[0]+rep.ref.pos[0];

      if(rep.speed[1] !== 0) params["y"] =  rep.speed[1]*duration/1000+rep.pos[1]+rep.ref.pos[1];
      if(params["x"] || params["y"]){
        params["path"] = this.getCrossPath(params["x"] || x, params["y"] || y, w, h);
      } else {
        return;
      }
      

      var animation = paperRaph.raphael.animation(params,duration);
      this.drawing.animate(animation);

    },

  	drawRaph : function(paperRaph, ref){


      return r;
  	},
    
    

    drawTime : function(paperRaph, ref){
 
  		var rep = this.getRefRep(ref);

      this.timeEl = paperRaph.text(
          (rep.pos[0]-rep.size[0]/2 + ref.pos[0] + this.timePos[0]), 
          (rep.pos[1]-rep.size[1]/2 + ref.pos[1] + this.timePos[1]), 
          ""
      ).attr({ "font-size": 16, "font-family": "digital" });

      this.updateTime();

      return  this.timeEl;
    },

    updateTime : function(ref){
      var secs = Math.floor(this.time/1000);
      var centisecs = Math.floor(this.time%1000/10);

      secs = (secs < 10 ? "0" : "")+secs;
      centisecs = (centisecs < 10 ? "0" : "")+centisecs;

      
      this.timeEl.attr({"text" : secs+":"+centisecs});
    },

  	start : function(){
  		
  	},

    getRefRep : function(ref){
        this.reps || (this.reps = {});
       // logger(ref);
        if(!this.reps[ref.obj.name]){ 
            
            var speed = [this.speed[0] - ref.obj.speed[0], this.speed[1] - ref.obj.speed[1]];
            this.reps[ref.obj.name] = new Rep({
                time : 0,   
                speed : speed,
                phys : this,
                ref : ref
            });

            //console.log("rep created with limitSpeed to xxxx");

        } 

        return this.reps[ref.obj.name];
    },

    tick : function(o){
        var rep = this.getRefRep(o.ref);

        rep.speed = [this.speed[0] - o.ref.obj.speed[0], this.speed[1] - o.ref.obj.speed[1]];

        rep.setPos(
            rep.pos[0] + rep.speed[0]*(o.time-rep.time)/o.interval, 
            rep.pos[1] + rep.speed[1]*(o.time-rep.time)/o.interval
        );

        rep.time = o.time;

        rep.setSize();

        this.time = lorentz.getContracted(rep.speedNorm, o.limitSpeed, o.time);
       
      //  this.draw();
       
    },

    clean : function(){
      this.drawing && this.drawing.remove();
    },

    reset : function(){
      var o = this.initialOptions;
      for(var i in o) if(o.hasOwnProperty(i)){
        this[i] = o[i];
      }
      this.reps = null;
      this.drawing && this.drawing.remove();
      this.drawing = null;
    }

  });

  var lorentz = {
  	getContracted : function(v,c,base){
        //logger("contracted");
       // logger([base,v,c,base*Math.sqrt(1-v*v/(c*c))]);
  		return base*Math.sqrt(1-v*v/(c*c))
  	}
  };

  var Train = Phys.extend({
  	"+options" : {
  		size : [100,10],
  		pos : [0,100],
  		speed : [45,0]
  	}
  });

  var Home = Phys.extend({
  	"+options" : {
  		size : [100,30],
  		pos : [0,0],
  		speed : [0,0]
  	}
  });

  var Anim = S.extend({
  	options : {
  		ref : null,
  		elems : {},
  		paper : paper,
  		interval : 1000,
  		iteration : 0,
  		limitSpeed : null,
      duration : 10000
  	},

  	addElem : function(elem){
  		this.elems[elem.name]=elem;
  	},

  	setRef : function(phys){
      
      if(typeof(phys) === "string"){
        phys = this.elems[phys];
      }

  		this.ref || (this.ref = {});
  		this.ref.obj = phys;
      this.ref.duration = this.duration;
  		this.ref.pos = [this.paper.width/2-phys.pos[0], this.paper.height/2-phys.pos[1]];
  		this.ref.limitSpeed = this.limitSpeed;
  		this.addElem(phys);

  	},

  	draw : function(){
  		var paperRaph = this.paper.raphael, ref = this.ref;

  		for(var i in this.elems) if(this.elems.hasOwnProperty(i)) {
        var e = this.elems[i];
  			e.draw(paperRaph, ref);
  		}
  	},

  	start : function(){
  		
      for(var i in this.elems) if(this.elems.hasOwnProperty(i)) {
        var e = this.elems[i];
  			e.start();
      }
      //this.tick();
  		this.intervalId = setInterval(this.tick.bind(this), this.interval);
  	},

  	tick : function(){
      //  logger("tick");

      if(this.iteration > this.duration/this.interval){ 
        this.reset();
      }

  		var time = this.iteration*this.interval;
  		var limitSpeed = this.limitSpeed;

  		this.ref.time = time;

      for(var i in this.elems) if(this.elems.hasOwnProperty(i)) {
        var e = this.elems[i];
        // logger("tick");
        e.tick({ 
            limitSpeed : limitSpeed, 
            time : time,  
            ref : this.ref,
            interval : this.interval
        });
      }

  		this.draw();

      this.iteration++;

  	},

    cleanElems : function(){
      for(var i in this.elems) if(this.elems.hasOwnProperty(i)) {
        var e = this.elems[i];        
        e.clean();
      }
      this.elems = {};
    },

    reset : function(){
      clearInterval(this.intervalId);

      this.iteration = 0;
      this.start();
      for(var i in this.elems) if(this.elems.hasOwnProperty(i)) {
        var e = this.elems[i];
        e.reset();
      }
    }

  });

  var setRefChoices = function(o,cb){
          if(typeof(form) === "undefined"){
            cb(["House","Train","Tree"]);
          } else {
            cb(form.getValue().details.elems.map(function(e){
              return {label : e.name, value : e.name};
            }));            
          }
        };

  var form = new FormC({ 
    parentEl : "twin-form", 
    fields : [
      { name : "c", label : "light speed", type : "number", value : 50 }, 
      //{ name : "v", label : "train speed", type : "number", value : 0 },
      { 
        name : "ref", 
        label : "Referentiel", 
        type : "select", 
        //value : "home",
        choices : setRefChoices
      },
      {
        type : "group",
        name : "details",
        legend : "Details",
        collapsible : true,
        collapsed : true,
        fields : [{
            name : "elems", 
            type : "multi",
            addField : {
              label : "add a Physical object",
              type : "select",
              choices : ["Your choice here, baby !",{
                label : "Tree", 
                value : "Tree"
              },{
                label : "House", 
                value : "House"
              },{
                label : "Train", 
                value : "Train"
              }]
            },
            value : ["House", "Train","Tree"],
            elementType : function(v, index){
              return { 
                type : "group", 
                name : "physical",
                fields : [{
                    label : "name",
                    required : true,
                    name : "name",
                    type : "string",
                    value : v
                  },{
                    label : "Start position X",
                    required : true,
                    name : "posX",
                    type : "number",
                    value : (v == "Tree" ? -200 : 0 )
                  },{
                    label : "Start position Y",
                    required : true,
                    name : "posY",
                    type : "number",
                    value : (v == "Tree" ? -30 : (v == "Train" ? 100 : 0))
                  },{
                    label : "Speed (Y)",
                    required : true,
                    name : "speedY",
                    type : "number",
                    value : 0
                  },{
                    label : "Speed (X)",
                    required : true,
                    name : "speedX",
                    type : "number",
                    value : (v == "Train" ? -44 : 0)
                  },{
                    label : "Proper width",
                    required : true,
                    name : "sizeX",
                    type : "number",
                    value : (v == "Tree" ? 100 : (v == "House" ? 80 : (v == "Train" ? 100 : null)))
                  },{
                    label : "Proper height",
                    required : true,
                    name : "sizeY",
                    type : "number",
                    value : (v == "Tree" ? 80 : (v == "House" ? 60 : (v == "Train" ? 80 : null)))
                  },{
                    label : "image",
                    required : false,
                    name : "image",
                    type : "string",
                    value : (v == "Tree" ? "res/arbre-2.png" : (v == "House" ? "res/maison.jpg" : (v == "Train" ? "res/train25.gif" : null)))
                  }]
              };
            }
          }]
      }
    ]
  });
  
  var values = form.getValue();  

  var anim = new Anim({
    limitSpeed : values.c
  });
/*
  var train = new Train({ name : "train", size : [100,80], speed : [-1* values.v, 0], image : "res/train25.gif" });

  var home = new Home({ name : "home", image : "res/maison.jpg", size : [80,60] }); 
  
  var tree = new Home({ 
        name : "tree",
      size : [100,80],
      pos : [-200,-30],
      speed : [0,0],
        fill : "#eeeeee",
      image : "res/arbre-2.png"
    });*/

  var onChange = function(values){
    var refChoices = []; 

    //set choices of the select

    setRefChoices({}, function(res){
      
      var f = form.inputs[1];
      var v = f.getValue();
      
      f.options.choices = res;

      I.purgeElement(f.fieldEl);
      if(I.inDoc(f.fieldEl)){
        f.fieldEl.parentNode.removeChild(f.fieldEl);
      }
      f.renderComponent();
      f.setValue(v, false);
      f.initEvents();

    });
    

    anim.limitSpeed = values.c;
    //train.setInitialOption("speed",[-1*values.v, 0]);

    anim.cleanElems();
    values.details.elems.map(function(v){
          anim.addElem(new Phys({ 
          name : v.name,
          size : [v.sizeX,v.sizeY],
          pos : [v.posX,v.posY],
          speed : [v.speedX,v.speedY],
          fill : "#eeeeee",
          onClick : function(){
            form.setValue({ref:v.name});
          },
          image : v.image
        }));  
    });

    anim.setRef(values.ref);

    anim.reset();
  };

  form.on("updated", onChange);
  onChange(form.getValue());
//  anim.start();

  
});
