require.define("twinJS/Anim", ["seed-js/Seed"], function(S){

     return S.extend({
        options : {
            ref : null,
            elems : {},
            paper : null,
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
});

