import random


class Food:
    def __init__(self, width, height, cell_size):
        self.width = width
        self.height = height
        self.cell_size = cell_size
        self.position = self.spawn()

    def spawn(self):
        return (
            random.randrange(0, self.width, self.cell_size),
            random.randrange(0, self.height, self.cell_size)
        )