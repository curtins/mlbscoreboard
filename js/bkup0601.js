 $(document).ready(function() { 
 
 
	// Load Blog / Twitter Files
	
	 
	 
	 var strFileName;
	 strFileName="files/json/redsoxblogs.json";	 
	 GetColumn(strFileName,"#grp1");
	 
	 strFileName="files/json/redsoxtwitter.json";	 
	 GetColumn(strFileName,"#grp2");
	 
	 strFileName="files/json/stadiums.json";	 
	 GetColumn(strFileName,"#grp3");
	 
	 strFileName="files/json/alltwitter.json";	 
	 GetColumn(strFileName,"#grp4");
	 
	
	 function GetColumn(FileName, column) {
		 
		  return; 
	 
		  $.getJSON(FileName, function(result)
		  
			{
				
				
				 
				
					 
					 
				var strURL1;
				var strURL2;
				var strURL3="";
				 
				$.each(result, function(i, item) {
					
					if (column == "#grp1") {
				
						strURL1 = item.url;
						strURL2 = "<li><a href="  + strURL1  + "   class=list-group-item  target=_blank >" + item.display +"</a></li>";
						if (i != 'name') {
							strURL3+=strURL2;
							console.log(strURL3);
							$( column ).append( strURL2 );
						 };
					 
					}
				});
				
				/*
				var strURL1;
				var strURL2;
				 
				$.each(result, function(i, item) {
				
					strURL1 = item.url;
					strURL2 = "</li><a href="  + strURL1  + "   class=list-group-item  target=_blank >" + item.display +"</a></li>";
					if (i != 'name') {
						$( column ).append( strURL2 );
					 };
				});
				
				*/
			
			
			  
		});
		
		}
		
		
//	});
 
	
	
	
var urls= [];
var dates=[];
var html=[];
var loop = 0;
var ctr = 0;
var weekTotal="";

 


//Create file names of data to be extracted from MLB

for (loop = 0; loop < 1; loop++) { 

	var strp = Back_date(loop);
	var smonth=strp.substring(0,2);
	var sday=strp.substring(4,2);
	var a="http://gd2.mlb.com/components/game/mlb/year_2015/month_";
    var c="/day_";
    var d="/master_scoreboard.json";
    var c1=sday;
    var d2=" >/dev/null 2>&1";
    var e =  a.concat(smonth,c,c1,d);
	urls[loop]=e;
	dates[loop]=smonth + '/' + sday;
}


//Extract MLB Data --> JSON

for (loop1 = 0; loop1 < 7; loop1++) { 
    GetHTML(urls[loop1], loop1);
}
 	
function GetHTML (passValue,ctr) {


$.getJSON(passValue, function(data) { 

itrHTML=""; ftrHTML="";  xtrHTML="";
ftrHomeInnings="";
ftrAwayInnings="";
strDate=data.subject;

//Loop Thru JSON
$.each(data.data.games.game, function() {	

	
	// MLB Final Game Data Extraction

	if (this.status.status == 'Final' || this.status.status == 'Game Over'   )

		{	
		
			ftrHomeInnings="";
			ftrAwayInnings="";
		
		
			for (var i = 0; i < this.linescore.inning.length; i++) 
			
			{
				if(this.linescore.inning[i].home != undefined)	{
					ftrHomeInnings+="&nbsp;" + this.linescore.inning[i].home + "&nbsp;"; 
				}
				
				if(this.linescore.inning[i].away != undefined)	{
					ftrAwayInnings+="&nbsp;" + this.linescore.inning[i].away + "&nbsp;"; 
				}
			}
		 
		
		ftrHTML+="<li><table  ><tr>";
		
		ftrHTML+="<td><strong>" + this.status.status + ":</strong></td>";
		ftrHTML+="<td><strong>" + this.venue + "</strong></td>";
		ftrHTML+="<td><strong>" + dates[ctr] + "</strong></td>";
		ftrHTML+="<td colspan='3'>&nbsp;</td>";
		ftrHTML+="</tr><tr>";  
		
		
		
		ftrHTML+="<td><img src='/images/" + this.home_team_name + ".png'" + " width='40' height='40' alt='' />&nbsp;&nbsp;(" + this.home_win + "-" + this.home_loss + ")</td>";
		ftrHTML+="<td>" + ftrHomeInnings  + "</td>";
		ftrHTML+="<td>("+ this.linescore.r.home;  
		ftrHTML+=" - "+ this.linescore.h.home;  
		ftrHTML+=" - "+ this.linescore.e.home + ")</td>";  
		ftrHTML+="</tr><tr>";  
	 
		ftrHTML+="<td><img src='/images/" + this.away_team_name + ".png'" + " width='40' height='40' alt='' />&nbsp;&nbsp;(" + this.away_win + "-" + this.away_loss + ")</td>";
		ftrHTML+="<td>" + ftrAwayInnings  + "</td>";
		ftrHTML+="<td>("+ this.linescore.r.away;  
		ftrHTML+=" - "+ this.linescore.h.away;  
		ftrHTML+=" - "+ this.linescore.e.away + ")</td>";  
		ftrHTML+="</tr><tr>";  
		 
		ftrHTML+="<td>&nbsp;</td><td>Losing Pitcher: " + this.losing_pitcher.name_display_roster;  
		ftrHTML+="(" + this.losing_pitcher.wins;  
		ftrHTML+="-" + this.losing_pitcher.losses + ")</td>";  
		
		ftrHTML+="<td>Winning Pitcher: " + this.winning_pitcher.name_display_roster;  
		ftrHTML+="&nbsp;(" + this.winning_pitcher.wins;  
		ftrHTML+="-" + this.winning_pitcher.losses + ")</td>";  
		ftrHTML+="<td>&nbsp;</td>";
		ftrHTML+="</tr></table></li>";
		}
		
		
	// Game In Progress  
	if (this.status.status == 'In Progress' || (this.status.status.indexOf("Delayed") > -1)) {
		
		
		ftrHomeInnings="";
		ftrAwayInnings="";
	
	
		for (var i = 0; i < this.linescore.inning.length; i++) 
		
		{
			if(this.linescore.inning[i].home != undefined)	{
				ftrHomeInnings+="&nbsp;" + this.linescore.inning[i].home + "&nbsp;"; 
			}
			
			if(this.linescore.inning[i].away != undefined)	{
				ftrAwayInnings+="&nbsp;" + this.linescore.inning[i].away + "&nbsp;"; 
			}
		}
		
		
		itrHTML+="<li><table class='table   table-responsive'><tr>";
		itrHTML+="<td><strong>" + this.status.status + ":</strong></td>";
		itrHTML+="<td><strong>" + this.venue + "</strong></td>";
		itrHTML+="<td><strong>" + dates[ctr] + "</strong></td>";
		itrHTML+="<td colspan='3'>&nbsp;</td>";
		 
		itrHTML+="</tr><tr>";
		itrHTML+="<td><img src='/images/" + this.away_team_name + ".png'" + " width='35' height='35' alt='' /></td>";	
		itrHTML+="<td>" + this.opposing_pitcher.last + ",";
		itrHTML+="    " + this.opposing_pitcher.first + "&nbsp;";
		itrHTML+="&nbsp;(" + this.opposing_pitcher.wins + " -";
		itrHTML+=" "     + this.opposing_pitcher.losses + ")</td>";
		itrHTML+="<td>" + this.opposing_pitcher.era + "</td>";
		itrHTML+="<td>" + ftrAwayInnings  + "</td>";
		itrHTML+="<td>("+ this.linescore.r.away;  
		itrHTML+="-"+ this.linescore.h.away;  
		itrHTML+="-"+ this.linescore.e.away + ")</td>";  
		itrHTML+="</tr><tr>";
		itrHTML+="<td><img src='/images/" + this.home_team_name + ".png'" + " width='35' height='35' alt='' /></td>";	
		itrHTML+="<td>" + this.pitcher.last + ",";
		itrHTML+="    " + this.pitcher.first + "&nbsp;";
		itrHTML+="&nbsp;(" + this.pitcher.wins + " -";
		itrHTML+=" "     + this.pitcher.losses + ")</td>";
		itrHTML+="<td>" + this.pitcher.era + "</td>";
		itrHTML+="<td>" + ftrHomeInnings  + "</td>";
		itrHTML+="<td>("+ this.linescore.r.home;  
		itrHTML+="-"+ this.linescore.h.home;  
		itrHTML+="-"+ this.linescore.e.home + ")</td>";  
		itrHTML+="</tr></table><li>";
	
	}
	
	// MLB Pre Game Data Extraction
	if (this.status.status == 'Preview' || this.status.status == 'Pre-Game'   )

		{	
		
		xtrHTML+="<li><table class='table  table-responsive'><tr>";
		xtrHTML+="<td><strong>" + this.status.status + ":</strong></td>";
		xtrHTML+="<td><strong>" + this.venue + "</strong></td>";
		xtrHTML+="<td><strong>" + this.time + "</strong></td>";
		xtrHTML+="<td><strong>" + dates[ctr] + "</strong></td>";
		
		xtrHTML+="<td colspan='3'>&nbsp;</td>";
		xtrHTML+="</tr><tr>";
		xtrHTML+="<td><img src='/images/" + this.away_team_name + ".png'" + " width='40' height='40' alt='' /></td>";	
		xtrHTML+="<td class='text-left'>" + this.away_probable_pitcher.last_name + ",";
		xtrHTML+="    " + this.away_probable_pitcher.first_name + "&nbsp;";
		xtrHTML+="&nbsp;(" + this.away_probable_pitcher.wins + " -";
		xtrHTML+=" "     + this.away_probable_pitcher.losses + ")</td>";
		xtrHTML+="<td>" + this.away_probable_pitcher.era + "</td>";
		xtrHTML+="<td>&nbsp;</td>";
		
		xtrHTML+="<td><img src='/images/" + this.home_team_name + ".png'" + " width='40' height='40' alt='' /></td>";	
		xtrHTML+="<td>" + this.home_probable_pitcher.last_name + ",";
		xtrHTML+="    " + this.home_probable_pitcher.first_name + "&nbsp;";
		xtrHTML+="&nbsp;(" + this.home_probable_pitcher.wins + " -";
		xtrHTML+=" "     + this.home_probable_pitcher.losses + ")</td>";
		xtrHTML+="<td>" + this.home_probable_pitcher.era + "</td>";
		xtrHTML+="</tr></table></li>";
		
		}
		
}); // $.each(data.data.games.game, function() {	

     
	 

    

	$('.bxslider').append(itrHTML+ftrHTML+xtrHTML);	
	
	 $('.bxslider').bxSlider({
	      
		     mode: 'vertical',
			 auto: true,
			 slideMargin: 5,
			 adaptiveheight: true,
			 mode: 'fade'
          }); 
		  
	   		
			 $('.smarticker6').smarticker({
			theme:'2',
			shuffle:true,
			imagesPath:'images',
			 
			category: true,			 
			subcategory: true,	
			rssFeed:'http://partner.mlb.com/partnerxml/gen/news/rss/sf.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/la.xml,	 http://mlb.mlb.com/partnerxml/gen/news/rss/sd.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/col.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/ari.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/chc.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/stl.xml,         \
					 http://mlb.mlb.com/partnerxml/gen/news/rss/pit.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/cin.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/mil.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/was.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/nym.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/atl.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/mia.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/phi.xml',          			 
					 
			rssCats: 'Giants , Dodgers, Padres, Rockies, Diamondbacks, \
					  Cubs, Cardinals, Pirates, Reds, Brewers,		\
					  Capitals, Mets, Braves, Marlins, Phillies ', 		 
			
			rssSources: 'MLB - N/L West , MLB - N/L West , MLB - N/L West, MLB - N/L West, MLB - N/L West, \
						 MLB - N/L Central, MLB - N/L Central,  MLB - N/L Central, MLB - N/L Central, MLB - N/L Central, \
						 MLB - N/L East, MLB - N/L East, MLB - N/L East, MLB - N/L East, MLB - N/L East '		
			});
			
			
			$('.smarticker6a').smarticker({
			theme:'2',
			shuffle:true,
			imagesPath:'images',
			 
			category: true,			 
			subcategory: true,	
			rssFeed:'http://partner.mlb.com/partnerxml/gen/news/rss/hou.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/ana.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/sea.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/tex.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/oak.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/kc.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/min.xml,         \
					 http://mlb.mlb.com/partnerxml/gen/news/rss/det.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/cws.xml, http://mlb.mlb.com/partnerxml/gen/news/rss/cle.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/nyy.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/tb.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/bal.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/tor.xml,http://mlb.mlb.com/partnerxml/gen/news/rss/bos.xml',          			 
					 
			rssCats: 'Astros , Angels, Mariners, Rangers, Athletics, \
					  Royals, Twins, Tigers, White Sox, Indians,		\
					  Yankees, Rays, Orioles, Blue Jays, Red Sox', 		 
			
			rssSources: 'MLB - A/L West , MLB - A/L West , MLB - A/L West, MLB - A/L West, MLB - A/L West, \
						 MLB - A/L Central, MLB - A/L Central,  MLB - A/L Central, MLB - A/L Central, MLB - A/L Central, \
						 MLB - A/L East, MLB - A/L East, MLB - A/L East, MLB - A/L East, MLB - A/L East '		
			});
			
			
			
		$('.smarticker6e').smarticker({
			theme:'2',
			shuffle:true,
			imagesPath:'images',
			 
			category: true,			 
			subcategory: true,	
			rssFeed:'http://mlb.mlb.com/partnerxml/gen/news/rss/mlb.xml',
					 
			rssCats: 'Teams', 		 
			
			rssSources: 'All MLB'	
			});
			
			
		$('.smarticker6f').smarticker({
			theme: 2,
			animation: 'typing',
			speed: 2000,
			pausetime: 5000,
			rounded: false,	
			catcolor: false 
		 
		});
		
		
		
		$('.smarticker6g').smarticker({
			theme: 2,
			animation: 'typing',
			speed: 2000,
			pausetime: 5000,
			rounded: false,	
			catcolor: false 
		 
		});
	 
     
		  
	
	
}); // function GetHTML (passValue) 

} //GetHtml Function


});
	
	
 