import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import dns from 'dns';

// Fix for Node 20+ DNS issues
dns.setDefaultResultOrder('ipv4first');

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database Connected....');
  } catch (err) {
    console.log('cannot connect Database');
    console.log(err);
  }
}

export default connectDb;
