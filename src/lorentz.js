require.define("twinJS/lorentz", function(){
	return {
  	getContracted : function(v,c,base){
        //logger("contracted");
       // logger([base,v,c,base*Math.sqrt(1-v*v/(c*c))]);
  		return base*Math.sqrt(1-v*v/(c*c))
  	},

  	composeSpeed : function(v1, v2, c){
  		return [(v1[0]+v2[0])/(1+v1[0]*v2[0]/(c*c)),(v1[1]+v2[1])/(1+v1[1]*v2[1]/(c*c))];
  	}
  };
});