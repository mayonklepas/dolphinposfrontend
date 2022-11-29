<template>
  <div id="app">
    <div v-if="login == true">
      <home></home>
    </div>
    <div v-else>
      <login></login>
    </div>
  </div>
</template>
<script>
import home from "./components/Home";
import login from "./components/Login";
export default {
  components: {
    home,
    login,
  },
  data() {
    return {
      login: false,
    };
  },
  methods: {},
  mounted() {
    console.log(this.$settings);
    if (JSON.parse(localStorage.getItem("dataLogin")) !== null) {
      let dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
      if (
        this.$idPengguna == dataLogin.id &&
        this.$idOutlet == dataLogin.idOutlet
      ) {
        this.login = true;
      }
    }
  },
};
</script>
<style>
@import url(assets/minimal.css);

.modal {
  display: block;
}

.hide {
  display: none;
  transition: height 1s ease;
}

.show {
  display: block;
  transition: height 1s ease;
}
</style>