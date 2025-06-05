<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReportConfig extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'selected_columns',
        'filters',
        'sort_by',
        'sort_order',
    ];

    protected $casts = [
        'selected_columns' => 'json',
        'filters' => 'json',
    ];
}
