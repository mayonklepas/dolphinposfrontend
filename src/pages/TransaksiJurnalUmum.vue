<template>
  <div class="Transaksi JurnalUmum">
    <div class="container">
      <div class="row" style="margin-bottom: 5px">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-table" style="color: #313131 !important"></i> Input
            Jurnal Umum</label
          >
          <button
            type="button"
            class="float-right"
            v-on:click="backToJurnalUmum"
          >
            <i class="fa fa-arrow-left"></i> Kembali
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-2">
          <label>Tanggal Transaksi</label>
          <input type="date" v-model="tanggalJurnal" />
        </div>
        <div class="col-2">
          <label>No. Ref</label>
          <input type="text" v-model="noRef" />
        </div>
        <div class="col-2">
          <label>Tanggal Ref</label>
          <input type="date" v-model="tanggalRef" />
        </div>
        <div class="col-6">
          <label>Keterangan</label>
          <input type="text" v-model="deskripsi" />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <div class="table-box" style="height: 60vh">
            <table class="table-minimal">
              <thead>
                <tr>
                  <th class="pointer">#</th>
                  <th class="pointer">Kode Akun</th>
                  <th class="pointer">Nama Akun</th>
                  <th class="pointer">Deskripsi</th>
                  <th class="pointer">Debit</th>
                  <th class="pointer">Kredit</th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(x, index) in resData" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td style="width: 150px">
                    <input
                      type="text"
                      v-model="x.akunKeuangan.kodeAkunKeuangan"
                      v-on:keyup.enter="findAkunKeuanganByKode(index)"
                    />
                  </td>
                  <td style="width: 250px">
                    <input
                      type="text"
                      v-model="x.akunKeuangan.namaAkunKeuangan"
                    />
                  </td>
                  <td>
                    <input type="text" v-model="x.deskripsi" />
                  </td>
                  <td style="width: 150px">
                    <input
                      type="text"
                      v-model="x.debit"
                      v-on:keyup="formatDebit(index)"
                    />
                  </td>
                  <td style="width: 150px">
                    <input
                      type="text"
                      v-model="x.kredit"
                      v-on:keyup="formatKredit(index)"
                    />
                  </td>

                  <td style="width: 60px">
                    <button v-on:click="deleteData(index)">
                      <i class="fa fa-trash-o"></i>
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
          <button type="button" v-on:click="addData">
            <i class="fa fa-plus"></i> Tambah Data
          </button>
          <button type="button" v-on:click="saveData">
            <i class="fa fa-save"></i> Simpan Data
          </button>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-9">
              <span class="float-right">Total Debit : </span>
            </div>
            <div class="col-3">
              <span class="float-right">{{ totalDebit | formatNumber }}</span>
            </div>
            <div class="col-9">
              <span class="float-right">Total Kredit : </span>
            </div>
            <div class="col-3">
              <span class="float-right">{{ totalKredit | formatNumber }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" v-if="modalInfo == true">
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

      <div class="modal" v-if="modalAkunKeuangan == true">
        <div class="modal-content" style="width: 50%">
          <div class="modal-header">Cari AkunKeuangan</div>
          <div class="modal-body">
            <div class="row">
              <div class="col-12">
                <div class="table-box" style="height: 330px">
                  <table class="table-minimal">
                    <thead>
                      <tr>
                        <th
                          class="pointer"
                          v-on:click="sortData('kodeAkunKeuangan')"
                        >
                          Kode
                        </th>
                        <th
                          class="pointer"
                          v-on:click="sortData('namaAkunKeuangan')"
                        >
                          Nama
                        </th>
                        <th class="pointer">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="x in resDataAkunKeuangan.content" :key="x.id">
                        <td>{{ x.kodeAkunKeuangan | limitText }}</td>
                        <td>{{ x.namaAkunKeuangan | limitText }}</td>
                        <td style="width: 100px">
                          <button
                            v-on:click="
                              pilihModalAkunKeuangan(
                                x.id,
                                x.kodeAkunKeuangan,
                                x.namaAkunKeuangan
                              )
                            "
                          >
                            <i class="fa fa-hand-pointer-o"></i> Pilih
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
                  <a
                    v-on:click="prevDataAkunKeuangan"
                    class=""
                    ><i class="fa fa-chevron-left tx-small"></i> Prev</a
                  >
                  <a
                    v-for="x in pagingDataAkunKeuangan"
                    :key="x.index"
                    v-on:click="navData(x.index)"
                    v-bind:class="{
                      active: pagingStatusDataAkunKeuangan[x.index],
                    }"
                    >{{ x.number }}</a
                  >
                  <a
                    v-on:click="nextDataAkunKeuangan"
                    class=""
                    >Next <i class="fa fa-chevron-right tx-small"></i
                  ></a>
                </div>
              </div>
              <div class="col-4">
                <input
                  type="text"
                  placeholder="Cari data"
                  v-model="keywordDataAkunKeuangan"
                  v-on:keyup.enter="loadDataAkunKeuangan"
                />
              </div>
              <div class="col-2">
                <button
                  v-on:click="reloadDataAkunKeuangan"
                  style="width: 100% !important"
                >
                  <i class="fa fa-refresh"></i> Reload
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="closeModalAkunKeuangan">
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
      modalAkunKeuangan: false,
      resData: [],
      tanggalJurnal: "",
      noRef: "",
      tanggalRef: "",
      deskripsi: "",
      tipe: this.$route.query.tipe,
      idMaster: this.$route.query.idMaster,
      indexPosition: 0,
      totalKredit: 0,
      totalDebit: 0,
      //Akun
      resDataAkunKeuangan: {},
      pagingDataAkunKeuangan: [],
      pagenoDataAkunKeuangan: 0,
      sortByDataAkunKeuangan: "kodeAkunKeuangan",
      sortTypeDataAkunKeuangan: "ASC",
      activeDataAkunKeuangan: "active",
      keywordDataAkunKeuangan: "",
      pagingStatusDataAkunKeuangan: [],
      dataSizeDataAkunKeuangan: 50,
      //paramData: JSON.parse(localStorage.getItem("dataJurnalUmum")),
    };
  },
  methods: {
    showProgress() {
      this.modalProgress = true;
    },
    closeProgress() {
      this.modalProgress = false;
    },
    loadData() {
      if (this.tipe == 0) {
        this.addData();
        this.calculatedebitkredit();
      } else {
        this.$axios
          .get(
            this.$url +
              "jurnalumum/getdatabyid/" +
              this.$idOutlet +
              "/" +
              this.idMaster
          )
          .then((response) => {
            let data=response.data;
            this.tanggalJurnal = data.tanggalJurnal;
            this.noRef = data.noRef;
            this.tanggalRef = data.tanggalRef;
            this.resData = data.jurnalUmumDetail;
            this.deskripsi = data.deskripsi;
            this.calculatedebitkredit();
          });
      }
    },
    backToJurnalUmum() {
      this.$router.push({
        path: "/JurnalUmum",
      });
    },
    addData() {
      this.resData.push({
        akunKeuangan: { kodeAkunKeuangan: "", namaAkunKeuangan: "" },
        idAkunKeuangan: "",
        deskripsi: "",
        debit: 0,
        kredit: 0,
      });
      this.calculatedebitkredit();
    },
    saveData() {
      for (let i = 0; i < this.resData.length; i++) {
        if (this.resData[i].idAkunKeuangan == "") {
          this.deleteData(i);
        }
      }

      console.log(this.resData);

      if (this.totalDebit == this.totalKredit) {
        if (
          this.tanggalJurnal !== "" &&
          this.noRef !== "" &&
          this.tanggalRef !== ""
        ) {
          let idMaster = "";
          if (this.resData.length > 0) {
            this.showProgress();
            let dest = "adddata";
            if (this.tipe == 0) {
              dest = "adddata";
              idMaster = "";
            } else {
              idMaster = this.idMaster;
              dest = "updatedata/" + this.idMaster;
            }
            let postdatamaster = {
              tanggalJurnal: this.tanggalJurnal,
              noRef: this.noRef,
              tanggalRef: this.tanggalRef,
              idPengguna: this.$idPengguna,
              idOutlet: this.$idOutlet,
            };

            let postdatadetail = [];
            for (let i = 0; i < this.resData.length; i++) {
              postdatadetail.push({
                idJurnalMaster: idMaster,
                tanggalJurnal: this.tanggalJurnal,
                idAkunKeuangan: this.resData[i].idAkunKeuangan,
                deskripsi: this.resData[i].deskripsi,
                debit: this.stdNum(this.resData[i].debit),
                kredit: this.stdNum(this.resData[i].kredit),
                idPengguna: this.$idPengguna,
                idOutlet: this.$idOutlet,
                urutan: i + 1,
              });
            }
            let postdata = {};
            postdata["master"] = postdatamaster;
            postdata["detail"] = postdatadetail;
            console.log(postdata);
            this.$axios
              .post(
                this.$url + "jurnalumum/" + dest,
                JSON.stringify(postdata),
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              )
              .then((response) => {
                console.log(response);
                this.resData = [];
                this.addData();
                this.modalInfoText = response.data.message;
                this.modalInfo = true;
                this.kodeJurnalMaster = "";
                this.closeProgress();
              })
              .catch((err) => {
                console.log(err);
                this.modalInfoText = err;
                this.modalInfo = true;
                this.closeProgress();
              });
          } else {
            this.modalInfoText =
              "Operasi ditolak, data detail tidak boleh kosong";
            this.modalInfo = true;
          }
        } else {
          this.modalInfoText =
            "Operasi ditolak, data master tidak boleh kosong";
          this.modalInfo = true;
        }
      } else {
        this.modalInfoText = "Operasi ditolak, debit kredit tidak balance";
        this.modalInfo = true;
      }
    },
    deleteData(index) {
      this.resData.splice(index, 1);
      this.calculatedebitkredit();
    },
    findAkunKeuanganByKode(index) {
      this.indexposition = index;
      let keyword = this.resData[index].akunKeuangan.kodeAkunKeuangan;
      if (keyword == "") {
        this.showModalAkunKeuangan(index);
      } else {
        this.$axios
          .get(
            this.$url +
              "akunkeuangan/getdatabykode/" +
              keyword +
              "/" +
              this.$idOutlet +
              "/"
          )
          .then((response) => {
            console.log(response);
            if (response.data !== null) {
              let cekindex = this.resData.findIndex(function (item) {
                return item.idAkunKeuangan == response.data.id;
              });

              if (cekindex < 0) {
                this.resData[index].idAkunKeuangan = response.data.id;
                this.resData[index].akunKeuangan.kodeAkunKeuangan =
                  response.data.kodeAkunKeuangan;
                this.resData[index].akunKeuangan.namaAkunKeuangan =
                  response.data.namaAkunKeuangan;
                console.log(this.resData[index]);
                console.log(this.resData.length + "|" + (index + 1));
                if (this.resData.length == index + 1) {
                  this.addData();
                }
              } else {
                this.showModalInfo("Akun sudah ada");
              }
            } else {
              this.showModalAkunKeuangan(index);
            }
          });
      }
    },
    calculatedebitkredit() {
      this.totalDebit = 0;
      this.totalKredit = 0;
      for (let index = 0; index < this.resData.length; index++) {
        this.totalDebit =
          this.totalDebit + this.stdNum(this.resData[index].debit);
        this.totalKredit =
          this.totalKredit + this.stdNum(this.resData[index].kredit);
      }
    },
    closeModalInfo() {
      this.modalInfoText = "";
      this.modalInfo = false;
    },
    showModalInfo(message) {
      this.modalInfoText = message;
      this.modalInfo = true;
    },
    showModalAkunKeuangan(index) {
      this.indexPosition = index;
      this.loadDataAkunKeuangan();
      this.modalAkunKeuangan = true;
    },
    closeModalAkunKeuangan() {
      this.keywordDataAKun = "";
      this.resDataAkun = {};
      this.modalAkunKeuangan = false;
    },
    pilihModalAkunKeuangan(idAkunKeuangan, kodeAkunKeuangan, namaAkunKeuangan) {
      let cekindex = this.resData.findIndex(function (item) {
        return item.idAkunKeuangan == idAkunKeuangan;
      });

      if (cekindex < 0) {
        this.resData[this.indexPosition].idAkunKeuangan = idAkunKeuangan;
        this.resData[this.indexPosition].akunKeuangan.kodeAkunKeuangan =
          kodeAkunKeuangan;
        this.resData[this.indexPosition].akunKeuangan.namaAkunKeuangan =
          namaAkunKeuangan;
        console.log(this.resData[this.indexPosition]);
        console.log(this.resData.length + "|" + (this.indexPosition + 1));
        if (this.resData.length == this.indexPosition + 1) {
          this.addData();
        }
      } else {
        this.showModalInfo("Akun sudah ada");
      }

      this.modalAkunKeuangan = false;
    },
    //akun keuangan
    loadDataAkunKeuangan() {
      this.showProgress();
      this.pagingDataAkunKeuangan = [];
      this.pagingStatusDataAkunKeuangan = [];
      this.$axios
        .get(
          this.$url +
            "akunkeuangan/getdata/" +
            this.$idOutlet +
            "?keyword=" +
            this.keywordDataAkunKeuangan +
            "&sort=" +
            this.sortByDataAkunKeuangan +
            "," +
            this.sortTypeDataAkunKeuangan +
            "&size=" +
            this.dataSizeDataAkunKeuangan +
            "&page=" +
            this.pagenoDataAkunKeuangan
        )
        .then((response) => {
          this.resDataAkunKeuangan = response.data;
          console.log(response);
          for (let index = 0; index < response.data.totalPages; index++) {
            let data = {
              index: index,
              number: index + 1,
            };
            this.pagingDataAkunKeuangan.push(data);
            this.pagingStatusDataAkunKeuangan.push(false);
          }
          console.log(this.pagingDataAkunKeuangan);
          console.log(this.pagingStatusDataAkunKeuangan);
          this.closeProgress();
        });
      this.$set(
        this.pagingStatusDataAkunKeuangan,
        this.pagenoDataAkunKeuangan,
        true
      );
    },
    nextDataAkunKeuangan() {
      if (
        this.pagenoDataAkunKeuangan <
        this.pagingDataAkunKeuangan.length - 1
      ) {
        this.pagenoDataAkunKeuangan = this.pagenoDataAkunKeuangan + 1;
        this.navDataAkunKeuangan(this.pagenoDataAkunKeuangan);
      }
    },
    prevDataAkunKeuangan() {
      if (this.pagenoDataAkunKeuangan > 0) {
        this.pagenoDataAkunKeuangan = this.pagenoDataAkunKeuangan - 1;
        this.navDataAkunKeuangan(this.pagenoDataAkunKeuangan);
      }
    },
    sortDataAkunKeuangan(sortByDataAkunKeuangan) {
      this.showProgress();
      this.sortByDataAkunKeuangan = sortByDataAkunKeuangan;
      if (this.sortTypeDataAkunKeuangan == "asc") {
        this.sortTypeDataAkunKeuangan = "desc";
      } else {
        this.sortTypeDataAkunKeuangan = "asc";
      }
      this.$axios
        .get(
          this.$url +
            "barang/getdata/" +
            this.$idOutlet +
            "?keyword=" +
            this.keywordDataAkunKeuangan +
            "&sort=" +
            this.sortByDataAkunKeuangan +
            "," +
            this.sortTypeDataAkunKeuangan +
            "&size=" +
            this.dataSizeDataAkunKeuangan +
            "&page=" +
            this.pagenoDataAkunKeuangan
        )
        .then((response) => {
          this.resDataAkunKeuangan = response.data;
          console.log(response);
          this.closeProgress();
        });
    },
    navDataAkunKeuangan(pagenoDataAkunKeuangan) {
      this.showProgress();
      this.pagenoDataAkunKeuangan = pagenoDataAkunKeuangan;
      this.pagingStatusDataAkunKeuangan = [];
      this.$axios
        .get(
          this.$url +
            "barang/getdatabykey/" +
            this.$idOutlet +
            "?keyword=" +
            this.keywordDataAkunKeuangan +
            "&sort=" +
            this.sortByDataAkunKeuangan +
            "," +
            this.sortTypeDataAkunKeuangan +
            "&size=" +
            this.dataSizeDataAkunKeuangan +
            "&page=" +
            this.pagenoDataAkunKeuangan
        )
        .then((response) => {
          this.resDataAkunKeuangan = response.data;
          console.log(response);
          this.closeProgress();
        });
      for (let i = 0; i < this.pagingStatusDataAkunKeuangan.length; i++) {
        this.pagingStatusDataAkunKeuangan.push(false);
      }
      this.$set(
        this.pagingStatusDataAkunKeuangan,
        pagenoDataAkunKeuangan,
        true
      );
    },
    reloadDataAkunKeuangan() {
      this.keywordDataAkunKeuangan = "";
      this.loadDataAkunKeuangan();
    },

    formatDebit(index) {
      this.calculatedebitkredit();
      this.resData[index].debit = this.fmNum(this.resData[index].debit);
    },
    formatKredit(index) {
      this.calculatedebitkredit();
      this.resData[index].kredit = this.fmNum(this.resData[index].kredit);
    },
  },

  mounted() {
    this.loadData();
  },
};
</script>