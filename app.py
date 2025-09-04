from flask import Flask, request, jsonify, render_template
from minimax import MiniMaxAgent
from tictactoe import TicTacToe
import logging

app = Flask(__name__, static_folder='static', template_folder='templates')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def validate_game_data(data):
    """Validate game data input"""
    required_fields = ['h_symbol', 'c_symbol', 'first_move']
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")
    
    if data['h_symbol'] not in ['X', 'O']:
        raise ValueError("Invalid symbol choice. Must be X or O")
    
    if data['first_move'] not in ['computer', 'player']:
        raise ValueError("Invalid first move choice. Must be 'computer' or 'player'")
    
    return True

@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Invalid request data'}), 400

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

@app.route('/')              
def index():
    return render_template('index.html')

@app.route('/pvp', methods=["GET"])  # Changed to GET since wer're not making a post request 

def pvp():
    return render_template('pvp.html')

@app.route('/pve', methods=["POST", "GET"])
def pve():
    try:
        if request.method == 'GET':
            return render_template('pve.html')
        
        data = request.get_json()
        if not data:
            raise ValueError("No JSON data received")
        
        # Validate input data
        validate_game_data(data)
        
        h_symbol = data['h_symbol']
        c_symbol = data['c_symbol']
        first_move = data['first_move']
        game = TicTacToe(h_symbol, c_symbol, 9, 9)

        if first_move == 'computer':
            agent = MiniMaxAgent(game)
            agent.play()

        winner = None
        if game.goal_test(game.board, game.comp):
            winner = game.c_symbol
        elif game.goal_test(game.board, game.human):
            winner = game.h_symbol
        return jsonify({'board': game.board, 'game_over': game.game_over(game.board), 'winner': winner})
    except ValueError as e:
        logger.warning(f"Validation error in /pve route: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error in /pve route: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/pve/play', methods=['POST', 'GET'])
def play():
    try:
        if request.method == 'GET':
            return render_template('pve.html')
        
        data = request.get_json()
        if not data:
            raise ValueError("No JSON data received")
        
        # Validate required fields
        required_fields = ['board', 'h_symbol', 'c_symbol']
        for field in required_fields:
            if field not in data:
                raise ValueError(f"Missing required field: {field}")
        
        board = data['board']
        h_symbol = data['h_symbol']
        c_symbol = data['c_symbol']
        
        # Validate board structure
        if not isinstance(board, list) or len(board) != 3:
            raise ValueError("Invalid board structure")
        
        for row in board:
            if not isinstance(row, list) or len(row) != 3:
                raise ValueError("Invalid board structure")

        game = TicTacToe(h_symbol, c_symbol, 9, 9)
        game.board = board
        agent = MiniMaxAgent(game)

        if not game.game_over(game.board):
            agent.play()
            winner = None
            if game.goal_test(game.board, game.comp):
                winner = game.c_symbol
            elif game.goal_test(game.board, game.human):
                winner = game.h_symbol
            return jsonify({
                'board': game.board,
                'game_over': game.game_over(game.board),
                'winner': winner
            })
        else:
            return jsonify({'board': game.board, 'game_over': True, 'winner': None})
    
    except ValueError as e:
        logger.warning(f"Validation error in /pve/play route: {e}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Unexpected error in /pve/play route: {e}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

if __name__ == '__main__':
    app.run(debug=True)


