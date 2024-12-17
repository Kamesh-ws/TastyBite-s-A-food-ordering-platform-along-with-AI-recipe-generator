import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import { User } from "../models/user.js";
import sendMail from "../middleware/sendMail.js";

//New user registration
export const registerUser = async (req, res) => {
    try {

        const { username, email, password, phoneNo, role} = req.body;

        //All field is filled
        if (!username || !email || !password || !phoneNo) {
            return res.status(400).json({ message: "All fields are required" });
          }

        // Email available
        let existUser = await User.findOne({ email });
        if (existUser) {
            res.status(400).json({
                message: "User Email Id already Exists",
            });
        }

        //Generate OTP
        const otp = Math.floor(Math.random() * 1000000);

        // create New user data
        const user = { username, email, password, phoneNo, role };

        //Activation token
        const token = jwt.sign({ user, otp }, process.env.ACTIVATION_SECRET, {
            expiresIn: "5m",
        });

        //Send emailto use
        const msg = `Please Verify your account using OTP your otp is ${otp}`;
        await sendMail(email, "Welcome to TastyBite :)", msg);

        return res.status(200).json({
            message: "OTP sent to your mail",
            token,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }

};

//verify OTP
export const verifyUser = async (req, res) => {
    try {
        const { enteredOtp, token } = req.body;
        const verify = jwt.verify(token, process.env.ACTIVATION_SECRET);

        if (!verify) {
            return res.json({
                message: 'OTP Expired',
            });
        }

        if (verify.otp !== enteredOtp) {
            return res.json({
                message: 'Wrong OTP',
            });
        }

        const newUser = await User.create({
            username: verify.user.username,
            email: verify.user.email,
            password: verify.user.password,
            phoneNo: verify.user.phoneNo,
            role:verify.user.role,
        });

        return res.status(200).json({
            message: "User Registration success",
            userId: newUser._id,
            role: newUser.role,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Ensure both email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter email & password",
            });
        }

        // Check if user exists by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials (email not found)",
            });
        }

        // Check if the provided password matches the stored password
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials (incorrect password)",
            });
        }

        // Generate signed token (JWT)
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "15d"
        });

        // Exclude the password field from the user object before sending the response
        const { password: userPassword, ...userDetails } = user.toObject();

        // Send success response with token and user details
        return res.status(200).json({
            message: "Welcome " + user.username,
            token,
            name: user.username,
            role: user.role,
            userDetails,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//Forget Password
export const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
          }
        //valid EmailId
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({
                message: "Invalid Crediential",
            });
        }

        //Generate reset Token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
        await user.save();

        //Send Mail
        const resetUrl = `http://${req.headers.host}/api/password/reset/${resetToken}`;
        const message = `Your password reset url is as follows \n\n 
    ${resetUrl} \n\n If you have not requested this email, then ignore it.`;
        await sendMail(email, "TastyBite - Reset Password )", message);

        res.status(200).json({
            message: 'Password reset email sent',
            resettoken: resetToken,
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//Reset Password
export const resetPassword = async (req, res, next) => {
    try {
        const { resetToken } = req.params;

        // Hash the reset token
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find the user with the hashed reset token and ensure the token is not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Check if the password and confirmPassword fields match
        if (req.body.password !== req.body.confirmPassword) {
            return next(new ErrorHandler('Passwords do not match')); // Assuming you have an ErrorHandler middleware
        }

        // Set the new password
        const { password } = req.body;

        // user.password = await bcrypt.hash(newPassword, 10);
        user.password = password;

        // Clear the reset token and its expiry from the user's document
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        // Save the updated user
        await user.save();

        // Respond with success message
        res.status(201).json({ 
            user,
            message: 'Password reset successful' 
        });

    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//User Profile
export const myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

//Update Profile
export const updateProfile = async (req, res) => {
    try {
        
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }

        // Destructure incoming fields to update the profile
        const { username, phoneNo, addresses } = req.body;

        // Update fields if they exist in the request body
        if (username) user.username = username;
        if (phoneNo) user.phoneNo = phoneNo;
        if (addresses) user.addresses = addresses;

        // Save the updated user back to the database
        await user.save();

        res.status(200).json({ 
            message: 'Profile updated successfully', 
            user 
        });
    
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit; 
        const users = await User.find({role: { $ne: 'admin' } }, '-password').skip(skip)
        .limit(limit)
        .exec();

    // Count total number of restaurants
    const total = await User.countDocuments();
     
      res.status(200).json(
        {total,            // Total number of restaurants
        page,             // Current page
        pages: Math.ceil(total / limit), // Total pages
        users});
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

// export const editProfile = async (req, res) => {
//     try {
//         // Get the user ID from the request
//         const userId = req.user._id;

//         // Extract the updated fields from the request body
//         const { name, email, phone, address } = req.body;

//         // Find the user and update the fields
//         const updatedUser = await User.findByIdAndUpdate(
//             userId,
//             { name, email, phone, address },
//             { new: true, runValidators: true } // Options: return the updated document and validate fields
//         );

//         // If user not found, return 404
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Return the updated user details (excluding password)
//         const { password, ...userDetails } = updatedUser.toObject();
        
//         return res.status(200).json({
//             message: 'Profile updated successfully',
//             user: userDetails,
//         });
//     } catch (err) {
//         return res.status(500).json({
//             message: err.message,
//         });
//     }
// };
