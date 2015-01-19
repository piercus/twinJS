
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
    paper : paper,
    limitSpeed : values.c
  });


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
