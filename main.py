import pygame
import sys

from settings import *
from src.snake import Snake
from src.food import Food
from src.utils import load_highscore, save_highscore

pygame.init()

screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Snakefy Neon Edition")

clock = pygame.time.Clock()

font = pygame.font.SysFont("Arial", 30)
big_font = pygame.font.SysFont("Arial", 60)

snake = Snake(CELL_SIZE)
food = Food(WIDTH, HEIGHT, CELL_SIZE)

score = 0
highscore = load_highscore()

game_started = False
game_over = False

pulse = 0
pulse_dir = 1

running = True

while running:

    speed = FPS + score // 5
    clock.tick(speed)

    pulse += pulse_dir

    if pulse > 4:
        pulse_dir = -1

    if pulse < -4:
        pulse_dir = 1

    for event in pygame.event.get():

        if event.type == pygame.QUIT:
            running = False

        if not game_started:

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    game_started = True

        elif not game_over:

            if event.type == pygame.KEYDOWN:

                if event.key == pygame.K_UP and snake.dy == 0:
                    snake.dx = 0
                    snake.dy = -CELL_SIZE

                elif event.key == pygame.K_DOWN and snake.dy == 0:
                    snake.dx = 0
                    snake.dy = CELL_SIZE

                elif event.key == pygame.K_LEFT and snake.dx == 0:
                    snake.dx = -CELL_SIZE
                    snake.dy = 0

                elif event.key == pygame.K_RIGHT and snake.dx == 0:
                    snake.dx = CELL_SIZE
                    snake.dy = 0

        else:

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_r:

                    snake.reset()
                    food.position = food.spawn()

                    score = 0
                    game_over = False

    if game_started and not game_over:

        snake.move()

        head = snake.head()

        if (
            head[0] < 0
            or head[0] >= WIDTH
            or head[1] < 0
            or head[1] >= HEIGHT
        ):
            game_over = True

        if snake.collision_self():
            game_over = True

        if head == food.position:

            score += 1

            snake.grow()
            food.position = food.spawn()

            if score > highscore:
                highscore = score
                save_highscore(highscore)

    screen.fill(BG_COLOR)

    for x in range(0, WIDTH, CELL_SIZE):
        pygame.draw.line(screen, GRID_COLOR, (x, 0), (x, HEIGHT))

    for y in range(0, HEIGHT, CELL_SIZE):
        pygame.draw.line(screen, GRID_COLOR, (0, y), (WIDTH, y))

    pygame.draw.circle(
        screen,
        FOOD_COLOR,
        (
            food.position[0] + CELL_SIZE // 2,
            food.position[1] + CELL_SIZE // 2
        ),
        CELL_SIZE // 2 + pulse
    )

    for i, segment in enumerate(snake.body):

        color = HEAD_COLOR if i == 0 else BODY_COLOR

        pygame.draw.rect(
            screen,
            color,
            (
                segment[0],
                segment[1],
                CELL_SIZE,
                CELL_SIZE
            ),
            border_radius=6
        )

    if snake.body:

        head = snake.head()

        pygame.draw.circle(
            screen,
            WHITE,
            (head[0] + 6, head[1] + 6),
            2
        )

        pygame.draw.circle(
            screen,
            WHITE,
            (head[0] + 14, head[1] + 6),
            2
        )

    score_text = font.render(f"Score: {score}", True, WHITE)
    high_text = font.render(f"High Score: {highscore}", True, WHITE)

    screen.blit(score_text, (10, 10))
    screen.blit(high_text, (10, 45))

    if not game_started:

        title = big_font.render("SNAKEFY", True, HEAD_COLOR)
        start = font.render("Press SPACE to Start", True, WHITE)

        screen.blit(
            title,
            (WIDTH // 2 - title.get_width() // 2, HEIGHT // 2 - 70)
        )

        screen.blit(
            start,
            (WIDTH // 2 - start.get_width() // 2, HEIGHT // 2 + 10)
        )

    if game_over:

        over = big_font.render("GAME OVER", True, FOOD_COLOR)

        restart = font.render(
            "Press R to Restart",
            True,
            WHITE
        )

        screen.blit(
            over,
            (WIDTH // 2 - over.get_width() // 2, HEIGHT // 2 - 60)
        )

        screen.blit(
            restart,
            (WIDTH // 2 - restart.get_width() // 2, HEIGHT // 2 + 10)
        )

    pygame.display.flip()

pygame.quit()
sys.exit()