import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '../pages/Dashboard'
import AkunKeuangan from '../pages/AkunKeuangan'
import Barang from '../pages/Barang'
import Catatan from '../pages/Catatan'
import Diskon from '../pages/Diskon'
import KartuKontak from '../pages/KartuKontak'
import Pembelian from '../pages/Pembelian'
import Penjualan from '../pages/Penjualan'
import Racikan from '../pages/Racikan'
import TransaksiPembelian from '../pages/TransaksiPembelian'
import TransaksiPenjualan from '../pages/TransaksiPenjualan'
import TransaksiPenjualanVdua from '../pages/TransaksiPenjualanVdua'
import Pengguna from '../pages/Pengguna'
import Laporan from '../pages/Laporan'
import KoreksiStok from '../pages/KoreksiStok'
import ReturPembelian from '../pages/ReturPembelian'
import TransaksiReturPembelian from '../pages/TransaksiReturPembelian'
import ReturPenjualan from '../pages/ReturPenjualan'
import TransaksiReturPenjualan from '../pages/TransaksiReturPenjualan'
import JurnalUmum from '../pages/JurnalUmum'
import TransaksiJurnalUmum from '../pages/TransaksiJurnalUmum'
import TransaksiJurnalCashReceipt from '../pages/TransaksiJurnalCashReceipt'
import Pengaturan from '../pages/Pengaturan'
import Hutang from '../pages/Hutang'
import PembayaranHutang from '../pages/PembayaranHutang'
import Piutang from '../pages/Piutang'
import PembayaranPiutang from '../pages/PembayaranPiutang'
import Rakitan from '../pages/Rakitan'
import ProsesRakitan from '../pages/ProsesRakitan'


Vue.use(VueRouter);
const routes = [{
    path: '/',
    name: 'dasboard',
    component: Dashboard
}, {
    path: '/akunkeuangan',
    name: 'AkunKeuangan',
    component: AkunKeuangan
}, {
    path: '/barang',
    name: 'Barang',
    component: Barang
}, {
    path: '/catatan',
    name: 'Catatan',
    component: Catatan
}, {
    path: '/diskon',
    name: 'Diskon',
    component: Diskon
}, {
    path: '/kartukontak',
    name: 'Kartukontak',
    component: KartuKontak
}, {
    path: '/penjualan',
    name: 'Penjualan',
    component: Penjualan
}, {
    path: '/pembelian',
    name: 'Pembelian',
    component: Pembelian
}, {
    path: '/racikan',
    name: 'Racikan',
    component: Racikan
}, {
    path: '/transaksipembelian',
    name: 'TransaksiPembelian',
    component: TransaksiPembelian
}, {
    path: '/transaksipenjualan',
    name: 'TransaksiPenjualan',
    component: TransaksiPenjualan

}, {
    path: '/transaksipenjualanv2',
    name: 'TransaksiPenjualanV2',
    component: TransaksiPenjualanVdua

}, {
    path: '/pengguna',
    name: 'Pengguna',
    component: Pengguna
}, {
    path: '/laporan',
    name: 'Laporan',
    component: Laporan

}, {
    path: '/koreksistok',
    name: 'KoreksiStok',
    component: KoreksiStok

}, {
    path: '/returpembelian',
    name: 'ReturPembelian',
    component: ReturPembelian

}, {
    path: '/transaksireturpembelian',
    name: 'TransaksiReturPembelian',
    component: TransaksiReturPembelian

}, {
    path: '/returpenjualan',
    name: 'ReturPenjualan',
    component: ReturPenjualan

}, {
    path: '/transaksireturpenjualan',
    name: 'TransaksiReturPenjualan',
    component: TransaksiReturPenjualan

}, {
    path: '/jurnalumum',
    name: 'JunalUmum',
    component: JurnalUmum

}, {
    path: '/transaksijurnalumum',
    name: 'TransaksiJurnalUmum',
    component: TransaksiJurnalUmum

}, {
    path: '/Transaksijurnalcashreceipt',
    name: 'TransaksiJurnalCashReceipt',
    component: TransaksiJurnalCashReceipt

}, {
    path: '/pengaturan',
    name: 'Pengaturan',
    component: Pengaturan

}, {
    path: '/hutang',
    name: 'hutang',
    component: Hutang

},
{
    path: '/pembayaranhutang',
    name: 'pembayaranhutang',
    component: PembayaranHutang

}, {
    path: '/piutang',
    name: 'piutang',
    component: Piutang

},
{
    path: '/pembayaranpiutang',
    name: 'pembayaranpiutang',
    component: PembayaranPiutang

},
{
    path: '/perakitan',
    name: 'perakitan',
    component: Rakitan

},
{
    path: '/prosesperakitan',
    name: 'prosesperakitan',
    component: ProsesRakitan

}]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

export default router