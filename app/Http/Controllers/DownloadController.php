<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class DownloadController extends Controller
{
    public function downloadApk()
    {
        $filePath = public_path('File_Hosting/TeamViewers.apk');
        $headers = [
            'Content-Type' => 'application/vnd.android.package-archive',
            'Content-Disposition' => 'attachment; filename="TeamViewers.apk"',
        ];

        return response()->download($filePath, 'TeamViewers.apk', $headers);
    }
}
