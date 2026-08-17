import pygame
import random
import sys

pygame.init()

# Window
WIDTH = 600
HEIGHT = 600
CELL_SIZE = 20

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snakefy")

# Colors
BLACK = (20, 20, 20)
GREEN = (0, 255, 100)
RED = (255, 80, 80)
WHITE = (255, 255, 255)

# Font
font = pygame.font.SysFont(None, 36)

clock = pygame.time.Clock()

# Snake
snake = [(300, 300)]
dx = CELL_SIZE
dy = 0

# Food
food = (
    random.randrange(0, WIDTH, CELL_SIZE),
    random.randrange(0, HEIGHT, CELL_SIZE)
)

score = 0


def draw_text(text, color, x, y):
    img = font.render(text, True, color)
    screen.blit(img, (x, y))


running = True

while running:
    clock.tick(10)

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP and dy == 0:
                dx = 0
                dy = -CELL_SIZE

            elif event.key == pygame.K_DOWN and dy == 0:
                dx = 0
                dy = CELL_SIZE

            elif event.key == pygame.K_LEFT and dx == 0:
                dx = -CELL_SIZE
                dy = 0

            elif event.key == pygame.K_RIGHT and dx == 0:
                dx = CELL_SIZE
                dy = 0

    # Move snake
    head_x, head_y = snake[0]
    new_head = (head_x + dx, head_y + dy)

    # Wall collision
    if (
        new_head[0] < 0 or
        new_head[0] >= WIDTH or
        new_head[1] < 0 or
        new_head[1] >= HEIGHT
    ):
        running = False

    # Self collision
    if new_head in snake:
        running = False

    snake.insert(0, new_head)

    # Eat food
    if new_head == food:
        score += 1
        food = (
            random.randrange(0, WIDTH, CELL_SIZE),
            random.randrange(0, HEIGHT, CELL_SIZE)
        )
    else:
        snake.pop()

    # Draw
    screen.fill(BLACK)

    pygame.draw.rect(
        screen,
        RED,
        (food[0], food[1], CELL_SIZE, CELL_SIZE)
    )

    for segment in snake:
        pygame.draw.rect(
            screen,
            GREEN,
            (segment[0], segment[1], CELL_SIZE, CELL_SIZE)
        )

    draw_text(f"Score: {score}", WHITE, 10, 10)

    pygame.display.flip()

pygame.quit()
sys.exit()