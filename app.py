from flask import Flask, request, jsonify, templating
from minimax import MiniMaxAgent
from tictactoe import TicTacToe

app = Flask(__name__)

@app.route('/')              # This is the home page
                             # We need to create where the user is welcomed
                             # and can choose between the PvP mode or PvE mode
def index():
    return templating.render_template('index.html')

@app.route('/pvp', ["POST"]) # pvp for player vs player
                             # Here we just load the game that you have creted 
def pvp():
    return templating.render_template('pvp.html')

@app.route('/pve', methods=["POST"]) # pve for player vs environment
                                     # Here I created the game and the computer will play first
                                     # first we cann the function pve that will create the game
                                     # after getting his choices we need to start the game
                                     # we need AJAX to avoid the page reload after each move
def pve():
    # Set up the game
    data = request.get_json()
    h_symbol = data['h_symbol']
    c_symbol = data['c_symbol']
    first_move = data['first_move']
    game = TicTacToe(h_symbol, c_symbol, 9, 9)
    
    # decide who plays first based on the user's choice
    # we need to recieve the first move
    if first_move == 'computer':
        agent = MiniMaxAgent(game)
        agent.play()
    return jsonify(game.board)

@app.route('/pve/play', methods=['POST']) # Here we need to play the game
                                          # we need the frontend for this + AJAX to avoid loading the page 
                                          # after each move
def play():
    data = request.get_json()
    board = data['board']
    h_symbol = data['h_symbol']
    c_symbol = data['c_symbol']

    game = TicTacToe(h_symbol, c_symbol, 9, 9)
    game.board = board
    agent = MiniMaxAgent(game)

    if not game.game_over(game.board):
        agent.play()
        return jsonify({
                        'board': game.board,
                        'game_over': game.game_over(game.board),
                        'winner': game.goal_test(game.board, game.comp) or game.goal_test(game.board, game.human)})

