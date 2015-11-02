function Current_Date() {
    var today_GMT = new Date();
    var dd = today_GMT.getDate();
    var mm = today_GMT.getMonth() + 1; //January is 0!
    var yyyy = today_GMT.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    current_date = mm + '/' + dd + '/' + yyyy;
    //alert("current_date"+current_date);

    Back_date();
}

function Back_date(nbrDays)
{    
    var back_GTM = new Date(); back_GTM.setDate(back_GTM.getDate() - nbrDays); // 2 is your X
    var b_dd = back_GTM.getDate();
    var b_mm = back_GTM.getMonth()+1;
    var b_yyyy = back_GTM.getFullYear();
    if (b_dd < 10) {
        b_dd = '0' + b_dd
    }
    if (b_mm < 10) {
        b_mm = '0' +b_mm
    }

    var back_date=  b_mm + '' + b_dd + '';
    //alert("back_date"+back_date);
	return  back_date;
}

