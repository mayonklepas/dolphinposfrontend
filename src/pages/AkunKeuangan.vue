<template>
  <div class="Akun Keuangan">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-money" style="color: #313131 !important"></i> Akun
            Keuangan</label>
          <div>
            <button class="float-right" v-on:click="showModalForm">
              <i class="fa fa-plus"></i> Tambah Akun
            </button>
            <!--<button class="float-right" v-on:click="generateAccounts">
              <i class="fa fa-check"></i> Generate Default
            </button>-->
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('kodeAkunKeuangan')">
                    Kode
                  </th>
                  <th class="pointer" v-on:click="sortData('namaAkunKeuangan')">
                    Nama
                  </th>
                  <th class="pointer" v-on:click="sortData('openingBalance')">
                    Saldo Awal
                  </th>
                  <th class="pointer" v-on:click="sortData('currentBalance')">
                    Saldo Akhir
                  </th>
                  <th class="pointer" v-on:click="sortData('tipeAkun')">
                    Tipe
                  </th>
                  <th class="pointer" v-on:click="sortData('groupAkun')">
                    Group
                  </th>
                  <th
                    class="pointer"
                    v-on:click="sortData('deskripsiAkunKeuangan')"
                  >
                    Deskripsi
                  </th>
                  <th class="pointer" v-on:click="sortData('DateCreated')">
                    Date Created
                  </th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.kodeAkunKeuangan | limitText }}</td>
                  <td>{{ x.namaAkunKeuangan | limitText }}</td>
                  <td>{{ x.openingBalance | formatNumber }}</td>
                  <td>{{ x.currentBalance | formatNumber }}</td>
                  <td>
                    {{ akunTipeIf(x.tipeAkun) }}
                  </td>
                  <td>
                    {{ akunGroupIf(x.groupAkun) }}
                  </td>
                  <td>{{ x.deskripsiAkunKeuangan | limitText }}</td>
                  <td>{{ x.dateCreated | formatDate }}</td>
                  <td>
                    <button
                      v-on:click="
                        editData(
                          x.id,
                          x.kodeAkunKeuangan,
                          x.namaAkunKeuangan,
                          x.openingBalance,
                          x.currentBalance,
                          x.tipeAkun,
                          x.groupAkun,
                          x.deskripsiAkunKeuangan
                        )
                      "
                    >
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
            <a v-on:click="prev"
              ><i class="fa fa-chevron-left tx-small"></i> Prev</a
            >
            <a
              v-for="x in paging"
              :key="x.index"
              v-on:click="navData(x.index)"
              v-bind:class="{ active: pagingStatus[x.index] }"
              >{{ x.number }}</a
            >
            <a v-on:click="next">
              Next <i class="fa fa-chevron-right tx-small"></i
            ></a>
          </div>
        </div>
        <div class="col-4">
          <input
            type="text"
            placeholder="Cari data"
            v-model="keyword"
            v-on:keyup.enter="loadData"
          />
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

      <div class="modal" v-if="modalForm == true">
        <div class="modal-content">
          <div class="modal-header">
            <span v-if="saveTipe == 0">Tambah Akun Keuangan</span>
            <span v-else>Edit Akun Keuangan</span>
          </div>
          <div class="modal-body">
            <label>Kode Akun Keuangan</label><br />
            <input type="text" v-model="kodeAkunKeuangan" /><br />
            <label>Nama Akun Keuangan</label><br />
            <input type="text" v-model="namaAkunKeuangan" /><br />
            <label>Opening Balance</label><br />
            <input
              type="text"
              v-model="openingBalance"
              v-on:keyup="formatOpbal"
            /><br />
            <label>Current Balance</label><br />
            <input
              type="text"
              v-model="currentBalance"
              v-on:keyup="formatCurbal"
            /><br />
            <label>Tipe Akun</label><br />
            <select name="" v-model="tipeAkun">
              <option value="1">KAS</option>
              <option value="2">BANK</option>
              <option value="3">LAINNYA</option>
            </select>
            <br />
            <label>Group Akun</label><br />
            <select name="" v-model="groupAkun">
              <option value="1">Aset</option>
              <option value="2">Pendapatan</option>
              <option value="3">Kewajiban</option>
              <option value="4">Beban</option>
            </select>
            <br />
            <label>Deskripsi</label><br />
            <input type="text" v-model="deskripsiAkunKeuangan" /><br /><br />
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
      kodeAkunKeuangan: "",
      namaAkunKeuangan: "",
      openingBalance: 0,
      currentBalance: 0,
      tipeAkun: 0,
      groupAkun: 0,
      deskripsiAkunKeuangan: "",
      paging: [],
      pageno: 0,
      sortBy: "kodeAkunKeuangan",
      sortType: "asc",
      active: "active",
      saveTipe: 0,
      id: "",
      keyword: "",
      pagingStatus: [],
      dataSize: this.$pageSize,
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
      this.kodeAkunKeuangan = "";
      this.namaAkunKeuangan = "";
      this.deskripsiAkunKeuangan = "";
      this.openingBalance = 0;
      this.currentBalance = 0;
      this.groupAkun = "";
      this.tipeAkun = 0;
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
            "akunkeuangan/getdata/" +
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
          this.closeProgress();
        });
      this.$set(this.pagingStatus, this.pageno, true);
    },
    simpanData() {
      if (
        this.namaAkunKeuangan !== "" &&
        this.deskripsiAkunKeuangan !== "" &&
        this.kodeAkunKeuangan !== "" &&
        this.tipeAkun !== "" &&
        this.groupAkun !== "" &&
        this.openingBalance !== "" &&
        this.currentBalance !== ""
      ) {
        this.showProgress();
        let postdata = {
          kodeAkunKeuangan: this.kodeAkunKeuangan,
          namaAkunKeuangan: this.namaAkunKeuangan,
          openingBalance: this.openingBalance,
          currentBalance: this.currentBalance,
          tipeAkun: this.tipeAkun,
          groupAkun: this.groupAkun,
          deskripsiAkunKeuangan: this.deskripsiAkunKeuangan,
          idPengguna: this.$idPengguna,
          idOutlet: this.$idOutlet,
        };
        if (this.saveTipe == 0) {
          this.$axios
            .post(
              this.$url + "akunkeuangan/adddata",
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
        } else {
          this.$axios
            .put(
              this.$url + "akunkeuangan/updatedata/" + this.id,
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
      kodeAkunKeuangan,
      namaAkunKeuangan,
      openingBalance,
      currentBalance,
      tipeAkun,
      groupAkun,
      deskripsiAkunKeuangan
    ) {
      this.id = id;
      this.kodeAkunKeuangan = kodeAkunKeuangan;
      this.namaAkunKeuangan = namaAkunKeuangan;
      this.openingBalance = openingBalance;
      this.currentBalance = currentBalance;
      this.tipeAkun = tipeAkun;
      this.groupAkun = groupAkun;
      this.deskripsiAkunKeuangan = deskripsiAkunKeuangan;
      this.showModalForm();
      this.saveTipe = 1;
    },
    deleteData() {
      this.showProgress();
      this.$axios
        .delete(this.$url + "akunkeuangan/deletedata/" + this.id)
        .then((response) => {
          this.closeModalDeleteDialog();
          console.log(response);
          this.loadData(this.pageno, this.sortBy);
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
            "akunkeuangan/getdata/" +
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
            "akunkeuangan/getdata/" +
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
    formatOpbal() {
      this.openingBalance = this.fmNum(this.openingBalance);
    },
    formatCurbal() {
      this.currentBalance = this.fmNum(this.currentBalance);
    },
    akunGroupIf(tipe) {
      let tipeNama = "";
      if (tipe == 1) {
        tipeNama = "Aset";
      } else if (tipe == 2) {
        tipeNama = "Pendapatan";
      } else if (tipe == 3) {
        tipeNama = "Kewajiban";
      } else if (tipe == 4) {
        tipeNama = "Beban";
      }
      return tipeNama;
    },
    akunTipeIf(tipe) {
      let tipeNama = "";
      if (tipe == 1) {
        tipeNama = "KAS";
      } else if (tipe == 2) {
        tipeNama = "BANK";
      } else if (tipe == 3) {
        tipeNama = "LAINNYA";
      }
      return tipeNama;
    },
    generateAccounts() {
      this.showProgress();
      this.$axios
        .get(
          this.$url +
            "akunkeuangan/generatedefault/" +
            this.$idOutlet +
            "/" +
            this.$idPengguna
        )
        .then((response) => {
          console.log(response);
          if (response.data.code == 1) {
            this.showModalInfo(response.data.message);
          }
          this.loadData(this.pageno, this.sortBy);
          this.closeProgress();
        });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>