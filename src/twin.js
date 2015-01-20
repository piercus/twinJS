
require.config({
  paths: {
      "inputex": "lib/inputex/",
      "jquery" : "http://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
      "twinJS" : "./src"
  }
});

require([
  "seed-js/Seed", 
  "twinJS/Anim",
  "twinJS/Phys",
  "logger", 
  "inputex/src/inputex-requirejs/inputex-requirejs", 
  "inputex/src/inputex-string/inputex-string",
  "inputex/src/inputex-number/inputex-number",
  "inputex/src/inputex-form/inputex-form",
  "inputex/src/inputex-select/inputex-select",
  "inputex/src/inputex-multi/inputex-multi",
  "inputex/src/inputex/lang/inputex_fr"

], function(S, Anim, Phys, logger, I, StringField, NumberField, FormC, SelectField){

  //var limitSpeed = 50;

  var Paper = S.extend({
  	options : {
  		width : 800,
  		height : 400,
  		pos : [0,0]
  	},

  	"+init" : function(){
  		this.raphael = Raphael("anim", this.width, this.height);
      //  logger(this.raphael);
  	}
  });
  
  var paper = new Paper();
  var anim = new Anim({
    paper : paper,
    limitSpeed : 50,
    interval : 100,
    duration : 20000
  });

  var spaceshipSpeedX = -40;

  
  var earth = new Phys({
    //image : 
    name : "earth",
    speed : [0, 0],
    pos : [50,0],
    size : [50,50],
    onClick : function(){
      anim.setRef(earth);
      anim.reset();
      spaceship.speed[0] = spaceshipSpeedX;
    }
  });

  var mars = new Phys({
    //image : 
    name : "mars",
    speed : [0, 0],
    pos : [-50, 0],
    size : [50,50],
    onClick : function(){
      anim.setRef(mars);
      anim.reset();
      spaceship.speed[0] = spaceshipSpeedX;
    }
  });

  var Spaceship = Phys.extend({
    "-tick" : function(o){
      
      var repMe = this.getRefRep(o.ref),
          repMars = mars.getRefRep(o.ref),
          repEarth = earth.getRefRep(o.ref);

      if(repMe.pos[0]<repMars.pos[0]){
        this.speed[0] = -1*this.speed[0];
        this.rmDrawing();
        earth.rmDrawing();
        mars.rmDrawing();
        repMe.pos[0] = repMars.pos[0];
      }

      if(repMe.pos[0]>repEarth.pos[0]){
        anim.pause();
      }

    }
  });
  var spaceshipRef = new Phys({
    //image : 
    name : "spaceshipRef",
    speed : [spaceshipSpeedX, 0],
    pos : [50, 100],
    size : [1,1],
    drawable : false,
    onClick : function(){
      anim.setRef(spaceshipRef);
      anim.reset();
      spaceship.speed[0] = spaceshipSpeedX;
    }
  });

  var spaceship = new Spaceship({
    //image : 
    speed : [spaceshipSpeedX, 0],
    name : "spaceship",
    pos : [50, 100],
    size : [25, 25],
    onClick : function(){
      anim.setRef(spaceshipRef);
      anim.reset();
      spaceship.speed[0] = spaceshipSpeedX;
    }
  });

  
  anim.addElem(earth);
  anim.addElem(mars);
  anim.addElem(spaceship);
  anim.addElem(spaceshipRef);
  anim.setRef(earth);
  anim.reset();

/*
  var setRefChoices = function(o,cb){
          if(typeof(form) === "undefined"){
            cb(["House","Train","Tree"]);
          } else {
            cb(form.getValue().details.elems.map(function(e){
              return {label : e.name, value : e.name};
            }));            
          }
        };
*/
  /*var form = new FormC({ 
    parentEl : "twin-form", 
    fields : [
      { name : "c", label : "light speed", type : "number", value : 50 }, 
      { name : "v", label : "train speed", type : "number", value : 40 },
      { 
        name : "ref", 
        label : "Referentiel", 
        type : "select", 
        choices : ["Mars", "Earth", "Spaceship"]
      }
    ]
  });*/
  
  //var values = form.getValue();  




  /*var onChange = function(values){
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
  onChange(form.getValue());*/
//  anim.start();

  
});
