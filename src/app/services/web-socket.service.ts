import { Injectable, OnDestroy } from '@angular/core';
import { CompatClient, StompSubscription, Stomp } from '@stomp/stompjs';
import { Task } from '../Task/task';
import { HttpClient } from '@angular/common/http';




export type ListenerCallBack = (message: Task) => void;

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy{

  private connection: CompatClient | undefined = undefined;

  private subscription: StompSubscription | undefined;

  constructor(private http : HttpClient) {
    this.connection = Stomp.client('ws://localhost:8080/websocket');
    this.connection.connect({}, () => {});
    

  }

  public send(task: Task): void {
    if (this.connection && this.connection.connected) {
      this.connection.send('/dashboard/add_new_task', {}, JSON.stringify(task));
    }
  }

  public getAll(){
    return this.http.get<Task[]>("http://localhost:8080/getAll");
  }



  public listen(fun: ListenerCallBack): void {
    if (this.connection) {
      this.connection.connect({}, () => {
        this.subscription = this.connection!.subscribe('/tasks/added_task', message => fun(JSON.parse(message.body)));
      }); 
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}