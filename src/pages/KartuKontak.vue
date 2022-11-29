<template>
  <div class="KartuKontak">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-address-card-o" style="color:#313131 !important"></i> Kartu
            Kontak</label>
          <button class="float-right" v-on:click="showModalForm">
            <i class="fa fa-plus"></i> Tambah Kontak
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('namaKontak')">Nama</th>
                  <th class="pointer" v-on:click="sortData('alamatKontak')">Alamat</th>
                  <th class="pointer" v-on:click="sortData('emailKontak')">Email</th>
                  <th class="pointer" v-on:click="sortData('nohpKontak')">Phone</th>
                  <th class="pointer" v-on:click="sortData('tipeKontak')">Tipe</th>
                  <th class="pointer" v-on:click="sortData('DateCreated')">Date Created</th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.namaKontak | limitText }}</td>
                  <td>{{ x.alamatKontak | limitText }}</td>
                  <td>{{ x.emailKontak | limitText }}</td>
                  <td>
                    {{ x.nohpKontak | limitText }}
                  </td>
                  <td>
                    <div v-if="x.tipeKontak == 0" class="badge bg-green ">Suplier</div>
                    <div v-if="x.tipeKontak == 1" class="badge bg-blue ">Customer</div>
                    <div v-if="x.tipeKontak == 2" class="badge bg-purple ">Personal</div>
                  </td>
                  <td>{{ x.dateCreated | formatDate }}</td>
                  <td>
                    <button v-on:click="
                      editData(
                        x.id,
                        x.namaKontak,
                        x.alamatKontak,
                        x.emailKontak,
                        x.nohpKontak,
                        x.tipeKontak,
                        x.deskripsi
                      )
                    ">
                      <i class="fa fa-edit"></i> Edit
                    </button>
                    <button v-on:click="showModalDeleteDialog(x.id)">
                      <i class="fa fa-trash-o"></i> Delete
                    </button>
                    <a class="button-link" target="_blank" :href="`${getlink(x.nohpKontak)}`"><i
                        class="fa fa-whatsapp"></i> WhatsApp</a>
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
            <a v-on:click="prev">
              <i class="fa fa-chevron-left tx-small"></i> Prev</a>
            <a v-for="x in paging" :key="x.index" v-on:click="navData(x.index)"
              v-bind:class="{ active: pagingStatus[x.index] }">{{ x.number }}</a>
            <a v-on:click="next">Next <i class="fa fa-chevron-right tx-small"></i></a>
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
          <div class="modal-header ">Konfirmasi</div>
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
            <span v-if="saveTipe == 0">Tambah Kontak</span>
            <span v-else>Edit Kontak</span>
          </div>
          <div class="modal-body">
            <label>Tipe</label><br />
            <input type="radio" id="suplier" name="radio" value="0" v-model="tipeKontak" /><label
              for="suplier">Suplier</label><br />
            <input type="radio" id="customer" name="radio" value="1" v-model="tipeKontak" /><label
              for="customer">Customer</label><br />
            <input type="radio" id="personal" name="radio" value="2" v-model="tipeKontak" /><label
              for="personal">Personal</label><br /><br />
            <label>Nama Kontak</label><br />
            <input type="text" v-model="namaKontak" /><br />
            <label>Alamat Kontak</label><br />
            <input type="text" v-model="alamatKontak" /><br />
            <label>Email Kontak</label><br />
            <input type="email" v-model="emailKontak" /><br />
            <label>Phone</label><br />
            <input type="phone" v-model="nohpKontak" /><br />
            <label>Deskripsi</label><br />
            <textarea type="text" v-model="deskripsiKontak" style="height:100px"></textarea><br />

          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="simpanData"><i class="fa fa-save"></i> Simpan</button>
            <button type="button" v-on:click="closeModalForm">
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
              <i class="fa fa-close "></i> Tutup
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
      namaKontak: "",
      alamatKontak: "",
      emailKontak: "",
      nohpKontak: "",
      tipeKontak: "",
      deskripsiKontak: "",
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
      this.namaKontak = "";
      this.alamatKontak = "";
      this.emailKontak = "";
      this.nohpKontak = "";
      this.tipeKontak = "";
      this.deskripsiKontak = "";
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
          "kartukontak/getdata/" +
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
          let totalPages = (response.data.totalPages <= 10) ? response.data.totalPages : 10;
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
        this.namaKontak !== "" &&
        this.alamatKontak !== "" &&
        this.emailKontak !== "" &&
        this.phone !== "" &&
        this.deskripsiKontak !== "" &&
        this.tipeKontak !== ""
      ) {
        this.showProgress();
        let postdata = {
          namaKontak: this.namaKontak,
          alamatKontak: this.alamatKontak,
          emailKontak: this.emailKontak,
          nohpKontak: this.nohpKontak,
          deskripsi: this.deskripsiKontak,
          tipeKontak: this.tipeKontak,
          idPengguna: this.$idPengguna,
          idOutlet: this.$idOutlet,
        };
        if (this.saveTipe == 0) {
          this.$axios
            .post(this.$url + "kartukontak/adddata", JSON.stringify(postdata), {
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
            .put(this.$url + "kartukontak/updatedata/" + this.id, JSON.stringify(postdata), {
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
    editData(id, namaKontak, alamatKontak, emailKontak, nohpKontak, tipeKontak, deskripsiKontak) {
      this.id = id;
      this.namaKontak = namaKontak;
      this.alamatKontak = alamatKontak;
      this.emailKontak = emailKontak;
      this.nohpKontak = nohpKontak;
      this.tipeKontak = tipeKontak;
      this.deskripsiKontak = deskripsiKontak;
      this.showModalForm();
      this.saveTipe = 1;
    },
    deleteData() {
      this.showProgress();
      this.$axios.delete(this.$url + "kartukontak/deletedata/" + this.id).then((response) => {
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
          "kartukontak/getdata/" +
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
          "kartukontak/getdata/" +
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
    getlink(link) {
      let filterString = link.substring(1, link.length);
      return "http://wa.me/62" + filterString;
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>