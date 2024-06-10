<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class ProductDetailController extends Controller
{
    public function show(Request $request, $UserID, $ProductID)
    {
        return view('/TeamViewers/Marketplace/ProductDetail', [ 'UserID' => $UserID, 'ProductID' => $ProductID ]);
    }

}
