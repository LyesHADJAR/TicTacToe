from flask import Flask, request, jsonify, render_template
from minimax import MiniMaxAgent
from tictactoe import TicTacToe

app = Flask(__name__, static_folder='static', template_folder='templates')

@app.route('/')              
def index():
    return render_template('index.html')

@app.route('/pvp', methods=["GET"])  # Changed to GET since wer're not making a post request 

def pvp():
    return render_template('pvp.html')

@app.route('/pve', methods=["POST"])
def pve():
    data = request.get_json()
    h_symbol = data['h_symbol']
    c_symbol = data['c_symbol']
    first_move = data['first_move']
    game = TicTacToe(h_symbol, c_symbol, 9, 9)

    if first_move == 'computer':
        agent = MiniMaxAgent(game)
        agent.play()

    return jsonify({'board': game.board, 'game_over': game.game_over(game.board), 'winner': None})

@app.route('/pve/play', methods=['POST'])
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
            'winner': game.goal_test(game.board, game.comp) or game.goal_test(game.board, game.human)
        })
    else:
        return jsonify({'board': game.board, 'game_over': True, 'winner': None})

if __name__ == '__main__':
    app.run(debug=True)
