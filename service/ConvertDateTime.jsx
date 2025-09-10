import moment from "moment"

export const FormatDate=(timestamp)=>{
    return new Date(timestamp).setHours(0,0,0,0)
}

export const formatDateForText=(date)=>{
    return moment(date).format('ll')
}

export const formatTime=(timestamp)=>{
    const date=new Date(timestamp);
    const timeString=date.toLocaleTimeString([],{
        hour:'2-digit',
        minute:'2-digit'
    })

    console.log(timeString)
    return timeString; // 9:00 AM 
}

export const getDatesRange=(startdate,endDate)=>{
    const start=moment(new Date(startdate),'MM/DD/YYYY');
    const end=moment(new Date(endDate),'MM/DD/YYYY');
    const dates=[];

    while(start.isSameOrBefore(end))
    {
        dates.push(start.format('MM/DD/YYYY'));
        start.add(1,'days')
    }

    return dates;

}

/**
 * 
 * @returns Get Next & Days List
 */
export const GetDateRangeToDisplay=()=>{
    const dateList=[];
    for(let i=0;i<=7;i++)
    {
        dateList.push({
            date:moment().add(i,'days').format('DD'), // 27
            day:moment().add(i,'days').format('dd'), // Tue
            formattedDate:moment().add(i,'days').format('L')// 12/27/2024
        })
    }

    return dateList;
}

export const GetPrevDateRangeToDisplay=()=>{
    const dates=[];
    for(let i=0;i<=7;i++)
    {
        const date=moment().subtract(i,'days');

        dates.push({
            date:date.format('DD'),
            day:date.format('dd'),
            formattedDate:date.format('L')
        })
    }
    return dates;
}