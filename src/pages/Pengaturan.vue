<template>
  <div class="Laporan">
    <div class="container">
      <div class="row">
        <div class="col-12 d-flex justify-content-between">
          <label class="title">
            <i class="fa fa-wrench" style="color:#313131 !important"></i> Pengaturan</label>
          <button class="float-right" v-on:click="simpanPengaturan">
            <i class="fa fa-save"></i> Simpan Pengaturan
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-4">
          <div class="panel">
            <div class="panel-header">Profil Perusahaan</div>
            <div class="panel-body">
              <div class="row">
                <div class="col-4" style="padding-top:10px">
                  Nama
                </div>
                <div class="col-8">
                  <input type="text" v-model="namaOutlet" />
                </div>
              </div>

              <div class="row">
                <div class="col-4" style="padding-top:10px">
                  Alamat
                </div>
                <div class="col-8">
                  <input type="text" v-model="alamatOutlet" />
                </div>
              </div>

              <div class="row">
                <div class="col-4" style="padding-top:10px">
                  No Handphone
                </div>
                <div class="col-8">
                  <input type="text" v-model="nohpOutlet" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-8">
          <div class="panel">
            <div class="panel-header">Utilitas</div>
            <div class="panel-body">
              <div class="row">
                <div class="col-3" style="padding-top:10px">
                  Default Tax (%)
                </div>
                <div class="col-3">
                  <input type="text" v-model="defaultTax" />
                </div>
                <div class="col-3" style="padding-top:10px">
                  Default Customer
                </div>
                <div class="col-3">
                  <select name="" v-model="idCustomer">
                    <option v-for="x in resDataCustomer.content" :key="x.id" v-bind:value="x.id">{{
                        x.namaKontak
                    }}</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-3" style="padding-top:10px">
                  Tipe Struk
                </div>
                <div class="col-3">
                  <select class="" v-model="tipeStruk">
                    <option value="struk">Struk</option>
                    <option value="faktur">Faktur</option>
                  </select>
                </div>
                <div class="col-3" style="padding-top:10px">
                  Default Suplier
                </div>
                <div class="col-3">
                  <select name="" v-model="idSuplier">
                    <option v-for="x in resDataSuplier.content" :key="x.id" v-bind:value="x.id">{{
                        x.namaKontak
                    }}</option>
                  </select>
                </div>
              </div>

              <div class="row">
                <div class="col-3" style="padding-top:10px">
                  Periode Akuntansi
                </div>
                <div class="col-3">
                  <select class="" v-model="periodeAkuntansi">
                    <option value="1-12">Januari - Desember</option>
                    <option value="2-1">Februari - Januari</option>
                    <option value="3-2">Maret - Februari</option>
                    <option value="4-3">April - Maret</option>
                    <option value="5-4">Mei - April</option>
                    <option value="6-5">Juni - Mei</option>
                    <option value="7-6">Juli - Juni</option>
                    <option value="8-7">Agustus - Juli</option>
                    <option value="9-8">September - Agustus</option>
                    <option value="10-9">Oktober - September</option>
                    <option value="11-10">November - Oktober</option>
                    <option value="12-11">Desember - November</option>
                  </select>
                </div>

                <div class="col-3" style="padding-top:10px">
                  Jenis Usaha
                </div>
                <div class="col-3">
                  <select class="" v-model="jenisUsaha">
                    <option value="retail">Retail Barang atau Jasa</option>
                    <option value="cafe">Cafe / Resto</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="panel">
            <div class="panel-header">Set Default Akun Keuangan</div>
            <div class="panel-body">
              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Penjualan
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3"><input type="text" v-model="penjualanDebit.nama" /></div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('penjualanDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="penjualanKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('penjualanKredit')">
                    Cari
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Pembelian
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pembelianDebit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('pembelianDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pembelianKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('pembelianKredit')">
                    Cari
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Retur Penjualan
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3">
                  <input type="text" v-model="returPenjualanDebit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('returPenjualanDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="returPenjualanKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('returPenjualanKredit')">
                    Cari
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Retur Pembelian
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3">
                  <input type="text" v-model="returPembelianDebit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('returPembelianDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="returPembelianKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('returPembelianKredit')">
                    Cari
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Hutang
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3">
                  <input type="text" v-model="hutangDebit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('hutangDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="hutangKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('hutangKredit')">
                    Cari
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Pembayaran Hutang
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pembayaranHutangDebit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('pembayaranHutangDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pembayaranHutangKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('pembayaranHutangKredit')">
                    Cari
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Piutang
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3">
                  <input type="text" v-model="piutangDebit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('piutangDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="piutangKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('piutangKredit')">
                    Cari
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Pembayaran Piutang
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pembayaranPiutangDebit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('pembayaranPiutangDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pembayaranPiutangKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%"
                    v-on:click="showModalAkunKeuangan('pembayaranPiutangKredit')">
                    Cari
                  </button>
                </div>
              </div>


              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Pendapatan Lain
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pendapatanLainDebit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('pendapatanLainDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pendapatanLainKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('pendapatanLainKredit')">
                    Cari
                  </button>
                </div>
              </div>

              <div class="row">
                <div class="col-2" style="padding-top:10px">
                  Pengeluaran Lain
                </div>
                <div class="col-1" style="padding-top:10px"><label>Debit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pengeluaranLainDebit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('pengeluaranLainDebit')">
                    Cari
                  </button>
                </div>
                <div class="col-1" style="padding-top:10px"><label>Kredit</label></div>
                <div class="col-3">
                  <input type="text" v-model="pengeluaranLainKredit.nama" />
                </div>
                <div class="col-1">
                  <button type="button" style="width:100%" v-on:click="showModalAkunKeuangan('pengeluaranLainKredit')">
                    Cari
                  </button>
                </div>
              </div>


            </div>
          </div>
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

    <div class="modal" v-if="modalAkunKeuangan == true">
      <div class="modal-content" style="width: 50%">
        <div class="modal-header">Cari AkunKeuangan</div>
        <div class="modal-body">
          <div class="row">
            <div class="col-12">
              <div class="table-box" style="height: 330px;">
                <table class="table-minimal">
                  <thead>
                    <tr>
                      <th class="pointer" v-on:click="sortDataAkunKeuangan('kodeAkunKeuangan')">Kode</th>
                      <th class="pointer" v-on:click="sortDataAkunKeuangan('namaAkunKeuangan')">Nama</th>
                      <th class="pointer">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="x in resDataAkunKeuangan.content" :key="x.id">
                      <td>{{ x.kodeAkunKeuangan | limitText }}</td>
                      <td>{{ x.namaAkunKeuangan | limitText }}</td>
                      <td style="width:100px">
                        <button v-on:click="
                          pilihModalAkunKeuangan(x.id, x.kodeAkunKeuangan, x.namaAkunKeuangan)
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
            <div class="col-6">
              <div class="pagination">
                <a v-on:click="prevDataAkunKeuangan" class=""><i class="fa fa-chevron-left tx-small"></i> Prev</a>
                <a v-for="x in pagingDataAkunKeuangan" :key="x.index" v-on:click="navData(x.index)"
                  v-bind:class="{ active: pagingStatusDataAkunKeuangan[x.index] }">{{ x.number }}</a>
                <a v-on:click="nextDataAkunKeuangan" class="">Next <i class="fa fa-chevron-right tx-small"></i></a>
              </div>
            </div>
            <div class="col-4">
              <input type="text" placeholder="Cari data" v-model="keywordDataAkunKeuangan"
                v-on:keyup.enter="loadDataAkunKeuangan" />
            </div>
            <div class="col-2">
              <button v-on:click="reloadDataAkunKeuangan" style="width:100% !important">
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      showHutang: 0,
      modalInfo: false,
      modalInfoText: "",
      modalAkunKeuangan: false,
      tipeAkun: "",
      pendapatanLainDebit: { id: "", nama: "" },
      pendapatanLainKredit: { id: "", nama: "" },
      pengeluaranLainDebit: { id: "", nama: "" },
      pengeluaranLainKredit: { id: "", nama: "" },
      penjualanDebit: { id: "", nama: "" },
      penjualanKredit: { id: "", nama: "" },
      pembelianDebit: { id: "", nama: "" },
      pembelianKredit: { id: "", nama: "" },
      returPenjualanDebit: { id: "", nama: "" },
      returPenjualanKredit: { id: "", nama: "" },
      returPembelianDebit: { id: "", nama: "" },
      returPembelianKredit: { id: "", nama: "" },
      hutangDebit: { id: "", nama: "" },
      hutangKredit: { id: "", nama: "" },
      pembayaranHutangDebit: { id: "", nama: "" },
      pembayaranHutangKredit: { id: "", nama: "" },
      piutangDebit: { id: "", nama: "" },
      piutangKredit: { id: "", nama: "" },
      pembayaranPiutangDebit: { id: "", nama: "" },
      pembayaranPiutangKredit: { id: "", nama: "" },
      resData: [],
      namaOutlet: "",
      alamatOutlet: "",
      nohpOutlet: "",
      defaultTax: 0,
      tipeStruk: "struk",
      jenisUsaha: "retail",
      periodeAkuntansi: "1-12",
      resDataSuplier: {},
      resDataCustomer: {},
      idCustomer: "",
      idSuplier: "",
      resDataAkunKeuangan: [],
      pagingDataAkunKeuangan: [],
      pagenoDataAkunKeuangan: 0,
      sortByDataAkunKeuangan: "kodeAkunKeuangan",
      sortTypeDataAkunKeuangan: "asc",
      activeDataAkunKeuangan: "active",
      keywordDataAkunKeuangan: "",
      pagingStatusDataAkunKeuangan: [],
      dataSizeDataAkunKeuangan: 50,
    };
  },
  methods: {
    loadData() {
      this.$axios.get(this.$url + "outlet/getdatabyid/" + this.$idOutlet).then((response) => {
        let dataOutlet = response.data;
        console.log(dataOutlet);
        this.namaOutlet = dataOutlet.namaOutlet;
        this.alamatOutlet = dataOutlet.alamatOutlet;
        this.nohpOutlet = dataOutlet.nohpOutlet;
        this.defaultTax = dataOutlet.tax;
        let linkAkun = JSON.parse(dataOutlet.settings);

        this.pendapatanLainDebit = linkAkun.akunPendapatanLainDebit;
        this.pendapatanLainKredit = linkAkun.akunPendapatanLainKredit;
        this.pengeluaranLainDebit = linkAkun.akunPengeluaranLainDebit;
        this.pengeluaranLainKredit = linkAkun.akunPengeluaranLainKredit;

        this.penjualanDebit = linkAkun.akunPenjualanDebit;
        this.penjualanKredit = linkAkun.akunPenjualanKredit;
        this.pembelianDebit = linkAkun.akunPembelianDebit;
        this.pembelianKredit = linkAkun.akunPembelianKredit;
        this.returPenjualanDebit = linkAkun.akunReturPenjualanDebit;
        this.returPenjualanKredit = linkAkun.akunReturPenjualanKredit;
        this.returPembelianDebit = linkAkun.akunReturPembelianDebit;
        this.returPembelianKredit = linkAkun.akunReturPembelianKredit;
        this.hutangDebit = linkAkun.akunHutangDebit;
        this.hutangKredit = linkAkun.akunHutangKredit;
        this.pembayaranHutangDebit = linkAkun.akunPembayaranHutangDebit;
        this.pembayaranHutangKredit = linkAkun.akunPembayaranHutangKredit;
        this.piutangDebit = linkAkun.akunPiutangDebit;
        this.piutangKredit = linkAkun.akunPiutangKredit;
        this.pembayaranPiutangDebit = linkAkun.akunPembayaranPiutangDebit;
        this.pembayaranPiutangKredit = linkAkun.akunPembayaranPiutangKredit;
        this.tipeStruk = linkAkun.tipeStruk;
        this.jenisUsaha = linkAkun.jenisUsaha;
        this.idCustomer = linkAkun.defaultCustomer;
        this.idSuplier = linkAkun.defaultSuplier;
        this.periodeAkuntansi = linkAkun.periodeAkuntansi;

        //set setting to current
        /*this.$tax = dataOutlet.tax;
        this.$namaOutlet = dataOutlet.namaOutlet;
        this.$alamatOutlet = dataOutlet.alamatOutlet;
        this.$nohpOutlet = dataOutlet.nohpOutlet;
        this.$settings = linkAkun;*/

      });
    },
    closeModalInfo() {
      this.modalInfoText = "";
      this.modalInfo = false;
    },
    showModalInfo(message) {
      this.modalInfoText = message;
      this.modalInfo = true;
    },
    showModalAkunKeuangan(tipeAkun) {
      this.tipeAkun = tipeAkun;
      this.loadDataAkunKeuangan();
      this.modalAkunKeuangan = true;
    },
    simpanPengaturan() {
      let settingData = {
        akunPengeluaranLainDebit: this.pengeluaranLainDebit,
        akunPengeluaranLainKredit: this.pengeluaranLainKredit,

        akunPendapatanLainDebit: this.pendapatanLainDebit,
        akunPendapatanLainKredit: this.pendapatanLainKredit,

        akunPenjualanDebit: this.penjualanDebit,
        akunPenjualanKredit: this.penjualanKredit,
        akunPembelianDebit: this.pembelianDebit,
        akunPembelianKredit: this.pembelianKredit,
        akunReturPenjualanDebit: this.returPenjualanDebit,
        akunReturPenjualanKredit: this.returPenjualanKredit,
        akunReturPembelianDebit: this.returPembelianDebit,
        akunReturPembelianKredit: this.returPembelianKredit,
        akunHutangDebit: this.hutangDebit,
        akunHutangKredit: this.hutangKredit,
        akunPembayaranHutangDebit: this.pembayaranHutangDebit,
        akunPembayaranHutangKredit: this.pembayaranHutangKredit,
        akunPiutangDebit: this.piutangDebit,
        akunPiutangKredit: this.piutangKredit,
        akunPembayaranPiutangDebit: this.pembayaranPiutangDebit,
        akunPembayaranPiutangKredit: this.pembayaranPiutangKredit,
        tipeStruk: this.tipeStruk,
        jenisUsaha: this.jenisUsaha,
        defaultCustomer: this.idCustomer,
        defaultSuplier: this.idSuplier,
        periodeAkuntansi: this.periodeAkuntansi,
      };
      let data = {
        namaOutlet: this.namaOutlet,
        alamatOutlet: this.alamatOutlet,
        nohpOutlet: this.nohpOutlet,
        tax: this.defaultTax,
        settings: JSON.stringify(settingData),
      };
      this.$axios
        .put(this.$url + "outlet/updatedata/" + this.$idOutlet, JSON.stringify(data), {
          headers: { "Content-Type": "application/json" },
        })
        .then((response) => {
          this.showModalInfo(response.data.message);
          this.loadData();
        });
    },
    closeModalAkunKeuangan() {
      this.resDataAkunKeuangan = [];
      this.modalAkunKeuangan = false;
    },
    loadDataAkunKeuangan() {
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
        });
      this.$set(this.pagingStatusDataAkunKeuangan, this.pagenoDataAkunKeuangan, true);
    },
    nextDataAkunKeuangan() {
      if (this.pagenoDataAkunKeuangan < this.pagingDataAkunKeuangan.length - 1) {
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
      this.sortByDataAkunKeuangan = sortByDataAkunKeuangan;
      if (this.sortTypeDataAkunKeuangan == "asc") {
        this.sortTypeDataAkunKeuangan = "desc";
      } else {
        this.sortTypeDataAkunKeuangan = "asc";
      }
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
        });
    },
    navDataAkunKeuangan(pagenoDataAkunKeuangan) {
      this.pagenoDataAkunKeuangan = pagenoDataAkunKeuangan;
      this.pagingStatusDataAkunKeuangan = [];
      this.$axios
        .get(
          this.$url +
          "akunkeuangan/getdatabykey/" +
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
        });
      for (let i = 0; i < this.pagingStatusDataAkunKeuangan.length; i++) {
        this.pagingStatusDataAkunKeuangan.push(false);
      }
      this.$set(this.pagingStatusDataAkunKeuangan, pagenoDataAkunKeuangan, true);
    },
    reloadDataAkunKeuangan() {
      this.keywordDataAkunKeuangan = "";
      this.loadDataAkunKeuangan();
    },
    pilihModalAkunKeuangan(idAkunKeuangan, kodeAkunKeuangan, namaAkunKeuangan) {
      switch (this.tipeAkun) {
        case "penjualanDebit":
          this.penjualanDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "penjualanKredit":
          this.penjualanKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;

        case "pembelianDebit":
          this.pembelianDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "pembelianKredit":
          this.pembelianKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;

        case "returPenjualanDebit":
          this.returPenjualanDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "returPenjualanKredit":
          this.returPenjualanKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;

        case "returPembelianDebit":
          this.returPembelianDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "returPembelianKredit":
          this.returPembelianKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;

        case "hutangDebit":
          this.hutangDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "hutangKredit":
          this.hutangKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;

        case "pembayaranHutangDebit":
          this.pembayaranHutangDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "pembayaranHutangKredit":
          this.pembayaranHutangKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;

        case "piutangDebit":
          this.piutangDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "piutangKredit":
          this.piutangKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "pembayaranPiutangDebit":
          this.pembayaranPiutangDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "pembayaranPiutangKredit":
          this.pembayaranPiutangKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "pendapatanLainDebit":
          this.pendapatanLainDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "pendapatanLainKredit":
          this.pendapatanLainKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "pengeluaranLainDebit":
          this.pengeluaranLainDebit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
        case "pengeluaranLainKredit":
          this.pengeluaranLainKredit = {
            id: idAkunKeuangan,
            nama: kodeAkunKeuangan + " - " + namaAkunKeuangan,
          };
          break;
      }
      this.closeModalAkunKeuangan();
    },
    loadDataSuplier() {
      this.$axios
        .get(this.$url + "kartukontak/getdatabytipe/" + this.$idOutlet + "/0")
        .then((response) => {
          this.resDataSuplier = response.data;
          console.log(response);
        });
    },
    loadDataCustomer() {
      this.$axios
        .get(this.$url + "kartukontak/getdatabytipe/" + this.$idOutlet + "/1")
        .then((response) => {
          this.resDataCustomer = response.data;
          console.log(response);
        });
    },
  },
  mounted() {
    this.loadData();
    this.loadDataCustomer();
    this.loadDataSuplier();
  },
};
</script>