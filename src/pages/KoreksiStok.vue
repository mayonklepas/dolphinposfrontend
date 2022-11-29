<template>
  <div class="KoreksiStok">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-edit" style="color: #313131 !important"></i> Koreksi
            Stok</label>
          <button class="float-right" v-on:click="showModalForm">
            <i class="fa fa-plus"></i> Tambah Koreksi
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('tanggalKoreksi')">
                    Tanggal Koreksi
                  </th>
                  <th class="pointer" v-on:click="sortData('tipeKoreksi')">
                    Tipe
                  </th>
                  <th class="pointer" v-on:click="sortData('barang.namaBarang')">
                    Nama Barang
                  </th>
                  <th class="pointer" v-on:click="sortData('deskripsi')">
                    Deskripsi
                  </th>
                  <th class="pointer" v-on:click="sortData('jumlah')">
                    Jumlah
                  </th>
                  <th class="pointer" v-on:click="sortData('DateCreated')">
                    Date Created
                  </th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.tanggalKoreksi | formatDate }}</td>
                  <td>
                    <span v-if="x.tipeKoreksi == 0">Penambahan</span>
                    <span v-else>Pengurangan</span>
                  </td>
                  <td>{{ x.barang.namaBarang | limitText }}</td>
                  <td>{{ x.deskripsi | limitText }}</td>
                  <td>{{ x.jumlahKoreksi | formatNumber }} {{x.barang.satuanBarang}}</td>
                  <td>{{ x.dateCreated | formatDate }}</td>
                  <td>
                    <button v-on:click="
                      editData(
                        x.id,
                        x.tanggalKoreksi,
                        x.idBarang,
                        x.barang.namaBarang,
                        x.tipeKoreksi,
                        x.jumlahKoreksi,
                        x.deskripsi
                      )
                    ">
                      <i class="fa fa-edit"></i> Edit
                    </button>
                    <button v-on:click="showModalDeleteDialog(x.id)">
                      <i class="fa fa-trash-o"></i> Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-6">
          <div class="pagination">
            <a v-on:click="prev" class=""><i class="fa fa-chevron-left tx-small"></i> Prev</a>
            <a v-for="x in paging" :key="x.index" v-on:click="navData(x.index)"
              v-bind:class="{ active: pagingStatus[x.index] }">{{ x.number }}</a>
            <a v-on:click="next" class="">Next <i class="fa fa-chevron-right tx-small"></i></a>
          </div>
        </div>
        <div class="col-4">
          <input type="text" placeholder="Cari data" v-model="keyword" v-on:keyup.enter="loadData" />
        </div>
        <div class="col-2">
          <button v-on:click="reload" style="width: 100% !important">
            <i class="fa fa-refresh"></i> Reload
          </button>
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
            <button type="button" v-on:click="deleteData">
              <i class="fa fa-trash"></i> Hapus
            </button>
            <button type="button" v-on:click="closeModalDeleteDialog">
              <i class="fa fa-close"></i> Batal
            </button>
          </div>
        </div>
      </div>

      <div class="modal" v-if="modalForm == true">
        <div class="modal-content">
          <div class="modal-header">
            <span v-if="saveTipe == 0">Tambah Koreksi</span>
            <span v-else>Edit Kontak</span>
          </div>
          <div class="modal-body">
            <label>Tanggal</label><br />
            <input type="date" v-model="tanggalKoreksi" /><br />
            <label>Barang</label><br />
            <div class="row">
              <div class="col-10">
                <input type="text" v-model="namaBarang" /><br />
              </div>
              <div class="col-2">
                <button v-on:click="showModalBarang" style="width: 100%">
                  Cari
                </button>
              </div>
            </div>
            <label>Tipe Koreksi</label><br />
            <select name="" v-model="tipeKoreksi">
              <option value="0">Penambahan</option>
              <option value="1">Pengurangan</option>
            </select>
            <br />
            <label>Jumlah Koreksi</label><br />
            <div class="row">
              <div class="col-10">
                <input type="text" v-model="jumlahKoreksi" v-on:keyup="formatJumlah" />
              </div>
              <div class="col-2 " style="align-self: center ;">
                <input type="text" v-model="satuanBarang" disabled />
              </div>
            </div>
            <label>Alasan koreksi</label><br />
            <select name="" v-model="alasan" v-on:change="setAlasan">
              <option v-for="x in alasanKoreksi" :key="x.name" v-bind:value="x.value">
                  {{x.value}}
                </option>
            </select>
            <br>
            <label>Deskripsi</label><br />
            <textarea type="text" v-model="deskripsi" style="height: 100px;"></textarea><br />
            <br />
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="simpanData">
              <i class="fa fa-save"></i> Simpan
            </button>
            <button type="button" v-on:click="closeModalForm">
              <i class="fa fa-close"></i> Batal
            </button>
          </div>
        </div>
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

      <div class="modal" v-if="modalBarang == true">
        <div class="modal-content" style="width: 70%">
          <div class="modal-header">Cari Barang</div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="table-box" style="height: 355px">
                  <table class="table-minimal">
                    <thead>
                      <tr>
                        <th class="pointer" v-on:click="sortData('kodeBarang')">
                          Kode
                        </th>
                        <th class="pointer" v-on:click="sortData('namaBarang')">
                          Nama
                        </th>
                        <th class="pointer" v-on:click="sortData('jumlahBarang')">
                          Stok
                        </th>
                        <th class="pointer" v-on:click="sortData('hargaJual')">
                          Harga
                        </th>
                        <th class="pointer" v-on:click="sortData('keterangan')">
                          Desc
                        </th>
                        <th class="pointer">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="x in resDataBarang.content" :key="x.id">
                        <td>{{ x.kodeBarang | limitText }}</td>
                        <td>{{ x.namaBarang | limitText }}</td>
                        <td>{{ x.jumlahBarang | formatNumber }}</td>
                        <td>{{ x.hargaJual | formatNumber }}</td>
                        <td>{{ x.keterangan }}</td>
                        <td style="width: 100px">
                          <button v-on:click="
                            pilihModalBarang(
                              x.id,
                              x.kodeBarang,
                              x.namaBarang,
                              x.satuanBarang,
                              x.jumlahBarang,
                              x.hargaBeli,
                              x.hargaJual,
                              x.tipeBarang
                            )
                          ">
                            <i class="fa fa-hand-pointer-o"></i> Pilih
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-7">
                <div class="pagination">
                  <a v-on:click="prevDataBarang" class=""><i class="fa fa-chevron-left tx-small"></i> Prev</a>
                  <a v-for="x in pagingDataBarang" :key="x.index" v-on:click="navData(x.index)"
                    v-bind:class="{ active: pagingStatusDataBarang[x.index] }">{{ x.number }}</a>
                  <a v-on:click="nextDataBarang" class="">Next <i class="fa fa-chevron-right tx-small"></i></a>
                </div>
              </div>
              <div class="col-3">
                <input type="text" placeholder="Cari data" v-model="keywordDataBarang"
                  v-on:keyup.enter="loadDataBarang" />
              </div>
              <div class="col-2">
                <button v-on:click="reloadDataBarang" style="width: 100% !important">
                  <i class="fa fa-refresh"></i> Reload
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="closeModalBarang">
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
import configApp from "./../assets/configApp.json";
export default {
  components: {
    pbar,
  },
  data() {
    return {
      modalProgress: false,
      modalInfo: false,
      modalInfoText: "",
      modalBarang: false,
      modalForm: false,
      modalDeleteDialog: false,
      resData: {},
      resDataAkunHolder: {},
      tanggalKoreksi: "",
      idBarang: "",
      namaBarang: "",
      tipeKoreksi: "",
      deskripsi: "",
      jumlahKoreksi: "",
      paging: [],
      pageno: 0,
      sortBy: "dateCreated",
      sortType: "desc",
      active: "active",
      satuanBarang:"",
      saveTipe: 0,
      id: "",
      keyword: "",
      pagingStatus: [],
      dataSize: this.$pageSize,
      //barang
      resDataBarang: {},
      pagingDataBarang: [],
      pagenoDataBarang: 0,
      sortByDataBarang: "namaBarang",
      sortTypeDataBarang: "asc",
      activeDataBarang: "active",
      keywordDataBarang: "",
      pagingStatusDataBarang: [],
      dataSizeDataBarang: this.$pageSize,
      alasanKoreksi: configApp.alasanKoreksi,
      alasan:"",
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
    showModalForm() {
      this.saveTipe = 0;
      this.modalForm = true;
    },
    closeModalForm() {
      this.saveTipe = 0;
      this.tanggalKoreksi = "";
      this.tipeKoreksi = "";
      this.idBarang = "";
      this.namaBarang = "";
      this.deskripsi = "";
      this.jumlahKoreksi = "";
      this.modalForm = false;
    },
    showModalDeleteDialog(id) {
      this.id = id;
      this.modalDeleteDialog = true;
    },
    closeModalDeleteDialog() {
      this.modalDeleteDialog = false;
    },
    showModalBarang() {
      this.loadDataBarang();
      this.modalBarang = true;
    },
    closeModalBarang() {
      this.keywordDataBarang = "";
      this.resDataBarang = {};
      this.modalBarang = false;
    },
    pilihModalBarang(idBarang, kodeBarang, namaBarang, satuanBarang) {
      this.idBarang = idBarang;
      this.namaBarang = namaBarang;
      this.satuanBarang = satuanBarang;
      this.modalBarang = false;
    },
    //barang
    loadDataBarang() {
      this.showProgress();
      this.pagingDataBarang = [];
      this.pagingStatusDataBarang = [];
      this.$axios
        .get(
          this.$url +
          "barang/getdatabykey/" +
          this.$idOutlet +
          "?keyword=" +
          this.keywordDataBarang +
          "&sort=" +
          this.sortByDataBarang +
          "," +
          this.sortTypeDataBarang +
          "&size=" +
          this.dataSizeDataBarang +
          "&page=" +
          this.pagenoDataBarang
        )
        .then((response) => {
          this.resDataBarang = response.data;
          let totalPages =
            response.data.totalPages <= 10 ? response.data.totalPages : 10;
          for (let index = 0; index < totalPages; index++) {
            let data = {
              index: index,
              number: index + 1,
            };
            this.pagingDataBarang.push(data);
            this.pagingStatusDataBarang.push(false);
          }
          this.closeProgress();
        });
      this.$set(this.pagingStatusDataBarang, this.pagenoDataBarang, true);
    },
    nextDataBarang() {
      if (this.pagenoDataBarang < this.pagingDataBarang.length - 1) {
        this.pagenoDataBarang = this.pagenoDataBarang + 1;
        this.navDataBarang(this.pagenoDataBarang);
      }
    },
    prevDataBarang() {
      if (this.pagenoDataBarang > 0) {
        this.pagenoDataBarang = this.pagenoDataBarang - 1;
        this.navDataBarang(this.pagenoDataBarang);
      }
    },
    sortDataBarang(sortByDataBarang) {
      this.showProgress();
      this.sortByDataBarang = sortByDataBarang;
      if (this.sortTypeDataBarang == "asc") {
        this.sortTypeDataBarang = "desc";
      } else {
        this.sortTypeDataBarang = "asc";
      }
      this.$axios
        .get(
          this.$url +
          "barang/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keywordDataBarang +
          "&sort=" +
          this.sortByDataBarang +
          "," +
          this.sortTypeDataBarang +
          "&size=" +
          this.dataSizeDataBarang +
          "&page=" +
          this.pagenoDataBarang
        )
        .then((response) => {
          this.resDataBarang = response.data;
          console.log(response);
          this.closeProgress();
        });
    },
    navDataBarang(pagenoDataBarang) {
      this.showProgress();
      this.pagenoDataBarang = pagenoDataBarang;
      this.pagingStatusDataBarang = [];
      this.$axios
        .get(
          this.$url +
          "barang/getdatabykey/" +
          this.$idOutlet +
          "?keyword=" +
          this.keywordDataBarang +
          "&sort=" +
          this.sortByDataBarang +
          "," +
          this.sortTypeDataBarang +
          "&size=" +
          this.dataSizeDataBarang +
          "&page=" +
          this.pagenoDataBarang
        )
        .then((response) => {
          this.resDataBarang = response.data;
          console.log(response);
          this.closeProgress();
        });
      for (let i = 0; i < this.pagingStatusDataBarang.length; i++) {
        this.pagingStatusDataBarang.push(false);
      }
      this.$set(this.pagingStatuDataBarangs, pagenoDataBarang, true);
    },
    reloadDataBarang() {
      this.keywordDataBarang = "";
      this.loadDataBarang();
    },

    loadData() {
      this.showProgress();
      this.paging = [];
      this.pagingStatus = [];
      this.$axios
        .get(
          this.$url +
          "koreksistok/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keyword +
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
          let totalPages =
            response.data.totalPages <= 10 ? response.data.totalPages : 10;
          for (let index = 0; index < totalPages; index++) {
            let data = {
              index: index,
              number: index + 1,
            };
            this.paging.push(data);
            this.pagingStatus.push(false);
          }
          console.log(this.paging);
          console.log(this.pagingStatus);
          this.closeProgress();
        });
      this.$set(this.pagingStatus, this.pageno, true);
    },
    loadDataAkunHolder() {
      this.$axios
        .get(this.$url + "akunholder/getdata/" + this.$idOutlet + "?keyword=")
        .then((response) => {
          this.resDataAkunHolder = response.data;
          console.log(response);
        });
    },
    simpanData() {
      if (
        this.tanggalKoreksi !== "" &&
        this.tipeKoreksi !== "" &&
        this.idBarang !== "" &&
        this.jumlahKoreksi !== "" &&
        this.deskripsi !== ""
      ) {
        this.showProgress();
        let postdata = {
          tanggalKoreksi: this.tanggalKoreksi,
          idBarang: this.idBarang,
          tipeKoreksi: this.tipeKoreksi,
          jumlahKoreksi: this.stdNum(this.jumlahKoreksi),
          deskripsi: this.deskripsi,
          idPengguna: this.$idPengguna,
          idOutlet: this.$idOutlet,
        };
        if (this.saveTipe == 0) {
          this.$axios
            .post(this.$url + "koreksistok/adddata", JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log(response);
              this.modalInfoText = response.data.message;
              this.modalInfo = true;
              this.loadData();
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
            .put(
              this.$url + "koreksistok/updatedata/" + this.id,
              JSON.stringify(postdata),
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            )
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
      tanggalKoreksi,
      idBarang,
      namaBarang,
      tipeKoreksi,
      jumlahKoreksi,
      deskripsi
    ) {
      this.id = id;
      this.tanggalKoreksi = tanggalKoreksi;
      this.idBarang = idBarang;
      this.namaBarang = namaBarang;
      this.tipeKoreksi = tipeKoreksi;
      this.jumlahKoreksi = jumlahKoreksi;
      this.deskripsi = deskripsi;
      this.showModalForm();
      this.saveTipe = 1;
    },
    deleteData() {
      this.showProgress();
      this.$axios
        .delete(this.$url + "koreksistok/deletedata/" + this.id)
        .then((response) => {
          this.closeModalDeleteDialog();
          console.log(response);
          this.loadData();
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
          "koreksistok/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keyword +
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
          "koreksistok/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keyword +
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
    formatJumlah() {
      this.jumlah = this.fmNum(this.jumlah);
    },
    setAlasan(){
      this.deskripsi = this.alasan;
    }
  },
  mounted() {
    this.loadData();
  },
};
</script>