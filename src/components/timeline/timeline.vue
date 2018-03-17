<template >
  <div class="timeline">
    <div>
      <b-row class="head" align-v="start">
        <b-col md="3">
          <b-btn variant="select" @click="back">Back</b-btn>
        </b-col>
        <b-col>
          <span class="timeline-details">
            <h1>{{title}}</h1>
            <p>
              {{date}}
            </p>
          </span>
        </b-col>
        <b-col>
          <b-btn variant="create" @click="openModal" style="float: right;">Create new event</b-btn>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import {formatDate} from '../../scripts/script'

export default {
  name: 'aTimeline',
  data() {
    return {
    }
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
    }
  },
  methods: {
    back: function() {
      this.$router.push({name: 'REGISTER'})
    },
    openModal: function() {
      alert("new")
    }
  }
}
</script>

<style lang="scss" scoped>
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
