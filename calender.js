const Year = {template: '<div>year</div>'}
const Month = {template: '<div>month</div>'}

const routes = [
    {path : '/year', component : Year},
    {path : '/month', component : Month}
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: routes 
});

const app = Vue.createApp({
    el: '#app',
    router,
    data() {
        return {
            weekList: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            currentTime: {},   // object for currenttime
            calendarList: [],  
            actualDate: new Date(),
            monthEnglish: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        }
    },
    computed: {
        currentDate() {
            console.log("hihi");
            let { year, month } = this.currentTime;
            return `${this.getEnglishMonth(month)} ${year}`;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.setCurrent();
            this.calendarCreator();
        },

        check(item){
            item.isChecked = !item.isChecked;
            for(ele of this.calendarList){
                if(item != ele)
                    ele.isChecked = false;
            }
        },

        getDaysByMonth(year, month) {
            return new Date(year, month + 1, 0).getDate(); //juage how much days on this month
        },

        getFirstDayByMonths(year, month) {
            return new Date(year, month, 1).getDay(); //juage the first day of the month
        },

        getLastDayByMonth(year, month) {
            return new Date(year, month + 1, 0).getDay(); //juage the last day of the month
        },

        getEnglishMonth(indexMonth) {
            return this.monthEnglish[indexMonth]; //translate intMonth into englishMonth 
        },

        getInt(num){
            return num < 10 ? `0${num}` : `${num}`; //if num < 10 then return 0 & num
        },

        previousMonth() {
            this.currentTime.month--;
            this.correctCurrent();
            this.calendarCreator();
        },

        nextMonth() {
            this.currentTime.month++;
            this.correctCurrent();
            this.calendarCreator();
        },

        stringify(year, month, date) {
            let str = [year, this.getInt(month + 1), this.getInt(date)].join('-');
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

        correctCurrent() {
            let { year, month, date } = this.currentTime;

            let maxDate = this.getDaysByMonth(year, month);
            date = Math.min(maxDate, date);

            let instance = new Date(year, month, date);
            this.setCurrent(instance);
        },

        calendarCreator() {
            let count = 0;
            const millliSecond = 24 * 60 * 60 * 1000;

            let list = [];
            let { year, month, date } = this.currentTime;

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
                    isToday:curMonth == month && curDate == date && curYear == year
                });
                begin += millliSecond;
            }

            this.calendarList = list;
        }
    },
})
app.use(router);
app.mount('#app');