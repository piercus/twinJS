require.define("twinJS/Rep", ["seed-js/Seed", "twinJS/lorentz"], function(S, lorentz){
    return S.extend({
      options : {
          time : 0, 
          pos : [0,0],  
          speed : [0,0],
          phys : null,
          paper : null,
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
})
  