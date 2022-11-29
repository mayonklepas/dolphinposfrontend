<template>
  <div class="Penjualan">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-shopping-cart" style="color:#313131 !important"></i> Penjualan</label>
          <button class="float-right" v-on:click="addData">
            <i class="fa fa-plus"></i> Tambah Penjualan
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('kodePenjualanMaster')">Kode</th>
                  <th class="pointer" v-on:click="sortData('tanggalPenjualan')">Tanggal</th>
                  <th class="pointer" v-on:click="sortData('status')">Status</th>
                  <th class="pointer" v-on:click="sortData('deskripsi')">Deskripsi</th>
                  <th class="pointer" v-on:click="sortData('penjualanDetail')">Total</th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.kodePenjualanMaster }}</td>
                  <td>{{ x.tanggalPenjualan | formatDate }}</td>
                  <td>
                    <div v-if="x.status == 1" class="badge bg-red tx-white">Pending</div>
                    <div v-if="x.status == 2" class="badge bg-orange tx-white">Edited</div>
                    <div v-if="x.status == 3" class="badge bg-green tx-white">Completed</div>
                    <div v-if="x.status == 4" class="badge bg-blue tx-white">Void</div>
                  </td>
                  <td>{{ x.deskripsi | limitText }}</td>
                  <td>
                    <!--{{ penjualanDetailTotal(x.penjualanDetail, x.disc, x.tax) | formatNumber }}-->
                    {{ x.totalBelanja | formatNumber }}
                  </td>
                  <td>
                    <div v-if="x.isPosting == 0 || isSuperAdmin == true">
                      <button v-on:click="editData(x.id)"><i class="fa fa-edit"></i> Edit</button>
                      <button v-on:click="showModalDeleteDialog(x.id)">
                        <i class="fa fa-trash-o"></i> Delete
                      </button>
                      <button v-on:click="showModalVoidDialog(x.id)">
                        <i class="fa fa-ban"></i> Void
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
            <a v-on:click="prev" class=""><i class="fa fa-chevron-left "></i> Prev</a>
            <a v-for="x in paging" :key="x.index" v-on:click="navData(x.index)"
              v-bind:class="{ active: pagingStatus[x.index] }">{{ x.number }}</a>
            <a v-on:click="next" class="">Next <i class="fa fa-chevron-right "></i></a>
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

      <div class="modal" v-if="modalVoidDialog == true">
        <div class="modal-content" style="width: 35%">
          <div class="modal-header">Konfirmasi</div>
          <div class="modal-body">
            <div style="padding: 10px">
              <h3 style="text-align: center">
                Yakin ingin melakukan void untuk data ini ?
              </h3>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="voidData"><i class="fa fa-ban"></i> Ya</button>
            <button type="button" v-on:click="closeModalVoidDialog">
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
      modalForm: false,
      modalDeleteDialog: false,
      modalVoidDialog: false,
      resData: {},
      paging: [],
      pageno: 0,
      sortBy: "dateCreated",
      sortType: "desc",
      active: "active",
      saveTipe: 0,
      id: "",
      keyword: "",
      pagingStatus: [],
      dataSize: 200,
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
    showModalDeleteDialog(id) {
      this.id = id;
      this.modalDeleteDialog = true;
    },
    closeModalDeleteDialog() {
      this.modalDeleteDialog = false;
    },
    showModalVoidDialog(id) {
      this.id = id;
      this.modalVoidDialog = true;
    },
    closeModalVoidDialog() {
      this.modalVoidDialog = false;
    },
    loadData() {
      this.showProgress();
      this.paging = [];
      this.pagingStatus = [];
      this.$axios
        .get(
          this.$url +
          "penjualan/getdata/" +
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
          this.closeProgress();
        });
      this.$set(this.pagingStatus, this.pageno, true);
    },
    editData(idMaster) {
      let jenisUsaha = this.$settings.jenisUsaha;
      if (jenisUsaha === "cafe") {
        this.$router.push({
          path: "/transaksipenjualanv2",
          query: { tipe: 1, idMaster: idMaster },
        });
      } else {
        this.$router.push({
          path: "/transaksipenjualan",
          query: { tipe: 1, idMaster: idMaster },
        });
      }
    },
    addData() {
      let jenisUsaha = this.$settings.jenisUsaha;
      if (jenisUsaha === "cafe") {
        this.$router.push({
          path: "/transaksipenjualanv2",
          query: { tipe: 0 },
        });
      } else {
        this.$router.push({
          path: "/transaksipenjualan",
          query: { tipe: 0 },
        });
      }
    },
    deleteData() {
      this.showProgress();
      this.$axios.delete(this.$url + "penjualan/deletedata/" + this.id).then((response) => {
        this.closeModalDeleteDialog();
        console.log(response);
        this.loadData();
        this.closeProgress();
      });
    },
    voidData() {
      this.showProgress();
      this.$axios.put(this.$url + "penjualan/updatestatus/" + this.id + "/4").then((response) => {
        this.closeModalVoidDialog();
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
          "penjualan/getdata/" +
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
          "penjualan/getdata/" +
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
    penjualanDetailTotal(penjualanDetail, disc, tax) {
      let total = 0;
      let taxsimple = tax / 100;
      for (let i = 0; i < penjualanDetail.length; i++) {
        let hargaJual = penjualanDetail[i].hargaJualJual;
        let jumlahJual = penjualanDetail[i].jumlahJual;
        let disc = penjualanDetail[i].disc;
        total = total + (hargaJual * jumlahJual - disc * jumlahJual);
      }
      let totaltax = taxsimple * (total - disc);
      let grandtotal = total - disc + totaltax;
      return grandtotal;
    },
  },
  mounted() {
    this.loadData();
    if (this.$rules == "superadmin") {
      this.isSuperAdmin = true;
    } else {
      this.isSuperAdmin = false;
    }
  },
};
</script>