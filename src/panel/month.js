import { DateTime } from 'luxon'
import locale from '@/mixins/locale'

export default {
  name: 'panelMonth',
  mixins: [locale],
  props: {
    value: null,
    calendarYear: {
      default: DateTime.utc().year
    },
    disabledMonth: Function
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
    const currentYear = this.value && this.value.year
    const currentMonth = this.value && this.value.month
    months = months.map((v, i) => {
      const month = i + 1
      return <span
        class={{
          'cell': true,
          'actived': currentYear === this.calendarYear && currentMonth === month,
          'disabled': this.isDisabled(month)
        }}
        onClick={this.selectMonth.bind(this, month)}>
        {v}
      </span>
    })
    return <div class="mx-panel mx-panel-month">{months}</div>
  }
}
