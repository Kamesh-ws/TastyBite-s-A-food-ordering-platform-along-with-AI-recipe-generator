import mongoose from 'mongoose';

const menuSchema = new mongoose.Schema({
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
    foodTag:{
        enum: ['Veg', 'Non-Veg'],
        type: String,
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
        type: Number, // Hour in 24-hour format (e.g., 9 for 9 AM)
        
    },
    endHour: {
        type: Number, // Hour in 24-hour format (e.g., 12 for 12 PM)
        
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

menuSchema.methods.isAvailable = function () {
    const currentHour = new Date().getHours();
    return currentHour >= this.startHour && currentHour < this.endHour;
};


export const Menu = mongoose.model('Menu', menuSchema);

