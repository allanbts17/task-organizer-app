import { Component, Input, OnInit } from '@angular/core';
import { format } from 'date-fns';
import { ApiService } from 'src/app/services/api.service';
import { ObservablesService } from 'src/app/services/observables.service';
import { take } from 'rxjs/operators';
import { Task } from 'src/app/interfaces/task';
import { Hour } from 'src/app/interfaces/hour';

@Component({
  selector: 'app-schedule-row',
  templateUrl: './schedule-row.component.html',
  styleUrls: ['./schedule-row.component.scss'],
})
export class ScheduleRowComponent implements OnInit {
  @Input() hour: Hour
  oldHour: Hour
  selectArray = {
    domingo: false,
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    viernes: false,
    sabado: false
  }
  allSelect = false
  hasChanged = false

  actualTmo: any

  constructor(private obs: ObservablesService,
    private apiService: ApiService) {
    obs.newTask.subscribe((task) => {
      this.recivedATask(task)
    })

    obs.clearScheduleSelection.subscribe(() => {
      this.unSelectAll()
      obs.toogleScheduleCancel = false;
      obs.toogleSave = false;
    })

    obs.saveScheduleChanges.subscribe(async () => {
      if (this.hasChanged) {
        await apiService.updateHour(this.hour, this.hour.id)
        this.oldHour = Object.assign({}, this.hour)
        obs.toogleSave = false;
      }
    })

    obs.clearScheduleSelection.subscribe(() => {
      this.cancelChanges()
    })
  }

  ngOnInit() {
    this.oldHour = Object.assign({}, this.hour)
  }

  cancelChanges() {
    this.unSelectAll()
    this.obs.toogleTaskBar = false
    if (this.hasChanged) {
      this.hour = Object.assign({}, this.oldHour)
      this.hasChanged = false
    }

  }

  recivedATask(task) {
    if (task !== undefined) {
      // entry => [key,value] => [day,selected]
      let entries = Object.entries(this.selectArray)
      entries.forEach(entry => {
        if (entry[1]) {
          this.hasChanged = true
          this.hour[entry[0]] = task.tarea
        }
      })
    } else {
      let entries = Object.entries(this.selectArray)
      entries.forEach(entry => {
        if (entry[1]) {
          this.hasChanged = true
          this.hour[entry[0]] = ''
        }
      })
    }
    this.obs.toogleSave = true
    this.unSelectAll();
  }

  getTaskColor(taskName: string): string {
    return this.apiService.allTasks?.find(tsk => tsk.tarea === taskName)?.color || ''
  }

  format(date, pattern) {
    return format(new Date(date), pattern)
  }

  // TODO: On production, change mousedown for touchstart
  changeSel(day: string) {
    this.actualTmo = setTimeout(() => {
      this.selectArray[day] = !this.selectArray[day]
      this.allSelect = false
      this.actualTmo = undefined;
      this.obs.toogleScheduleCancel = true;
      this.obs.toogleTaskBar = true
    }, 100)

    // console.log(this.selectArray[day])
  }

  drag(day: string) {
    if (this.actualTmo !== undefined) {
      clearTimeout(this.actualTmo)
      //this.selectArray[day] = false
      //this.allSelect = false
    }

  }

  changeAllSel() {
    this.allSelect = !this.allSelect
    for (let day in this.selectArray)
      this.selectArray[day] = this.allSelect
  }

  unSelectAll() {
    this.allSelect = false
    for (let day in this.selectArray)
      this.selectArray[day] = this.allSelect
  }



}
