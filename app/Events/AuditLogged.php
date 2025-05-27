<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use OwenIt\Auditing\Models\Audit;

class AuditLogged implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $audit;

    public function __construct(Audit $audit)
    {
        $this->audit = $audit;
    }

    public function broadcastOn()
    {
        return new Channel('audits');
    }
}
