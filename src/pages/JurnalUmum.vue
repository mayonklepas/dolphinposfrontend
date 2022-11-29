<template>
  <div class="JurnalUmum">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-cart-plus" style="color: #313131 !important"></i>
            Jurnal Umum</label
          >

          <div class="button-dropdown float-right">
            <div class="button-dropdown-menu">
              <i class="fa fa-plus"></i> Tambah Jurnal Umum
            </div>
            <div class="button-dropdown-content ">
              <a v-on:click="addDataCR(0)" 
                ><i class="fa fa-align-left"></i> Jurnal Penerimaan</a
              >
              <a v-on:click="addDataCR(1)" 
                ><i class="fa fa-align-right"></i> Jurnal Pengeluaran</a
              >
              <a v-on:click="addData()" 
                ><i class="fa fa-align-justify"></i> Jurnal Fleksibel</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer" v-on:click="sortData('tanggalJurnal')">
                    Tanggal Transaksi
                  </th>
                  <th class="pointer" v-on:click="sortData('noRef')">No Ref</th>
                  <th class="pointer" v-on:click="sortData('tanggalRef')">
                    Tanggal Ref
                  </th>
                  <th class="pointer" v-on:click="sortData('id')">
                    Total Debit
                  </th>
                  <th class="pointer" v-on:click="sortData('id')">
                    Total Kredit
                  </th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="x in resData.content" :key="x.id">
                  <td>{{ x.tanggalJurnal | formatDate }}</td>
                  <td>{{ x.noRef | limitText }}</td>
                  <td>{{ x.tanggalRef | formatDate }}</td>
                  <td>{{ x.debit | formatNumber }}</td>
                  <td>{{ x.debit | formatNumber }}</td>
                  <td>
                    <div v-if="x.isPosting == 0 || isSuperAdmin == true">
                      <button v-on:click="editData(x.id)">
                        <i class="fa fa-edit"></i> Edit
                      </button>
                      <button v-on:click="showModalDeleteDialog(x.id)">
                        <i class="fa fa-trash-o"></i> Delete
                      </button>
                    </div>
                    <div v-else>
                      <div class="badge bg-green tx-white" style="width:120px">
                        <i class="fa fa-check"></i> Dari Posting
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
      dataSize: this.$pageSize,
      isSuperAdmin: false,
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
            "jurnalumum/getdata/" +
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
    editData(id) {
      this.$router.push({
        path: "/TransaksiJurnalUmum",
        query: { tipe: 1, idMaster: id},
      });
    },
    addData() {
      this.$router.push({
        path: "/TransaksiJurnalUmum",
        query: { tipe: 0 },
      });
    },
    addDataCR(tipe) {
      this.$router.push({
        path: "/TransaksiJurnalCashReceipt?tipejurnal=" + tipe,
        query: { tipe: 0 },
      });
    },
    deleteData() {
      this.showProgress();
      this.$axios
        .delete(this.$url + "jurnalumum/deletedata/" + this.id)
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
            "jurnalumum/getdata/" +
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
            "jurnalumum/getdata/" +
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
    jurnalUmumDetailTotal(jurnalUmumDetail, tipe) {
      let total = 0;
      for (let i = 0; i < jurnalUmumDetail.length; i++) {
        let debit = jurnalUmumDetail[i].debit;
        let kredit = jurnalUmumDetail[i].kredit;
        if (tipe == 1) {
          total = total + debit;
        } else {
          total = total + kredit;
        }
      }

      return total;
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