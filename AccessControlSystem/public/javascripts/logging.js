//数据库连接 var objdconn = new ActiveXObject（“ADODB.Connection”）；之类的
//var objrs = objdbConn.Execute("Select userId from [User]");
//var fdCount = objrs.Fieds.Count - 1;
if (!){
    document.write("<table border=1><tr>");
    for(vari=0;i<=fdCount;i++)
        document.write("<td><b>" + objrs.field(i).Name +"</b></td>");
    Document.write("</tr>");
    while (!){
        document.write("<tr>");
        for(i=0;i<=fdCount;i++)
            document.write("<td valign='top'>"+objrs.Fields(i).value+"</td>");
        document.write("</tr>");
        objrs.moveNext();
    }
    document.write("</table>");
}
else
    document.write("数据库中没有记录<br>");
objrs.Close();
//objrsConn.Close();