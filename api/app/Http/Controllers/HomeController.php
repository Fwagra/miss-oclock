<?php

namespace App\Http\Controllers;

use App\Game;
use App\Question;
use App\Performance;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $games = Game::orderBy('id', 'desc')->get();
        $questions = Question::orderBy('id', 'desc')->get();
        return view('home', compact('games', 'questions', 'performances'));
    }
}
