import { Component, OnInit } from '@angular/core';
import { Task } from './Task/task';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WebsocketService } from './services/web-socket.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = ""
  tasks: Task[] = [];

  form: FormGroup = new FormGroup({
    sender: new FormControl<string>('',Validators.required),
    receiver: new FormControl<string>('', Validators.required),
    content: new FormControl<string>('', Validators.required)
   
  });

  constructor(private websocketService: WebsocketService) {
  }

  ngOnInit(): void {
        this.websocketService.listen(task => {
          this.tasks.push(task);
        });

      this.websocketService.getAll().subscribe((s:Task[])=>{
        console.log(s);
        
        this.tasks= s ;

      })

           

    }

  // ngOnInit(): void {
  //   this.websocketService.listen((tasks: Task[] | Task) => {
  //     if (Array.isArray(tasks)) {
  //       this.tasks = tasks;   // replace entire array
  //     } else {
  //       this.tasks.push(tasks);  // single task
  //     }
  //   });
  // }

    add(sender:string,receiver:string,content: string,timeStamp:Date){
    const task: Task = {
      sender:sender,
      receiver:receiver ,
      content : content ,
      timeStamp : new Date()
    };
    this.websocketService.send(task);

        this.websocketService.getAll().subscribe((s:Task[])=>{
        console.log(s);
        
        this.tasks= s ;

      })
    }

    click():void{
    this.add(this.form.value.sender, this.form.value.receiver,this.form.value.content,this.form.value.timeStamp);
    this.form.reset({});
    }


}
