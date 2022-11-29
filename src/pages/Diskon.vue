<template>
  <div class="Diskon">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-tags" style="color:#313131 !important"></i> Diskon</label>
          <button class="float-right" v-on:click="showModalForm">
            <i class="fa fa-plus"></i> Tambah Diskon
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('namaDiskon')">Nama</th>
                  <th class="pointer" v-on:click="sortData('minimalPembelianSatu')">Min Beli 1</th>
                  <th class="pointer" v-on:click="sortData('nominalDiskonSatu')">Disc 1</th>
                  <th class="pointer" v-on:click="sortData('minimalPembelianDua')">Min Beli 2</th>
                  <th class="pointer" v-on:click="sortData('nominalDiskonDua')">Disc 2</th>
                  <th class="pointer" v-on:click="sortData('tanggalBerlakuHingga')">
                    Berlaku Hingga
                  </th>
                  <th class="pointer" v-on:click="sortData('DateCreated')">Date Created</th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.namaDiskon | limitText }}</td>
                  <td>{{ x.minimalPembelianSatu | formatNumber }}</td>
                  <td>{{ x.nominalDiskonSatu | formatNumber }}</td>
                  <td>{{ x.minimalPembelianDua | formatNumber }}</td>
                  <td>{{ x.nominalDiskonDua | formatNumber }}</td>
                  <td>{{ x.tanggalBerlakuHingga | formatDate }}</td>
                  <td>{{ x.dateCreated | formatDate }}</td>
                  <td>
                    <button v-on:click="
                        editData(
                          x.id,
                          x.namaDiskon,
                          x.minimalPembelianSatu,
                          x.minimalPembelianDua,
                          x.tipeDiskon,
                          x.tanggalBerlakuHingga,
                          x.nominalDiskonSatu,
                          x.nominalDiskonDua
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
            <span v-if="saveTipe == 0">Tambah Diskon</span>
            <span v-else>Edit Diskon</span>
          </div>
          <div class="modal-body">
            <label>Nama Diskon</label><br />
            <input type="text" v-model="namaDiskon" /><br />
            <div class="row">
              <div class="col-6">
                <label>Minimal Beli 1</label><br />
                <input type="text" v-model="minimalPembelianSatu" /><br />
              </div>

              <div class="col-6">
                <label>Disc 1</label><br />
                <input type="text" v-model="nominalDiskonSatu" v-on:keyup="formatNominal1" /><br />
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <label>Minimal Beli 2</label><br />
                <input type="text" v-model="minimalPembelianDua" /><br />
              </div>

              <div class="col-6">
                <label>Disc 2</label><br />
                <input type="text" v-model="nominalDiskonDua" v-on:keyup="formatNominal2" /><br />
              </div>
            </div>

            <!-- <label>Tipe Diskon</label><br />
            <input type="radio" id="satuan" name="radio" value="0" v-model="tipeDiskon" /><label
              for="satuan"
              >Persatuan</label
            ><br />
            <input type="radio" id="total" name="radio" value="1" v-model="tipeDiskon" /><label
              for="total"
              >Pertotal</label
            ><br />-->
            <label>Tanggal Berlaku Hingga</label><br />
            <input type="date" v-model="tanggalBerlakuHingga" /><br />
            <br />
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
        namaDiskon: "",
        minimalPembelianSatu: "",
        minimalPembelianDua: "",
        tipeDiskon: 0,
        tanggalBerlakuHingga: "",
        nominalDiskonSatu: "",
        nominalDiskonDua: "",
        paging: [],
        pageno: 0,
        sortBy: "dateCreated",
        sortType: "desc",
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
        this.namaDiskon = "";
        this.nominalDiskonSatu = "";
        this.nominalDiskonDua = "";
        this.minimalPembelianSatu = "";
        this.minimalPembelianDua = "";
        this.tanggalBerlakuHingga = "";
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
            "diskon/getdata/" +
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
            let totalPages = (response.data.totalPages <= 10)?response.data.totalPages : 10 ;
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
      simpanData() {
        if (
          this.namaDiskon !== "" &&
          this.minimalPembelianSatu !== "" &&
          this.minimalPembelianDua !== "" &&
          this.nominalDiskonSatu !== "" &&
          this.nominalDiskonDua !== "" &&
          this.tanggalBerlakuHingga !== ""
        ) {
          this.showProgress();
          let postdata = {
            namaDiskon: this.namaDiskon,
            minimalPembelianSatu: this.stdNum(this.minimalPembelianSatu),
            minimalPembelianDua: this.stdNum(this.minimalPembelianDua),
            tipeDiskon: 0,
            tanggalBerlakuHingga: this.tanggalBerlakuHingga,
            nominalDiskonSatu: this.stdNum(this.nominalDiskonSatu),
            nominalDiskonDua: this.stdNum(this.nominalDiskonDua),
            idPengguna: this.$idPengguna,
            idOutlet: this.$idOutlet,
          };
          if (this.saveTipe == 0) {
            this.$axios
              .post(this.$url + "diskon/adddata", JSON.stringify(postdata), {
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
              .put(this.$url + "diskon/updatedata/" + this.id, JSON.stringify(postdata), {
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
          }
        } else {
          this.modalInfoText = "Operasi ditolak, inputan tidak boleh kosong";
          this.modalInfo = true;
        }
      },
      editData(
        id,
        namaDiskon,
        minimalPembelianSatu,
        minimalPembelianDua,
        tipeDiskon,
        tanggalBerlakuHingga,
        nominalDiskonSatu,
        nominalDiskonDua
      ) {
        this.id = id;
        this.namaDiskon = namaDiskon;
        this.minimalPembelianSatu = this.stdNum(minimalPembelianSatu);
        this.minimalPembelianDua = this.stdNum(minimalPembelianDua);
        this.tipeDiskon = this.stdNum(tipeDiskon);
        this.tanggalBerlakuHingga = tanggalBerlakuHingga;
        this.nominalDiskonSatu = this.fmNum(nominalDiskonSatu);
        this.nominalDiskonDua = this.fmNum(nominalDiskonDua);
        this.showModalForm();
        this.saveTipe = 1;
      },
      deleteData() {
        this.showProgress();
        this.$axios.delete(this.$url + "diskon/deletedata/" + this.id).then((response) => {
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
            "diskon/getdata/" +
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
            "diskon/getdata/" +
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
      formatNominal1() {
        this.nominalDiskonSatu = this.fmNum(this.nominalDiskonSatu);
      },

      formatNominal2() {
        this.nominalDiskonDua = this.fmNum(this.nominalDiskonDua);
      },
    },
    mounted() {
      this.loadData();
    },
  };
</script>