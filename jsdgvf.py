from pynput import keyboard
from pynput.keyboard import Controller, Key
import time
import random
PHRASE_TO_PASTE = input("phrase: ")
CHAR_DELAY = random.choice(list(range(5)))  # Delay between each character (adjust as needed)
LINE_DELAY = 2    # Delay between lines
keyboard_controller = Controller()
running = False

def type_with_delay(text, delay=CHAR_DELAY):
    """Type text with a delay between each character"""
    for char in text:
        keyboard_controller.type(char)
        time.sleep(delay)

def on_press(key):
    global running
    try:
        if hasattr(key, 'char') and key.char == '1' and not running:
            time.sleep(1)
            running = True
            print("Started typing... Press any key to stop")
            
            while running:
                # Type the phrase with character-by-character delay
                type_with_delay(PHRASE_TO_PASTE)
                
                # Wait before starting the next line
                time.sleep(LINE_DELAY)
                
                # Move to next line (press Enter)
                keyboard_controller.press(Key.enter)
                keyboard_controller.release(Key.enter)
                
    except Exception as e:
        print("Error:", e)
        running = False

def on_release(key):
    global running
    # Don't stop if it's the trigger key being released
    if hasattr(key, 'char') and key.char != '1':
        running = False
        print("Stopped typing")
    return True

with keyboard.Listener(on_press=on_press, on_release=on_release) as listener:
    print("Press '1' to start typing, press any other key to stop")
    listener.join()
