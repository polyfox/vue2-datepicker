import { DateTime } from 'luxon'
import { formatTime, parseTime } from '@/utils/index'

export default {
  name: 'panelTime',
  props: {
    timePickerOptions: {
      type: [Object, Function],
      default () {
        return null
      }
    },
    minuteStep: {
      type: Number,
      default: 0,
      validator: val => val >= 0 && val <= 60
    },
    value: null,
    timeType: {
      type: Array,
      default () {
        return ['24', 'a']
      }
    },
    disabledTime: Function
  },
  computed: {
    currentHours () {
      return this.value ? this.value.hour : 0
    },
    currentMinutes () {
      return this.value ? this.value.minute : 0
    },
    currentSeconds () {
      return this.value ? this.value.second : 0
    }
  },
  methods: {
    stringifyText (value) {
      return ('00' + value).slice(String(value).length)
    },
    selectTime (time) {
      if (typeof this.disabledTime === 'function' && this.disabledTime(time)) {
        return
      }
      this.$emit('select', time)
    },
    pickTime (time) {
      if (typeof this.disabledTime === 'function' && this.disabledTime(time)) {
        return
      }
      this.$emit('pick', time)
    },
    getTimeSelectOptions () {
      const result = []
      const options = this.timePickerOptions
      if (!options) {
        return []
      }
      if (typeof options === 'function') {
        return options() || []
      }
      const start = parseTime(options.start)
      const end = parseTime(options.end)
      const step = parseTime(options.step)
      if (start && end && step) {
        const startMinutes = start.minutes + start.hours * 60
        const endMinutes = end.minutes + end.hours * 60
        const stepMinutes = step.minutes + step.hours * 60
        const len = Math.floor((endMinutes - startMinutes) / stepMinutes)
        for (let i = 0; i <= len; i++) {
          let timeMinutes = startMinutes + i * stepMinutes
          let hours = Math.floor(timeMinutes / 60)
          let minutes = timeMinutes % 60
          let value = {
            hours, minutes
          }
          result.push({
            value,
            label: formatTime(value, ...this.timeType)
          })
        }
      }
      return result
    }
  },
  render (h) {
    const date = this.value || DateTime.utc().set({hour: 0, minute: 0, second: 0})
    const disabledTime = typeof this.disabledTime === 'function' && this.disabledTime

    let pickers = this.getTimeSelectOptions()
    if (Array.isArray(pickers) && pickers.length) {
      pickers = pickers.map(picker => {
        const pickHours = picker.value.hours
        const pickMinutes = picker.value.minutes
        const time = date.set({hour: pickHours, minute: pickMinutes, second: 0})
        return (
          <li
            class={{
              'mx-time-picker-item': true,
              'cell': true,
              'actived': pickHours === this.currentHours && pickMinutes === this.currentMinutes,
              'disabled': disabledTime && disabledTime(time)
            }}
            onClick={this.pickTime.bind(this, time)}>{picker.label}</li>
        )
      })
      return (
        <div class="mx-panel mx-panel-time">
          <ul class="mx-time-list">
            {pickers}
          </ul>
        </div>
      )
    }

    const hours = Array.apply(null, { length: 24 }).map((_, i) => {
      const time = date.set({hour: i})
      return <li
        class={{
          'cell': true,
          'actived': i === this.currentHours,
          'disabled': disabledTime && disabledTime(time)
        }}
        onClick={this.selectTime.bind(this, time)}
      >{this.stringifyText(i)}</li>
    })

    const step = this.minuteStep || 1
    const length = parseInt(60 / step)
    const minutes = Array.apply(null, { length }).map((_, i) => {
      const value = i * step
      const time = date.set({minute: value})
      return <li
        class={{
          'cell': true,
          'actived': value === this.currentMinutes,
          'disabled': disabledTime && disabledTime(time)
        }}
        onClick={this.selectTime.bind(this, time)}
      >{this.stringifyText(value)}</li>
    })

    const seconds = Array.apply(null, { length: 60 }).map((_, i) => {
      const time = date.set({second: i})
      return <li
        class={{
          'cell': true,
          'actived': i === this.currentSeconds,
          'disabled': disabledTime && disabledTime(time)
        }}
        onClick={this.selectTime.bind(this, time)}
      >{this.stringifyText(i)}</li>
    })

    let times = [hours, minutes]
    if (this.minuteStep === 0) {
      times.push(seconds)
    }

    times = times.map(list => (
      <ul class="mx-time-list"
        style={{ width: 100 / times.length + '%' }}>
        {list}
      </ul>
    ))

    return (
      <div class="mx-panel mx-panel-time">
        {times}
      </div>
    )
  }
}
