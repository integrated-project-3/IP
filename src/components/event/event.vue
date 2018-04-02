<template lang="html">
  <div>
    <div v-if="event != null">
      <b-row>
        <b-col md="10" offset-md="1" class="event-page" id="event-page">
          <b-row class="event-header">
            <b-col md="1">
              <b-btn class="btn-round" variant="create" @click="back"><i class="material-icons">arrow_back</i></b-btn>
            </b-col>
            <b-col md="5">
              <h1>{{title}}</h1>
            </b-col>
            <b-col md="5">
              <h1>{{date}} - {{time}} <i class="material-icons date-range">date_range</i></h1>
            </b-col>
            <b-col md="1">
              <b-btn class="btn-round" variant="delete" @click=""><i class="material-icons">delete</i></b-btn>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
    <div v-else>
      <div v-if="timeline != null">
        <h2>
          No event selected. Click <router-link to="/timeline">here</router-link> to return to timeline.
        </h2>
      </div>
      <div v-else>
        <h2>
          No event or timeline selected. Click <router-link to="/">here</router-link> to return to timeline register.
        </h2>
      </div>
    </div>
  </div>
</template>

<script>
import {formatEventDate, formatEventTime, validTitle} from '../../scripts/script'
import $ from 'jquery'

export default {
  name: 'aTimeline',
  computed: {
    timeline() {
      return this.$store.state.currentTimeline
    },
    event() {
      return this.$store.state.currentEvent
    },
    title() {
      return this.event.Title
    },
    date() {
      return formatEventDate(this.event.EventDateTime)
    },
    time() {
      return formatEventTime(this.event.EventDateTime)
    }
  },
  methods: {
    back() {
      this.$router.push({name: 'TIMELINE'})
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/styles/theme.scss';
@import '../../assets/styles/main.scss';

.event-page {
  background-color: $event-bg;
  margin-top: 20px;
  .event-header {
    padding: 20px;
    .btn-round {
      position: relative;
      bottom: 50%;
      transform: translateY(50%);
      font-size: 1px;
      padding: 0;
    }
    h1 {
      display: inline;
    }
    i.date-range {
      font-size: 0.9em;
    }
  }
}
</style>
