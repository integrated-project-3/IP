<template >
  <div class="timeline">
    <b-row class="head" align-v="start">
      <b-col md="6">
        <b-btn @click="back">Back</b-btn>
      </b-col>
      <b-col>
        <h3>{{title}}</h3>
      </b-col>
    </b-row>
    <b-row></b-row>
  </div>
</template>

<script>
export default {
  name: 'aTimeline',
  data() {
    return {
      title: this.$route.params.timeline.title
    }
  },
  methods: {
    back: function() {
      this.$router.push({name: 'REGISTER'})
    }
  }
}
</script>

<style lang="scss">
</style>
