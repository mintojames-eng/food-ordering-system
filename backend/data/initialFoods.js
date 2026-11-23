const initialFoods = [
  {
    id: "food_1",
    name: "Paneer Butter Masala Biryani",
    category: "Biryani",
    price: 349,
    description: "Aromatic basmati rice layered with rich paneer tikka, saffron, and slow-cooked caramelized onions.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    rating: 4.6,
    prepTime: "25-30 mins",
    available: true
  },
  {
    id: "food_2",
    name: "Hyderabadi Chicken Dum Biryani",
    category: "Biryani",
    price: 389,
    description: "Authentic dum biryani cooked on slow flame with succulent chicken pieces, mint, and fresh spices.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80",
    isVeg: false,
    rating: 4.8,
    prepTime: "30-35 mins",
    available: true
  },
  {
    id: "food_3",
    name: "Classic Cheese Burst Margherita",
    category: "Pizza",
    price: 299,
    description: "Loaded with 100% real mozzarella cheese, Italian tomato concasse, and fresh basil leaves on sourdough.",
    image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    rating: 4.5,
    prepTime: "20-25 mins",
    available: true
  },
  {
    id: "food_4",
    name: "Peri-Peri Grilled Chicken Pizza",
    category: "Pizza",
    price: 429,
    description: "Spicy peri-peri marinated grilled chicken, red paprika, jalapenos, and melted gouda cheese.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    isVeg: false,
    rating: 4.7,
    prepTime: "20-25 mins",
    available: true
  },
  {
    id: "food_5",
    name: "Crispy Paneer Supreme Burger",
    category: "Burgers",
    price: 199,
    description: "Crispy spiced cottage cheese patty, cheddar slice, crunchy lettuce, and smoked tandoori mayo in brioche.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    rating: 4.4,
    prepTime: "15-20 mins",
    available: true
  },
  {
    id: "food_6",
    name: "Double Smash Crispy Chicken Burger",
    category: "Burgers",
    price: 249,
    description: "Two golden crispy chicken fillets, pickled gherkins, melted Monterey Jack, and secret house sauce.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    isVeg: false,
    rating: 4.8,
    prepTime: "15-20 mins",
    available: true
  },
  {
    id: "food_7",
    name: "Chilli Garlic Hakka Noodles",
    category: "Asian",
    price: 219,
    description: "Wok-tossed noodles with bell peppers, spring onions, burnt garlic, and spicy Indo-Chinese sauces.",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    rating: 4.3,
    prepTime: "15-20 mins",
    available: true
  },
  {
    id: "food_8",
    name: "Crispy Steamed Chicken Dimsums (6 pcs)",
    category: "Asian",
    price: 259,
    description: "Delicate parcels stuffed with minced chicken, ginger, scallions, served with spicy schezwan dip.",
    image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80",
    isVeg: false,
    rating: 4.6,
    prepTime: "20-25 mins",
    available: true
  },
  {
    id: "food_9",
    name: "Dal Makhani with Garlic Naan Platter",
    category: "North Indian",
    price: 279,
    description: "Slow-cooked black lentils simmered overnight with butter and cream, served with 2 butter garlic naans.",
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    rating: 4.7,
    prepTime: "20-25 mins",
    available: true
  },
  {
    id: "food_10",
    name: "Belgian Molten Chocolate Lava Cake",
    category: "Desserts",
    price: 169,
    description: "Warm gourmet chocolate sponge with a luscious molten dark chocolate center, dusted with icing sugar.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    rating: 4.9,
    prepTime: "10-15 mins",
    available: true
  },
  {
    id: "food_11",
    name: "Gulab Jamun with Rabri (2 pcs)",
    category: "Desserts",
    price: 139,
    description: "Traditional soft khoya dumplings soaked in saffron-cardamom syrup, crowned with chilled thick rabri.",
    image: "https://images.unsplash.com/photo-1589119908995-c6837fa14d48?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    rating: 4.8,
    prepTime: "10 mins",
    available: true
  },
  {
    id: "food_12",
    name: "Iced Hazelnut Frappuccino",
    category: "Beverages",
    price: 189,
    description: "Chilled espresso blend whipped with roasted hazelnut syrup, whole milk, and crowned with whipped cream.",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    rating: 4.5,
    prepTime: "5-10 mins",
    available: true
  }
];

module.exports = initialFoods;
