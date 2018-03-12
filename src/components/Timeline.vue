<template >
  <b-row class="timeline" align-v="center">
    <b-col>
      <b-btn @click="back">Back</b-btn>
    </b-col>
    <b-col>
      <h3>{{title}}</h3>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'Timeline',
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
