<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Registry extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $table = 'registry';

    protected $fillable = [
        'surname', 'given_name', 'nationality', 'country_of_residence','national_id_number',
        'document_type', 'document_no', 'dob', 'age', 'sex', 'travel_date',
        'direction', 'accommodation_address', 'note', 'travel_reason',
        'border_post', 'destination_coming_from',
    ];

}
