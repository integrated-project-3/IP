<template >
  <div class="timeline">
    <div>
      <b-row class="head" align-v="start">
        <b-col md="2">
          <b-btn variant="select" @click="back">Back</b-btn>
        </b-col>
        <b-col>
          <span class="timeline-details">
            <h1>{{title}}</h1>
            <h2>{{date}}</h2>
            <p v-if="events.length > 0">
              {{startTime}} - {{endTime}}
            </p>
          </span>
        </b-col>
        <b-col>
          <b-btn variant="create" @click="openModal" style="float: right;">Create new event</b-btn>
        </b-col>
      </b-row>
      <b-row align-v="center">
        <a-events :events="events"></a-events>
      </b-row>
    </div>
  </div>
</template>

<script>
import {formatDate} from '../../scripts/script'
import aEvents from './events'

export default {
  name: 'aTimeline',
  data() {
    return {
    }
  },
  components: {
    aEvents
  },
  computed: {
    timeline() {
      return this.$store.state.currentTimeline
    },
    title() {
      return this.timeline.title
    },
    date() {
      return formatDate(this.timeline.date)
    },
    events() {
      return this.timeline.timelineEvents
    },
    startTime() {
      return this.timeFromDateTime(this.events[0].EventDateTime)
    },
    endTime() {
      return this.timeFromDateTime(this.events[this.events.length-1].EventDateTime)
    }
  },
  methods: {
    back: function() {
      this.$router.push({name: 'REGISTER'})
    },
    openModal: function() {
      alert("new")
    },
    timeFromDateTime(dateTime) {
      return dateTime.substring(11, 16)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';

.timeline {
  padding-top: 20px;
  .timeline-details {
    h1 {
      @media only screen and (max-width: 576px) {
        font-size: 2em;
      }
      font-size: 4em;
    }
    p {
      font-size: 2em;
    }
  }
}
</style>
