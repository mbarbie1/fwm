function processbar ( processbarId ) {

	var pBar = document.getElementById( processbarId );

	var updateProgress = function( value ) {
		pBar.value = value;
		//pBar.getElementsByTagName('span')[0].innerHTML = Math.floor((100 / 100) * value);
	}

}