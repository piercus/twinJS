require.define("twinJS/lorentz", function(){
	return {
  	getContracted : function(v,c,base){
        //logger("contracted");
       // logger([base,v,c,base*Math.sqrt(1-v*v/(c*c))]);
  		return base*Math.sqrt(1-v*v/(c*c))
  	}
  };
});