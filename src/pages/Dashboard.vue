<template>
  <div class="Dashboard">
    <div class="row" style="margin-top: 1%">
      <div class="col-3">
        <div class="box-material bg-green tx-white">
          <div style="padding:10px">
            <div>Total Penjualan Hari ini</div>
            <span style="display: inline;"><i class="fa fa-shopping-cart tx-xlarge"></i></span>
            <span class="tx-large tx-bold" style="display:inline;float:right">
              {{ resData.totalPenjualanHariIni.value | formatNumber }}
            </span>
          </div>
        </div>
      </div>

      <div class="col-3">
        <div class="box-material bg-orange tx-white">
          <div style="padding:10px">
            <div>Total Penjualan Bulan ini</div>
            <span style="display: inline;"><i class="fa fa-shopping-cart tx-xlarge"></i></span>
            <span class="tx-large tx-bold" style="display:inline;float:right">
              {{ resData.totalPenjualanBulanIni.value | formatNumber }}
            </span>
          </div>
        </div>
      </div>

      <div class="col-3">
        <div class="box-material bg-blue tx-white">
          <div style="padding:10px">
            <div>Total Pembelian Hari Ini</div>
            <span style="display: inline;"><i class="fa fa-money tx-xlarge"></i></span>
            <span class="tx-large tx-bold" style="display:inline;float:right">
              {{ resData.totalPembelianHariIni.value | formatNumber }}
            </span>
          </div>
        </div>
      </div>

      <div class="col-3">
        <div class="box-material bg-red tx-white">
          <div style="padding:10px">
            <div>Total Pembelian Bulan Ini</div>
            <span style="display: inline;"><i class="fa fa-money tx-xlarge"></i></span>
            <span class="tx-large tx-bold" style="display:inline;float:right">
              {{ resData.totalPembelianBulanIni.value | formatNumber }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-4">
        <div class="panel">
          <div class="panel-header">
            Grafik Penjualan Bulan ini
          </div>
          <div class="panel-body">
            <gjual :chart-data="chartDataPenjualan" :options="chartOptions"></gjual>
          </div>
        </div>
      </div>

      <div class="col-4">
        <div class="panel">
          <div class="panel-header">
            TOP Selling Bulan Ini
          </div>
          <div class="panel-body">
            <gtopsell :chart-data="chartDataTopSelling" :options="chartOptions"></gtopsell>
          </div>
        </div>
      </div>
      <div class="col-4">
        <div class="panel">
          <div class="panel-header">
            Stok Overview
          </div>
          <div class="panel-body">
            <div class="table-box" style="height: 400px;">
              <table class="table-minimal">
                <thead>
                  <tr>
                    <th>
                      Kode
                    </th>
                    <th>
                      Nama
                    </th>
                    <th>
                      Jumlah
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="x in resData.stokOverview" :key="x.id">
                    <td>{{ x.kodeBarang }}</td>
                    <td>{{ x.namaBarang }}</td>
                    <td>{{ x.jumlahBarang | formatNumber }} {{ x.satuanBarang | limitText }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <pbar v-if="modalProgress == true"></pbar>
  </div>
</template>
<script>
import gjual from "../components/LineChart.js";
import gtopsell from "../components/BarChart.js";
import pbar from "../components/ProgressBar";

export default {
  components: {
    gjual,
    gtopsell,
    pbar,
  },
  data() {
    return {
      resData: {},
      modalProgress: false,
      chartDataPenjualan: {},
      chartDataTopSelling: {},
      chartOptions: {},
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    fillDataChartPenjualan(labels, dataSets) {
      this.chartDataPenjualan = {
        labels: labels,
        datasets: [
          {
            label: "",
            fill: false,
            borderColor: "rgba(132, 12, 245, 0.5)",
            data: dataSets,
          },
        ],
      };
    },
    fillDataChartTopSelling(labels, dataSets) {
      this.chartDataTopSelling = {
        labels: labels,
        datasets: [
          {
            label: "",
            backgroundColor: [
              "rgba(16, 179, 95, 0.5)",
              "rgba(211, 214, 11, 0.5)",
              "rgba(194, 15, 214, 0.5)",
              "rgba(252, 3, 36, 0.5)",
              "rgba(3, 111, 252, 0.5)",
              "rgba(104, 227, 227, 0.5)",
              "rgba(237, 111, 26, 0.5)",
              "rgba(132, 12, 245, 0.5)",
            ],
            borderColor: "rgba(132, 12, 245, 0.5)",
            data: dataSets,
          },
        ],
      };
    },
    showProgress() {
      this.modalProgress = true;
    },
    closeProgress() {
      this.modalProgress = false;
    },
    loadData() {

      this.$axios.get(this.$url + "dashboard/chart/" + this.$idOutlet).then((response) => {
        this.resData = response.data;
        console.log(response);
        let chartPenjualanDataset = [];
        let chartPenjualanLabel = [];
        for (let i = 0; i < response.data.chartPenjualan.length; i++) {
          chartPenjualanDataset.push(response.data.chartPenjualan[i].value);
          chartPenjualanLabel.push(response.data.chartPenjualan[i].label);
        }
        this.fillDataChartPenjualan(chartPenjualanLabel, chartPenjualanDataset);

        let chartTopSellingDataset = [];
        let chartTopSellingLabel = [];
        for (let i = 0; i < response.data.chartTopSelling.length; i++) {
          chartTopSellingDataset.push(response.data.chartTopSelling[i].value);
          chartTopSellingLabel.push(response.data.chartTopSelling[i].label);
        }
        this.fillDataChartTopSelling(chartTopSellingLabel, chartTopSellingDataset);

        this.chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
        };

      });
    },
  },
};
</script>