<template>
  <div id="home">
    <div class="top-nav bg-purple-blue" style="position: fixed !important;">
      <div class="top-nav-menu">
        <div style="display: inline;position: relative;top: 10px;margin-right:5px;margin-left:5px">
          <!-- <img src="../assets/logoputih.png" style="width:193px;" />-->
        </div>
        <router-link to="/" class="">
          <i class="fa fa-tachometer"></i> Dashboard
        </router-link>
        <div class="top-dropdown" v-if="isAdmin == true">
          <div class="top-dropdown-menu"><i class="fa fa-database"></i> Master Data</div>
          <div class="top-dropdown-content bg-purple-blue">
            <router-link to="/kartukontak">
              <i class="fa fa-address-card-o"></i> Kartu Kontak
            </router-link>
            <router-link to="/barang" >
              <i class="fa fa-archive"></i> Barang / Persedian
            </router-link>

            <router-link to="/racikan" >
              <i class="fa fa-flask"></i> Racikan/Resep
            </router-link>

            <router-link to="/diskon" >
              <i class="fa fa-tags"></i> Diskon
            </router-link>
            <router-link to="/akunkeuangan">
              <i class="fa fa-money"></i> Akun Keuangan
            </router-link>
          </div>
        </div>

        <div class="top-dropdown">
          <div class="top-dropdown-menu"><i class="fa fa-exchange"></i> Transaksi</div>
          <div class="top-dropdown-content bg-purple-blue">
            <router-link to="/pembelian" v-if="isAdmin == true">
              <i class="fa fa-reply"></i> Pembelian
            </router-link>
            <router-link to="/penjualan">
              <i class="fa fa-share"></i> Penjualan
            </router-link>
            <router-link to="/returpembelian" >
              <i class="fa fa-undo"></i> Retur Pembelian
            </router-link>
            <router-link to="/returpenjualan">
              <i class="fa fa-repeat"></i> Retur Penjualan
            </router-link>
            <!--
            <router-link to="/hutangpiutang?tipe=0" class="">
              <i class="fa fa-chevron-left"></i> Hutang</router-link
            >
            <router-link to="/hutangpiutang?tipe=1" class="">
              <i class="fa fa-chevron-right"></i> Piutang</router-link
            >-->
          </div>
        </div>

        <div class="top-dropdown">
          <div class="top-dropdown-menu "><i class="fa fa-table"></i>Akuntansi</div>
          <div class="top-dropdown-content bg-purple-blue">
            <router-link to="/jurnalumum" >
              <i class="fa fa-calendar"></i> Jurnal Umum
            </router-link>
            <a class="pointer" v-on:click="showModalPosting">
              <i class="fa fa-calendar-check-o"></i> Posting Transaksi</a>
            <!--<a class=" pointer" v-on:click="reIndexTahunData">
              <i class="fa fa-indent"></i> ReIndex Data Periode</a>-->
          </div>
        </div>

        <div class="top-dropdown">
          <div class="top-dropdown-menu "><i class="fa fa-tasks"></i> Ekstra</div>
          <div class="top-dropdown-content bg-purple-blue">
            <router-link to="/koreksistok" class="">
              <i class="fa fa-paint-brush"></i> Koreksi Stok
            </router-link>

            <router-link to="/pengguna" class="" v-if="isAdmin == true">
              <i class="fa fa-user-circle"></i> Manajemen Pengguna
            </router-link>

            <router-link to="/pengaturan" class="" v-if="isAdmin == true">
              <i class="fa fa-wrench"></i> Pengaturan Aplikasi
            </router-link>

            <router-link to="/laporan" class="">
              <i class="fa fa-file-o"></i> Laporan
            </router-link>
          </div>
        </div>

        <a href="#" class="" v-on:click="logout"> <i class="fa fa-sign-out"></i> Keluar</a>
      </div>
    </div>
    <div class="top-container" style="margin-top:40px !important;margin-bottom:10px !important">
      <router-view />
    </div>

    <div class="modal" v-if="modalInfo == true" style="z-index:2000">
      <div class="modal-content" style="width: 30%">
        <div class="modal-header">Informasi</div>
        <div class="modal-body">
          <div style="padding: 10px;text-align: center">
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
            <h3 style="text-align: center">
              Yakin ingin melakukan posting ?<br>
              setelah melakukan posting, maka data penjualan terakhir, tidak bisa dihapus, edit ataupun void.
            </h3>
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
          .get(this.$url + "jurnalumum/posting/" + this.$idOutlet + "/" + this.$idPengguna)
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
      }
    },
    mounted() {
      if (this.$rules == "admin" || this.$rules == "superadmin") {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    },
  };
</script>

<style></style>