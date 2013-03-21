
/**
 * Determine si une chaine est vide ou non
 */
 GLOBAL.isEmpty = function isEmpty(v){
 	return v == undefined || v.length < 1;
 }


/**
 * Determine si le nombre est entre les deux passes en parametre
 */
 GLOBAL.between = function between(valeur, min, max) {
 	return (parseInt(valeur) >= parseInt(min) && parseInt(valeur) <= parseInt(max));
 }