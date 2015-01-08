$( generateTable( gheaders, [gfolders, gfiles] ) );

function generateCell(header, row) {
	var cellStr = '';
	switch ( header.type ) {
		case 'svg':
			cellStr += '<td>' + '<object data=\"'+ row[header.data] + '\"' + ' type=\"image/svg+xml\" />' + '</td>\n';
			break;
		case 'img':
			cellStr += '<td>' + '<img src=\"'+ row.img +'\"' + ' alt=\"' + row[header.data] + '\"' + '>' + '</td>\n';
			console.log('Img icon: ' + cellStr);
			break;
		case 'url':
			cellStr += '<td>' + '<a href=\"'+ row.url +'\"' + '>' + row[header.data] + '</a>' + '</td>\n';
			break;
		case 'string':
			cellStr += '<td>' + row[header.data] + '</td>\n';
			break;
		case 'number':
			cellStr += '<td>' + row[header.data].toString() + '</td>\n';
			break;
		default:
			cellStr += '<td>' + row[header.data] + '</td>\n';
	}
	return cellStr;
}

function generateRow(lhs, row) {
	var rowStr = '';
	rowStr += '	';
	rowStr += '<tr>\n';
	for (var j = 0; j < lhs.length; j++) {
		rowStr += '		';
		header = lhs[j];
		rowStr += generateCell(header, row);
	}
	rowStr += '	';
	rowStr += '</tr>\n';
	return rowStr;
}

function generateHeader(lhs) {
	var headerStr = '';
	headerStr += '<thead>\n';
	headerStr += '	';
	headerStr += '<tr>\n';
	for (var k = 0; k < lhs.length; k++) {
		headerStr += '		';
		header = lhs[k];
		headerStr += '<td>' + header.heading + '</td>\n';
	}
	headerStr += '	';
	headerStr += '</tr>\n';
	headerStr += '</thead>\n';
	return headerStr;
}

function generateTableBody(lhs,lfs) {

	var file;
	tbodyStr = '<tbody>\n';
	for (var i = 0; i < lfs.length; i++) {
		file = lfs[i];
		tbodyStr += generateRow(lhs, file);
	}
	tbodyStr += '</tbody>\n';
	return tbodyStr;
}

function generateTable(lhs,lfs) {

	var file;

	tableStr = '<table class=\"fbTable\" id=\"tableID\">\n';

	// TABLE HEADER
	tableStr += generateHeader(lhs);

	// TABLE BODY
	for (var m = 0; m < lfs.length; m++) {
		tableStr += generateTableBody(lhs,lfs[m]);
	}
	
	tableStr += '</table>\n';
	// console.log(tableStr);
	document.getElementById('divID').innerHTML = tableStr;

	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = 'table { font-size:100%; } table.fbTable img { height: 1em; }	table.fbTable a { text-decoration: none; color: #AAA; } table.fbTable a:hover { color: #000; }'
	document.getElementsByTagName('head')[0].appendChild(style);

	document.getElementById('divId').className = 'fbTable';	
}
