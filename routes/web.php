<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\DownloadController;
use App\Http\Controllers\EditProductController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\SellerPageController;
use App\Http\Controllers\ShoppingPageController;

Route::get('/', function () {
    return view('TeamViewersHome');
});

// Route::get('TeamViewers/Download', 'App\Http\Controllers\DownloadController@downloadApk');
Route::get('TeamViewers/Download', [DownloadController::class, 'downloadApk']);

// Route::get('/TeamViewers/Marketplace/Product/{information}', [ProductController::class, 'show']);


Route::get('/TeamViewers/KebijakanPrivasi', function () {
    return view('KebijakanPrivasi');
});

Route::redirect('TeamViewers/Community', 'https://chat.whatsapp.com/FgMlWhYU1WdK3QRgqx4p2Y');

// TeamViewers Marketplace

Route::get('/TeamViewers/Marketplace/LandingPage', function () {
    return view('/TeamViewers/Marketplace/LandingPage');
});

Route::get('/TeamViewers/Marketplace/ShoppingPage/{UserID}', [ShoppingPageController::class, 'show']);
Route::get('/TeamViewers/Marketplace/ProductDetail/{UserID}/{ProductID}', [ProductDetailController::class, 'show']);
Route::get('/TeamViewers/Marketplace/SellerPage/{UserID}', [SellerPageController::class, 'show']);
Route::get('/TeamViewers/Marketplace/EditProduct/{UserID}/{ProductID}', [EditProductController::class, 'show']);




