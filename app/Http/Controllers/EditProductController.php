<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class EditProductController extends Controller
{
    public function show(Request $request, $UserID, $ProductID)
    {
        return view('/TeamViewers/Marketplace/EditProduct', [ 'UserID' => $UserID, 'ProductID' => $ProductID ]);
    }

}
