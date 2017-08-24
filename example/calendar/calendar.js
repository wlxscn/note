const WEEKDAYS= ['日', '一', '二', '三', '四', '五', '六'];

const TOTALDAYS= 42;

const getMonthFirstDay= (year, month) => {
    return new Date(year, month-1, 1).getDay();
}

const getMonthLength= (year, month) => {
    return new Date(year, month, 0).getDate();
}

const renderCalendarTable= (year, month) => {
    let html= '';

    // 获取当前年月
    // const year= new Date().getFullYear();
    // const month= new Date().getMonth();

    firstDay= getMonthFirstDay(year, month);
    monthLength= getMonthLength(year, month);
    lastMonthLength= getMonthLength(year, month-1);
    nextMonthDay= TOTALDAYS-monthLength-firstDay;

    html+= "<div class='calendar-box'>";

    html+= "<div class='calendar-caption'>";

    for(let i=0; i< WEEKDAYS.length; i++) {
        html+= "<div class='calendar-cell'>" + WEEKDAYS[i] + "</div>"
    }

    html+= "</div>";

    html+= "<div class='calendar-content'>"

    for(let j=1; j <= firstDay; j++) {
        html+= '<div class="lastMothCell">' + (lastMonthLength-j) + '</div>';
    }

    for(let k=1; k<=monthLength;k++) {
        if(k === new Date().getDate()) {
            html+= '<div class="curMothCell curDate">' + k +'</div>';
        } else {
            html+= '<div class="curMothCell">' + k +'</div>';
        }  
    }

    for(let k=1; k<=nextMonthDay;k++) {
        html+= '<div class="nextMothCell">' + k +'</div>';
    }

    html+= "</div>";

    html+= "</div>";

    return html;   
}

function buildCalender(){
	var year = document.getElementById('year').value,
		month = document.getElementById('month').value,
		calender_html = renderCalendarTable(year,month);

	document.getElementsByClassName('calendar')[0].innerHTML = calender_html;
}

buildCalender();