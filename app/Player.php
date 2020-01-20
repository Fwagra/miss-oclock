<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Player extends Model
{
    public function games() {
        return $this->belongsToMany('App\Game')->withPivot('step', 'winner', 'question');
    }

    public function answers()
    {
        return $this->hasMany('App\Answer');
    }

    public function voted()
    {
        return $this->hasMany('App\Vote', 'voted_player_id');
    }
}
