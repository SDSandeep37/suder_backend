import * as User from "../models/userModel.js";
import path from "path";
import fs from 'fs';
import multer from "multer";

// sync function to check if user exists by email
export async function syncUserWithDatabase(req, res) {
  const { email, first_name, last_name, mobile, profile_pic, clerk_id } = req.body;
  // return res.status(200).json({ message: 'Sync endpoint is working',data:req.body });
  if(!email){
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const user = await User.syncUserData(clerk_id, email, first_name, last_name, mobile, profile_pic);
    res.status(201).json(user);
  } catch (err) {
    console.error('Error syncing user data', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}
// Get all users
export async function getAllUsers(req, res) {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}

// Get user by id
export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user by id', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}
// Create a new user
export async function createUser(req, res) {
  const { email, first_name, last_name, mobile, profile_picture } = req.body;
  if(!email){
    return res.status(400).json({ error: 'Email is required' });
  }
  try {
    const user = await User.createUser(email, first_name, last_name, mobile, profile_picture);
    res.status(201).json(user);
  } catch (err) {
    console.error('Error creating user', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}
// Update existing user
export async function updateUser(req, res) {
  try {   
    const { id } = req.params;
    const { first_name, last_name, mobile } = req.body;
    const user = await User.updateUser(id, first_name, last_name, mobile);
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error updating user', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}

// Delete existing user
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const user = await User.deleteUser(id);
    if (!user) {
      return res.status(404).json({ error: 'User does not exist' });
    }
    res.json({ message: 'User deleted successfully' });
  }catch (err) {
    console.error('Error deleting user', err);
    res.status(500).json({ error: `Internal Server Error: ${err.message}` });
  }
}

// Upload profile pic to server in uploads folder and send the url to update

//configuring multer storage
const storage = multer.diskStorage({
  destination:(req,file,cb) =>{
    const uploadPath =  path.join(process.cwd(),'uploads');
    if(!fs.existsSync(uploadPath)){
      fs.mkdirSync(uploadPath,{recursive:true});
    }
    cb(null,uploadPath);
  },
  filename:(req,file,cb) =>{
    const uniqueNameToFile =  `${Date.now()}-${file.originalname}`;
    cb(null,uniqueNameToFile);
  }
});

const upload = multer({storage});

// export async function profilePicUpload(){
//   upload.single("profile_pic"), // middleware to handle file
//   async (req, res) => {
//     try {
//       const userId = req.body.id;
//       const fileUrl = `/uploads/${req.file.filename}`;

//       // calling model funtion of userModel.js
//       await User.updateProfilePic(userId, fileUrl);

//       res.status(200).json({ profile_pic_url: fileUrl });
//     } catch (error) {
//       console.error("Error while uploading", error);
//       res.status(500).json({ error: "Failed to upload image" });
//     }
//   }
// }
export const profilePicUpload = [
  upload.single("profile_pic"), // middleware to handle file
  async (req, res) => {
    try {
      const userId = req.body.id;
      const fileUrl = `${process.env.BASEURL}/uploads/${req.file.filename}`;

      // calling model funtion of userModel.js
      await User.updateProfilePic(userId, fileUrl);

      res.status(200).json({ profile_pic_url: fileUrl });
    } catch (error) {
      console.error("Error while uploading", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  },
];
