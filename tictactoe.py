from math import inf as infinity
import random
import platform
from os import system
from minimax import MiniMaxAgent

class TicTacToe():
    def __init__(self, h_symbol = '', c_symbol = '', depth = 9, size = 9):
        self.human = -1
        self.comp = +1
        self.board = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0],
                      ]
        self.h_symbol = h_symbol
        self.c_symbol = c_symbol
        self.depth = depth
        self.size = size
        self.heuristic = [[0, -.25, -.5, -.75, -1], [.25, 0, 0, 0, 0], [.5, 0, 0, 0, 0], [.75, 0, 0, 0, 0], [1, 0, 0, 0, 0]]
            
    
    def goal_test(self, state, player):
        """
        This method checks if a player wins. 
        Possibilities:
        * Three rows    [X X X] or [O O O]
        * Three cols    [X X X] or [O O O]
        * Two diagonals [X X X] or [O O O]

        :param state: the state of the current board.
        :param player: the human or the Agent.
        :return: True if the player wins, False otherwise.
        """
        # Check rows and columns
        for i in range(3):
            if all([state[i][j] == player for j in range(3)]) or all([state[j][i] == player for j in range(3)]):
                return True
        # Check diagonals
        if all([state[i][i] == player for i in range(3)]) or all([state[i][2 - i] == player for i in range(3)]):
            return True
        return False

    def game_over(self, state):
        """
        This function tests if the human or computer wins or if the board is full.
        :param state: the state of the current board
        :return: True if the human or computer wins or if the board is full
        """
        return self.goal_test(state, self.human) or self.goal_test(state, self.comp) or len(self.empty_cells(state)) == 0
      
    def empty_cells(self, state):
        """
        Each empty cell will be added into cells' list
        :param state: the state of the current board
        :return: a list of empty cells
        """
        cells = []
        
        for x, row in enumerate(state):
            for y, cell in enumerate(row):
              if cell == 0:
                cells.append([x, y])
        return cells

    def valid_move(self, x, y):
        """
        A move is valid if the chosen cell is empty
        :param x: X coordinate
        :param y: Y coordinate
        :return: True if the board[x][y] is empty
        """
        if [x, y] in self.empty_cells(self.board):
            return True
        return False
        
    def set_move(self, x, y, player):
        """
        Set the move on the board, if the coordinates are valid
        :param x: X coordinate
        :param y: Y coordinate
        :param player: the current player
        """
        if self.valid_move(x, y):
            self.board[x][y] = player
            return True
        return False
        
    
    def clean(self):
        """
        Clears the console
        """
        os_name = platform.system().lower()
        if 'windows' in os_name:
            system('cls')
        else:
            system('clear')


    def render(self, state):
        """
        Print the board on console
        :param state: current state of the board
        """
        chars = {
            -1: self.h_symbol,
            +1: self.c_symbol,
            0: ' '
        }
        str_line = '---------------'

        print('\n' + str_line)
        for row in state:
            for cell in row:
                symbol = chars[cell]
                print(f'| {symbol} |', end='')
            print('\n' + str_line)
    
    def human_turn(self):
        """
        The Human plays choosing a valid move.
        :param c_choice: computer's choice X or O
        :param h_choice: human's choice X or O
        :return:
        """
        if self.depth == 0 or self.game_over(self.board):
            return

        # Dictionary of valid moves
        move = -1
        moves = {
            1: [0, 0], 
            2: [0, 1], 
            3: [0, 2],
            4: [1, 0], 
            5: [1, 1], 
            6: [1, 2],
            7: [2, 0], 
            8: [2, 1], 
            9: [2, 2],
        }

        self.clean()
        print(f'Your turn [{self.h_symbol}]')
        self.render(self.board)

        while move < 1 or move > 9:
            try:
                move = int(input('(1..9): '))
                coord = moves[move]
                can_move = self.set_move(coord[0], coord[1], self.human)
                if not can_move:
                    print('Bad move')
                    move = -1
            except (EOFError, KeyboardInterrupt):
                print('Good Bye!')
                exit()
            except (KeyError, ValueError):
                print('Bad choice')
                
    def evaluate(self, state):
        score = 0
        player = self.comp
        other_player = self.human

        for i in range(3):
            player_score = sum(state[i][j] == player for j in range(3))
            opponent_score = sum(state[i][j] == other_player for j in range(3))
            score += self.heuristic[player_score][opponent_score]

        for j in range(3):
            player_score = sum(state[i][j] == player for i in range(3))
            opponent_score = sum(state[i][j] == other_player for i in range(3))
            score += self.heuristic[player_score][opponent_score]

        player_score = sum(state[i][i] == player for i in range(3))
        opponent_score = sum(state[i][i] == other_player for i in range(3))
        score += self.heuristic[player_score][opponent_score]

        player_score = sum(state[i][2 - i] == player for i in range(3))
        opponent_score = sum(state[i][2 - i] == other_player for i in range(3))
        score += self.heuristic[player_score][opponent_score]

        return score
    
    def run(self):
        """
        run the game: 
        Main function that calls all functions
        """
        self.clean()
        self.h_symbol = ''  # X or O
        self.c_symbol = ''  # X or O
        first = ''  # if human is the first

        # Human chooses X or O to play
        while self.h_symbol != 'O' and self.h_symbol != 'X':
            try:
                print('')
                self.h_symbol = input('Choose X or O\nChosen: ').upper()
            except (EOFError, KeyboardInterrupt):
                print('Bye')
                exit()
            except (KeyError, ValueError):
                print('Bad choice')

        # Setting agent's choice
        if self.h_symbol == 'X':
            self.c_symbol = 'O'
        else:
            self.c_symbol = 'X'

        # Human may starts first
        self.clean()
        while first != 'Y' and first != 'N':
            try:
                first = input('Do you want to start First?[y/n]: ').upper()
            except (EOFError, KeyboardInterrupt):
                print('Good Bye')
                exit()
            except (KeyError, ValueError):
                print('Bad choice')
                
        #Create AI agent, we give it the game object as parameter        
        aiAgent = MiniMaxAgent(self)
        
        # Main loop of this game
        while len(self.empty_cells(self.board)) > 0 and not self.game_over(self.board):
            if first == 'N':
                aiAgent.play()
                first = ''
                if self.game_over(self.board):
                    break
                  
            self.human_turn()
            if self.game_over(self.board):
                break
              
            aiAgent.play()
            if self.game_over(self.board):
                break

        # Game over message
        if self.goal_test(self.board, self.human):
            self.clean()
            print(f'Your turn [{self.h_symbol}]')
            self.render(self.board)
            print('YOU WIN!')
        elif self.goal_test(self.board, self.comp):
            self.clean()
            print(f'Computer turn [{self.c_symbol}]')
            self.render(self.board)
            print('YOU LOSE!')
        else:
            self.clean()
            self.render(self.board)
            print('DRAW!')
        return self.board
