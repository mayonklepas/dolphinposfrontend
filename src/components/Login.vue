<template>
  <div class="login">
    <div class="container" style="height:80vh">
      <div style="width:350px;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)">
        <div class="align-center tx-xlarge tx-xbold" style="text-transform:uppercase ;">{{host}}</div>
        <div class="box-material" style="z-index: 10001;padding: 20px;margin-top: 15px;">
          <div class="box-body">
            <label>Kode Outlet</label>
            <input type="text" v-model="kodeOutlet" />
            <label>Username</label>
            <input type="text" v-model="username" />
            <label>Password</label>
            <input type="password" v-model="password" />
            <button type="button" v-on:click="login" style="width:100%;margin-top: 10px;"><i class="fa fa-sign-in"></i>
              Login</button>
          </div>
        </div>
        <div style="margin-top:15px; text-align:center">
          Lupa password ? <a href="http://">Klik disini</a>
        </div>
      </div>
    </div>


    <div class="modal" v-if="modalInfo == true" style="z-index:2000">
      <div class="modal-content" style="width: 30%">
        <div class="modal-header">Informasi</div>
        <div class="modal-body">
          <div style="padding: 10px;text-align: center">
            <span style="font-size: 15px;color: #fa054f;font-weight: bold;">
              {{ modalInfoText }}
            </span>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" v-on:click="closeModalInfo">
            <i class="fa fa-close"></i> Tutup
          </button>
        </div>
      </div>
    </div>

    <pbar v-if="modalProgress == true"></pbar>

  </div>
</template>

<script>
  import pbar from ".././components/ProgressBar";
  export default {
    components: {
      pbar,
    },
    data() {
      return {
        modalProgress: false,
        modalInfo: false,
        modalInfoText: "",
        kodeOutlet: "",
        username: "",
        password: "",
        host:location.hostname.split(".")[0]
      };
    },
    methods: {
      login() {
        this.modalProgress = true;
        let postData = {
          kodeOutlet: this.kodeOutlet,
          username: this.username,
          password: this.password,
        };
        this.$axios
          .post(this.$url + "pengguna/login", JSON.stringify(postData), {
            headers: { "Content-Type": "application/json" },
          })
          .then((response) => {
            this.modalProgress = false;
            console.log(response);
            let statusCode = response.data.code;
            let status = response.data.status;
            let message =response.data.message;
            if (statusCode == 0 && status == "success") {
              console.log("sukses");
              let dataLogin = response.data.content;
              console.log(dataLogin);
              localStorage.setItem("dataLogin", JSON.stringify(dataLogin));
              localStorage.setItem("token",message);
              location.reload();
            } else {
              this.modalInfo = true;
              this.modalInfoText = "Login gagal, Pastikan Kode Outlet, Username dan Password anda benar"
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
      closeModalInfo() {
        this.modalInfo = false;
      }
    },
    mounted() { },
  };
</script>

<style></style>