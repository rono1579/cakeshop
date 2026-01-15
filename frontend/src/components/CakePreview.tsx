import React, { useState, useEffect } from 'react';
import { cakeCustomizationOptions } from '@/data/cakes';

interface CakePreviewProps {
  size: string;
  flavor: string;
  frosting: string;
  filling: string;
  topping: string;
  decoration: string;
  message: string;
}

export const CakePreview: React.FC<CakePreviewProps> = ({
  size,
  flavor,
  frosting,
  filling,
  topping,
  decoration,
  message,
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Get the selected options
  const sizeOption = cakeCustomizationOptions.sizes.find(s => s.id === size);
  const flavorOption = cakeCustomizationOptions.flavors.find(f => f.id === flavor);
  const frostingOption = cakeCustomizationOptions.frostings.find(f => f.id === frosting);
  const fillingOption = cakeCustomizationOptions.fillings.find(f => f.id === filling);
  const toppingOption = cakeCustomizationOptions.toppings.find(t => t.id === topping);
  const decorationOption = cakeCustomizationOptions.decorations.find(d => d.id === decoration);

  // Map IDs to readable names
  const flavorMap: { [key: string]: string } = {
    'flavor-vanilla': 'vanilla',
    'flavor-chocolate': 'chocolate',
    'flavor-redvelvet': 'red velvet',
    'flavor-lemon': 'lemon',
  };

  const frostingMap: { [key: string]: string } = {
    'frosting-buttercream': 'vanilla buttercream',
    'frosting-chocolate': 'chocolate buttercream',
    'frosting-creamcheese': 'cream cheese',
  };

  const toppingMap: { [key: string]: string } = {
    'topping-none': 'no toppings',
    'topping-strawberries': 'fresh strawberries',
    'topping-chocolate': 'chocolate shavings',
    'topping-sprinkles': 'sprinkles',
  };

  const decorationMap: { [key: string]: string } = {
    'deco-none': 'no decorations',
    'deco-flowers': 'edible flowers',
    'deco-message': 'custom message',
    'deco-topper': 'cake topper',
  };

  const sizeMap: { [key: string]: string } = {
    'size-6': '6 inch round',
    'size-8': '8 inch round',
    'size-10': '10 inch round',
  };

  const flavorName = flavorMap[flavor] || 'vanilla';
  const frostingName = frostingMap[frosting] || 'vanilla buttercream';
  const toppingName = toppingMap[topping] || 'no toppings';
  const decorationName = decorationMap[decoration] || 'no decorations';
  const sizeName = sizeMap[size] || '8 inch round';

  // Build the prompt for image generation
  const buildPrompt = () => {
    let fillingText = '';
    if (filling !== 'filling-none') {
      const fillingNames: { [key: string]: string } = {
        'filling-strawberry': 'strawberry',
        'filling-chocolate': 'chocolate ganache',
        'filling-lemon': 'lemon curd',
      };
      fillingText = `, with ${fillingNames[filling] || 'filling'} filling`;
    }

    let decorationText = '';
    if (decoration !== 'deco-none') {
      const decorationTexts: { [key: string]: string } = {
        'deco-flowers': ', decorated with beautiful edible flowers',
        'deco-topper': ', with an elegant cake topper',
        'deco-message': message ? `, with text "${message}" written on it` : '',
      };
      decorationText = decorationTexts[decoration] || '';
    }

    const prompt = `A beautiful, professional, appetizing ${sizeName} ${flavorName} cake with ${frostingName} frosting, topped with ${toppingName}${fillingText}${decorationText}. Premium bakery quality, professional photography, studio lighting, white background, mouth-watering presentation`;

    return prompt;
  };

  // Generate AI image using Pollinations.ai
  useEffect(() => {
    const generateImage = async () => {
      try {
        setIsLoading(true);
        const prompt = buildPrompt();

        // URL encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        // Use Pollinations.ai API (free, no authentication required)
        const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

        // Verify the image loads
        const img = new Image();
        img.onload = () => {
          setImageUrl(imageUrl);
          setIsLoading(false);
        };
        img.onerror = () => {
          setIsLoading(false);
        };
        img.src = imageUrl;
      } catch (error) {
        console.error('Error generating image:', error);
        setIsLoading(false);
      }
    };

    generateImage();
  }, [size, flavor, frosting, filling, topping, decoration, message]);

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium text-gray-600">Generating your cake...</p>
            </div>
          </div>
        </div>
      )}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Your custom cake preview"
          className="w-full h-full object-cover transition-opacity duration-500"
          style={{
            opacity: isLoading ? 0.5 : 1,
          }}
        />
      )}

      {!imageUrl && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 text-sm">Unable to generate image. Please try again.</p>
        </div>
      )}
    </div>
  );
};
