<template lang="html">
  <div class="logo">
    <router-link :to="linkTo" v-if="router === true">
      <!--
        The image source should be bound to the src prop, however it isn't working with local files.
        If the prop default is changed to a direct link to an image online then it works.
      -->
      <img src="../../assets/images/logo.png" :alt="alt" />
    </router-link>
    <a href=link v-else>
      <!--
        Same as above.
      -->
      <img src="../../assets/images/logo.png" :alt="alt" />
    </a>
  </div>
</template>

<script>
export default {
  name: 'aLogo',
  props: {
    /*
      Set whether the logo is a href or a router-link.
      Default: router-link since the application is a single-page application using vue-router.
    */
    router: {
      type: Boolean,
      required: false,
      default: true
    },
    /*
      Set where the logo shold lead to when clicked.
      Default: home page of the application.
    */
    linkTo: {
      type: String,
      required: false,
      default: "/"
    },
    /*
      Set the src of the image.
      Default: aileron airways logo.
    */
    src: {
      type: String,
      required: false,
      default: "../../assets/logo.png"
    },
    /*
      Set the alt of the image.
      Default: Aileron Airways
    */
    alt: {
      type: String,
      required: false,
      default: "Aileron Airways"
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/theme.scss';

.logo {
  padding: 35px 30px 15px 30px;
  img {
    max-width: 100%;
    height: auto;
  }
}
</style>
