const User = require("../models/UserModel");
const nodemailer = require("nodemailer");
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

// Get all users
const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
    }

    // not found
    if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
    }

    // Display all users
    return res.status(200).json({ users });
};

// Add user
const addUser = async (req, res, next) => {
    const { full_name, email, uni_id, password, role, contact_no, faculty } = req.body;

    try {
        // Check for existing email or uni_id
        const existingUser = await User.findOne({ $or: [{ email }, { uni_id }] });
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email is already registered" });
            }
            if (existingUser.uni_id === uni_id) {
                return res.status(400).json({ message: "University ID is already registered" });
            }
        }

        const user = new User({
            full_name,
            email,
            uni_id,
            password,
            role,
            contact_no,
            faculty
        });
        await user.save();

        // Send welcome email
        const mailOptions = {
            from: EMAIL_USER,
            to: email,
            subject: 'Welcome to Helpdesk Management System',
            text: `Hello ${full_name},\n\nYour account has been created successfully!\n\nUsername: ${email}\n\nThank you for registering.\n\n- Helpdesk Team`,
            html: `
              <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 32px;">
                <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(44,62,80,0.07); padding: 32px;">
                  <h2 style="color: #2980b9; margin-bottom: 16px;">Welcome to Helpdesk Management System!</h2>
                  <p style="font-size: 1.1rem; color: #222;">Hello <b>${full_name}</b>,</p>
                  <p style="font-size: 1.05rem; color: #333; margin-bottom: 18px;">
                    Your account has been created successfully.<br>
                    <b>Username:</b> <span style="color:#2980b9">${email}</span>
                  </p>
                  <div style="background: #eaf6fb; border-radius: 6px; padding: 16px; margin-bottom: 18px;">
                    <p style="margin:0; color:#2980b9; font-weight:600;">You can now log in and start using the Helpdesk platform.</p>
                  </div>
                  <p style="font-size: 1rem; color: #555;">Thank you for registering.<br>- Helpdesk Team</p>
                  <div style="margin-top: 32px; text-align: center; color: #aaa; font-size: 0.95rem;">
                    &copy; ${new Date().getFullYear()} Helpdesk Management System
                  </div>
                </div>
              </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            } else {
                console.log('Email sent:', info.response);
            }
        });

        return res.status(201).json({ user });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Unable to add user" });
    }
};
//Get by Id
const getById = async(req, res, next) =>{
    const id = req.params.id;
    let user;
    try{
        user = await User.findById(id);
    }catch(err){
        console.log(err);
    }
    //not available users
     if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
};
//update User Details
const updateUser = async (req,res,next) =>{
     const id = req.params.id;
     const { full_name, email, uni_id, password, role, contact_no, faculty } = req.body;

     let user;

      try{
        user = await User.findByIdAndUpdate(id,{full_name:full_name, email:email, uni_id:uni_id, password:password, role:role, contact_no:contact_no, faculty:faculty });
        user=await user.save();
    }catch(err){
        console.log(err);
    }
     if (!user) {
        return res.status(404).json({ message: "Unableto update user Details" });
    }

    return res.status(200).json({ user });
};
//Delete User Details
const deleteUser = async (req,res,next) =>{
    const id = req.params.id;

    let user;
    try{
        user= await User.findByIdAndDelete(id)
    }catch(err){
        console.log(err);
    }
    if (!user) {
        return res.status(404).json({ message: "Unableto to delete " });
    }

    return res.status(200).json({ user });
};
// Login user
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    let user;
    try {
        user = await User.findOne({ email });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    // Simple password check (for demo; use hashing in production!)
    if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    // You can add JWT here if needed
    return res.status(200).json({ message: "Login successful", user });
};

exports.getAllUsers = getAllUsers;
exports.addUser = addUser;
exports.getById = getById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
