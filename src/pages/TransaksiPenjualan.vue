<template>
  <div class="Transaksi Penjualan">
    <div class="container">
      <div class="row" style="margin-bottom: 5px">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-shopping-cart" style="color: #313131 !important"></i>
            Transaksi Penjualan</label>
          <div>
            <button type="button" class="float-right" v-on:click="changeAccMode">
              <i class="fa fa-toggle-off" v-if="isAccMode == false"></i>
              <i class="fa fa-toggle-on" v-if="isAccMode == true"></i>
              Accounting Mode
            </button>
            <button type="button" class="float-right" v-on:click="backToPenjualan">
              <i class="fa fa-arrow-left"></i> Kembali
            </button>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-2">
          <label>Tanggal</label>
          <input type="date" v-model="tanggalPenjualan" />
        </div>
        <div class="col-2">
          <label>Customer/Personal</label>
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
          <input type="text" v-model="deskripsi" placeholder="Keterangan" />
        </div>
        <div class="col-2">
          <label>Barcode</label>
          <input type="text" v-model="barcode" placeholder="Scan kode barang" v-on:keyup.enter="findBarangByKodeText"
            ref="barcode" />
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
                  <th class="pointer">Harga Jual</th>
                  <th class="pointer">Desc</th>
                  <th class="pointer">Disc (Rp.)</th>
                  <th class="pointer">Jumlah</th>
                  <th class="pointer">Total</th>
                  <th class="pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(x, index) in resData" :key="index">
                  <td style="width: 20px">{{ index + 1 }}</td>
                  <td style="width: 150px">
                    <input type="text" v-model="x.kodeBarang" v-on:keyup.enter="findBarangByKode(index)" readonly />
                  </td>
                  <td>
                    <input type="text" v-model="x.namaBarang" readonly />
                  </td>
                  <td style="width: 120px">
                    <input type="number" v-model.number="x.hargaJualJual" />
                  </td>
                  <td style="width: 170px">
                    <input type="text" v-model="x.keterangan" readonly />
                  </td>
                  <td style="width: 80px">
                    <input type="number" v-model.number="x.disc" v-on:keyup="calculatetotalrow(index)"
                      v-on:click="calculatetotalrow(index)" />
                  </td>
                  <td style="width: 100px">
                    <input style="width: 50px" type="number" v-model.number="x.jumlahJual"
                      v-on:keyup="calculatetotalrow(index)" v-on:click="calculatetotalrow(index)" />
                    {{ x.satuanBarang }}
                  </td>
                  <td style="width: 130px">
                    <input type="text" :value="x.total | formatNumber" readonly />
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
          <button type="button" v-on:click="saveData(0)">
            <i class="fa fa-save"></i> Simpan Data
          </button>
          <button type="button" v-on:click="showModalBayar">
            <i class="fa fa-money"></i> Bayar
          </button>
        </div>
        <div class="col-6">
          <div class="row">
            <div class="col-8">
              <span class="float-right tx-bold">Total Penjualan : </span>
            </div>
            <div class="col-4">
              <span class="float-right tx-bold">{{
                  totalPenjualan | formatNumber
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
              <span class="float-right tx-xlarge tx-bold">Grand Total : </span>
            </div>
            <div class="col-4">
              <span class="float-right tx-xlarge tx-bold">{{ grandTotal | formatNumber }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal" v-if="modalForm == true">
        <div class="modal-content" style="width: 35%">
          <div class="modal-header">Pembayaran</div>
          <div class="modal-body">
            <label class="tx-large tx-bold">Total Belanja</label><br />
            <input type="text" :value="totalBelanja | formatNumber" class="tx-xxlarge tx-white bg-black tx-bold"
              style="height: 45px; padding-top: 5px !important" /><br />
            <label class="tx-large tx-bold">Kembalian</label><br />
            <input type="text" :value="kembalian | formatNumber" class="tx-xxlarge tx-orange bg-black tx-bold"
              style="height: 45px; padding-top: 5px !important" /><br />
            <label class="tx-large tx-bold">Jumlah Uang</label><br />
            <input type="text" v-model="jumlahUang" v-on:keyup="calculateKembalian" class="tx-xxlarge tx-bold"
              style="height: 45px; padding-top: 5px !important" ref="jumlahUang" /><br /><br />
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="saveData(1)">
              <i class="fa fa-save"></i> Simpan Data
            </button>
            <button type="button" v-on:click="closeModalBayar">
              <i class="fa fa-close"></i> Batal
            </button>
          </div>
        </div>
      </div>

      <div class="modal" v-if="modalInfo == true">
        <div class="modal-content" style="width: 30%">
          <div class="modal-header">Informasi</div>
          <div class="modal-body">
            <div style="padding: 10px; text-align: center">
              <span>
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
                              x.keterangan,
                              x.tipeBarang,
                              x.diskon
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
      idTrx: "",
      modalInfo: false,
      modalInfoText: "",
      modalBarang: false,
      modalForm: false,
      resData: [],
      resDataAkunKeuangan: [],
      resDataKartuKontak: {},
      tanggalPenjualan: "",
      idKartuKontak: this.$settings.defaultCustomer,
      idAkunKeuangan: this.$settings.akunPenjualanDebit.id,
      idAkunKeuanganKredit: this.$settings.akunPenjualanKredit.id,
      tipeStruk: this.$settings.tipeStruk,
      deskripsi: "",
      tipe: this.$route.query.tipe,
      idMaster: this.$route.query.idMaster,
      totalPenjualan: 0,
      indexPosition: 0,
      disc: 0,
      tax: this.$tax,
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
      dataSizeDataBarang: 25,
      tipeSimpan: 0,
      totalBelanja: 0,
      kembalian: 0,
      jumlahUang: 0,
      barcode: "",
      isAccMode: false,
      filterTipe: 1,
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
        this.tanggalPenjualan = cdate.toISOString().slice(0, 10);
        this.addData();
      } else {
        this.$axios
          .get(
            this.$url +
            "penjualan/getdatabyid/" +
            this.$idOutlet +
            "/" +
            this.idMaster
          )
          .then((response) => {
            console.log(response);

            let jualDetail = response.data.penjualanDetail;
            for (let y = 0; y < jualDetail.length; y++) {
              jualDetail[y].kodeBarang = jualDetail[y].barang.kodeBarang;
              jualDetail[y].namaBarang = jualDetail[y].barang.namaBarang;
              jualDetail[y].satuanBarang = jualDetail[y].barang.satuanBarang;
              jualDetail[y].tipeBarang = jualDetail[y].barang.tipeBarang;
            }

            this.tanggalPenjualan = response.data.tanggalPenjualan;
            this.idKartuKontak = response.data.idKartuKontak;
            this.idAkunKeuangan = response.data.idAkunKeuangan;
            this.idAkunKeuanganKredit = response.data.idAkunKeuanganKredit;
            this.deskripsi = response.data.deskripsi;
            this.tax = response.data.tax;
            this.disc = response.data.disc;
            this.resData = response.data.penjualanDetail;
            for (let i = 0; i < this.resData.length; i++) {
              this.calculatetotalrow(i);
            }
          });
      }
    },
    backToPenjualan() {
      this.$router.push({
        path: "/Penjualan",
      });
    },
    addData() {
      this.resData.push({
        idBarang: "",
        kodeBarang: "",
        namaBarang: "",
        satuanBarang: "",
        tipeBarang: 0,
        hargaBeliJual: 0,
        hargaJualJual: 0,
        disc: 0,
        barang: { diskon: {} },
        jumlahJual: 0,
        total: 0,
      });
      this.$refs.barcode.focus();
    },
    saveData(tipeSimpan) {
      for (let i = 0; i < this.resData.length; i++) {
        if (this.resData[i].kodeBarang == "") {
          this.deleteData(i);
        }
      }

      console.log(this.resData);

      if (
        this.tanggalPenjualan !== "" &&
        this.idKartuKontak !== "" &&
        this.idAkunKeuangan !== "" &&
        this.idAkunKeuanganKredit !== ""
      ) {
        let idMaster = "";
        let statusPenjualan = 0;
        if (this.resData.length > 0) {
          this.showProgress();
          let dest = "adddata";
          if (this.tipe == 0) {
            dest = "adddata";
            idMaster = "";
            if (tipeSimpan == 0) {
              statusPenjualan = 1;
            } else {
              statusPenjualan = 3;
            }
          } else {
            idMaster = this.idMaster;
            dest = "updatedata/" + idMaster;
            if (tipeSimpan == 0) {
              statusPenjualan = 1;
            } else {
              statusPenjualan = 3;
            }
          }
          let postdatamaster = {
            kodePenjualanMaster: this.kodePenjualanMaster,
            tanggalPenjualan: this.tanggalPenjualan,
            status: statusPenjualan,
            deskripsi: this.deskripsi,
            idAkunKeuangan: this.idAkunKeuangan,
            idAkunKeuanganKredit: this.idAkunKeuanganKredit,
            idKartuKontak: this.idKartuKontak,
            tax: this.tax,
            disc: this.disc,
            totalBelanja: this.stdNum(this.totalBelanja),
            jumlahUang: this.stdNum(this.jumlahUang),
            kembalian: this.stdNum(this.kembalian),
            idPengguna: this.$idPengguna,
            idOutlet: this.$idOutlet,
          };

          let postdatadetail = [];
          for (let i = 0; i < this.resData.length; i++) {
            postdatadetail.push({
              idPenjualanMaster: idMaster,
              tanggalTransaksi: this.tanggalPenjualan,
              idBarang: this.resData[i].idBarang,
              kodeBarang: this.resData[i].kodeBarang,
              namaBarang: this.resData[i].namaBarang,
              satuanBarang: this.resData[i].satuanBarang,
              tipeBarang: this.resData[i].tipeBarang,
              jumlahJual: this.resData[i].jumlahJual,
              hargaBeliJual: this.resData[i].hargaBeliJual,
              hargaJualJual: this.resData[i].hargaJualJual,
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
            .post(this.$url + "penjualan/" + dest, JSON.stringify(postdata), {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then((response) => {
              console.log(response);
              this.modalForm = false;
              this.resData = [];
              this.addData();
              this.calculatetotalrow(0);
              this.modalInfoText = response.data.message;
              this.idTrx = response.data.content.master.id;
              this.modalInfo = true;
              if (tipeSimpan == 1) {
                this.printFaktur(this.idTrx);
              }
              this.closeProgress();
            })
            .catch((err) => {
              console.log(err);
              this.modalForm = false;
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
              this.resData[index].hargaBeliJual = response.data.hargaBeli;
              this.resData[index].hargaJualJual = response.data.hargaJual;
              this.resData[index].keterangan = response.data.keterangan;
              this.resData[index].jumlahJual = 1;
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
    findBarangByKodeText() {
      let keyword = this.barcode;
      let index = this.resData.length - 1;
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
              let cekindex = this.resData.findIndex(function (item) {
                return item.idBarang == response.data.id;
              });
              if (cekindex < 0) {
                this.resData[index].idBarang = response.data.id;
                this.resData[index].kodeBarang = keyword;
                this.resData[index].namaBarang = response.data.namaBarang;
                this.resData[index].satuanBarang = response.data.satuanBarang;
                this.resData[index].tipeBarang = response.data.tipeBarang;
                this.resData[index].hargaBeliJual = response.data.hargaBeli;
                this.resData[index].hargaJualJual = response.data.hargaJual;
                this.resData[index].keterangan = response.data.keterangan;
                this.resData[index].jumlahJual = 1;
                console.log(this.resData[index]);
                this.calculatetotalrow(index);
                console.log(this.resData.length + "|" + (index + 1));
                if (this.resData.length == index + 1) {
                  this.addData();
                }
              } else {
                this.resData[cekindex].jumlahJual =
                  this.resData[cekindex].jumlahJual + 1;
                this.calculatetotalrow(cekindex);
              }
              this.barcode = "";
            } else {
              this.showModalBarang(index);
            }
          });
      }
    },
    calculatetotalrow(index) {
      let hargaJual = this.stdNum(this.resData[index].hargaJualJual);
      let jumlah = this.stdNum(this.resData[index].jumlahJual);
      let diskonDetail = this.resData[index].barang.diskon;

      if (diskonDetail !== null) {
        let tanggalBerlakuHingga = diskonDetail.tanggalBerlakuHingga;
        let minimalPembelianSatu = diskonDetail.minimalPembelianSatu;
        let nominalDiskonSatu = diskonDetail.nominalDiskonSatu;
        let minimalPembelianDua = diskonDetail.minimalPembelianDua;
        let nominalDiskonDua = diskonDetail.nominalDiskonDua;
        let Cdate = new Date().setHours(0, 0, 0, 0);
        let Ddate = new Date(tanggalBerlakuHingga).setHours(0, 0, 0, 0);

        if (Cdate <= Ddate) {
          console.log("dapat");
          if (jumlah >= minimalPembelianSatu && jumlah < minimalPembelianDua) {
            this.resData[index].disc = nominalDiskonSatu;
          } else if (
            jumlah > minimalPembelianSatu &&
            jumlah >= minimalPembelianDua
          ) {
            this.resData[index].disc = nominalDiskonDua;
          } else {
            this.resData[index].disc = this.stdNum(this.resData[index].disc);
          }
        } else {
          console.log("expired");
        }
      } else {
        console.log("tidak ada diskon");
      }
      let disc = this.stdNum(this.resData[index].disc);
      let totalrow = hargaJual * jumlah - disc * jumlah;
      this.resData[index].total = totalrow;
      this.calculatetotalall();
      this.calculategrandtotal();
    },
    calculatetotalall() {
      let totalpenjualanraw = 0;
      for (let i = 0; i < this.resData.length; i++) {
        totalpenjualanraw = totalpenjualanraw + this.resData[i].total;
      }
      this.totalPenjualan = totalpenjualanraw;
    },
    calculategrandtotal() {
      let persentax =
        (this.tax / 100) *
        (parseFloat(this.stdNum(this.totalPenjualan)) - this.disc);
      let totalplusdisc =
        parseFloat(this.stdNum(this.totalPenjualan)) - this.disc;
      let allgrand = totalplusdisc + persentax;
      this.grandTotal = allgrand;
      this.totalBelanja = allgrand;
    },
    calculateKembalian() {
      this.jumlahUang = this.fmNum(this.jumlahUang);
      let totalBelanja = this.totalBelanja;
      let jumlahUang = this.stdNum(this.jumlahUang);
      let kembali = jumlahUang - totalBelanja;
      this.kembalian = kembali;
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
    showModalBayar() {
      //this.$refs.jumlahUang.focus();
      this.jumlahUang = 0;
      this.kembalian = 0;
      this.modalForm = true;
    },
    closeModalBayar() {
      this.modalForm = false;
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
      keterangan,
      tipeBarang,
      diskon
    ) {
      let cekindex = this.resData.findIndex(function (item) {
        return item.idBarang == idBarang;
      });

      console.log(cekindex);

      if (cekindex < 0) {
        this.resData[this.indexPosition].idBarang = idBarang;
        this.resData[this.indexPosition].kodeBarang = kodeBarang;
        this.resData[this.indexPosition].namaBarang = namaBarang;
        this.resData[this.indexPosition].satuanBarang = satuanBarang;
        this.resData[this.indexPosition].tipeBarang = tipeBarang;
        this.resData[this.indexPosition].hargaBeliJual = hargaBeli;
        this.resData[this.indexPosition].hargaJualJual = hargaJual;
        this.resData[this.indexPosition].keterangan = keterangan;
        this.resData[this.indexPosition].jumlahJual = 1;
        this.resData[this.indexPosition].barang.diskon = diskon;
        console.log(this.resData[this.indexPosition]);
        this.calculatetotalrow(this.indexPosition);
        console.log(this.resData.length + "|" + (this.indexPosition + 1));
        if (this.resData.length == this.indexPosition + 1) {
          this.addData();
        }
      } else {
        this.resData[cekindex].jumlahJual =
          this.resData[cekindex].jumlahJual + 1;
        this.calculatetotalrow(cekindex);
      }
      this.barcode = "";
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
        .get(this.$url + "kartukontak/getdatabytipe/" + this.$idOutlet + "/1")
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
    printFaktur(id) {
      this.$printjs(
        this.$url + "report/" + this.tipeStruk + "/" + id + "/" + this.$idOutlet
      );
    },
    changeAccMode() {
      if (this.isAccMode) {
        this.isAccMode = false;
      } else {
        this.isAccMode = true;
      }
    }
  },

  mounted() {
    this.loadData();
    //this.calculatetotalall();
    //this.calculategrandtotal();
    this.loadDataAkunKeuangan();
    this.loadDataKartuKontak();
    console.log(this.paramData);
  },
};
</script>