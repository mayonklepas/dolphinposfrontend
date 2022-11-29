<template>
  <div class="Pengguna">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-money" style="color:#313131 !important"></i> Akun Pengguna</label>
          <button class="float-right" v-on:click="showModalForm">
            <i class="fa fa-plus"></i> Tambah Pengguna
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('namaPengguna')">Nama</th>
                  <th class="pointer" v-on:click="sortData('alamatPengguna')">Alamat</th>
                  <th class="pointer" v-on:click="sortData('emailPengguna')">Email</th>
                  <th class="pointer" v-on:click="sortData('nohpPengguna')">No HP</th>
                  <th class="pointer" v-on:click="sortData('username')">Username</th>
                  <th class="pointer" v-on:click="sortData('password')">Password</th>
                  <th class="pointer" v-on:click="sortData('rules')">Rules</th>
                  <th class="pointer" v-on:click="sortData('DateCreated')">Date Created</th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.namaPengguna | limitText }}</td>
                  <td>{{ x.alamatPengguna | limitText }}</td>
                  <td>{{ x.emailPengguna | limitText }}</td>
                  <td>{{ x.nohpPengguna | limitText }}</td>
                  <td>{{ x.username | limitText }}</td>
                  <td>{{ x.password | limitText }}</td>
                  <td>{{ x.rules | limitText }}</td>
                  <td>{{ x.dateCreated | formatDate }}</td>
                  <td>
                    <button v-on:click="
                        editData(
                          x.id,
                          x.namaPengguna,
                          x.alamatPengguna,
                          x.emailPengguna,
                          x.nohpPengguna,
                          x.username,
                          x.password,
                          x.rules
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
            <span v-if="saveTipe == 0">Tambah Kontak</span>
            <span v-else>Edit Kontak</span>
          </div>
          <div class="modal-body">
            <label>Nama</label><br />
            <input type="text" v-model="namaPengguna" /><br />
            <label>Alamat</label><br />
            <input type="text" v-model="alamatPengguna" /><br />
            <label>Email</label><br />
            <input type="text" v-model="emailPengguna" /><br />
            <label>No.Handphone</label><br />
            <input type="text" v-model="nohpPengguna" /><br />
            <label>Username</label><br />
            <input type="text" v-model="username" /><br />
            <label>Password</label><br />
            <input type="text" v-model="password" /><br />
            <label>Rules</label><br />
            <select name="" v-model="rules">
              <option value="admin">Admin</option>
              <option value="kasir">Kasir</option>
            </select>

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
        namaPengguna: "",
        alamatPengguna: "",
        emailPengguna: "",
        nohpPengguna: "",
        username: "",
        password: "",
        rules: "",
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
        this.id = "";
        this.namaPengguna = "";
        this.alamatPengguna = "";
        this.emailPengguna = "";
        this.nohpPengguna = "";
        this.username = "";
        this.password = "";
        this.rules = "";
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
            "pengguna/getdata/" +
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
          this.namaPengguna !== "" &&
          this.alamatPengguna !== "" &&
          this.emailPengguna !== "" &&
          this.nohpPengguna !== "" &&
          this.username !== "" &&
          this.password !== "" &&
          this.rules !== ""
        ) {
          this.showProgress();
          let postdata = {
            namaPengguna: this.namaPengguna,
            alamatPengguna: this.alamatPengguna,
            emailPengguna: this.emailPengguna,
            nohpPengguna: this.alamatPengguna,
            username: this.username,
            password: this.password,
            rules: this.rules,
            idOutlet: this.$idOutlet,
          };
          if (this.saveTipe == 0) {
            this.$axios
              .post(this.$url + "pengguna/adddata", JSON.stringify(postdata), {
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
              .put(this.$url + "pengguna/updatedata/" + this.id, JSON.stringify(postdata), {
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
              });
          }
        } else {
          this.modalInfoText = "Operasi ditolak, inputan tidak boleh kosong";
          this.modalInfo = true;
        }
      },
      editData(
        id,
        namaPengguna,
        alamatPengguna,
        emailPengguna,
        nohpPengguna,
        username,
        password,
        rules
      ) {
        this.id = id;
        this.namaPengguna = namaPengguna;
        this.alamatPengguna = alamatPengguna;
        this.emailPengguna = emailPengguna;
        this.nohpPengguna = nohpPengguna;
        this.username = username;
        this.password = password;
        this.rules = rules;
        this.showModalForm();
        this.saveTipe = 1;
      },
      deleteData() {
        this.showProgress();
        this.$axios.delete(this.$url + "pengguna/deletedata/" + this.id).then((response) => {
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
            "pengguna/getdata/" +
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
            "pengguna/getdata/" +
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
    },
    mounted() {
      this.loadData();
    },
  };
</script>