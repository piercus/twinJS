require.define("twinJS/Phys", ["seed-js/Seed", "twinJS/Rep", "twinJS/lorentz"], function(S, Rep, lorentz){
    return S.extend({
      options : {
    		time : 0,
        timePos : [0, -20],
    		pos : [0,0],
    		speed : [0,0],
        name : "unnamed",
        paper : null,
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
          this.drawing || this.initDrawing(paperRaph, this.getRefRep(ref), ref.duration, ref.interval);
          this.updateTime();

    	},

      initDrawing : function(paperRaph, rep, duration, interval){
        
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
        
        console.log(x,y,w,h);

        st.push(paperRaph.path(this.getCrossPath(x, y, w, h)).attr({"stroke" : rep.ref.obj.name === this.name ? "blue" : "red"}));


        st.push(this.drawTime(paperRaph, rep.ref));

        st.hover(function(){
          st.attr({"stroke-width" : 4});
        },function(){
          st.attr({"stroke-width" : 1});
        });

        this.onClick && st.click(this.onClick);

        this.drawing = st;

        this.animateDrawing(paperRaph, rep, duration, interval, x, y, w, h);
        
      },

      getCrossPath : function(x,y,w,h){
        return "M"+(x+w/2)+" "+(y+h/2)+"h"+w+"h"+(-2*w)+"h"+w+"v"+h+"v"+(-2*h);
      },

      animateDrawing : function(paperRaph, rep, duration, interval, x, y, w, h){
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

          } else {
            //console.log(ref.obj.speed[0]);
            this.reps[ref.obj.name].speed = [this.speed[0] - ref.obj.speed[0], this.speed[1] - ref.obj.speed[1]];
          }

          return this.reps[ref.obj.name];
      },

      tick : function(o){
          var rep = this.getRefRep(o.ref);

          rep.speed = [this.speed[0] - o.ref.obj.speed[0], this.speed[1] - o.ref.obj.speed[1]];
          //console.log((o.time-rep.time)/o.interval);
          rep.setPos(
              rep.pos[0] + rep.speed[0]*(o.time-rep.time)/1000, 
              rep.pos[1] + rep.speed[1]*(o.time-rep.time)/1000
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
        this.rmDrawing();
      },

      rmDrawing : function(){
        this.drawing && this.drawing.remove();
        this.drawing = null;   
      },

      pause : function(){
        this.drawing.stop();
      }

    });
});