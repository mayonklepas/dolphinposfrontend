<template>
  <div class="Barang">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-th-large" style="color:#313131 !important"></i> Barang / Persediaan
          </label>
          <button class="float-right" v-on:click="showModalForm">
            <i class="fa fa-plus"></i> Tambah Barang / Persediaan
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('kodeBarang')">
                    Kode
                  </th>
                  <th class="pointer" v-on:click="sortData('namaBarang')">
                    Nama
                  </th>
                  <th class="pointer" v-on:click="sortData('satuanBarang')">
                    Satuan
                  </th>
                  <th class="pointer" v-on:click="sortData('jumlahBarang')">
                    Jumlah
                  </th>
                  <th class="pointer" v-on:click="sortData('hargaBeli')">
                    Beli
                  </th>
                  <th class="pointer" v-on:click="sortData('hargaJual')">
                    Jual
                  </th>
                  <th class="pointer" v-on:click="sortData('tipeBarang')">
                    Tipe
                  </th>
                  <th class="pointer" v-on:click="sortData('Keterangan')">
                    Desc
                  </th>
                  <th class="pointer" v-on:click="sortData('DateCreated')">
                    Date Created
                  </th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.kodeBarang }}</td>
                  <td>{{ x.namaBarang }}</td>
                  <td>{{ x.satuanBarang }}</td>
                  <td>{{ x.jumlahBarang | formatNumber }}</td>
                  <td>{{ x.hargaBeli | formatNumber }}</td>
                  <td>{{ x.hargaJual | formatNumber }}</td>
                  <td>
                    <div v-if="x.tipeBarang == 0" class="badge bg-red tx-white">Mentah</div>
                    <div v-if="x.tipeBarang == 1" class="badge bg-green tx-white">Jadi</div>
                    <div v-if="x.tipeBarang == 2" class="badge bg-blue tx-white">Racikan</div>
                    <div v-if="x.tipeBarang == 3" class="badge bg-purple tx-white">Jasa</div>
                  </td>
                  <td>{{ x.keterangan | limitText }}</td>
                  <td>{{ x.dateCreated | formatDate }}</td>
                  <td>
                    <button v-on:click="
                      editData(
                        x.id,
                        x.kodeBarang,
                        x.namaBarang,
                        x.satuanBarang,
                        x.jumlahBarang,
                        x.hargaBeli,
                        x.hargaJual,
                        x.tipeBarang,
                        x.kodeResep,
                        x.kodeDiskon,
                        x.keterangan
                      )
                    ">
                      <i class="fa fa-edit"></i> Edit
                    </button>
                    <button v-on:click="showModalDeleteDialog(x.id)">
                      <i class="fa fa-trash-o"></i> Hapus
                    </button>
                    <button v-on:click="showModalGambar(x.kodeBarang)">
                      <i class="fa fa-image"></i> Gambar
                    </button>
                    <button v-on:click="showBarcode(x.kodeBarang)"><i class="fa fa-barcode"></i> Barcode</button>
                    <button v-on:click="showModalPeriode(x.kodeBarang)"><i class="fa fa-file-text"></i> Detail</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-5">
          <div class="pagination">
            <a v-on:click="prev" class="">
              <i class="fa fa-chevron-left tx-small"></i> Prev</a>
            <a v-for="x in paging" :key="x.index" v-on:click="navData(x.index)"
              v-bind:class="{ active: pagingStatus[x.index] }">{{ x.number }}</a>
            <a v-on:click="next" class="">
              Next <i class="fa fa-chevron-right tx-small"></i>
            </a>
          </div>
        </div>
        <div class="col-2">
          <select v-model="filterTipe" v-on:change="loadData">
            <option value="">Semua</option>
            <option value="0">Bahan Mentah</option>
            <option value="1">Barang Jadi</option>
            <option value="2">Barang Racikan</option>
            <option value="3">Jasa</option>
          </select>
        </div>
        <div class="col-3">
          <input type="text" placeholder="Cari data" v-model="keyword" v-on:keyup.enter="loadData" />
        </div>
        <div class="col-2">
          <button v-on:click="reload" style="width:32% !important">
            <i class="fa fa-refresh"></i> Reload
          </button>
          <div class="float-right">
            <div class="tx-small  tx-bold">Total Aset : {{ totalHargaBeli | formatNumber }}</div>
            <div class="tx-small  tx-bold">Total Item : {{ totalBarang | formatNumber }}</div>
          </div>
        </div>
      </div>

      <div class="modal" v-if="modalDeleteDialog == true">
        <div class="modal-content" style="width: 30%">
          <div class="modal-header">Konfirmasi</div>
          <div class="modal-body">
            <div style="padding: 10px">
              <h3 style="text-align: center">
                Yakin ingin menghapus data ini ?
              </h3>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="deleteData"><i class="fa fa-trash"></i> Hapus</button>
            <button type="button" v-on:click="closeModalDeleteDialog">
              <i class="fa fa-close"></i> Batal
            </button>
          </div>
        </div>
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

      <div class="modal" v-if="modalGambar == true">
        <div class="modal-content" style="width: 30%">
          <div class="modal-header">Pasang Gambar</div>
          <div class="modal-body">
            <img :src="linkGambar" alt="" style="height;100%;width:100%;object-fit:cover" />
            <input type="file" ref="file" />
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="uploadImage">
              <i class="fa fa-upload"></i> Upload
            </button>
            <button type="button" v-on:click="closeModalGambar">
              <i class="fa fa-close"></i> Tutup
            </button>
          </div>
        </div>
      </div>

      <div class="modal" v-if="modalForm == true">
        <div class="modal-content">
          <div class="modal-header">
            <span v-if="saveTipe == 0">Tambah Barang / Persediaan</span>
            <span v-else>Edit Kontak</span>
          </div>
          <div class="modal-body">
            <label>Kode</label><br />
            <input type="text" v-model="kodeBarang" /><br />
            <label>Nama</label><br />
            <input type="text" v-model="namaBarang" /><br />
            <label>Satuan</label><br />
            <select name="" v-model="satuanBarang">
              <option value="PCS">PCS</option>
              <option value="PACK">PACK</option>
              <option value="BOX">BOX</option>
              <option value="KG">KG</option>
              <option value="GRAM">GRAM</option>
              <option value="LITER">LITER</option>
              <option value="METER">METER</option>
              <option value="CM">CM</option>
              <option value="ROOM">ROOM</option>
              <option value="CUP">CUP</option>
              <option value="PORSI">PORSI</option>
              <option value="SESI">SESI</option>
              <option value="SET">SET</option>
            </select>
            <label>Tipe</label><br />
            <select name="" v-model="tipeBarang">
              <option value="0">Bahan Mentah</option>
              <option value="1">Barang Jadi</option>
              <option value="2">Barang Racikan</option>
              <option value="3">Jasa</option>
            </select>
            <label v-if="tipeBarang == 2">Resep</label><br />
            <select v-if="tipeBarang == 2" name="" v-model="kodeResep">
              <option value="">Kosong</option>
              <option v-for="x in resDataResep.content" :key="x.kodeResep" v-bind:value="x.kodeResep">{{ x.namaResep
              }}</option>
            </select>

            <label>Jumlah</label><br />
            <input type="text" v-model="jumlahBarang" v-on:keyup="formatJumlah" /><br />
            <label>Harga Beli</label><br />
            <input type="text" v-model="hargaBeli" v-on:keyup="formatBeli" /><br />
            <label>Harga Jual</label><br />
            <input type="text" v-model="hargaJual" v-on:keyup="formatJual" /><br />
            <label>Diskon</label><br />
            <select name="" v-model="kodeDiskon">
              <option value="">Kosong</option>
              <option v-for="x in resDataDiskon.content" :key="x.id" v-bind:value="x.id">{{
                  x.namaDiskon
              }}</option>
            </select>
            <label>Keterangan</label><br />
            <textarea style="height: 100px ;" v-model="keterangan"></textarea><br />
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="simpanData"><i class="fa fa-save"></i> Simpan</button>
            <button type="button" v-on:click="closeModalForm">
              <i class="fa fa-close"></i> Batal
            </button>
          </div>
        </div>
      </div>

      <div class="modal" v-if="isModalPeriode == true" style="z-index: 2000">
        <div class="modal-content" style="width: 30%">
          <div class="modal-header">Pilih Periode Penjualan</div>
          <div class="modal-body">
            <label>Tanggal Dari</label><br />
            <input type="date" v-model="tanggalDari" /><br />
            <label>Tanggal Hingga</label><br />
            <input type="date" v-model="tanggalHingga" /><br />
          </div>
          <div class="modal-footer">
          <button type="button" v-on:click="showDetail">
            <i class="fa fa-print"></i> Generate
          </button>
          <button type="button" v-on:click="closeModalPeriode">
            <i class="fa fa-close"></i> Tutup
          </button>
        </div>
        </div>
      </div>

      <pbar v-if="modalProgress == true"></pbar>
    </div>
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
      modalGambar: false,
      modalInfo: false,
      modalInfoText: "",
      modalForm: false,
      modalDeleteDialog: false,
      resData: {},
      resDataDiskon: {},
      resDataResep: {},
      kodeBarang: "",
      namaBarang: "",
      satuanBarang: "",
      jumlahBarang: "",
      hargaBeli: "",
      hargaJual: "",
      tipeBarang: "",
      kodeDiskon: "",
      kodeResep: "",
      keterangan: "",
      paging: [],
      pageno: 0,
      totalPages: 0,
      sortBy: "dateCreated",
      sortType: "desc",
      active: "active",
      totalHargaBeli: 0,
      totalHargaJual: 0,
      totalBarang: 0,
      saveTipe: 0,
      id: "",
      keyword: "",
      pagingStatus: [],
      dataSize: this.$pageSize,
      linkGambar: "",
      filterTipe: 1,
      isModalPeriode: false,
      tanggalDari: "",
      tanggalHingga: "",
      kodeBarangReport: "",
    };
  },
  methods: {
    showProgress() {
      this.modalProgress = true;
    },
    closeProgress() {
      this.modalProgress = false;
    },
    closeModalInfo() {
      this.modalInfoText = "";
      this.modalInfo = false;
    },
    showModalInfo(message) {
      this.modalInfoText = message;
      this.modalInfo = true;
    },
    closeModalGambar() {
      this.modalGambar = false;
      this.linkGambar = "";
    },
    showModalGambar(kodeBarangParam) {
      this.linkGambar = this.$url + "barang/getimage/" + this.$kodeOutlet + "/" + kodeBarangParam + ".jpg";
      this.kodeBarang = kodeBarangParam;
      this.modalGambar = true;
    },
    showModalForm() {
      this.saveTipe = 0;
      this.modalForm = true;
    },
    closeModalForm() {
      this.saveTipe = 0;
      this.kodeBarang = "";
      this.namaBarang = "";
      this.satuanBarang = "";
      this.jumlahBarang = "";
      this.hargaBeli = "";
      this.hargaJual = "";
      this.kodeDiskon = "";
      this.kodeResep = "";
      this.kodeBarang = "";
      this.tipeBarang = 0;
      this.modalForm = false;
    },
    showModalDeleteDialog(id) {
      this.id = id;
      this.modalDeleteDialog = true;
    },
    closeModalDeleteDialog() {
      this.modalDeleteDialog = false;
    },
    loadData() {
      this.showProgress();
      this.paging = [];
      this.pagingStatus = [];
      this.$axios
        .get(
          this.$url +
          "barang/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keyword +
          "&tipe=" +
          this.filterTipe +
          "&sort=" +
          this.sortBy +
          "," +
          this.sortType +
          "&size=" +
          this.dataSize +
          "&page=" +
          this.pageno
        )
        .then((response) => {
          this.resData = response.data;
          console.log(response);
          let totalPages = (response.data.totalPages <= 10) ? response.data.totalPages : 10;
          for (let index = 0; index < totalPages; index++) {
            let data = {
              index: index,
              number: index + 1,
            };
            this.paging.push(data);
            this.pagingStatus.push(false);
          }
          this.closeProgress();
        });
      this.$set(this.pagingStatus, this.pageno, true);

      this.loadTotalBarang();
    },
    tipeBarangSet() { },
    simpanData() {
      if (
        this.kodeBarang !== "" &&
        this.namaBarang !== "" &&
        this.satuanBarang !== "" &&
        this.tipeBarang !== "" &&
        this.jumlahBarang !== "" &&
        this.hargaBeli !== "" &&
        this.hargaJual !== ""
      ) {
        let postdata = {
          kodeBarang: this.kodeBarang,
          namaBarang: this.namaBarang,
          satuanBarang: this.satuanBarang,
          jumlahBarang: this.stdNum(this.jumlahBarang),
          hargaBeli: this.stdNum(this.hargaBeli),
          hargaJual: this.stdNum(this.hargaJual),
          tipeBarang: this.tipeBarang,
          kodeDiskon: this.kodeDiskon,
          kodeResep: this.kodeResep,
          keterangan: this.keterangan,
          idPengguna: this.$idPengguna,
          idOutlet: this.$idOutlet,
        };
        console.log(postdata);
        this.showProgress();
        if (this.saveTipe == 0) {
          this.$axios
            .post(this.$url + "barang/adddata", JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log(response);
              this.modalInfoText = response.data.message;
              this.modalInfo = true;
              this.loadData(this.pageno, this.sortBy);
              this.closeModalForm();
              this.closeProgress();
            })
            .catch((err) => {
              console.log(err);
              this.modalInfoText = err;
              this.modalInfo = true;
              this.closeProgress();
            });
        } else {
          this.$axios
            .put(this.$url + "barang/updatedata/" + this.id, JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log(response);
              this.modalInfoText = response.data.message;
              this.modalInfo = true;
              this.loadData(this.pageno, this.sortBy);
              this.closeModalForm();
              this.closeProgress();
            })
            .catch((err) => {
              console.log(err);
              this.modalInfoText = err;
              this.modalInfo = true;
              this.closeProgress();
            });
        }
      } else {
        this.modalInfoText = "Operasi ditolak, inputan tidak boleh kosong";
        this.modalInfo = true;
      }
    },
    editData(
      id,
      kodeBarang,
      namaBarang,
      satuanBarang,
      jumlahBarang,
      hargaBeli,
      hargaJual,
      tipeBarang,
      kodeResep,
      disc,
      keterangan
    ) {
      this.id = id;
      this.kodeBarang = kodeBarang;
      this.namaBarang = namaBarang;
      this.satuanBarang = satuanBarang;
      this.jumlahBarang = this.fmNum(jumlahBarang);
      this.hargaBeli = this.fmNum(hargaBeli);
      this.hargaJual = this.fmNum(hargaJual);
      this.tipeBarang = tipeBarang;
      this.kodeDiskon = disc;
      this.kodeResep = kodeResep;
      this.keterangan = keterangan;
      this.showModalForm();
      this.saveTipe = 1;
    },
    deleteData() {
      this.showProgress();
      this.$axios.delete(this.$url + "barang/deletedata/" + this.id).then((response) => {
        this.closeModalDeleteDialog();
        console.log(response);
        this.loadData();
        this.closeProgress();
      });
    },
    uploadImage() {
      this.showProgress();
      this.file = this.$refs.file.files[0];
      let formdata = new FormData();
      formdata.set("nama", this.kodeBarang);
      formdata.append("file", this.file);
      this.$axios
        .post(this.$url + "barang/uploadimage/" + this.$idOutlet, formdata, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
          this.modalInfoText = response.data.message;
          this.modalInfo = true;
          this.loadData(this.pageno, this.sortBy);
          this.closeModalForm();
          this.closeProgress();
        })
        .catch((err) => {
          console.log(err);
          this.modalInfoText = err;
          this.modalInfo = true;
          this.closeProgress();
        });
    },
    next() {
      if (this.pageno < this.paging.length - 1) {
        this.pageno = this.pageno + 1;
        this.navData(this.pageno);
      }
    },
    prev() {
      if (this.pageno > 0) {
        this.pageno = this.pageno - 1;
        this.navData(this.pageno);
      }
    },
    sortData(sortBy) {
      this.showProgress();
      this.sortBy = sortBy;
      if (this.sortType == "asc") {
        this.sortType = "desc";
      } else {
        this.sortType = "asc";
      }
      this.$axios
        .get(
          this.$url +
          "barang/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keyword +
          "&tipe=" +
          this.filterTipe +
          "&sort=" +
          this.sortBy +
          "," +
          this.sortType +
          "&size=" +
          this.dataSize +
          "&page=" +
          this.pageno
        )
        .then((response) => {
          this.resData = response.data;
          console.log(response);
          this.closeProgress();
        });
    },
    navData(pageno) {
      this.showProgress();
      this.pageno = pageno;
      this.pagingStatus = [];
      this.$axios
        .get(
          this.$url +
          "barang/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keyword +
          "&tipe=" +
          this.filterTipe +
          "&sort=" +
          this.sortBy +
          "," +
          this.sortType +
          "&size=" +
          this.dataSize +
          "&page=" +
          this.pageno
        )
        .then((response) => {
          this.resData = response.data;
          console.log(response);
          this.closeProgress();
        });
      for (let i = 0; i < this.pagingStatus.length; i++) {
        this.pagingStatus.push(false);
      }
      this.$set(this.pagingStatus, pageno, true);
    },
    reload() {
      this.keyword = "";
      this.loadData();
    },
    loadDataDiskon() {
      this.$axios
        .get(this.$url + "diskon/getdata/" + this.$idOutlet + "?keyword=")
        .then((response) => {
          this.resDataDiskon = response.data;
          console.log(response);
        });
    },
    loadDataResep() {
      this.$axios
        .get(this.$url + "racikan/getdata/" + this.$idOutlet + "?keyword=")
        .then((response) => {
          this.resDataResep = response.data;
          console.log(response);
        });
    },
    loadTotalBarang() {
      this.$axios.get(this.$url + "barang/getbarangtotal/" + this.$idOutlet + "?tipe=" + this.filterTipe).then((response) => {
        this.totalBarang = response.data.totalBarang;
        this.totalHargaJual = response.data.totalHargaJual;
        this.totalHargaBeli = response.data.totalHargaBeli;
        console.log(response);
      });
    },
    formatBeli() {
      this.hargaBeli = this.fmNum(this.hargaBeli);
    },
    formatJual() {
      this.hargaJual = this.fmNum(this.hargaJual);
    },
    formatJumlah() {
      this.jumlahBarang = this.fmNum(this.jumlahBarang);
    },
    showBarcode(kodeBarang) {
      this.$printjs(
        this.$url + "report/barcodebarang/" + this.$idOutlet + "?kodeBarang=" + kodeBarang
      );
    },
    showModalPeriode(kodeBarang) {
      this.kodeBarangReport = kodeBarang;
      this.isModalPeriode = true;
    },
    closeModalPeriode() {
      this.kodeBarangReport = "";
      this.isModalPeriode = false;
    },
    showDetail() {
      this.$printjs(
        this.$url + "report/barangdetail/" +
        this.$idOutlet +
        "?dari=" +
        this.tanggalDari +
        "&hingga=" +
        this.tanggalHingga +
        "&kodeBarang=" + this.kodeBarangReport +
        "&segment=0");
    }
  },
  mounted() {
    this.loadData();
    this.loadDataDiskon();
    this.loadDataResep();
  },
};
</script>