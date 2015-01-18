
  var logger1 = function(mess, isObj){
    return console.log(mess);
    var typ = typeof(mess);
    if(typeof(mess) ==="object" || isObj){
      if(!mess){
        mess = "null";
      } else {
       
        var s ="";
        for (var i in mess) if (mess.hasOwnProperty(i)) {
          s+= "key : "+i+" ; value : "+ mess[i] + ";\n";
        }
        mess = s;
      }
    }
    var e = document.getElementById("logger");
    e.innerText = e.innerText + "\n" + mess + " ; typeof " + typ ;
   // e.appendChild("<span>" + mess + "</span>");
  };
  
define("logger",function(){
  var logger = logger1;
  
  return logger;
});

//Raphael("anim", 320, 200).rect(10, 10, 10, 10).attr({ fill : "#555555"});
