import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../interfaces/task';

@Injectable({
  providedIn: 'root'
})
export class ObservablesService {
  newTask: Subject<Task> = new Subject<Task>();
  clearScheduleSelection: Subject<undefined> = new Subject<undefined>();
  saveScheduleChanges: Subject<undefined> = new Subject<undefined>();
  toogleScheduleCancel = false;
  toogleSave = false
  toogleTaskBar = false
  constructor() { }

  selectNewTask(task?: Task){
    console.log('new task selected',task)
    this.newTask.next(task);
  }

  doClearScheduleSelection(){
    this.clearScheduleSelection.next()
  }

  doSaveScheduleChanges(){
    this.saveScheduleChanges.next()
  }

}
