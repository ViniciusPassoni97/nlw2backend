import {Request,Response} from 'express';
import db from '../database/connection';
import conversorTime from '../utils/conversorTime';

interface sheduleInterface{
  week_day:number,
  to:string,
  from:string
}

export default class ClassesControllers{
  async index(req:Request,res:Response){
    const filters = req.query;
    console.log(filters.week_day,filters.time,filters.subject)
    if(!filters.week_day || !filters.time || !filters.subject){
      return res.status(400).json({
        error:"Missing filter to search classes"
      })
    }
    const week_day = filters.week_day as string;
    const time = filters.time as string;
    const subject = filters.subject as string;
    const timeMinutes = conversorTime(time);
    const classes = await db('classes')
    .whereExists(function(){
      this.select('class_schedule.*')
      .from('class_schedule')
      .whereRaw('`class_schedule`.`class_id`=`classes`.`id`')
      .whereRaw('`class_schedule`.`week_day`=??',[
        Number(week_day)
      ])
      .whereRaw('`class_schedule`.`from` <= ??',[
        timeMinutes
      ])
      .whereRaw('`class_schedule`.`to` > ??',[
        timeMinutes
      ])
    })
    .where("classes.subject","=",subject)
    .join('users','classes.user_id','=','users.id')
    .select(['classes.*','users.*']);

    return res.json(classes);
  }
  async  execute(req:Request,res:Response){
    const {
      name,
      avatar,
      whatsapp,
      bio,
      subject,
      cost,
      schedule
    }= req.body;
  
    const rsx = await db.transaction();
    
   try {
      const user = await rsx('users').insert({
      name,
      avatar,
      whatsapp,
      bio,
      });
      const user_id = user[0];
      const insertClassId = await rsx("classes").insert({
        subject,
        user_id,
        cost,
      });
      const class_id = insertClassId[0];
      const classSchedule = schedule.map((scheduleItem:sheduleInterface) =>{
        return{
          class_id,
          week_day:scheduleItem.week_day,
          to:conversorTime(scheduleItem.to),
          from:conversorTime(scheduleItem.from)
        };
      });
      await rsx('class_schedule').insert(classSchedule);
      
      await rsx.commit();
      console.log('Insert')
      return res.status(201).json(user);
   } catch (error) {
     return res.status(400).json({
      error:"Error while creating new class",
     });
   }
  }
};