<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function show(Request $request, $information)
    {
        return view('TeamViewersProduct', [ 'detail' => $information ]);
    }

}
