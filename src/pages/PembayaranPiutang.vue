<template>
  <div class="Piutang Piutang">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-edit" style="color:#313131 !important"></i>
            <span>Pembayaran Piutang</span>
          </label>
          <div>
            <button class="float-right" v-on:click="showModalForm">
              <i class="fa fa-plus"></i> Tambah Pembayaran
            </button>
            <button type="button" class="float-right" v-on:click="backToPiutang">
              <i class="fa fa-arrow-left"></i> Kembali
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('kodePembayaran')">
                    Kode Pembayaran
                  </th>
                  <th class="pointer" v-on:click="sortData('tanggal')">
                    Tanggal
                  </th>
                  <th class="pointer" v-on:click="sortData('akunKeuangan.namaAkunKeuangan')">
                    Disimpan Ke
                  </th>
                  <th class="pointer" v-on:click="sortData('deskripsi')">
                    Deskripsi
                  </th>
                  <th class="pointer" v-on:click="sortData('jumlah')">
                    Jumlah
                  </th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.kodePembayaran }}</td>
                  <td>{{ x.tanggal | formatDate }}</td>
                  <td> {{ x.akunKeuangan.namaAkunKeuangan | limitText }}</td>
                  <td>{{ x.deskripsi | limitText }}</td>
                  <td>{{ x.jumlah | formatNumber }}</td>
                  <td>
                    <button v-on:click="
                      editData(
                        x.id,
                        x.tanggal,
                        x.idAkunKeuangan,
                        x.idAkunKeuanganKredit,
                        x.deskripsi,
                        x.jumlah
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
            <button type="button" v-on:click="deleteData"><i class="fa fa-trash"></i> Hapus</button>
            <button type="button" v-on:click="closeModalDeleteDialog">
              <i class="fa fa-close"></i> Batal
            </button>
          </div>
        </div>
      </div>

      <div class="modal" v-if="modalForm == true">
        <div class="modal-content">
          <div class="modal-header">
            <span>Tambah Piutang</span>
          </div>
          <div class="modal-body">
            <label>Tanggal</label><br />
            <input type="date" v-model="tanggal" /><br />

            <label v-if="isAccMode == false">Disimpan Ke</label>
            <label v-if="isAccMode == true">Debit</label>
            <br />
            <select name="" v-model="idAkunKeuangan">
              <option v-for="x in resDataAkunKeuangan.content" :key="x.id" v-bind:value="x.id">
                {{ x.namaAkunKeuangan }}
              </option>
            </select>
            
            <div v-show="isAccMode">
              <label>Kredit</label><br />
              <select name="" v-model="idAkunKeuanganKredit">
                <option v-for="x in resDataAkunKeuangan.content" :key="x.id" v-bind:value="x.id">
                  {{ x.namaAkunKeuangan }}
                </option>
              </select>
              <br />
            </div>

            <label>Deskripsi</label><br />
            <input type="text" v-model="deskripsi" /><br />
            <label>Jumlah</label><br />
            <input type="text" v-model="jumlah" v-on:keyup="formatJumlah" /><br /><br />
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="simpanData"><i class="fa fa-save"></i> Simpan</button>
            <button type="button" v-on:click="closeModalForm">
              <i class="fa fa-close"></i> Batal
            </button>
            <button type="button" class="float-right" v-on:click="changeAccMode">
              <i class="fa fa-toggle-off" v-if="isAccMode == false"></i>
              <i class="fa fa-toggle-on" v-if="isAccMode == true"></i>
              Accounting Mode
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
      modalInfo: false,
      modalInfoText: "",
      modalForm: false,
      modalDeleteDialog: false,
      resData: {},
      resDataKartuKontak: {},
      resDataAkunKeuangan: {},
      tanggal: "",
      tipeCode: 0,
      idKartuKontak: "",
      idAkunKeuangan: this.$settings.akunPembayaranPiutangDebit.id,
      idAkunKeuanganKredit: this.$settings.akunPembayaranPiutangKredit.id,
      deskripsi: "",
      jumlah: "",
      paging: [],
      pageno: 0,
      sortBy: "dateCreated",
      sortType: "desc",
      active: "active",
      saveTipe: 0,
      id: "",
      keyword: "",
      pagingStatus: [],
      dataSize: 500,
      isAccMode: false,
      idPiutang: this.$route.query.idPiutang,
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
      this.tanggal = "";
      this.idKartuKontak = "";
      this.deskripsi = "";
      this.jumlah = "";
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
          "piutang/pembayaran/getdata/" +
          this.$idOutlet +
          "/" + this.idPiutang +
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
          for (let index = 0; index < response.data.totalPages; index++) {
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
    },
    loadDataAkunKeuangan() {
      this.$axios
        .get(this.$url + "akunkeuangan/getdata/" + this.$idOutlet + "?keyword=")
        .then((response) => {
          this.resDataAkunKeuangan = response.data;
        });
    },
    simpanData() {
      if (
        this.tanggal !== "" &&
        this.idAkunKeuangan !== "" &&
        this.idAkunKeuanganKredit !== "" &&
        this.deskripsi !== "" &&
        this.jumlah !== ""
      ) {
        this.showProgress();
        let postdata = {
          tanggal: this.tanggal,
          idAkunKeuangan: this.idAkunKeuangan,
          idAkunKeuanganKredit: this.idAkunKeuanganKredit,
          deskripsi: this.deskripsi,
          jumlah: this.stdNum(this.jumlah),
          idPengguna: this.$idPengguna,
          idOutlet: this.$idOutlet,
          idPiutang: this.idPiutang
        };
        if (this.saveTipe == 0) {
          this.$axios
            .post(this.$url + "piutang/pembayaran/adddata/" + this.$idOutlet, JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log(response);
              this.closeProgress();
              this.modalInfoText = response.data.message;
              this.modalInfo = true;
              this.loadData();
              this.closeModalForm();
            })
            .catch((err) => {
              this.closeProgress();
              console.log(err);
              this.modalInfoText = err;
              this.modalInfo = true;
            });
        } else {
          this.$axios
            .put(this.$url + "piutang/pembayaran/updatedata/" + this.id, JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log(response);
              this.closeProgress();
              this.modalInfoText = response.data.message;
              this.modalInfo = true;
              this.loadData(this.pageno, this.sortBy);
              this.closeModalForm();
            })
            .catch((err) => {
              this.closeProgress();
              console.log(err);
              this.modalInfoText = err;
              this.modalInfo = true;
            });
        }
      } else {
        this.modalInfoText = "Operasi ditolak, inputan tidak boleh kosong";
        this.modalInfo = true;
      }
    },
    editData(id, tanggal, idAkunKeuangan,idAkunKeuanganKredit, deskripsi, jumlah) {
      this.id = id;
      this.tanggal = tanggal;
      this.idAkunKeuangan = idAkunKeuangan;
      this.idAkunKeuanganKredit = idAkunKeuanganKredit;
      this.deskripsi = deskripsi;
      this.jumlah = jumlah;
      this.showModalForm();
      this.saveTipe = 1;
    },
    deleteData() {
      this.showProgress();
      this.$axios.delete(this.$url + "piutang/pembayaran/deletedata/" + this.id).then((response) => {
        this.closeProgress();
        this.closeModalDeleteDialog();
        console.log(response);
        this.loadData();
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
          "piutang/pembayaran/getdata/" +
          this.$idOutlet +
          "/"+ this.idPiutang+
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
          this.closeProgress();
          this.resData = response.data;
          console.log(response);
        });
    },
    navData(pageno) {
      this.showProgress();
      this.pageno = pageno;
      this.pagingStatus = [];
      this.$axios
        .get(
          this.$url +
          "piutang/pembayaran/getdata/" +
          this.$idOutlet +
          "/"+ this.idPiutang+
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
          this.closeProgress();
          this.resData = response.data;
          console.log(response);
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
    changeAccMode() {
      if (this.isAccMode) {
        this.isAccMode = false;
      } else {
        this.isAccMode = true;
      }
    },
    backToPiutang() {
      this.$router.push({
        path: "/piutang",
      });
    }
  },
  mounted() {
    this.loadData();
    this.loadDataAkunKeuangan();
  },
};
</script>
