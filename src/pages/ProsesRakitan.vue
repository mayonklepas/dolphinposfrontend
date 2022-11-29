<template>
  <div class="Proses Rakitan">
    <div class="container">
      <div class="row" style="margin-bottom: 5px">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-cart-plus" style="color: #313131 !important"></i>
            Proses Perakitan</label>
          <div>
            <button type="button" class="float-right" v-on:click="backToPerakitan">
              <i class="fa fa-arrow-left"></i> Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-2">
        <label>Tanggal</label>
        <input type="date" v-model="tanggalPerakitan" />
      </div>
      <div class="col-2">
        <label>No. Perakitan</label>
        <div>
          <input type="text" v-model="kodePerakitan" style="width:78% ;" />
          <button style="width:20%;" v-on:click="generateCode"><i class="fa fa-qrcode"></i></button>
        </div>
      </div>
      <div class="col-2">
        <label>Kode Barang</label><br />
        <div>
          <input type="text" v-model="kodeBarang" style="width:70% ;" />
          <button v-on:click="showModalBarang()" style="width: 27%">
            Cari
          </button>
        </div>
      </div>
      <div class="col-3">
        <label>Nama Barang</label><br />
        <input type="text" v-model="namaBarang" /><br />
      </div>
      <div class="col-1">
        <label>Satuan</label><br />
        <select name="" v-model="satuanBarang">
          <option value="PCS">PCS</option>
          <option value="PACK">PACK</option>
          <option value="BOX">BOX</option>
          <option value="KG">KG</option>
          <option value="GRAM">GRAM</option>
          <option value="LITER">LITER</option>
          <option value="METER">METER</option>
          <option value="CM">CM</option>
          <option value="ROOM">ROOM</option>
          <option value="CUP">CUP</option>
          <option value="PORSI">PORSI</option>
          <option value="SESI">SESI</option>
          <option value="SET">SET</option>
        </select>
      </div>
      <div class="col-2">
        <label>Jumlah rakit</label><br />
        <input type="text" v-model="jumlahBarang" /><br />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <div class="table-box" style="height: 60vh">
          <table class="table-minimal">
            <thead>
              <tr>
                <th class="pointer">No</th>
                <th class="pointer">Kode</th>
                <th class="pointer">Nama</th>
                <th class="pointer">Harga Persatuan</th>
                <th class="pointer">Jumlah saat ini</th>
                <th class="pointer">Jumlah pemakaian</th>
                <th class="pointer">Harga Pemakaian</th>
                <th class="pointer">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(x, index) in resData" :key="index">
                <td style="width: 20px">{{ index + 1 }}</td>
                <td style="width: 150px">
                  <input type="text" v-model="x.kodeBarang" v-on:keyup.enter="findBarangDetailByKode(index)" />
                </td>
                <td>
                  <input type="text" v-model="x.namaBarang" />
                </td>
                <td style="width: 150px">
                  <input type="text" :value="x.hargaBarang | formatNumber" readonly class="align-right"/>
                </td>
                <td style="width: 150px">
                  <input type="text" :value="x.jumlahBarang | formatNumber" style="width: 80px ;" readonly class="align-right"/>
                    PCS
                </td>
                <td style="width: 150px">
                  <input type="text" v-model="x.jumlahIsi" v-on:keyup="calculatetotalrow(index)"
                    v-on:click="calculatetotalrow(index)" style="width: 80px ;" class="align-right" />
                    PCS
                </td>
                <td style="width: 130px">
                  <input type="text" :value="x.hargaPakai | formatNumber" readonly />
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
      <div class="col-6 align-right tx-bolder tx-semi-large">
        <span style="padding-right:30px">Total Modal : </span>
        <span >{{
                totalHargaPerakitan | formatNumber
            }}</span>
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

    <div class="modal" v-if="modalBarang == true">
      <div class="modal-content" style="width: 70%">
        <div class="modal-header">Cari Barang</div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <div class="table-box" style="height: 355px">
                <table class="table-minimal">
                  <thead>
                    <tr>
                      <th class="pointer" v-on:click="sortData('kodeBarang')">
                        Kode
                      </th>
                      <th class="pointer" v-on:click="sortData('namaBarang')">
                        Nama
                      </th>
                      <th class="pointer" v-on:click="sortData('jumlahBarang')">
                        Stok
                      </th>
                      <th class="pointer" v-on:click="sortData('hargaBeli')">
                        Harga
                      </th>
                      <th class="pointer" v-on:click="sortData('keterangan')">
                        Desc
                      </th>
                      <th class="pointer">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="x in resDataBarang.content" :key="x.id">
                      <td>{{ x.kodeBarang | limitText }}</td>
                      <td>{{ x.namaBarang | limitText }}</td>
                      <td>{{ x.jumlahBarang | formatNumber }}</td>
                      <td>{{ x.hargaBeli | formatNumber }}</td>
                      <td>{{ x.keterangan }}</td>
                      <td style="width: 100px">
                        <button v-on:click="
                          pilihModalBarang(
                            x.id,
                            x.kodeBarang,
                            x.namaBarang,
                            x.satuanBarang,
                            x.jumlahBarang,
                            x.hargaBeli
                          )
                        ">
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
            <div class="col-5">
              <div class="pagination">
                <a v-on:click="prevDataBarang" class=""><i class="fa fa-chevron-left tx-small"></i> Prev</a>
                <a v-for="x in pagingDataBarang" :key="x.index" v-on:click="navDataBarang(x.index)"
                  v-bind:class="{ active: pagingStatusDataBarang[x.index] }">{{ x.number }}</a>
                <a v-on:click="nextDataBarang" class="">Next <i class="fa fa-chevron-right tx-small"></i></a>
              </div>
            </div>
            <div class="col-2">
                <select v-model="filterTipe" v-on:change="loadDataBarang">
                  <option value="">Semua</option>
                  <option value="0">Bahan Mentah</option>
                  <option value="1">Barang Jadi</option>
                  <option value="2">Barang Racikan</option>
                  <option value="3">Jasa</option>
                </select>
              </div>
            <div class="col-3">
              <input type="text" placeholder="Cari data" v-model="keywordDataBarang"
                v-on:keyup.enter="loadDataBarang" />
            </div>
            <div class="col-2">
              <button v-on:click="reloadDataBarang" style="width: 100% !important">
                <i class="fa fa-refresh"></i> Reload
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" v-on:click="closeModalBarang">
            <i class="fa fa-close"></i> Tutup
          </button>
        </div>
      </div>
    </div>

    <pbar v-if="modalProgress == true"></pbar>
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
      modalBarang: false,
      resData: [],
      tanggalPerakitan: "",
      kodePerakitan: "",
      namaPerakitan:"",
      idBarang: "",
      namaBarang: "",
      kodeBarang: "",
      satuanBarang: "",
      jumlahBarang: 0,
      idMaster: this.$route.query.idMaster,
      tipe: this.$route.query.tipe,
      totalHargaPerakitan: 0,
      indexPosition: 0,
      tipeModal: "",
      //Barang
      resDataBarang: {},
      pagingDataBarang: [],
      pagenoDataBarang: 0,
      sortByDataBarang: "namaBarang",
      sortTypeDataBarang: "asc",
      activeDataBarang: "active",
      keywordDataBarang: "",
      pagingStatusDataBarang: [],
      dataSizeDataBarang: this.$pageSize,
      isAccMode: false,
      filterTipe: 0,
      //paramData: JSON.parse(localStorage.getItem("dataPembelian")),
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
        let cdate = new Date();
        this.tanggalPembelian = cdate.toISOString().slice(0, 10);
        this.addData();
      } else {
        this.$axios
          .get(
            this.$url +
            "rakitan/getdatabyid/" +
            this.$idOutlet +
            "/" +
            this.idMaster
          )
          .then((response) => {
            console.log(response);
            let data = response.data;
            this.tanggalPerakitan = data.tanggalPerakitan;
            this.kodePerakitan = data.kodePerakitan;
            this.idBarang = data.idBarang;
            this.kodeBarang = data.kodeBarang;
            this.namaBarang = data.namaBarang;
            this.satuanBarang = data.satuanBarang;
            this.jumlahBarang = data.jumlahBarang;
            this.resData = data.rakitanDetail;
            for (let i = 0; i < this.resData.length; i++) {
              this.resData[i].kodeBarang = this.resData[i].barang.kodeBarang;
              this.resData[i].namaBarang = this.resData[i].barang.namaBarang;
              this.resData[i].hargaBarang = this.resData[i].barang.hargaBeli;
              this.resData[i].jumlahBarang = this.resData[i].barang.jumlahBarang;
              this.calculatetotalrow(i);
            }
            console.log(this.resData);
          });
      }
    },
    backToPerakitan() {
      this.$router.push({
        path: "/perakitan",
      });
    },
    addData() {
      this.resData.push({
        idBarang: "",
        kodeBarang: "",
        namaBarang: "",
        satuanBarang: "",
        hargaBarang: 0,
        jumlahBarang: 0,
        jumlahIsi: 0,
        hargaPakai:0
      });
    },
    saveData() {
      for (let i = 0; i < this.resData.length; i++) {
        if (this.resData[i].kodeBarang == "") {
          this.deleteData(i);
        }
      }

      if (
        this.tanggalPerakitan !== "" &&
        this.kodePerakitan !== "" &&
        this.kodeBarang !== "" &&
        this.namaBarang !== "" && 
        this.satuanBarang !== "" && 
        this.jumlahBarang !== ""
      ) {
        this.showProgress();
        let idMaster = "";
        if (this.resData.length > 0) {
          let dest = "adddata";
          if (this.tipe == 0) {
            dest = "adddata";
            idMaster = "";
          } else {
            idMaster = this.idMaster;
            dest = "updatedata/" + this.idMaster;
          }
          let postdatamaster = {
            tanggalPerakitan: this.tanggalPerakitan,
            kodePerakitan: this.kodePerakitan,
            namaPerakitan: this.namaPerakitan,
            idBarang: this.idBarang,
            kodeBarang: this.kodeBarang,
            namaBarang: this.namaBarang,
            satuanBarang: this.satuanBarang,
            jumlahBarang: this.jumlahBarang,
            hargaModal : this.stdNum(this.totalHargaPerakitan),
            idPengguna: this.$idPengguna,
            idOutlet: this.$idOutlet,
          };

          let postdatadetail = [];
          for (let i = 0; i < this.resData.length; i++) {
            postdatadetail.push({
              idRakitanMaster: idMaster,
              idBarang: this.resData[i].idBarang,
              jumlahIsi: this.resData[i].jumlahIsi,
              idPengguna: this.$idPengguna,
              idOutlet: this.$idOutlet,
            });
          }
          let postdata = {};
          postdata["master"] = postdatamaster;
          postdata["detail"] = postdatadetail;
          console.log(postdata);
          this.$axios
            .post(this.$url + "rakitan/" + dest, JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              this.resData = [];
              this.addData();
              this.modalInfoText = response.data.message;
              this.modalInfo = true;
              this.kodePerakitan = "";
              this.calculatetotalrow(0);
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
        this.modalInfoText = "Operasi ditolak, data master tidak boleh kosong";
        this.modalInfo = true;
      }
    },
    deleteData(index) {
      this.resData.splice(index, 1);
      this.calculatetotalall();
    },
    calculatetotalrow(index) {
      if(this.isAlpabet(this.resData[index].jumlahIsi)){
        this.showModalInfo("Inputan hanya boleh angka");
        this.resData[index].jumlahIsi=0;
      }
      let hargaBarang = this.stdNum(this.resData[index].hargaBarang);
      let jumlahIsi =  this.stdNum(this.resData[index].jumlahIsi);
      let totalrow = hargaBarang * jumlahIsi;
      this.resData[index].hargaPakai = totalrow;
      this.calculatetotalall();
    },
    calculatetotalall() {
      let totalHargaPakai= 0;
      for (let i = 0; i < this.resData.length; i++) {
        totalHargaPakai = totalHargaPakai + this.resData[i].hargaPakai;
      }
      this.totalHargaPerakitan = totalHargaPakai;
    },

    closeModalInfo() {
      this.modalInfoText = "";
      this.modalInfo = false;
    },
    showModalInfo(message) {
      this.modalInfoText = message;
      this.modalInfo = true;
    },
    showModalBarang(index) {
      this.indexPosition = index;
      this.loadDataBarang();
      this.modalBarang = true;
    },
    closeModalBarang() {
      this.keywordDataBarang = "";
      this.resDataBarang = {};
      this.modalBarang = false;
    },
    findBarangMasterByKode() {
      this.tipeModal = "master";
      let keyword = this.kodeBarang;
      if (keyword == "") {
        this.showModalBarang();
      } else {
        this.$axios
          .get(
            this.$url + "barang/getdatabykode/" + this.$idOutlet + "/" + keyword
          )
          .then((response) => {
            if (response.data !== null) {
              this.idBarang = response.data.id;
              this.namaBarang = response.data.namaBarang;
              this.satuanBarang = response.data.satuanBarang;
            } else {
              this.showModalBarang();
            }
          });
      }
    },
    findBarangDetailByKode(index) {
      this.tipeModal = "detail"
      this.indexposition = index;
      let keyword = this.resData[index].kodeBarang;
      if (keyword == "") {
        this.showModalBarang(index);
      } else {
        this.$axios
          .get(
            this.$url + "barang/getdatabykode/" + this.$idOutlet + "/" + keyword
          )
          .then((response) => {
            if (response.data !== null) {
              this.resData[index].idBarang = response.data.id;
              this.resData[index].kodeBarang = response.data.kodeBarang;
              this.resData[index].namaBarang = response.data.namaBarang;
              this.resData[index].satuanBarang = response.data.satuanBarang;
              this.resData[index].hargaBarang = response.data.hargaBeli;
              this.resData[index].jumlahBarang = response.data.jumlahBarang;
              this.resData[index].jumlahIsi = 0;
              if (this.resData.length == index + 1) {
                this.addData();
              }
            } else {
              this.showModalBarang(index);
            }
          });
      }
    },
    pilihModalBarang(
      idBarang,
      kodeBarang,
      namaBarang,
      satuanBarang,
      jumlahBarang,
      hargaBeli,
    ) {
      if (this.tipeModal == "detail") {
        this.resData[this.indexPosition].idBarang = idBarang;
        this.resData[this.indexPosition].kodeBarang = kodeBarang;
        this.resData[this.indexPosition].namaBarang = namaBarang;
        this.resData[this.indexPosition].satuanBarang = satuanBarang;
        this.resData[this.indexPosition].hargaBarang = hargaBeli;
        this.resData[this.indexPosition].jumlahBarang = jumlahBarang;
        this.resData[this.indexPosition].jumlahIsi = 0;
        if (this.resData.length == this.indexPosition + 1) {
          this.addData();
        }
      } else {
        this.idBarang = idBarang;
        this.kodeBarang = kodeBarang;
        this.namaBarang = namaBarang;
        this.satuanBarang = satuanBarang;
      }
      this.modalBarang = false;
    },
  
  
    //barang
    loadDataBarang() {
      this.showProgress();
      this.pagingDataBarang = [];
      this.pagingStatusDataBarang = [];
      this.$axios
        .get(
          this.$url +
          "barang/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keywordDataBarang +
          "&tipe=" +
          this.filterTipe +
          "&sort=" +
          this.sortByDataBarang +
          "," +
          this.sortTypeDataBarang +
          "&size=" +
          this.dataSizeDataBarang +
          "&page=" +
          this.pagenoDataBarang
        )
        .then((response) => {
          this.resDataBarang = response.data;
          let totalPages = (response.data.totalPages <= 10) ? response.data.totalPages : 10;
          for (let index = 0; index < totalPages; index++) {
            let data = {
              index: index,
              number: index + 1,
            };
            this.pagingDataBarang.push(data);
            this.pagingStatusDataBarang.push(false);
          }
          console.log(this.pagingDataBarang);
          console.log(this.pagingStatusDataBarang);
          this.closeProgress();
        });
      this.$set(this.pagingStatusDataBarang, this.pagenoDataBarang, true);
    },
    nextDataBarang() {
      if (this.pagenoDataBarang < this.pagingDataBarang.length - 1) {
        this.pagenoDataBarang = this.pagenoDataBarang + 1;
        this.navDataBarang(this.pagenoDataBarang);
      }
    },
    prevDataBarang() {
      if (this.pagenoDataBarang > 0) {
        this.pagenoDataBarang = this.pagenoDataBarang - 1;
        this.navDataBarang(this.pagenoDataBarang);
      }
    },
    sortDataBarang(sortByDataBarang) {
      this.showProgress();
      this.sortByDataBarang = sortByDataBarang;
      if (this.sortTypeDataBarang == "asc") {
        this.sortTypeDataBarang = "desc";
      } else {
        this.sortTypeDataBarang = "asc";
      }
      this.$axios
        .get(
          this.$url +
          "barang/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keywordDataBarang +
          "&tipe=" +
          this.filterTipe +
          "&sort=" +
          this.sortByDataBarang +
          "," +
          this.sortTypeDataBarang +
          "&size=" +
          this.dataSizeDataBarang +
          "&page=" +
          this.pagenoDataBarang
        )
        .then((response) => {
          this.resDataBarang = response.data;
          console.log(response);
          this.closeProgress();
        });
    },
    navDataBarang(pagenoDataBarang) {
      this.showProgress();
      this.pagenoDataBarang = pagenoDataBarang;
      this.pagingStatusDataBarang = [];
      this.$axios
        .get(
          this.$url +
          "barang/getdata/" +
          this.$idOutlet +
          "?keyword=" +
          this.keywordDataBarang +
          "&tipe=" +
          this.filterTipe +
          "&sort=" +
          this.sortByDataBarang +
          "," +
          this.sortTypeDataBarang +
          "&size=" +
          this.dataSizeDataBarang +
          "&page=" +
          this.pagenoDataBarang
        )
        .then((response) => {
          this.resDataBarang = response.data;
          console.log(response);
          this.closeProgress();
        });
      for (let i = 0; i < this.pagingStatusDataBarang.length; i++) {
        this.pagingStatusDataBarang.push(false);
      }
      this.$set(this.pagingStatusDataBarang, pagenoDataBarang, true);
    },
    reloadDataBarang() {
      this.keywordDataBarang = "";
      this.loadDataBarang();
    },
    formatBeli(index, val) {
      this.resData[index].hargaBeliBeli = this.fmNum(val);
    },
    generateCode() {
      this.showProgress();
      this.$axios
        .get(
          this.$url +
          "report/getinvoice/" +
          this.$idOutlet +
          "/rakitan_master"
        )
        .then((response) => {
          this.kodePerakitan = response.data.content
          this.closeProgress();
        });
    }
  },

  mounted() {
    this.loadData();
  },
};
</script>