import express from "express";
import { getUserById, createUser, updateUser, deleteUser,getAllUsers,syncUserWithDatabase,profilePicUpload  } from "../controllers/userController.js";

const router = express.Router();
router.options('/sync', cors());   // ⭐ FIX FOR PREFLIGHT
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.post('/sync', syncUserWithDatabase);
router.post('/profile_pic',profilePicUpload)
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
export default router;