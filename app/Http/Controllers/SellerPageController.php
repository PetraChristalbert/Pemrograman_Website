<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class SellerPageController extends Controller
{
    public function show(Request $request, $UserID)
    {
        return view('/TeamViewers/Marketplace/SellerPage', [ 'UserID' => $UserID ]);
    }

}
