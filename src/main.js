let dropdown = document.getElementsByClassName("side-dropdown-content");
let dropdownButton = document.getElementsByClassName("side-dropdown-menu");

for (let i = 0; i < dropdownButton.length; i++) {
  dropdownButton[i].addEventListener("click", function () {
    if (dropdown[i].classList.contains("hide")) {
      dropdown[i].classList.remove("hide");
      for (let index = 0; index < dropdown.length; index++) {
        if (dropdown[index] !== dropdown[i]) {
          dropdown[index].classList.add("hide");
        }
      }
    } else {
      dropdown[i].classList.add("hide");
    }
  });
}

import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import router from "./router/router.js";
import print from "print-js";

if (localStorage.getItem("dataLogin") !== null) {
  let dataLogin = JSON.parse(localStorage.getItem("dataLogin"));
  Vue.prototype.$idOutlet = dataLogin.idOutlet;
  Vue.prototype.$idPengguna = dataLogin.id;
  Vue.prototype.$rules = dataLogin.rules;
  Vue.prototype.$tax = dataLogin.outlet.tax;
  Vue.prototype.$kodeOutlet = dataLogin.outlet.kodeOutlet;
  Vue.prototype.$namaOutlet = dataLogin.outlet.namaOutlet;
  Vue.prototype.$alamatOutlet = dataLogin.outlet.alamatOutlet;
  Vue.prototype.$nohpOutlet = dataLogin.outlet.nohpOutlet;
  Vue.prototype.$settings = JSON.parse(dataLogin.outlet.settings);
} else {
  Vue.prototype.$idOutlet = "none";
  Vue.prototype.$idPengguna = "none";
  Vue.prototype.$rules = "none";
}

Vue.prototype.$pageElipsis = 8;
Vue.prototype.$pageSize = 100;
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.prototype.$printjs = print;
Vue.prototype.$url = "http://localhost:8087/api/";
//Vue.prototype.$url = "http://103.226.139.97:8087/api/";

axios.defaults.headers.common["Authorization"] =
  "Bearer " + localStorage.getItem("token");

axios.interceptors.response.use(undefined, function (error) {
  console.log(error);
  if(error == "Error: Network Error"){
    alert("Network Error, Try again later");
  }
  if (error.response.status === 403) {
    alert("Session Expired, please re login");
    localStorage.removeItem("dataLogin");
    location.replace("/");
  }else if(error.response.status === 500){
    alert("System Error, Server Maintenance");
  }else if(error.response.status === 404){
    alert("System Error, File not found");
  }
});

Vue.filter("formatDate", function (value) {
  if (value) {
    let date = "";
    let time = "";
    if (value.includes("T")) {
      let dateraw = value.toString().split("T");
      date = dateraw[0];
      time = dateraw[1];
    } else {
      date = value;
    }

    let d = date.split("-");
    return d[2] + "/" + d[1] + "/" + d[0] + " " + time.split(".")[0];
  }
});

Vue.filter("formatNumber", function (value) {
  if (value) {
    if(!isNaN(value)){
      let d = new Intl.NumberFormat("id-ID").format(value);
      return d;
    }else{
      return 0;
    }

  }
});

Vue.filter("limitText", function (value) {
  if (value) {
    let result = "";
    if (value.length > 30) {
      result = value.toString().substr(0, 30) + "...";
    } else {
      result = value;
    }
    return result;
  }
});

Vue.mixin({
  data: function () {
    return {
      stdNum(value) {
        let reg = new RegExp("\\.", "g");
        let clearDot = value.toString().replaceAll(reg, "");
        let replaceCommatoDot = clearDot.replace(",", ".");
        let clearVal = replaceCommatoDot;
        return parseFloat(clearVal);
      },
      fmNum(value) {
          let reg = new RegExp("\\.", "g");
          let clearDot = value.toString().replace(reg, "");
          let replaceCommatoDot = clearDot.replace(",", ".");
          let clearVal = replaceCommatoDot;
          if(!isNaN(clearVal)){
            let d = new Intl.NumberFormat("id-ID").format(clearVal);
            return d;
          }else{
            return 0;
          }

      },
      isAlpabet(value){
        const result =  /^[a-zA-Z()]+$/.test(value);
        return result;
      }
    };
  },
});

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
