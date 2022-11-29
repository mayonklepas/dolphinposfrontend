<template>
  <div class="Transaksi Pembelian">
    <div class="container">
      <div class="row" style="margin-bottom: 5px">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-cart-plus" style="color: #313131 !important"></i>
            Transaksi Retur Pembelian</label>
          <div>
            <button type="button" class="float-right" v-on:click="changeAccMode">
              <i class="fa fa-toggle-off" v-if="isAccMode == false"></i>
              <i class="fa fa-toggle-on" v-if="isAccMode == true"></i>
              Accounting Mode
            </button>
            <button type="button" class="float-right" v-on:click="backToReturPembelian">
              <i class="fa fa-arrow-left"></i> Kembali
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-2">
          <label>Tanggal</label>
          <input type="date" v-model="tanggalReturPembelian" />
        </div>
        <div class="col-2">
          <label>No. Invoice</label>
          <div>
            <input type="text" v-model="kodeReturPembelianMaster" style="width: 78%;" />
            <button style="width:20%;" v-on:click="generateInvCode"><i class="fa fa-qrcode"></i></button>
          </div>
        </div>
        <div class="col-2">
          <label>Supplier</label>
          <select name="" v-model="idKartuKontak">
            <option v-for="x in resDataKartuKontak.content" :key="x.id" v-bind:value="x.id">
              {{ x.namaKontak }}
            </option>
          </select>
        </div>
        <div class="col-2">
          <label v-if="isAccMode == true">Debit</label>
          <label v-if="isAccMode == false">Disimpan Ke</label>
          <br />
          <select name="" v-model="idAkunKeuangan">
            <option v-for="x in resDataAkunKeuangan" :key="x.id" v-bind:value="x.id">
              {{ x.namaAkunKeuangan }}
            </option>
          </select>
        </div>
        <div class="col-2" v-show="isAccMode">
          <label>Kredit</label><br />
          <select name="" v-model="idAkunKeuanganKredit">
            <option v-for="x in resDataAkunKeuangan" :key="x.id" v-bind:value="x.id">
              {{ x.namaAkunKeuangan }}
            </option>
          </select>
        </div>
        <div class="col-2">
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
                  <th class="pointer">No</th>
                  <th class="pointer">Kode</th>
                  <th class="pointer">Nama</th>
                  <th class="pointer" v-show="false">Satuan</th>
                  <th class="pointer" v-show="false">Tipe</th>
                  <th class="pointer">Harga Beli</th>
                  <th class="pointer" v-show="false">Jual</th>
                  <th class="pointer">Disc (Rp.)</th>
                  <th class="pointer">Jumlah</th>
                  <th class="pointer">Total</th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(x, index) in resData" :key="index">
                  <td style="width: 20px ;">{{ index + 1 }}</td>
                  <td style="width: 200px">
                    <input type="text" v-model="x.kodeBarang" v-on:keyup.enter="findBarangByKode(index)" />
                  </td>
                  <td>
                    <input type="text" v-model="x.namaBarang" />
                  </td>
                  <td style="width: 90px" v-show="false">
                    <select name="" v-model="x.satuanBarang">
                      <option value="PCS">PCS</option>
                      <option value="PACK">PACK</option>
                      <option value="BOX">BOX</option>
                      <option value="KG">KG</option>
                      <option value="LITER">LITER</option>
                      <option value="METER">METER</option>
                      <option value="ROOM">ROOM</option>
                      <option value="CUP">CUP</option>
                      <option value="PORSI">PORSI</option>
                      <option value="SESI">SESI</option>
                      <option value="SET">SET</option>
                    </select>
                  </td>
                  <td style="width: 130px" v-show="false">
                    <select name="" v-model="x.tipeBarang">
                      <option value="0">Bahan Mentah</option>
                      <option value="1">Barang Jadi</option>
                      <option value="2">Barang Racikan</option>
                      <option value="3">Jasa</option>
                    </select>
                  </td>
                  <td style="width: 150px">
                    <input type="number" v-model="x.hargaBeliBeli" v-on:keyup="calculatetotalrow(index)"
                      v-on:click="calculatetotalrow(index)" />
                  </td>
                  <td style="width: 0px" v-show="false">
                    <input type="number" v-model.number="x.hargaJualBeli" />
                  </td>
                  <td style="width: 110px">
                    <input type="number" v-model.number="x.disc" v-on:keyup="calculatetotalrow(index)"
                      v-on:click="calculatetotalrow(index)" />
                  </td>
                  <td style="width: 100px">
                    <input type="number" style="width:50px ;" v-model.number="x.jumlahBeliRetur" v-on:keyup="calculatetotalrow(index)"
                      v-on:click="calculatetotalrow(index)" />
                      {{x.satuanBarang}}
                  </td>
                  <td style="width: 150px">
                    <input type="text" :value="x.total | formatNumber" />
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
            <div class="col-8">
              <span class="float-right">Total : </span>
            </div>
            <div class="col-4">
              <span class="float-right">{{
                  totalReturPembelian | formatNumber
              }}</span>
            </div>
            <div class="col-8">
              <span class="float-right" style="margin-top: 6px">Disc (Rp.) :</span>
            </div>
            <div class="col-4">
              <input type="number" v-model="disc" style="
                  text-align: right;
                  padding: 0;
                  margin: 0;
                  padding-right: 3px;
                " v-on:keyup="calculategrandtotal" v-on:click="calculategrandtotal" />
            </div>
            <div class="col-8">
              <span class="float-right" style="margin-top: 6px">PPN / TAX (%) :</span>
            </div>
            <div class="col-4">
              <input type="number" v-model="tax" style="
                  text-align: right;
                  padding: 0;
                  margin: 0;
                  padding-right: 3px;
                " v-on:keyup="calculategrandtotal" v-on:click="calculategrandtotal" />
            </div>
            <div class="col-8">
              <span class="float-right">Grand Total : </span>
            </div>
            <div class="col-4">
              <span class="float-right">{{ grandTotal | formatNumber }}</span>
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
                        <th class="pointer" v-on:click="sortData('hargaJual')">
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
                        <td>{{ x.hargaJual | formatNumber }}</td>
                        <td>{{ x.keterangan }}</td>
                        <td style="width: 100px">
                          <button v-on:click="
                            pilihModalBarang(
                              x.id,
                              x.kodeBarang,
                              x.namaBarang,
                              x.satuanBarang,
                              x.jumlahBarang,
                              x.hargaBeli,
                              x.hargaJual,
                              x.tipeBarang
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
              <div class="col-7">
                <div class="pagination">
                  <a v-on:click="prevDataBarang" class=""><i class="fa fa-chevron-left tx-small"></i> Prev</a>
                  <a v-for="x in pagingDataBarang" :key="x.index" v-on:click="navDataBarang(x.index)"
                    v-bind:class="{ active: pagingStatusDataBarang[x.index] }">{{ x.number }}</a>
                  <a v-on:click="nextDataBarang" class="">Next <i class="fa fa-chevron-right tx-small"></i></a>
                </div>
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
      resDataAkunKeuangan: [],
      resDataKartuKontak: {},
      tanggalReturPembelian: "",
      kodeReturPembelianMaster: "",
      idKartuKontak: this.$settings.defaultSuplier,
      idAkunKeuangan: this.$settings.akunReturPembelianDebit.id,
      idAkunKeuanganKredit: this.$settings.akunReturPembelianKredit.id,
      deskripsi: "",
      tipe: this.$route.query.tipe,
      idMaster: this.$route.query.idMaster,
      totalReturPembelian: 0,
      indexPosition: 0,
      disc: 0,
      tax: 0,
      grandTotal: 0,
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
        this.tanggalReturPembelian = cdate.toISOString().slice(0, 10);
        this.addData();
      } else {
        this.$axios
          .get(
            this.$url +
            "retur-pembelian/getdatabyid/" +
            this.$idOutlet +
            "/" +
            this.idMaster
          )
          .then((response) => {
            console.log(response);
            let data = response.data;
            this.tanggalReturPembelian = data.tanggalReturPembelian;
            this.kodeReturPembelianMaster = data.kodeReturPembelianMaster;
            this.idKartuKontak = data.idKartuKontak;
            this.idAkunKeuangan = data.idAkunKeuangan;
            this.idAkunKeuanganKredit = data.idAkunKeuanganKredit;
            this.deskripsi = data.deskripsi;
            this.tax = data.tax;
            this.disc = data.disc;
            this.resData = data.returPembelianDetail;
            for (let i = 0; i < this.resData.length; i++) {
              this.calculatetotalrow(i);
            }
          });
      }
    },
    backToReturPembelian() {
      this.$router.push({
        path: "/ReturPembelian",
      });
    },
    addData() {
      this.resData.push({
        idBarang: "",
        kodeBarang: "",
        namaBarang: "",
        satuanBarang: "",
        tipeBarang: 0,
        hargaBeliBeli: 0,
        hargaJualBeli: 0,
        disc: 0,
        jumlahBeliRetur: 0,
        total: 0,
      });
    },
    saveData() {
      for (let i = 0; i < this.resData.length; i++) {
        if (this.resData[i].kodeBarang == "") {
          this.deleteData(i);
        }
      }

      console.log(this.resData);

      if (
        this.tanggalReturPembelian !== "" &&
        this.kodeReturPembelianMaster !== "" &&
        this.idKartuKontak !== "" &&
        this.idAkunKeuangan !== "" &&
        this.idAkunKeuanganKredit !== ""
      ) {
        let idMaster = "";
        let statusReturPembelian = 1;
        if (this.resData.length > 0) {
          this.showProgress();
          let dest = "adddata";
          if (this.tipe == 0) {
            dest = "adddata";
            idMaster = "";
            statusReturPembelian = 3;
          } else {
            idMaster = this.idMaster;
            dest = "updatedata/" + this.idMaster;
            statusReturPembelian = 2;
          }
          let postdatamaster = {
            kodeReturPembelianMaster: this.kodeReturPembelianMaster,
            tanggalReturPembelian: this.tanggalReturPembelian,
            status: statusReturPembelian,
            deskripsi: this.deskripsi,
            idAkunKeuangan: this.idAkunKeuangan,
            idAkunKeuanganKredit: this.idAkunKeuanganKredit,
            idKartuKontak: this.idKartuKontak,
            tax: this.tax,
            disc: this.disc,
            totalBelanja: this.grandTotal,
            idPengguna: this.$idPengguna,
            idOutlet: this.$idOutlet,
          };

          let postdatadetail = [];
          for (let i = 0; i < this.resData.length; i++) {
            postdatadetail.push({
              tanggalTransaksi: this.tanggalReturPembelian,
              idReturPembelianMaster: idMaster,
              idBarang: this.resData[i].idBarang,
              kodeBarang: this.resData[i].kodeBarang,
              namaBarang: this.resData[i].namaBarang,
              satuanBarang: this.resData[i].satuanBarang,
              tipeBarang: this.resData[i].tipeBarang,
              jumlahBeliRetur: this.resData[i].jumlahBeliRetur,
              hargaBeliBeli: this.resData[i].hargaBeliBeli,
              hargaJualBeli: this.resData[i].hargaJualBeli,
              disc: this.resData[i].disc,
              idPengguna: this.$idPengguna,
              idOutlet: this.$idOutlet,
            });
          }
          let postdata = {};
          postdata["master"] = postdatamaster;
          postdata["detail"] = postdatadetail;
          console.log(postdata);
          this.$axios
            .post(
              this.$url + "retur-pembelian/" + dest,
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
              this.calculatetotalrow(0);
              this.modalInfoText = response.data.message;
              this.modalInfo = true;
              this.kodePembelianMaster = "";
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
      this.calculategrandtotal();
    },
    findBarangByKode(index) {
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
            console.log(response);
            if (response.data !== null) {
              this.resData[index].idBarang = response.data.id;
              this.resData[index].namaBarang = response.data.namaBarang;
              this.resData[index].satuanBarang = response.data.satuanBarang;
              this.resData[index].tipeBarang = response.data.tipeBarang;
              this.resData[index].hargaBeliBeli = response.data.hargaBeli;
              this.resData[index].hargaJualBeli = response.data.hargaJual;
              this.resData[index].jumlahBeliRetur = 1;
              console.log(this.resData[index]);
              this.calculatetotalrow(index);
              console.log(this.resData.length + "|" + (index + 1));
              if (this.resData.length == index + 1) {
                this.addData();
              }
            } else {
              this.showModalBarang(index);
            }
          });
      }
    },
    calculatetotalrow(index) {
      let hargaBeli = this.stdNum(this.resData[index].hargaBeliBeli);
      let jumlah = this.stdNum(this.resData[index].jumlahBeliRetur);
      let disc = this.stdNum(this.resData[index].disc);
      let totalrow = hargaBeli * jumlah - disc * jumlah;
      this.resData[index].total = totalrow;
      this.calculatetotalall();
      this.calculategrandtotal();
    },
    calculatetotalall() {
      let totalReturpembelianraw = 0;
      for (let i = 0; i < this.resData.length; i++) {
        totalReturpembelianraw = totalReturpembelianraw + this.resData[i].total;
      }
      this.totalReturPembelian = totalReturpembelianraw;
    },
    calculategrandtotal() {
      let persentax =
        (this.tax / 100) *
        (parseFloat(this.stdNum(this.totalReturPembelian)) - this.disc);
      let totalplusdisc =
        parseFloat(this.stdNum(this.totalReturPembelian)) - this.disc;
      let allgrand = totalplusdisc + persentax;
      this.grandTotal = allgrand;
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
    pilihModalBarang(
      idBarang,
      kodeBarang,
      namaBarang,
      satuanBarang,
      jumlahBarang,
      hargaBeli,
      hargaJual,
      tipeBarang
    ) {
      this.resData[this.indexPosition].idBarang = idBarang;
      this.resData[this.indexPosition].kodeBarang = kodeBarang;
      this.resData[this.indexPosition].namaBarang = namaBarang;
      this.resData[this.indexPosition].satuanBarang = satuanBarang;
      this.resData[this.indexPosition].tipeBarang = tipeBarang;
      this.resData[this.indexPosition].hargaBeliBeli = hargaBeli;
      this.resData[this.indexPosition].hargaJualBeli = hargaJual;
      this.resData[this.indexPosition].jumlahBeliRetur = 1;
      console.log(this.resData[this.indexPosition]);
      this.calculatetotalrow(this.indexPosition);
      console.log(this.resData.length + "|" + (this.indexPosition + 1));
      if (this.resData.length == this.indexPosition + 1) {
        this.addData();
      }

      this.modalBarang = false;
    },
    loadDataAkunKeuangan() {
      this.$axios
        .get(this.$url + "akunkeuangan/getdataall/" + this.$idOutlet)
        .then((response) => {
          this.resDataAkunKeuangan = response.data;
          console.log(response);
        });
    },
    loadDataKartuKontak() {
      this.$axios
        .get(this.$url + "kartukontak/getdatabytipe/" + this.$idOutlet + "/0")
        .then((response) => {
          this.resDataKartuKontak = response.data;
          console.log(response);
        });
    },

    //barang
    loadDataBarang() {
      this.showProgress();
      this.pagingDataBarang = [];
      this.pagingStatusDataBarang = [];
      this.$axios
        .get(
          this.$url +
          "barang/getdatabykey/" +
          this.$idOutlet +
          "?keyword=" +
          this.keywordDataBarang +
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
          let totalPages =
            response.data.totalPages <= 10 ? response.data.totalPages : 10;
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
          "barang/getdatabykey/" +
          this.$idOutlet +
          "?keyword=" +
          this.keywordDataBarang +
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
    formatJual(index) {
      this.resData[index].hargaJualBeli = this.fmNum(
        this.resData[index].hargaJualBeli
      );
    },
    formatDisc(index) {
      this.resData[index].disc = this.fmNum(this.resData[index].disc);
    },
    formatDisctotal(index) {
      this.resData[index].disc = this.fmNum(this.resData[index].disc);
    },
    changeAccMode() {
      if (this.isAccMode) {
        this.isAccMode = false;
      } else {
        this.isAccMode = true;
      }
    },
    generateInvCode() {
      this.showProgress();
      this.$axios
        .get(
          this.$url +
          "report/getinvoice/" +
          this.$idOutlet +
          "/retur_pembelian_master"
        )
        .then((response) => {
          this.kodeReturPembelianMaster = response.data.content
          console.log(response);
          this.closeProgress();
        });
    }
  },

  mounted() {
    this.loadData();
    //this.calculatetotalall();
    //this.calculategrandtotal();
    this.loadDataAkunKeuangan();
    this.loadDataKartuKontak();
  },
};
</script>