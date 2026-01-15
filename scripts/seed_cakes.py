#!/usr/bin/env python3
"""
Selenium script to bulk post cakes to the Sweet Treats admin dashboard.
Usage: python seed_cakes.py
"""

import time
import sys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from start_driver import start_driver
import random

# Configuration
DOMAIN = "http://localhost:8081"
ADMIN_EMAIL = "mwafrd@gmail.com"  #demo email
ADMIN_PASSWORD = "111111"  #demo password

# Cake data - modify this array to add more cakes
CAKES = [
    {
        "id": f"{i:02d}",
        "name": f"{flavor} {style} Cake",
        "description": f"A {texture} {flavor} cake with {filling} and {topping}.",
        "price": str(price),
        "image": f"https://source.unsplash.com/800x600/?cake,{flavor.replace(' ', ',')}",
        "categories": f"{category}, {occasion}",
        "flavors": f"{flavor}, {filling}",
        "toppings": f"{topping}, {decoration}",
        "sizes": '6", 8", 10"',
        "rating": f"4.{random.randint(5, 9)}",
        "reviews": str(random.randint(50, 300)),
        "bestseller": random.choice([True, False])
    }
    for i, (flavor, style, texture, filling, topping, decoration, category, occasion, price) in enumerate([
        ("Vanilla", "Dream", "fluffy", "vanilla buttercream", "sprinkles", "edible flowers", "classic", "birthday", 2500),
        ("Chocolate", "Indulgence", "rich", "chocolate ganache", "chocolate curls", "gold leaf", "chocolate", "anniversary", 2800),
        ("Strawberry", "Bliss", "light", "strawberry mousse", "fresh berries", "white chocolate shavings", "fruit", "wedding", 3000),
        ("Red Velvet", "Elegance", "velvety", "cream cheese", "raspberry drizzle", "gold dust", "classic", "valentine", 3200),
        ("Lemon", "Zest", "zesty", "lemon curd", "blueberry compote", "lemon zest", "citrus", "summer", 2700),
        ("Carrot", "Harvest", "moist", "cream cheese", "walnuts", "edible flowers", "vegetable", "easter", 2900),
        ("Coconut", "Tropical", "fluffy", "coconut cream", "toasted coconut", "lime zest", "tropical", "summer", 3100),
        ("Coffee", "Mocha", "dense", "espresso buttercream", "chocolate chips", "coffee beans", "coffee", "all-occasion", 2600),
        ("Matcha", "Zen", "delicate", "white chocolate", "red bean paste", "matcha powder", "asian", "tea-time", 3400),
        ("Black Forest", "Classic", "decadent", "cherry compote", "whipped cream", "chocolate shavings", "german", "christmas", 3300),
        ("Tiramisu", "Italian", "creamy", "mascarpone", "cocoa powder", "espresso drizzle", "italian", "dinner-party", 3500),
        ("Pistachio", "Delight", "nutty", "pistachio cream", "chopped pistachios", "rose petals", "nut", "bridal-shower", 3600),
        ("Salted Caramel", "Decadence", "buttery", "salted caramel", "caramel drizzle", "sea salt", "caramel", "birthday", 3200),
        ("Raspberry", "Delight", "tangy", "raspberry mousse", "fresh raspberries", "white chocolate", "berry", "valentine", 3100),
        ("Blueberry", "Harvest", "moist", "lemon cream", "blueberry compote", "lemon zest", "berry", "summer", 2900),
        ("Mango", "Tropical", "fluffy", "mango mousse", "coconut flakes", "mint leaves", "tropical", "summer", 3300),
        ("Cookies and Cream", "Dream", "creamy", "oreo filling", "crushed oreos", "chocolate drizzle", "cookies", "kids", 2700),
        ("Peanut Butter", "Bliss", "rich", "peanut butter mousse", "chocolate ganache", "peanut brittle", "nut", "birthday", 3000),
        ("Almond", "Amaretto", "moist", "almond cream", "sliced almonds", "powdered sugar", "nut", "wedding", 3400),
        ("Pumpkin", "Spice", "spiced", "cream cheese", "pecan crumble", "cinnamon", "seasonal", "thanksgiving", 2800),
        ("Cheesecake", "New York", "creamy", "strawberry sauce", "graham cracker", "mint", "classic", "all-occasion", 3100),
        ("Hazelnut", "Praline", "nutty", "chocolate hazelnut", "chopped hazelnuts", "gold leaf", "nut", "anniversary", 3600),
        ("Passion Fruit", "Tropical", "tangy", "passion fruit curd", "white chocolate", "edible flowers", "tropical", "summer", 3500),
        ("White Chocolate", "Raspberry", "decadent", "white chocolate mousse", "raspberry coulis", "white chocolate shavings", "chocolate", "valentine", 3700),
        ("Mocha", "Hazelnut", "rich", "hazelnut praline", "coffee buttercream", "chocolate curls", "coffee", "all-occasion", 3200),
        ("Lavender", "Honey", "fragrant", "honey buttercream", "edible lavender", "honeycomb", "floral", "bridal-shower", 3800),
        ("S'mores", "Campfire", "gooey", "marshmallow", "graham cracker", "toasted meringue", "chocolate", "birthday", 2900),
        ("Chai", "Spice", "aromatic", "chai spice buttercream", "caramel drizzle", "cinnamon", "spiced", "fall", 3100),
        ("Blackberry", "Lemon", "tangy", "lemon curd", "blackberry compote", "mint", "berry", "summer", 3000),
        ("Pineapple", "Upside-Down", "caramelized", "brown sugar glaze", "cherries", "whipped cream", "tropical", "summer", 2900),
        ("Chocolate Mint", "Mojito", "refreshing", "mint chocolate chip", "chocolate ganache", "mint leaves", "chocolate", "st-patricks", 3100),
        ("Cinnamon", "Roll", "spiced", "cream cheese", "cinnamon sugar", "vanilla glaze", "breakfast", "morning", 2600),
        ("Banana", "Pudding", "moist", "vanilla pudding", "vanilla wafers", "whipped cream", "fruit", "potluck", 2700),
        ("Key Lime", "Pie", "tart", "lime curd", "graham cracker", "lime zest", "citrus", "summer", 3000),
        ("Chocolate", "Peanut Butter", "rich", "peanut butter mousse", "chocolate ganache", "peanut butter cups", "chocolate", "birthday", 3200),
        ("Strawberry", "Shortcake", "light", "whipped cream", "fresh strawberries", "mint", "fruit", "summer", 2900),
        ("Mocha", "Chip", "chocolatey", "coffee buttercream", "chocolate chips", "espresso powder", "coffee", "all-occasion", 3000),
        ("Raspberry", "Chocolate", "decadent", "raspberry mousse", "dark chocolate ganache", "fresh raspberries", "chocolate", "valentine", 3400),
        ("Lemon", "Blueberry", "zesty", "lemon curd", "blueberry compote", "lemon zest", "fruit", "spring", 3100),
        ("Caramel", "Apple", "spiced", "caramel sauce", "diced apples", "cinnamon sugar", "fruit", "fall", 2900),
        ("Chocolate", "Salted Caramel", "decadent", "salted caramel", "chocolate ganache", "sea salt", "chocolate", "all-occasion", 3500),
        ("Vanilla", "Berry", "light", "mixed berry compote", "whipped cream", "fresh berries", "fruit", "summer", 3000),
        ("Chocolate", "Orange", "citrusy", "orange marmalade", "dark chocolate ganache", "candied orange", "chocolate", "winter", 3200),
        ("Coconut", "Lime", "tropical", "lime curd", "toasted coconut", "lime zest", "tropical", "summer", 3100),
        ("Pistachio", "Rose", "floral", "rosewater cream", "chopped pistachios", "edible rose petals", "nut", "bridal", 3700),
        ("Chocolate", "Raspberry", "decadent", "raspberry mousse", "dark chocolate ganache", "fresh raspberries", "chocolate", "valentine", 3500),
        ("Peach", "Cobbler", "rustic", "vanilla bean cream", "cinnamon crumble", "powdered sugar", "fruit", "summer", 2900),
        ("Mocha", "Hazelnut", "nutty", "hazelnut praline", "coffee buttercream", "chopped hazelnuts", "coffee", "all-occasion", 3300),
        ("Lemon", "Lavender", "fragrant", "lavender buttercream", "lemon curd", "edible lavender", "floral", "bridal-shower", 3600),
    ], 1)
]


class CakesSeeder:
    def __init__(self):
        
        self.driver = start_driver()
        self.wait = WebDriverWait(self.driver, 10)
    
    def login(self):
        """Login to the admin dashboard"""
        print("🔐 Logging in...")
        self.driver.get(f"{DOMAIN}/auth?mode=login")
        time.sleep(2)
        
        try:
            # Find and fill email field
            email_input = self.wait.until(
                EC.presence_of_element_located((By.ID, "email"))
            )
            email_input.send_keys(ADMIN_EMAIL)
            
            # Find and fill password field
            password_input = self.driver.find_element(By.ID, "password")
            password_input.send_keys(ADMIN_PASSWORD)
            
            # Click Sign In button
            sign_in_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Sign In')]")
            sign_in_button.click()
            print("Current URL:", self.driver.current_url)
            
            # Wait for redirect to admin page            
            time.sleep(3)
            print("✅ Login successful")
        except Exception as e:
            print(f"❌ Login failed: {e}")
            raise
    
    def navigate_to_admin(self):
        """Navigate to admin dashboard"""
        print("📍 Navigating to admin dashboard...")
        self.driver.get(f"{DOMAIN}/admin")
        time.sleep(2)
        
        # Wait for dashboard to load
        try:
            self.wait.until(
                EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Admin Dashboard')]"))
            )
            print("✅ Admin dashboard loaded")
        except Exception as e:
            print(f"❌ Failed to load admin dashboard, make sure you are an admin(check env): {e}")
            raise
    
    def click_add_cake_button(self):
        """Click the Add New Cake button"""
        print("📝 Clicking 'Add New Cake' button...")
        try:
            #click cakes tab:
            self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Cakes')]"))
            ).click()

            add_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add New Cake')]"))
            )
            add_button.click()
            time.sleep(1)
            print("✅ Add Cake form opened")
        except Exception as e:
            print(f"❌ Failed to click Add New Cake button: {e}")
            raise
    
    def fill_cake_form(self, cake):
        """Fill and submit the cake form"""
        print(f"\n🍰 Adding cake: {cake['name']}")
        
        try:
            # Fill ID
            id_input = self.driver.find_element(By.ID, "id")
            id_input.clear()
            id_input.send_keys(cake["id"])
            
            # Fill Name
            name_input = self.driver.find_element(By.ID, "name")
            name_input.clear()
            name_input.send_keys(cake["name"])
            
            # Fill Price
            price_input = self.driver.find_element(By.ID, "price")
            price_input.clear()
            price_input.send_keys(cake["price"])
            
            # Fill Rating
            rating_input = self.driver.find_element(By.ID, "rating")
            rating_input.clear()
            rating_input.send_keys(cake["rating"])
            
            # Fill Reviews
            reviews_input = self.driver.find_element(By.ID, "reviews")
            reviews_input.clear()
            reviews_input.send_keys(cake["reviews"])
            
            # Check Bestseller checkbox if needed
            if cake.get("bestseller", False):
                bestseller_checkbox = self.driver.find_element(By.ID, "bestseller")
                if not bestseller_checkbox.is_selected():
                    bestseller_checkbox.click()
            
            # Fill Description
            description_textarea = self.driver.find_element(By.ID, "description")
            description_textarea.clear()
            description_textarea.send_keys(cake["description"])
            
            # Fill Image URL
            image_input = self.driver.find_element(By.ID, "image-url")
            image_input.clear()
            image_input.send_keys(cake["image"])
            time.sleep(1)  # Wait for image to load
            
            # Fill Categories
            category_input = self.driver.find_element(By.ID, "category")
            category_input.clear()
            category_input.send_keys(cake["categories"])
            
            # Fill Flavors
            flavors_input = self.driver.find_element(By.ID, "flavors")
            flavors_input.clear()
            flavors_input.send_keys(cake["flavors"])
            
            # Fill Toppings
            toppings_input = self.driver.find_element(By.ID, "toppings")
            toppings_input.clear()
            toppings_input.send_keys(cake["toppings"])
            
            # Fill Sizes
            sizes_input = self.driver.find_element(By.ID, "sizes")
            sizes_input.clear()
            sizes_input.send_keys(cake["sizes"])
            
            print(f"✅ Form filled for: {cake['name']}")
            
            # Submit form
            self.submit_form()
            
        except Exception as e:
            print(f"❌ Failed to fill form: {e}")
            raise
    
    def submit_form(self):
        """Submit the cake form"""
        print("📤 Submitting form...")
        try:
            submit_button = self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create Cake')]"))
            )
            submit_button.click()
            
            # Wait for success message or redirect
            time.sleep(2)
            print("✅ Form submitted successfully")
        except Exception as e:
            print(f"❌ Failed to submit form: {e}")
            raise
    
    def wait_for_cake_list_refresh(self):
        """Wait for cake list to refresh and prepare for next cake"""
        print("⏳ Waiting for dashboard to refresh...")
        try:
            # Wait for the "Add New Cake" button to be clickable again
            self.wait.until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Add New Cake')]"))
            )
            time.sleep(1)
            print("✅ Ready for next cake")
        except Exception as e:
            print(f"⚠️  Timeout waiting for refresh: {e}")
    
    def seed_all_cakes(self):
        """Seed all cakes from the CAKES array"""
        try:
            # Login first
            self.login()
            
            # Navigate to admin
            self.navigate_to_admin()
            
            # Add each cake
            for idx, cake in enumerate(CAKES, 1):
                print(f"\n{'='*60}")
                print(f"CAKE {idx}/{len(CAKES)}")
                print(f"{'='*60}")
                
                self.click_add_cake_button()
                self.fill_cake_form(cake)
                
                if idx < len(CAKES):
                    self.wait_for_cake_list_refresh()
            
            print(f"\n{'='*60}")
            print(f"✅ ALL {len(CAKES)} CAKES ADDED SUCCESSFULLY!")
            print(f"{'='*60}")
            
        except Exception as e:
            print(f"\n❌ ERROR: {e}")
            sys.exit(1)
        finally:
            input("Press Enter to close the browser...")
            self.driver.quit()


def main():
    """Main function"""
    print("🚀 Sweet Treats Cake Seeder")
    print(f"Domain: {DOMAIN}")
    print(f"Cakes to seed: {len(CAKES)}")
    print()
    
    # Validate config
    if ADMIN_EMAIL == "your-email@example.com":
        print("⚠️  ERROR: Please update ADMIN_EMAIL in the script!")
        sys.exit(1)
    
    if ADMIN_PASSWORD == "your-password":
        print("⚠️  ERROR: Please update ADMIN_PASSWORD in the script!")
        sys.exit(1)
    
    # Start seeding
    seeder = CakesSeeder()
    seeder.seed_all_cakes()


if __name__ == "__main__":
    main()
