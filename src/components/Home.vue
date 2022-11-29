<template>
  <div id="home">
    <div class="header-nav bg-white" style="height:50px !important">
      <div class="header-element">
        <div style="text-transform: uppercase;" class="tx-bold tx-large tx-white">
         {{dataLogin.outlet.namaOutlet}}
        </div>
      </div>
      <div style="flex-grow: 1;"></div>
      <div class="header-element">
        <div class="button-dropdown">
          <button type="button" class="button-dropdown-menu" onClick="" style="border:none">
            <i class="fa fa-user-circle"></i>
            {{ dataLogin.namaPengguna }} <i class="fa fa-caret-down"></i>
          </button>
          <div class="button-dropdown-content">
            <a href="#" v-on:click="logout"><i class="fa fa-sign-out"></i> Logout</a>
          </div>
        </div>
      </div>
    </div>
    <div class="side-nav" style="position: fixed !important">
      <div class="side-nav-menu">
        <div style="
            display: inline;
            position: relative;
            top: 10px;
            margin-right: 5px;
            margin-left: 5px;
          ">
          <!-- <img src="../assets/logoputih.png" style="width:193px;" />-->
        </div>
        <router-link to="/" class="">
          <i class="fa fa-tachometer"></i> Dashboard
        </router-link>
        <div class="side-dropdown" v-if="isAdmin == true" v-bind:class="{ 'active-menu': showMaster }">
          <div class="side-dropdown-menu" v-on:click="showMenu('master')">
            <i class="fa fa-database"></i> Master Data
            <span class="float-right" style="margin-top: 1px">
              <i class="fa fa-caret-right tx-white"></i>
            </span>
          </div>
          <div class="side-dropdown-content" v-show="showMaster">
            <router-link to="/kartukontak">
              <i class="fa fa-address-card-o"></i> Kartu Kontak
            </router-link>

            <router-link to="/barang">
              <i class="fa fa-archive"></i> Persedian
            </router-link>

            <router-link to="/racikan">
              <i class="fa fa-flask"></i> Racikan
            </router-link>

            <router-link to="/diskon">
              <i class="fa fa-tags"></i> Diskon
            </router-link>
            <router-link to="/akunkeuangan">
              <i class="fa fa-money"></i> Akun Keuangan
            </router-link>
          </div>
        </div>
        <div class="side-dropdown" v-bind:class="{ 'active-menu': showTransaksi }">
          <div class="side-dropdown-menu" v-on:click="showMenu('transaksi')">
            <i class="fa fa-exchange"></i> Transaksi
            <span class="float-right" style="margin-top: 1px">
              <i class="fa fa-caret-right tx-white"></i>
            </span>
          </div>
          <div class="side-dropdown-content" v-show="showTransaksi">
            <router-link to="/pembelian" v-if="isAdmin == true">
              <i class="fa fa-reply"></i> Pembelian
            </router-link>
            <router-link to="/penjualan">
              <i class="fa fa-share"></i> Penjualan
            </router-link>
            <router-link to="/returpembelian">
              <i class="fa fa-undo"></i> Retur Pembelian
            </router-link>
            <router-link to="/returpenjualan">
              <i class="fa fa-repeat"></i> Retur Penjualan
            </router-link>
            <router-link to="/hutang" class="">
              <i class="fa fa-chevron-right"></i> Hutang
            </router-link>
            <router-link to="/piutang" class="">
              <i class="fa fa-chevron-left"></i> Piutang
            </router-link>
            <router-link to="/catatan">
              <i class="fa fa-arrows"></i> Transaksi Lain
            </router-link>
          </div>
        </div>

        <div class="side-dropdown" v-bind:class="{ 'active-menu': showAkuntansi }">
          <div class="side-dropdown-menu" v-on:click="showMenu('akuntansi')">
            <i class="fa fa-table"></i> Akuntansi
            <span class="float-right" style="margin-top: 1px">
              <i class="fa fa-caret-right tx-white"></i>
            </span>
          </div>
          <div class="side-dropdown-content" v-show="showAkuntansi">
            <router-link to="/jurnalumum">
              <i class="fa fa-calendar"></i> Jurnal Umum
            </router-link>
            <a class="pointer" v-on:click="showModalPosting">
              <i class="fa fa-calendar-check-o"></i> Posting Transaksi</a>
          </div>
        </div>

        <div class="side-dropdown" v-bind:class="{ 'active-menu': showEkstra }">
          <div class="side-dropdown-menu" v-on:click="showMenu('ekstra')">
            <i class="fa fa-tasks"></i> Ekstra
            <span class="float-right" style="margin-top: 1px">
              <i class="fa fa-caret-right tx-white"></i>
            </span>
          </div>
          <div class="side-dropdown-content" v-show="showEkstra">
            <router-link to="/koreksistok" class="">
              <i class="fa fa-paint-brush"></i> Koreksi Stok
            </router-link>

            <router-link to="/pengguna" class="" v-if="isAdmin == true">
              <i class="fa fa-user-circle"></i> Atur Pengguna
            </router-link>

            <router-link to="/pengaturan" class="" v-if="isAdmin == true">
              <i class="fa fa-wrench"></i> Pengaturan Aplikasi
            </router-link>

           <router-link to="/perakitan" class="" v-if="isAdmin == true">
              <i class="fa fa-cogs"></i> Perakitan barang
            </router-link>


          </div>
        </div>

        <router-link to="/laporan" class="">
          <i class="fa fa-file-o"></i> Laporan
        </router-link>

      </div>
    </div>
    <div class="side-nav-container" style="margin-top: 40px !important; margin-bottom: 10px !important">
      <router-view />
    </div>

    <div class="modal" v-if="modalInfo == true" style="z-index: 2000">
      <div class="modal-content" style="width: 30%">
        <div class="modal-header">Informasi</div>
        <div class="modal-body">
          <div style="padding: 10px; text-align: center">
            <span style="">
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

    <div class="modal" v-if="modalPosting == true">
      <div class="modal-content" style="width: 35%">
        <div class="modal-header">Konfirmasi</div>
        <div class="modal-body">
          <div style="padding: 10px">
             <div class="tx-large align-center"> Yakin ingin melakukan posting ? </div><br />
             <div class="tx-semi-large" style="text-align: justify">
              setelah melakukan posting, maka semua data terakhir pada menu transaksi, tidak dapat diubah maupun dihapus.
             </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" v-on:click="postingTransaksi">
            <i class="fa fa-check"></i> Lakukan Posting
          </button>
          <button type="button" v-on:click="closeModalPosting">
            <i class="fa fa-close"></i> Batal
          </button>
        </div>
      </div>
    </div>

    <pbar v-if="modalProgress == true"></pbar>
  </div>
</template>

<script>
import pbar from "./ProgressBar";
export default {
  components: {
    pbar,
  },
  data() {
    return {
      modalPosting: false,
      modalProgress: false,
      isAdmin: true,
      modalInfo: false,
      modalInfoText: "",
      showMaster: false,
      showTransaksi: false,
      showAkuntansi: false,
      showEkstra: false,
      dataLogin: JSON.parse(localStorage.getItem("dataLogin"))
    };
  },
  methods: {
    showProgress() {
      this.modalProgress = true;
    },
    closeProgress() {
      this.modalProgress = false;
    },
    logout() {
      localStorage.removeItem("dataLogin");
      location.replace("/");
    },
    postingTransaksi() {
      this.showProgress();
      this.$axios
        .get(
          this.$url +
          "jurnalumum/posting/" +
          this.$idOutlet +
          "/" +
          this.$idPengguna
        )
        .then((response) => {
          this.showModalInfo(response.data.message);
          this.closeProgress();
          this.closeModalPosting();
        });
    },
    reIndexTahunData() {
      this.showProgress();
      this.$axios
        .get(this.$url + "jurnalumum/reindextahundata/" + this.$idOutlet)
        .then((response) => {
          this.showModalInfo(response.data.message);
          this.closeProgress();
          this.closeModalPosting();
        });
    },
    closeModalInfo() {
      this.modalInfoText = "";
      this.modalInfo = false;
    },
    showModalInfo(message) {
      this.modalInfoText = message;
      this.modalInfo = true;
    },
    showModalPosting() {
      this.modalPosting = true;
    },
    closeModalPosting() {
      this.modalPosting = false;
    },
    showMenu(tipe) {
      if (tipe === "master") {
        if (this.showMaster == true) {
          this.showMaster = false;
        } else {
          this.showMaster = true;
        }
      } else if (tipe === "transaksi") {
        if (this.showTransaksi == true) {
          this.showTransaksi = false;
        } else {
          this.showTransaksi = true;
        }
      } else if (tipe === "akuntansi") {
        if (this.showAkuntansi == true) {
          this.showAkuntansi = false;
        } else {
          this.showAkuntansi = true;
        }
      } else if (tipe === "ekstra") {
        if (this.showEkstra == true) {
          this.showEkstra = false;
        } else {
          this.showEkstra = true;
        }
      }
    },
  },
  mounted() {
    if (this.$rules == "admin" || this.$rules == "superadmin") {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
    console.log(this.dataLogin);
  },
};
</script>

<style>

</style>