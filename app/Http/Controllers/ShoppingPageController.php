<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class ShoppingPageController extends Controller
{
    public function show(Request $request, $UserID)
    {
        return view('/TeamViewers/Marketplace/ShoppingPage', [ 'UserID' => $UserID ]);
    }

}
