const app = Vue.createApp({
    el: '#app',
    data() {
        return {
            weekList: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            currentTime: {},   // object for currenttime
            today:{},
            calendarList: [],  
            yearList: {},
            actualDate: new Date(),
            monthEnglish: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthAbbre: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            isClickToolBar: false,
            isClickYearToolBar: false,
            isClickPicker: false,
            isCheckItem:[],
            isYear:[]
        }
    },
    computed: {
        currentDate() {
            let { year, month } = this.currentTime;
            return `${this.getEnglishMonth(month)} ${year}`;
        },

        rangeYear(){
            let a = this.currentTime.year % 10;
            return `${this.currentTime.year-a}-${this.currentTime.year+(9-a)}`;
        },

        valueDate(){
            return `${this.stringify(this.currentTime.year, this.currentTime.month, this.currentTime.date)}`;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.setCurrent();
            this.setToday();
            this.calendarCreator();
        },

        checkDate(item){
            item.isChecked = !item.isChecked;
            this.isClickPicker = !this.isClickPicker;
            for(ele of this.calendarList){
                if(item != ele)
                    ele.isChecked = false;
                else{
                    this.currentTime.year = ele.year;
                    this.currentTime.month = ele.month;
                    this.currentTime.date = ele.date;
                }
            }
        },

        checkMonth(item){
            this.currentTime.month = item;
            this.correctCurrent();
            this.calendarCreator();
            this.isClickToolBar = !this.isClickToolBar;
        },

        checkYear(item){
            this.currentTime.year = item.year;
            this.isClickYearToolBar = !this.isClickYearToolBar;
        },

        getDaysByMonth(year, month) {
            return new Date(year, month+1, 0).getDate(); //juage how much days on this month
        },

        getFirstDayByMonths(year, month) {
            return new Date(year, month, 1).getDay(); //juage the first day of the month
        },

        getLastDayByMonth(year, month) {
            return new Date(year, month, 0).getDay(); //juage the last day of the month
        },

        getEnglishMonth(indexMonth) {
            return this.monthEnglish[indexMonth]; //translate intMonth into englishMonth 
        },

        getInt(num){
            return num < 10 ? `0${num}` : `${num}`; //if num < 10 then return 0 & num
        },

        previousMonth() {
            if(this.currentTime.month == 0){
                this.previousYear();
                this.currentTime.month = 11;
            }
            else
                this.currentTime.month--;
            this.correctCurrent();
            this.calendarCreator();
        },

        previousYear() {
            this.currentTime.year--;
            this.isCheckItem[this.currentTime.month] = false;
        },

        nextMonth() {
            if(this.currentTime.month == 11){
                this.nextYear();
                this.currentTime.month = 0;
            }
            else
                this.currentTime.month++;
            this.correctCurrent();
            this.calendarCreator();
        },

        nextYear() {
            this.currentTime.year++;
            this.isCheckItem[this.currentTime.month] = false;
        },

        stringify(year, month, date) {
            let str = [year, this.getInt(month+1), this.getInt(date)].join('-');
            return str;
        },
    
        setCurrent(d = new Date()) {
            let year = d.getFullYear();
            let month = d.getMonth();
            let date = d.getDate();
            this.currentTime = {
                year,
                month,
                date
            }
        },

        setToday(){
            d = new Date();
            let year = d.getFullYear();
            let month = d.getMonth();
            let date = d.getDate();
            this.today = {
                year,
                month,
                date
            }
        },

        correctCurrent() {
            let { year, month, date } = this.currentTime;
            date = this.getDaysByMonth(year, month); 
            this.currentTime = {year, month, date};
        },

        calendarCreator() {
            let count = 0;
            const millliSecond = 24 * 60 * 60 * 1000;

            let list = [];
            let {year, month} = this.currentTime;

            let firstDay = this.getFirstDayByMonths(year, month);
            let prefixDaysLen = firstDay;

            let begin = new Date(year, month, 1).getTime() - millliSecond * prefixDaysLen;

            while (count / 7 <= 5 || count % 7 != 0) {
                count++;
                this.actualDate.setTime(begin);
                let curYear = this.actualDate.getFullYear();
                let curMonth = this.actualDate.getMonth();
                let curDate = this.actualDate.getDate();
                list.push({
                    year: curYear,
                    month: curMonth,
                    date: curDate,
                    disable: curMonth !== month,
                    value: this.stringify(curYear, curMonth, curDate),
                    isChecked : false,
                    isToday:curMonth === this.today.month && curDate === this.today.date && curYear === this.today.year
                });
                begin += millliSecond;
            }

            this.calendarList = list;
        },

        chooseMonth(){
            this.isClickToolBar = true;
            for(let i = 0; i < 12; i++){
                if(this.currentTime.month == i)
                    this.isCheckItem.push(true);
                else
                    this.isCheckItem.push(false);
            }   
        },

        chooseYear(){
            this.isClickYearToolBar = true;
            for(let i = 0; i < 12; i++){
                if(this.currentTime.year == i)
                    this.isYear.push(true);
                else
                    this.isYear.push(false);
            }
            let a = this.currentTime.year % 10;
            let begin = this.currentTime.year - a;
            for(i = begin - 1; i < begin + 11; i++){
                this.yearList[i-begin+1] = {
                    disable: i === begin-1 || i === begin+10,
                    year: i,  
                    isThisYear: i === this.today.year                  
                }
            }   
        },

        previousRangeYear(){
            this.currentTime.year -= 10; 
            for(i = 0; i < 12; i++){
                this.yearList[i].year -= 10;    
                this.yearList[i].isThisYear = false;
            }
        },

        nextRangeYear(){
            this.currentTime.year += 10;
            for(i = 0; i < 12; i++){
                this.yearList[i].year += 10; 
                this.yearList[i].isThisYear = false;
            }
        }
    },
})

app.mount('#app');
