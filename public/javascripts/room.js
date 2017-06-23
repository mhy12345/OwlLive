function loadXMLDoc(room)
{
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var tt = document.getElementsByClassName("messageField")
			tt[0].innerHTML = tt[1].innerHTML=xmlhttp.responseText;
		}
	}
	xmlhttp.open("GET","api/loadmessage?room="+room,true);
	xmlhttp.send();
	setTimeout("loadXMLDoc('"+room+"')",1000);
}

function updateVotingResult(room)
{
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp2=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp2=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp2.onreadystatechange=function()
	{
		if (xmlhttp2.readyState==4 && xmlhttp2.status==200)
		{
			var haha = xmlhttp2.responseText.split(",");
			//console.log(xmlhttp.responseText);
			//console.log(haha);
			document.getElementById("divD").style.width=haha[0]+'%';
			document.getElementById("divC").style.width=haha[1]+'%';
			document.getElementById("divB").style.width=haha[2]+'%';
			document.getElementById("divA").style.width=haha[3]+'%';
		}
	}
	xmlhttp2.open("GET","api/votestatus?room="+room,true);
	xmlhttp2.send();
	setTimeout("updateVotingResult('"+room+"')",1000);
}

function sendLike(messageid,username)
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST","/api/likemessage",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("user="+username+"&messageid="+messageid);
}


function sendVote(room,nStatus)
{
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open("POST","/api/votestatus",true);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send("room="+room+"&nStatus="+nStatus);
}
