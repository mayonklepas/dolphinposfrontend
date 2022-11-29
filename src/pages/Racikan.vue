<template>
  <div class="Racikan">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-list-alt" style="color:#313131 !important"></i> Racikan</label>
          <button class="float-right" v-on:click="showModalForm">
            <i class="fa fa-plus"></i> Tambah Racikan
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('kodeResep')">Kode</th>
                  <th class="pointer" v-on:click="sortData('namaResep')">Nama</th>
                  <th class="pointer" v-on:click="sortData('DateCreated')">Date Created</th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.kodeResep">
                  <td>{{ x.kodeResep | limitText }}</td>
                  <td>{{ x.namaResep | limitText }}</td>
                  <td>{{ x.dateCreated | formatDate }}</td>
                  <td>
                    <button v-on:click="editData(x.kodeResep, x.namaResep)">
                      <i class="fa fa-edit"></i> Edit
                    </button>
                    <button v-on:click="showModalDeleteDialog(x.kodeResep)">
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
          <button v-on:click="reload" style="width:100% !important">
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

      <div class="modal" v-if="modalForm == true">
        <div class="modal-content">
          <div class="modal-header">
            <span v-if="saveTipe == 0">Tambah Racikan</span>
            <span v-else>Edit Racikan</span>
          </div>
          <div class="modal-body">
            <label>Kode Resep</label><br />
            <input type="text" v-model="kodeResep" /><br />
            <label>Nama Resep</label><br />
            <input type="text" v-model="namaResep" /><br />
            <button type="button" class="float-right" style="margin-bottom:7px;" v-on:click="tambahBahan">
              <i class="fa fa-plus"></i> Tambah Bahan
            </button>
            <table>
              <thead>
                <tr>
                  <th>Bahan</th>
                  <th>Jumlah</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(y, index) in isiresep" :key="index">
                  <td>
                    <select name="" v-model="y.idBarang" v-on:change="setSatuan(index, $event.target.selectedIndex)">
                      <option v-for="x in resDataBarang.content" :key="x.id" v-bind:value="x.id">{{
                        x.namaBarang
                        }}</option>
                    </select>
                  </td>
                  <td style="text-align:center">
                    <input type="number" v-model="y.jumlahIsi" style="width:100px; !important" />
                    /{{ y.satuanBarang }}
                  </td>
                  <td style="text-align:center">
                    <button type="button" v-on:click="hapusBahan(index)">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="simpanData"><i class="fa fa-save"></i> Simpan</button>
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
        resDataBarang: {},
        resTableBahan: [],
        kodeResep: "",
        namaResep: "",
        isiresep: [],
        paging: [],
        pageno: 0,
        sortBy: "dateCreated",
        sortType: "desc",
        active: "active",
        id: "",
        keyword: "",
        pagingStatus: [],
        dataSize: this.$pageSize,
        incremental: 0,
        saveTipe: 0,
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
        this.kodeResep = "";
        this.namaResep = "";
        this.isiresep = [];
        this.modalForm = false;
      },
      showModalDeleteDialog(kodeResep) {
        this.kodeResep = kodeResep;
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
            "racikan/getdata/" +
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
      loadDataBarang() {
        this.$axios
          .get(this.$url + "barang/getdatabytipe/" + this.$idOutlet + "/0")
          .then((response) => {
            this.resDataBarang = response.data;
            console.log(response);
          });
      },
      simpanData() {
        if (this.kodeResep !== "" && this.namaResep !== "") {
          this.showProgress();
          let postdata = [];
          for (let i = 0; i < this.isiresep.length; i++) {
            postdata.push({
              kodeResep: this.kodeResep,
              namaResep: this.namaResep,
              idBarang: this.isiresep[i].idBarang,
              jumlahIsi: this.isiresep[i].jumlahIsi,
              idPengguna: this.$idPengguna,
              idOutlet: this.$idOutlet,
            });
          }
          this.$axios
            .post(this.$url + "racikan/adddata/" + this.$idOutlet, JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log(response);
              this.loadData();
              this.closeModalForm();
              this.closeProgress();
            });
        } else {
          this.modalInfoText = "Operasi ditolak, inputan tidak boleh kosong";
          this.modalInfo = true;
        }
      },
      editData(kodeResep, namaResep) {
        this.showProgress();
        this.saveTipe = 1;
        this.kodeResep = kodeResep;
        this.namaResep = namaResep;
        this.$axios
          .get(this.$url + "racikan/getdatabykoderesep/" + this.$idOutlet + "/" + this.kodeResep)
          .then((response) => {
            this.isiresep = response.data;
            console.log(response);
            this.closeProgress();
          });
        this.showModalForm();
        this.saveTipe = 1;
      },
      deleteData() {
        this.showProgress();
        this.$axios
          .delete(this.$url + "racikan/deletedata/" + this.$idOutlet + "/" + this.kodeResep)
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
            "racikan/getdata/" +
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
            "racikan/getdata/" +
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
      tambahBahan() {
        this.isiresep.push({
          idBarang: "",
          jumlahIsi: 0,
          satuanBarang: "",
        });
      },
      hapusBahan(index) {
        //let indexrow = this.resTableBahan.map((x) => x.aksi).indexOf(id);
        console.log(index);
        this.isiresep.splice(index, 1);
      },
      setSatuan(index, indexin) {
        this.isiresep[index].satuanBarang = this.resDataBarang.content[indexin].satuanBarang;
      },
    },
    mounted() {
      this.loadData();
      this.loadDataBarang();
    },
  };
</script>