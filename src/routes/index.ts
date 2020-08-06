import express from 'express';
import ClassesControllers from '../controllers/ClassesControlers';
import ConnectionControllers from '../controllers/ConnectionsControllers';
const route = express.Router();

const classesControllers = new ClassesControllers();
const connectionControllers = new ConnectionControllers();
route.post('/classes',classesControllers.execute);
route.get('/classes',classesControllers.index);
route.post('/connections',connectionControllers.create);
route.get('/connections',connectionControllers.list);
export default route;