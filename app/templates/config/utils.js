function camelSplit(str){
    if(str){            
        str = str.replace(/^./, function(str){ return str.toLowerCase(); })
        .replace(/([A-Z])/g, '-$1');
    }
    return str.toLowerCase();
} 
module.exports = {  
  camelSplit
};
