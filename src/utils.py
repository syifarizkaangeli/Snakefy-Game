def load_highscore():
    try:
        with open("highscore.txt", "r") as file:
            return int(file.read())
    except:
        return 0


def save_highscore(score):
    with open("highscore.txt", "w") as file:
        file.write(str(score))