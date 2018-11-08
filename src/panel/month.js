import { DateTime } from 'luxon'
import locale from '@/mixins/locale'

export default {
  name: 'panelMonth',
  mixins: [locale],
  props: {
    value: null,
    calendarYear: {
      default: DateTime.utc().year,
    },
    disabledMonth: Function,
  },
  methods: {
    isDisabled (month) {
      if (typeof this.disabledMonth === 'function' && this.disabledMonth(month)) {
        return true
      }
      return false
    },
    selectMonth (month) {
      if (this.isDisabled(month)) {
        return
      }
      this.$emit('select', month)
    }
  },
  render (h) {
    let months = this.t('months')
    const currentYear = this.value && DateTime.utc().year
    const currentMonth = this.value && DateTime.utc().month
    months = months.map((v, i) => {
      return <span
        class={{
          'cell': true,
          'actived': currentYear === this.calendarYear && currentMonth === i,
          'disabled': this.isDisabled(i)
        }}
        onClick={this.selectMonth.bind(this, i)}>
        {v}
      </span>
    })
    return <div class="mx-panel mx-panel-month">{months}</div>
  }
}
