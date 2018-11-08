import { DateTime } from 'luxon'
import locale from '@/mixins/locale'
import { formatDate } from '@/utils/index'

export default {
  name: 'panelDate',
  mixins: [locale],
  props: {
    value: null,
    startAt: null,
    endAt: null,
    dateFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    calendarMonth: {
      default: DateTime.utc().month,
    },
    calendarYear: {
      default: DateTime.utc().year,
    },
    firstDayOfWeek: {
      default: 7,
      type: Number,
      validator: val => val >= 1 && val <= 7
    },
    disabledDate: {
      type: Function,
      default: () => {
        return false
      }
    }
  },
  methods: {
    selectDate ({ year, month, day }) {
      const date = DateTime.utc(year, month, day)
      if (this.disabledDate(date)) {
        return
      }
      this.$emit('select', date)
    },
    getDays (firstDayOfWeek) {
      const days = this.t('days')
      const firstday = parseInt(firstDayOfWeek, 10)
      return days.concat(days).slice(firstday, firstday + 7)
    },
    getDates (year, month, firstDayOfWeek) {
      const arr = []
      const time = DateTime.utc(year, month)

      time.set({ day: 1 }) // 把时间切换到上个月最后一天
      const lastMonthLength = (time.weekday + 7 - firstDayOfWeek) % 7 + 1 // time.weekday 0是星期天, 1是星期一 ...
      const lastMonthfirst = time.day - (lastMonthLength - 1)
      for (let i = 0; i < lastMonthLength; i++) {
        arr.push({ year, month: month - 1, day: lastMonthfirst + i })
      }

      time.set({ month: time.month + 2, day: 1 }) // 切换到这个月最后一天
      const curMonthLength = time.day
      for (let i = 0; i < curMonthLength; i++) {
        arr.push({ year, month, day: 1 + i })
      }

      time.set({ month: time.month + 1, day: 1 }) // 切换到下个月第一天
      const nextMonthLength = 42 - (lastMonthLength + curMonthLength)
      for (let i = 0; i < nextMonthLength; i++) {
        arr.push({ year, month: month + 1, day: 1 + i })
      }

      return arr
    },
    getCellClasses ({ year, month, day }) {
      const classes = []
      const cellTime = DateTime.utc(year, month, day)
      const today = DateTime.utc().set({hour: 0, minute: 0, second: 0, millisecond: 0})
      const curTime = this.value && this.value.set({hour: 0, minute: 0, second: 0, millisecond: 0})
      const startTime = this.startAt && this.startAt.set({hour: 0, minute: 0, second: 0, millisecond: 0})
      const endTime = this.endAt && this.endAt.set({hour: 0, minute: 0, second: 0, millisecond: 0})

      if (month < this.calendarMonth) {
        classes.push('last-month')
      } else if (month > this.calendarMonth) {
        classes.push('next-month')
      } else {
        classes.push('cur-month')
      }

      if (cellTime === today) {
        classes.push('today')
      }

      if (this.disabledDate(cellTime)) {
        classes.push('disabled')
      }

      if (curTime) {
        if (cellTime === curTime) {
          classes.push('actived')
        } else if (startTime && cellTime <= curTime) {
          classes.push('inrange')
        } else if (endTime && cellTime >= curTime) {
          classes.push('inrange')
        }
      }
      return classes
    },
    getCellTitle ({ year, month, day }) {
      return formatDate(DateTime.utc(year, month, day), this.dateFormat)
    }
  },
  render (h) {
    const ths = this.getDays(this.firstDayOfWeek).map(day => {
      return <th>{day}</th>
    })

    const dates = this.getDates(this.calendarYear, this.calendarMonth, this.firstDayOfWeek)
    const tbody = Array.apply(null, { length: 6 }).map((week, i) => {
      const tds = dates.slice(7 * i, 7 * i + 7).map(date => {
        const attrs = {
          class: this.getCellClasses(date)
        }
        return (
          <td
            class="cell"
            {...attrs}
            title={this.getCellTitle(date)}
            onClick={this.selectDate.bind(this, date)}>
            {date.day}
          </td>
        )
      })
      return <tr>{tds}</tr>
    })

    return (
      <table class="mx-panel mx-panel-date">
        <thead>
          <tr>{ths}</tr>
        </thead>
        <tbody>
          {tbody}
        </tbody>
      </table>
    )
  }
}
