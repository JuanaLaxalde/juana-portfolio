## SAMURAI'S KATANAS

# Code's Key Components:

1. Game Initialization (startGame):
    - Resets game variables like score, lives, character positions, and the creation of different elements such as mountains, canyons, clouds, trees, platforms, and obstacles.
    - Populates the arrays for mountains, clouds, trees, shields, collectables, and enemies.

2. Player Input Handling (keyPressed & keyReleased):
    - Detects key presses for moving left, right, and jumping.
    - When a key is released, it stops the corresponding movement.

3. Game Elements (Clouds, Mountains, Trees, Shields, Collectables):
    - The Clouds constructor creates animated clouds that move up and down.
    - Mountains and trees are created with factory functions (createMountains, createTrees) and drawn with custom shapes.
    - Shields are collectible items that the player can pick up for extra lives or score.
    - Collectables are items the player can collect for score, drawn as blades or other shapes.

4. Canyon and Collision Detection:
    - Canyons are drawn and if the player falls into them, they start plummeting, losing lives if they fall below the screen.
    - Collisions with the canyon trigger a plummet, restarting the game if the player falls.

5. Enemies:
    - The Enemy class defines an enemy character that moves back and forth within a certain range.
    - The checkEnemy function detects if the player character collides with an enemy, in which case the player loses a life.

6. Platforms:
    - Platforms are created and checked for player contact.

7. Flagpole for Level Completion:
    - The flagpole indicates the end of the level, and once reached, it triggers the completion of the level.
    - There is one flagpole to the left and another to the right, this allows the player to move in either direction.
