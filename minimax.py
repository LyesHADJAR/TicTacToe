from math import inf as infinity
import random

class MiniMaxAgent():
    def __init__(self, game):
        self.game = game
        
    def minimax(self, state, depth, player):
        """
        AI function that choice the best move
        :param state: current state of the board
        :param depth: node index in the tree (0 <= depth <= 9),
        but never nine in this case (see iaturn() function)
        :param player: an human or a computer
        :return: a list with [the best row, best col, best score]
        """
        """ Follow these steps to create your minimax method"""
        if player == self.game.comp:
            best = [-1, -1, -infinity]
        else:
          best = [-1, -1, +infinity]
        
        if depth == 0 or self.game.game_over(state):
          score = self.game.evaluate(state)
          return [-1, -1, score]
        
        for cell in self.game.empty_cells(state):
            x, y = cell[0], cell[1]
            state[x][y] = player
            score = self.minimax(state, depth - 1, -player)
            state[x][y] = 0
            score[0], score[1] = x, y
            
            if player == self.game.comp:
              if score[2] > best[2]:
                best = score
            else:
              if score[2] < best[2]:
                best = score
                
        return best

    def play(self):
        """
        It calls the minimax function if the depth < 9,
        else it choices a random coordinate.
        :param c_choice: computer's choice X or O
        :param h_choice: human's choice X or O
        :return:
        """
        depth  = len(self.game.empty_cells(self.game.board))
        if depth == 0 or self.game.game_over(self.game.board):
            return
        if depth == 9:
          x = random.randint(0, 2)
          y = random.randint(0, 2)
        else:
          move = self.minimax(self.game.board, depth, self.game.comp)
          x, y = move[0], move[1]
        self.game.set_move(x, y, self.game.comp)
