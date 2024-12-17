import mongoose from 'mongoose';

const specialDishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true,
        maxLength: [100, "Product name cannot exceed 100 characters"],
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0.0
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    foodTag: {
        type: String,
        enum: ['Veg', 'Non-Veg'],
    },
    ratings: {
        type: String,
        default: 0
    },
    image: {
        type: String,
    },
    cuisineType: {
        type: String,
        required: [true, "Please enter product category"],
        enum: {
            values: ['Biryani', 'Pizza', 'South-Indian', 'Burgers', 'Chinese', 'Cakes', 'Shake', 'North-Indian', 'Ice-Cream', 'Pasta', 'Noodles', 'Rolls', 'Salad', 'Sandwich', 'Deserts'],
            message: "Please select correct category"
        }
    },
    quantity: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxLength: [20, 'Product stock cannot exceed 20']
    },
    offer: {
        type: Number,
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: String,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
    startHour: {
        type: Number,
    },
    endHour: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    specialDishExpiry: {
        type: Date,
        default: () => Date.now() + 12 * 60 * 60 * 1000, // 12 hours from creation
        index: { expireAfterSeconds: 0 }, // TTL index
    }
});

export const SpecialDish = mongoose.model('SpecialDish', specialDishSchema);
