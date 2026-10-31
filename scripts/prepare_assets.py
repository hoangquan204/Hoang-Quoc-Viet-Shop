import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont

os.makedirs('screenshots', exist_ok=True)

images_to_download = [
    ('screenshots/product_main.jpg', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80'),
    ('screenshots/product_cushion.jpg', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'),
    ('screenshots/product_sneaker.jpg', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'),
    ('screenshots/product_fit.jpg', 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80'),
    ('screenshots/product_daily.jpg', 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80')
]

for filename, url in images_to_download:
    try:
        if not os.path.exists(filename):
            print(f"Downloading {filename}...")
            urllib.request.urlretrieve(url, filename)
            print(f"Downloaded {filename}: {os.path.getsize(filename)} bytes")
    except Exception as e:
        print(f"Failed to download {filename}: {e}")

print("Asset preparation completed.")

