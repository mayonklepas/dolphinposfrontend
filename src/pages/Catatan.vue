<template>
  <div class="Catatan">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-edit" style="color:#313131 !important"></i> Transaksi Lain</label>
          <button class="float-right" v-on:click="showModalForm">
            <i class="fa fa-plus"></i> Tambah Transaksi
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('tanggalCatatan')">
                    Tanggal
                  </th>
                  <th class="pointer" v-on:click="sortData('tipeCatatan')">
                    Tipe
                  </th>
                  <th class="pointer" v-on:click="sortData('deskripsi')">
                    Deskripsi
                  </th>
                  <th class="pointer" v-on:click="sortData('jumlah')">
                    Jumlah
                  </th>
                  <th>
                    Akun Keuangan
                  </th>
                  <th class="pointer" v-on:click="sortData('DateCreated')">
                    Date Created
                  </th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.tanggalCatatan | formatDate }}</td>
                  <td>
                    <div class="badge bg-green tx-white" v-if="x.tipeCatatan == 1">Pendapatan</div>
                    <div class="badge bg-red tx-white" v-else>Pengeluaran</div>
                  </td>
                  <td>{{ x.deskripsi | limitText }}</td>
                  <td>{{ x.jumlah | formatNumber }}</td>
                  <td v-if="x.tipeCatatan == 0">{{ x.akunKeuanganDebit.namaAkunKeuangan | limitText }}</td>
                  <td v-else>{{ x.akunKeuanganKredit.namaAkunKeuangan | limitText }}</td>
                  <td>{{ x.dateCreated | formatDate }}</td>
                  <td>
                    <div v-if="x.isPosting == 0 || isSuperAdmin == true">
                      <button v-on:click="
                        editData(
                          x.id,
                          x.tanggalCatatan,
                          x.tipeCatatan,
                          x.idAkunKeuangan,
                          x.deskripsi,
                          x.jumlah
                        )
                      ">
                        <i class="fa fa-edit"></i> Edit
                      </button>
                      <button v-on:click="showModalDeleteDialog(x.id)">
                        <i class="fa fa-trash-o"></i> Delete
                      </button>
                    </div>
                    <div v-else>
                      <div class="badge bg-green tx-white" style="width:120px"><i class="fa fa-check"></i> Terposting
                      </div>
                    </div>
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
            <span v-if="saveTipe == 0">Tambah Transaksi</span>
            <span v-else>Edit Transaksi</span>
          </div>
          <div class="modal-body">
            <label>Tanggal</label><br />
            <input type="date" v-model="tanggalCatatan" /><br />
            <label>Tipe Transaski</label><br />
            <select name="" v-model="tipeCatatan" v-on:change="setTipeTransaksi()">
              <option value="1">Pendapatan</option>
              <option value="2">Pengeluaran</option>
            </select>
            <br />
            <div v-show="tipeCatatan == 1 || isAccMode == true">
              <label v-if="isAccMode">Debit</label>
              <label v-if="isAccMode == false">Disimpan Ke</label>
              <br />
              <select name="" v-model="idAkunKeuanganDebit">
                <option v-for="x in resDataAkunKeuangan" :key="x.id" v-bind:value="x.id">
                  {{ x.namaAkunKeuangan }}
                </option>
              </select>
            </div>
            <div v-show="tipeCatatan == 2 || isAccMode == true">
              <label v-if="isAccMode">Kredit</label>
              <label v-if="isAccMode == false">Diambil Dari</label><br />
              <select name="" v-model="idAkunKeuanganKredit">
                <option v-for="x in resDataAkunKeuangan" :key="x.id" v-bind:value="x.id">
                  {{ x.namaAkunKeuangan }}
                </option>
              </select>
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
      resDataAkunKeuangan: [],
      tanggalCatatan: "",
      tipeCatatan: "",
      idAkunKeuanganDebit: "",
      idAkunKeuanganKredit: "",
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
      dataSize: 100,
      isAccMode: false,
      isSuperAdmin: false
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
      this.tanggalCatatan = "";
      this.tipeCatatan = "";
      this.idAkunKeuanganDebit = "";
      this.idAkunKeuanganKredit = "";
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
          "catatan/getdata/" +
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
          this.closeProgress();
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
          console.log(this.paging);
          console.log(this.pagingStatus);
        });
      this.$set(this.pagingStatus, this.pageno, true);
    },
    loadDataAkunKeuangan() {
      this.$axios
        .get(this.$url + "akunkeuangan/getdataall/" + this.$idOutlet)
        .then((response) => {
          this.resDataAkunKeuangan = response.data;
          console.log(response);
        });
    },
    simpanData() {
      if (
        this.tanggalCatatan !== "" &&
        this.tipeCatatan !== "" &&
        this.idAkunKeuanganDebit !== "" &&
        this.idAkunKeuanganKredit !== "" &&
        this.jumlah !== ""
      ) {
        let postdata = {
          tanggalCatatan: this.tanggalCatatan,
          tipeCatatan: this.tipeCatatan,
          idAkunKeuanganDebit: this.idAkunKeuanganDebit,
          idAkunKeuanganKredit: this.idAkunKeuanganKredit,
          deskripsi: this.deskripsi,
          jumlah: this.stdNum(this.jumlah),
          idPengguna: this.$idPengguna,
          idOutlet: this.$idOutlet,
        };
        if (this.saveTipe == 0) {
          this.showProgress();
          this.$axios
            .post(this.$url + "catatan/adddata", JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              this.closeProgress();
              console.log(response);
              this.modalInfoText = response.data.message;
              this.modalInfo = true;
              this.loadData();
              this.closeModalForm();
            })
            .catch((err) => {
              console.log(err);
              this.modalInfoText = err;
              this.modalInfo = true;
            });
        } else {
          this.showProgress();
          this.$axios
            .put(this.$url + "catatan/updatedata/" + this.id, JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              this.closeProgress();
              console.log(response);
              this.modalInfoText = response.data.message;
              this.modalInfo = true;
              this.loadData(this.pageno, this.sortBy);
              this.closeModalForm();
            })
            .catch((err) => {
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
    editData(id, tanggalCatatan, tipeCatatan, idAkunKeuanganDebit, idAkunKeuanganKredit, deskripsi, jumlah) {
      this.id = id;
      this.tanggalCatatan = tanggalCatatan;
      this.tipeCatatan = tipeCatatan;
      this.idAkunKeuanganDebit = idAkunKeuanganDebit;
      this.idAkunKeuanganKredit = idAkunKeuanganKredit;
      this.deskripsi = deskripsi;
      this.jumlah = jumlah;
      this.showModalForm();
      this.saveTipe = 1;
    },
    deleteData() {
      this.showProgress();
      this.$axios.delete(this.$url + "catatan/deletedata/" + this.id).then((response) => {
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
      this.sortBy = sortBy;
      if (this.sortType == "asc") {
        this.sortType = "desc";
      } else {
        this.sortType = "asc";
      }
      this.loadData();
    },
    navData(pageno) {
      this.pageno = pageno;
      this.pagingStatus = [];
      this.loadData();
    },
    reload() {
      this.keyword = "";
      this.loadData();
    },
    formatJumlah() {
      this.jumlah = this.fmNum(this.jumlah);
    },
    setTipeTransaksi() {
      if (this.tipeCatatan == 1) {
        this.idAkunKeuanganDebit = this.$settings.akunPendapatanLainDebit.id;
        this.idAkunKeuanganKredit = this.$settings.akunPendapatanLainKredit.id;
      } else {
        this.idAkunKeuanganDebit = this.$settings.akunPengeluaranLainDebit.id;
        this.idAkunKeuanganKredit = this.$settings.akunPengeluaranLainKredit.id;
      }
    },
    changeAccMode() {
      if (this.isAccMode) {
        this.isAccMode = false;
      } else {
        this.isAccMode = true;
      }
    }
  },
  mounted() {
    this.loadData();
    this.loadDataAkunKeuangan();
    if (this.$rules == "superadmin") {
      this.isSuperAdmin = true;
    } else {
      this.isSuperAdmin = false;
    }
  },
};
</script>
