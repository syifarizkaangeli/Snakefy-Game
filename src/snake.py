class Snake:
    def __init__(self, cell_size):
        self.cell_size = cell_size
        self.reset()

    def reset(self):
        self.body = [(400, 300)]
        self.dx = self.cell_size
        self.dy = 0

    def move(self):
        head_x, head_y = self.body[0]

        new_head = (
            head_x + self.dx,
            head_y + self.dy
        )

        self.body.insert(0, new_head)
        self.body.pop()

    def grow(self):
        tail = self.body[-1]
        self.body.append(tail)

    def head(self):
        return self.body[0]

    def collision_self(self):
        return self.head() in self.body[1:]