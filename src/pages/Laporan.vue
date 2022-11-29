<template>
  <div class="Laporan">
    <div class="container">
      <div class="row">
        <div class="col-12" style="padding: 0;">
          <div class="top-nav-inner">
            <div class="top-nav-menu">
              <div class="top-dropdown">
                <div class="top-dropdown-menu">
                  <i class="fa fa-list"></i> Master Data
                  <span class="float-right" style="margin-left: 10px">
                    <i class="fa fa-caret-down tx-white"></i>
                  </span>
                </div>
                <div class="top-dropdown-content">
                  <a v-on:click="generateSuplier" class="pointer"><i class="fa fa-file-o"></i> Data Suplier</a>
                  <a v-on:click="generateCustomer" class="pointer"><i class="fa fa-file-o"></i> Customer</a>
                  <a v-on:click="generatePersonal" class="pointer"><i class="fa fa-file-o"></i> Personal</a>
                  <a v-on:click="generateStok" class="pointer"><i class="fa fa-file-o"></i> Stok Barang</a>
                  <a v-on:click="showModalPeriode('laporan-stok-detail-summary-penjualan')" class="pointer"><i
                      class="fa fa-file-o"></i> Stok Barang Detail Dengan Summary Penjualan</a>
                  <a v-on:click="generateBarcode" class="pointer"><i class="fa fa-file-o"></i> Barcode Barang</a>
                </div>
              </div>

              <div class="top-dropdown">
                <div class="top-dropdown-menu">
                  <i class="fa fa-list"></i> Transaksi
                  <span class="float-right" style="margin-left: 10px">
                    <i class="fa fa-caret-down tx-white"></i>
                  </span>
                </div>
                <div class="top-dropdown-content">
                  <a v-on:click="showModalPeriode('laporan-penjualan')" class="pointer"><i class="fa fa-file-o"></i>
                    Penjualan</a>
                  <a v-on:click="showModalPeriode('laporan-penjualan-detail')" class="pointer"><i
                      class="fa fa-file-o"></i> Penjualan Detail</a>
                  <a v-on:click="showModalPeriode('laporan-penjualan-detail-dengan-refrensi-pengeluaran')" class="pointer"><i
                      class="fa fa-file-o"></i> Penjualan Detail Dengan Refrensi Pengeluaran</a>
                  <a v-on:click="showModalPeriode('laporan-penjualan-detail-perkontak')" class="pointer"><i
                      class="fa fa-file-o"></i> Penjualan Detail Perkontak</a>
                  <a v-on:click="showModalPeriode('laporan-margin')" class="pointer"><i class="fa fa-file-o"></i>
                    Penjualan
                    Per Group Barang</a>
                  <a v-on:click="showModalPeriode('laporan-pembelian')" class="pointer"><i class="fa fa-file-o"></i>
                    Pembelian</a>
                  <a v-on:click="showModalPeriode('laporan-pembelian-detail')" class="pointer"><i
                      class="fa fa-file-o"></i> Pembelian Detail</a>
                  <a v-on:click="showModalPeriode('laporan-pembelian-detail-perkontak')" class="pointer"><i
                      class="fa fa-file-o"></i> Pembelian Detail Perkontak</a>
                  <a v-on:click="showModalPeriode('laporan-catatan')" class="pointer"><i class="fa fa-file-o"></i>
                    Transaksi Lain</a>
                </div>
              </div>

              <div class="top-dropdown">
                <div class="top-dropdown-menu">
                  <i class="fa fa-list"></i> Akuntansi
                  <span class="float-right" style="margin-left: 10px">
                    <i class="fa fa-caret-down tx-white"></i>
                  </span>
                </div>
                <div class="top-dropdown-content">
                  <a v-on:click="showModalReindexDialog" class="pointer"><i class="fa fa-file-o"></i>
                    Reindex Data</a>
                  <a v-on:click="showModalPeriode('laporan-buku-besar')" class="pointer"><i class="fa fa-file-o"></i>
                    Buku Besar</a>
                  <a v-on:click="showModalPeriode('laporan-neraca-saldo')" class="pointer"><i class="fa fa-file-o"></i>
                    Neraca Saldo</a>
                  <a v-on:click="showModalPeriode('laporan-neraca')" class="pointer"><i class="fa fa-file-o"></i>
                    Neraca</a>
                  <a v-on:click="showModalPeriode('laporan-laba-rugi')" class="pointer"><i class="fa fa-file-o"></i>
                    Laba Rugi</a>
                </div>
              </div>

              <a v-on:click="showModalPeriode('laporan-koreksi-stok')" class="pointer"><i class="fa fa-file-o"></i>
                Koreksi Stok</a>
            </div>
          </div>
        </div>
      </div>
      <iframe :src="urlReport" frameborder="0" class="container"
        style="margin-top:10px;height: 75vh; box-shadow: 0px 0px 0px 1px rgba(36, 36, 36, 0.3)"></iframe>
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

    <div class="modal" v-if="isPeriode == true" style="z-index: 2000">
      <div class="modal-content" style="width: 30%">
        <div class="modal-header">Pilih Periode Laporan</div>
        <div class="modal-body">
          <label>Tanggal Dari</label><br />
          <input type="date" v-model="tanggalDari" /><br />
          <label>Tanggal Hingga</label><br />
          <input type="date" v-model="tanggalHingga" /><br />
          <div v-if="isKontakShow">
            <label>Kontak</label><br />
            <select name="" v-model="idKartuKontak">
              <option v-for="x in resDataKartuKontak.content" :key="x.id" v-bind:value="x.id">
                {{ x.namaKontak }}
              </option>
            </select>
          </div>

          <div v-if="isTipeCatatanShow">
            <label>Tipe Transaksi</label><br />
            <select name="" v-model="tipeCatatan">
              <option value="1">
                Pendapatan
              </option>
              <option value="2">
                Pengeluaran
              </option>
            </select>
          </div>

          <div v-if="isAkunShow">
            <label>Akun</label><br />
            <select name="" v-model="idAkunKeuangan">
              <option value="">Semua</option>
              <option v-for="x in resDataAkunKeuangan" :key="x.id" v-bind:value="x.id">
                {{ x.namaAkunKeuangan }}
              </option>
            </select>
          </div>

          <div v-if="isSegmentShow">
            <label>Segment</label><br />
            <select name="" v-model="segment">
              <option value="0">Semua Barang</option>
              <option value="1">Hanya Barang Terjual</option>
            </select>
          </div>

        </div>
        <div class="modal-footer">
          <button type="button" v-on:click="generateLaporan">
            <i class="fa fa-print"></i> Generate
          </button>
          <button type="button" v-on:click="closeModalPeriode">
            <i class="fa fa-close"></i> Tutup
          </button>
        </div>
      </div>
    </div>

    <div class="modal" v-if="modalReindex == true">
      <div class="modal-content" style="width: 35%">
        <div class="modal-header">Konfirmasi</div>
        <div class="modal-body">
          <div style="padding: 10px">
            <h3 style="text-align: center">
              Laporan Akuntansi memerlukan reindex data
            </h3>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" v-on:click="reindexData">
            <i class="fa fa-indent"></i> Lakukan Reindex
          </button>
          <button type="button" v-on:click="closeModalReindexDialog">
            <i class="fa fa-close"></i> Batal
          </button>
        </div>
      </div>
    </div>

    <pbar v-if="modalProgress == true"></pbar>
  </div>
</template>
<script>
import pbar from "./../components/ProgressBar";
export default {
  components: {
    pbar,
  },
  data() {
    return {
      modalProgress: false,
      urlReport: "",
      modalInfo: false,
      modalInfoText: "",
      modalReindex: false,
      tipeLaporan: "",
      tanggalDari: "",
      tanggalHingga: "",
      isPeriode: false,
      resDataKartuKontak: {},
      isKontakShow: false,
      idKartuKontak: "",
      tipeCatatan: 2,
      isTipeCatatanShow: false,
      isAkunShow: false,
      resDataAkunKeuangan: [],
      idAkunKeuangan: "",
      segment: 0,
      isSegmentShow: false,
    };
  },
  methods: {
    showProgress() {
      this.modalProgress = true;
    },
    closeProgress() {
      this.modalProgress = false;
    },
    closeModalReindexDialog() {
      this.modalReindex = false;
    },
    showModalReindexDialog() {
      this.modalReindex = true;
    },
    closeModalInfo() {
      this.modalInfoText = "";
      this.modalInfo = false;
    },
    showModalInfo(message) {
      this.modalInfoText = message;
      this.modalInfo = true;
    },
    closeModalPeriode() {
      this.isPeriode = false;
    },
    showModalPeriode(tipe) {
      this.isPeriode = true;
      this.tipeLaporan = tipe;
      if (this.tipeLaporan == "laporan-penjualan-detail-perkontak") {
        this.isKontakShow = true;
        this.$axios
          .get(this.$url + "kartukontak/getdatabytipe/" + this.$idOutlet + "/1")
          .then((response) => {
            this.resDataKartuKontak = response.data;
            console.log(response);
          });
      } else if (this.tipeLaporan == "laporan-pembelian-detail-perkontak") {
        this.isKontakShow = true;
        this.$axios
          .get(this.$url + "kartukontak/getdatabytipe/" + this.$idOutlet + "/0")
          .then((response) => {
            this.resDataKartuKontak = response.data;
            console.log(response);
          });
      } else {
        this.isKontakShow = false;
      }

      if (this.tipeLaporan == "laporan-catatan") {
        this.isTipeCatatanShow = true;
      } else {
        this.isTipeCatatanShow = false;
      }

      if (this.tipeLaporan == "laporan-buku-besar" ||
        this.tipeLaporan == "laporan-penjualan" ||
        this.tipeLaporan == "laporan-penjualan-detail" ||
        this.tipeLaporan == "laporan-penjualan-detail-dengan-refrensi-pengeluaran" ||
        this.tipeLaporan == "laporan-pembelian" ||
        this.tipeLaporan == "laporan-pembelian-detail") {
        this.isAkunShow = true;
      } else {
        this.isAkunShow = false;
      }
      if (this.tipeLaporan == "laporan-stok-detail-summary-penjualan") {
        this.isSegmentShow = true;
      } else {
        this.isSegmentShow = false;
      }


    },
    generateSuplier() {
      let urlReport = this.$url + "report/kartukontak/" + this.$idOutlet + "/0";
      this.requestBlob(urlReport);
    },
    generateCustomer() {
      let urlReport = this.$url + "report/kartukontak/" + this.$idOutlet + "/1";
      this.requestBlob(urlReport);
    },
    generatePersonal() {
      let urlReport = this.$url + "report/kartukontak/" + this.$idOutlet + "/2";
      this.requestBlob(urlReport);
    },
    generateStok() {
      let urlReport = this.$url + "report/barang/" + this.$idOutlet;
      this.requestBlob(urlReport);
    },
    generateStokDetail() {
      let urlReport = this.$url + "report/barangdetail/" + this.$idOutlet;
      this.requestBlob(urlReport);
    },
    generateBarcode() {
      let urlReport = this.$url + "report/barcodebarang/" + this.$idOutlet + "?kodeBarang=";
      this.requestBlob(urlReport);
    },
    generateLaporan() {
      let prefix = "";
      if (this.isPeriode == true) {
        if (this.tanggalDari !== "" && this.tanggalHingga !== "") {
          switch (this.tipeLaporan) {
            case "laporan-stok-detail-summary-penjualan":
              prefix = "barangdetail/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga +
                "&kodeBarang=" +
                "&segment=" + this.segment;
              break;
            case "laporan-penjualan":
              prefix =
                "penjualan/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga +
                "&idAkunKeuangan=" +
                this.idAkunKeuangan;
              break;
            case "laporan-penjualan-detail":
              prefix =
                "penjualan-detail/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga +
                "&idAkunKeuangan=" +
                this.idAkunKeuangan;
              break;
              case "laporan-penjualan-detail-dengan-refrensi-pengeluaran":
              prefix =
                "penjualan-detail-dengan-refrensi-pengeluaran/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga +
                "&idAkunKeuangan=" +
                this.idAkunKeuangan;
              break;
            case "laporan-penjualan-detail-perkontak":
              prefix =
                "penjualan-detail-perkontak/" +
                this.$idOutlet +
                "/" + this.idKartuKontak +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga;
              break;
            case "laporan-margin":
              prefix =
                "penjualan-margin/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga;
              break;
            case "laporan-pembelian":
              prefix =
                "pembelian/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga +
                "&idAkunKeuangan=" +
                this.idAkunKeuangan;
              break;
            case "laporan-pembelian-detail":
              prefix =
                "pembelian-detail/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga +
                "&idAkunKeuangan=" +
                this.idAkunKeuangan;
              break;
            case "laporan-pembelian-detail-perkontak":
              prefix =
                "pembelian-detail-perkontak/" +
                this.$idOutlet +
                "/" + this.idKartuKontak +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga;
              break;
            case "laporan-catatan":
              prefix =
                "catatanbytipe/" +
                this.$idOutlet +
                "/" + this.tipeCatatan +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga;
              break;
            case "laporan-buku-besar":
              prefix =
                "bukubesar/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga +
                "&id=" + this.idAkunKeuangan;
              break;
            case "laporan-neraca-saldo":
              prefix =
                "neraca-saldo/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga;
              break;
            case "laporan-neraca":
              prefix =
                "neraca/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga;
              break;
            case "laporan-laba-rugi":
              prefix =
                "laba-rugi/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga;
              break;
            case "laporan-koreksi-stok":
              prefix =
                "koreksi-stok/" +
                this.$idOutlet +
                "?dari=" +
                this.tanggalDari +
                "&hingga=" +
                this.tanggalHingga;
              break;
          }
          this.closeModalPeriode();
          let urlReport = this.$url + "report/" + prefix;
          this.requestBlob(urlReport);
        } else {
          this.showModalInfo("Tanggal tidak boleh kosong");
        }
      }
    },
    reindexData() {
      this.showProgress();
      this.$axios
        .get(this.$url + "jurnalumum/reindextahundata/" + this.$idOutlet)
        .then((response) => {
          this.showModalInfo(response.data.message);
          this.closeProgress();
          this.closeModalReindexDialog();
        });
    },
    requestBlob(url) {
      this.showProgress();
      this.$axios.get(url, { responseType: "blob" }).then((response) => {
        let urlObject = URL.createObjectURL(response.data);
        document.querySelector("iframe").setAttribute("src", urlObject);
        this.urlReport = urlObject;
        this.closeProgress();

      });
    },
    loadDataKartuKontak() {
      this.$axios
        .get(this.$url + "kartukontak/getdatabytipe/" + this.$idOutlet + "/1")
        .then((response) => {
          this.resDataKartuKontak = response.data;
        });
    },
    loadDataAkunKeuangan() {
      this.$axios
        .get(this.$url + "akunkeuangan/getdataall/" + this.$idOutlet)
        .then((response) => {
          this.resDataAkunKeuangan = response.data;
          console.log(response);
        });
    },
  },
  mounted() {
    let cdate = new Date();
    let curbulan = this.$settings.periodeAkuntansi.split("-")[0];
    let dateString = cdate.getFullYear() + "-" + curbulan + "-02";
    let ddate = new Date(dateString);
    this.tanggalDari = ddate.toISOString().slice(0, 10);
    let hdate = new Date();
    this.tanggalHingga = hdate.toISOString().slice(0, 10);
    this.loadDataAkunKeuangan();
  },
};
</script>