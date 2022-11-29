<template>
  <div class="ReturPembelian">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-cart-plus" style="color: #313131 !important"></i>
            Retur Pembelian</label
          >
          <button class="float-right" v-on:click="addData">
            <i class="fa fa-plus"></i> Tambah Retur Pembelian
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th
                    class="pointer"
                    v-on:click="sortData('kodePembelianMaster')"
                  >
                    Kode
                  </th>
                  <th class="pointer" v-on:click="sortData('tanggalPembelian')">
                    Tanggal
                  </th>
                  <th class="pointer" v-on:click="sortData('status')">
                    Status
                  </th>
                  <th class="pointer" v-on:click="sortData('deskripsi')">
                    Deskripsi
                  </th>
                  <th class="pointer" v-on:click="sortData('pembelianDetail')">
                    Total
                  </th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.kodeReturPembelianMaster | limitText }}</td>
                  <td>{{ x.tanggalReturPembelian | formatDate }}</td>
                  <td>
                    <div v-if="x.status == 1" class="badge bg-red tx-white">
                      Pending
                    </div>
                    <div v-if="x.status == 2" class="badge bg-orange tx-white">
                      Edited
                    </div>
                    <div v-if="x.status == 3" class="badge bg-green tx-white">
                      Completed
                    </div>
                  </td>
                  <td>{{ x.deskripsi | limitText }}</td>
                  <td>
                    {{ x.totalBelanja | formatNumber }}
                    <!-- {{
                      returPembelianDetailTotal(x.returPembelianDetail, x.disc, x.tax)
                        | formatNumber
                    }}-->
                  </td>
                  <td>
                    <button v-on:click="editData(x.id)">
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
            <a v-on:click="prev" class=""
              ><i class="fa fa-chevron-left"></i> Prev</a
            >
            <a
              v-for="x in paging"
              :key="x.index"
              v-on:click="navData(x.index)"
              v-bind:class="{ active: pagingStatus[x.index] }"
              >{{ x.number }}</a
            >
            <a v-on:click="next" class=""
              >Next <i class="fa fa-chevron-right"></i
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
      dataSize: 500,
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
    loadData() {
      this.showProgress();
      this.paging = [];
      this.pagingStatus = [];
      this.$axios
        .get(
          this.$url +
            "retur-pembelian/getdata/" +
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
    editData(id) {
      this.$router.push({
        path: "/TransaksiReturPembelian",
        query: { tipe: 1, idMaster: id },
      });
    },
    addData() {
      this.$router.push({
        path: "/TransaksiReturPembelian",
        query: { tipe: 0 },
      });
    },
    deleteData() {
      this.showProgress();
      this.$axios
        .delete(this.$url + "retur-pembelian/deletedata/" + this.id)
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
            "retur-pembelian/getdata/" +
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
            "retur-pembelian/getdata/" +
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
    returPembelianDetailTotal(returPembelianDetail, disc, tax) {
      let total = 0;
      let taxsimple = tax / 100;
      for (let i = 0; i < returPembelianDetail.length; i++) {
        let hargaBeli = returPembelianDetail[i].hargaBeliBeli;
        let jumlahBeliRetur = returPembelianDetail[i].jumlahBeliRetur;
        let disc = returPembelianDetail[i].disc;
        total = total + (hargaBeli * jumlahBeliRetur - disc * jumlahBeliRetur);
      }
      let totaltax = taxsimple * (total - disc);
      let grandtotal = total - disc + totaltax;
      return grandtotal;
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>