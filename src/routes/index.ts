import express from 'express';
import db from '../database/connection';
const route = express.Router();

route.post('/classes',async(req,res)=>{
  const {
    name,
    avatar,
    whatsapp,
    bio,
    subject,
    cost,
    schedule
  }= req.body;
  
  const user = await db('users').insert({
    name,
    avatar,
    whatsapp,
    bio,
  });
  const user_id = user[0];
  await db("classes").insert({
    subject,
    user_id,
    cost,
  })
  return res.json(user);
});

export default route;