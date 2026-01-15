# Cake Seeder Script

This Selenium script automatically posts cakes to the Sweet Treats admin dashboard.

## Prerequisites

1. **Python 3.7+** installed
2. **ChromeDriver** downloaded (matching your Chrome version)
   - Download from: https://chromedriver.chromium.org/
   - Or install via package manager: `brew install chromedriver` (macOS)

## Installation

1. **Install Selenium**
   ```bash
   pip install selenium
   ```

2. **Verify ChromeDriver**
   ```bash
   chromedriver --version
   ```

## Setup

1. **Edit the script** - Open `seed_cakes.py` and update:
   ```python
   ADMIN_EMAIL = "your-email@example.com"  # Your admin email
   ADMIN_PASSWORD = "your-password"        # Your admin password
   ```

2. **Configure cakes** - Modify the `CAKES` array with your cake data:
   ```python
   CAKES = [
       {
           "id": "1",
           "name": "Your Cake Name",
           "description": "Cake description...",
           "price": "2500",
           "image": "https://image-url.com/...",
           "categories": "category1, category2",
           "flavors": "flavor1, flavor2",
           "toppings": "topping1, topping2",
           "sizes": '6", 8", 10"',
           "rating": "4.5",
           "reviews": "100",
           "bestseller": True  # or False
       }
   ]
   ```

## Running the Script

### Interactive Mode (Recommended)
```bash
python seed_cakes.py
```
The browser window will stay open so you can monitor the process.

### Headless Mode
Uncomment this line in the script:
```python
# chrome_options.add_argument("--headless")
```

## Field Reference

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | ✓ | Unique identifier (e.g., "1") |
| name | string | ✓ | Cake name |
| description | string | ✓ | Cake description |
| price | string | ✓ | Price in Ksh (e.g., "2500") |
| image | string | ✓ | Full image URL |
| categories | string | ✓ | Comma-separated categories |
| flavors | string | ✓ | Comma-separated flavors |
| toppings | string | ✓ | Comma-separated toppings |
| sizes | string | ✓ | Comma-separated sizes (e.g., '6", 8", 10"') |
| rating | string | ✗ | Rating 0-5 (optional) |
| reviews | string | ✗ | Number of reviews (optional) |
| bestseller | boolean | ✗ | Mark as bestseller (default: False) |

## Troubleshooting

### ChromeDriver not found
Make sure chromedriver is in your PATH or in the same directory as the script.

### Login fails
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are correct
- Make sure the admin user exists and has proper permissions
- Check if the domain is accessible

### Form filling timeouts
- Increase wait time by modifying `WebDriverWait(self.driver, 10)` to a higher value
- Add `time.sleep(n)` before form interactions if needed

### Image URL errors
- Verify all image URLs are accessible and valid
- Use complete URLs (starting with http:// or https://)

## Example Data

```python
CAKES = [
    {
        "id": "10",
        "name": "Lemon Raspberry Delight",
        "description": "Tangy lemon cake with raspberry filling and lemon buttercream.",
        "price": "2900",
        "image": "https://images.unsplash.com/photo-1535254973219-607245c8cc6b?w=800&auto=format&fit=crop",
        "categories": "fruit, summer, citrus",
        "flavors": "lemon, raspberry",
        "toppings": "fresh raspberries, lemon zest, edible flowers",
        "sizes": '6", 8", 10"',
        "rating": "4.8",
        "reviews": "79",
        "bestseller": False
    },
    {
        "id": "11",
        "name": "Caramel Drizzle",
        "description": "Moist caramel cake with salted caramel filling and caramel buttercream.",
        "price": "3200",
        "image": "https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=800&auto=format&fit=crop",
        "categories": "caramel, indulgent, celebration",
        "flavors": "caramel, vanilla",
        "toppings": "caramel drizzle, caramel popcorn, gold flakes",
        "sizes": '6", 8", 10"',
        "rating": "4.9",
        "reviews": "64",
        "bestseller": True
    }
]
```

## Notes

- The script will pause after completion so you can verify all cakes were added
- Press Enter to close the browser when done
- Each cake takes ~3-5 seconds to add depending on your internet speed
- For 100+ cakes, expect 5-10 minutes total

## Support

If you encounter issues:
1. Check the console output for error messages
2. Verify all credentials and configuration
3. Ensure the admin dashboard is accessible at `/admin`
