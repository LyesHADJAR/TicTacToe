from flask import Flask, request, jsonify, templating
from minimax import MiniMaxAgent
from tictactoe import TicTacToe

app = Flask(__name__)

@app.route('/')
def index():
    return templating.render_template('index.html')

@app.route('/play', methods=['POST'])
def play():
    data = request.get_json()
    h_symbol = data['h_symbol']
    c_symbol = data['c_symbol']
    depth = data['depth']
    size = data['size']
    board = data['board']
    game = TicTacToe(h_symbol, c_symbol, depth, size)
    game.board = board
    agent = MiniMaxAgent(game)
    agent.play()
    return jsonify(game.board)

if __name__ == '__main__':
    app.run(debug=True)
