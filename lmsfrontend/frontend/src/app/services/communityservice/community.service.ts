import { Injectable } from '@angular/core';
import { AuthserviceService } from '../authservice.service';
import { InstructorauthserviceService } from '../instructorauthservice.service';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  // private apiUrl='http://localhost:5000'
  // private apiUrl=environment.apiUrl
  private socketUrl=environment.socketUrl

  private socket!:Socket
  private messagesSubject=new BehaviorSubject<any[]>([])
  private currentCourseId:string=''
  private isInstructor:boolean=false
  private userId:string=''


  //add unread count subject
  private unreadCountsSubject=new BehaviorSubject<Record<string,number>>({})
  private unreadCountsInterval:any


  constructor(
    private studentAuthService:AuthserviceService,
    private instructorAuthService:InstructorauthserviceService
  ) { }


  connect(userType: 'student' | 'instructor'): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      if (!this.socket || !this.socket.connected) {
        const token = userType === 'student' ? 
          this.studentAuthService.getAccessToken() : 
          this.instructorAuthService.getAccessToken();
        
        console.log(`Connecting as ${userType} with token:`, token ? 'Token exists' : 'No token');
        
        if (!token) {
          console.error(`No ${userType} token available`);
          resolve(false);
          return;
        }
        
        // this.socket = io(`${this.apiUrl}/community`, {
        //   auth: {
        //     token,
        //     userType
        //   },
        //   withCredentials: false
        // });


        this.socket = io(`${this.socketUrl}/community`, {
        path: '/socket.io',    
  auth: {
    token,
    userType
  },
  withCredentials: false,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

        
        if (userType === 'instructor') {
          this.isInstructor = true;
        }

        this.socket.on('connect', () => {
          console.log(`Connected to community socket as ${userType}`);

          //adding code for getting message count
           this.socket.on('newMessage',(message:any)=>{
            if(message.courseId&&message.courseId!==this.currentCourseId){
              this.updateUnreadCount(message.courseId)
            }
           })
           this.getUnreadCounts()
          //adding code for getting message count
          resolve(true);
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          resolve(false);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from community socket');
        });

        this.socket.on('error', (error) => {
          console.error('Socket error:', error);
          resolve(false);
        });
        
        // Set a timeout in case the connection takes too long
        setTimeout(() => {
          if (!this.socket.connected) {
            console.error('Socket connection timeout');
            resolve(false);
          }
        }, 5000);
      } else {
        console.log('Socket already connected');
        resolve(true);
      }
    });
  }



  disconnect():void{
    if(this.socket){
      this.socket.disconnect()
    }
  }

  joinCourseRoom(courseId: string): Promise<boolean> {
    this.currentCourseId = courseId;
    
    return new Promise<boolean>(async (resolve) => {
      if (!this.socket || !this.socket.connected) {
        console.error('Socket not connected, attempting to connect...');
        const connected = await this.connect(this.isInstructor ? 'instructor' : 'student');
        if (!connected) {
          console.error('Failed to connect socket');
          resolve(false);
          return;
        }
      }

      console.log(`Joining room for course ${courseId}, isInstructor: ${this.isInstructor}`);
      
      this.socket.emit('joinRoom', { courseId }, (response: any) => {
        console.log('Join room response:', response);
        
        if (response && response.success) {
          console.log(`Received ${response.messages?.length || 0} messages`);
          this.messagesSubject.next(response.messages || []);
          
          // If we're already marked as an instructor, keep that status
          if (!this.isInstructor) {
            this.isInstructor = response.isInstructor || false;
          }
          
          // Use the userId from the response or keep our existing one
          if (response.userId) {
            this.userId = response.userId;
          }
          
          console.log(`Joined room successfully. isInstructor: ${this.isInstructor}, userId: ${this.userId}`);


           // Clear unread count for this course
          const currentCounts = this.unreadCountsSubject.value;
          const updatedCounts = { ...currentCounts };
          delete updatedCounts[courseId]; // Remove the count for this course
          this.unreadCountsSubject.next(updatedCounts);

          
          resolve(true);
        } else {
          const errorMsg = response?.message || 'Unknown error';
          console.error('Failed to join room:', errorMsg);
          resolve(false);
        }
      });
      
      // Add a timeout in case the server doesn't respond
      setTimeout(() => {
        console.error('Join room timeout');
        resolve(false);
      }, 10000);
    });
  }


  leaveRoom(courseId:string):void{
    console.log('Leaving room with courseId:',courseId)
    if(this.socket&&this.socket.connected)
    this.socket.emit('leaveRoom',{
      courseId
    }),
    this.messagesSubject.next([])
    this.currentCourseId=''
  }


  sendTextMessage(courseId:string,content:string):void{
    this.socket.emit('sendTextMessage',{courseId,content})
  }

  sendImageMessage(courseId:string,image:string){
    this.socket.emit('sendImageMessage',{courseId,image})
  }


  deleteMessage(courseId:string,messageId:string):void{
    this.socket.emit('deleteMessage',{courseId,messageId})
  }


  getMessages():Observable<any[]>{
    return this.messagesSubject.asObservable()
  }

  onNewMessage():Observable<any>{
    return new Observable<any>(observer=>{
      this.socket.on('newMessage',(message)=>{
        observer.next(message)
      })
      return ()=>{
        this.socket.off('newMessage')
      }
    })
  }


  onMessageDeleted():Observable<any>{
    return new Observable(observer=>{
      this.socket.on('messageDeleted',(data)=>{
        observer.next(data)
      })
      return ()=>{
        this.socket.off('messageDeleted')
      }
    })
  }


  isUserInstructor():boolean{
    return this.isInstructor
  }

  getCurrentCourseId():string{
    return this.currentCourseId
  }


  getUserId():string{
    return this.userId
  }


  //get unreadcount from the server
  getUnreadCounts(){
    if(this.socket&&this.socket.connected){
      this.socket.emit('getUnreadCounts',{},(response:any)=>{
        if(response&&response.success){
          this.unreadCountsSubject.next(response.unreadCounts||{})
        }
      })
    }
  }

  private updateUnreadCount(courseId:string){
    const currentCounts=this.unreadCountsSubject.value
    const currentCount=currentCounts[courseId]||0

    const updatedCounts={
      ...currentCounts,
      [courseId]:currentCount+1
    }

    this.unreadCountsSubject.next(updatedCounts)
  }


    getUnreadCountsObservable(): Observable<Record<string, number>> {
    return this.unreadCountsSubject.asObservable();
  }



    getTotalUnreadCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.unreadCountsSubject.subscribe(counts => {
        const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
        observer.next(total);
      });
    });
  }


   initUnreadCounts() {
    // Clear any existing interval
    this.clearUnreadCountsInterval();
    
    // Get initial unread counts
    this.getUnreadCounts();
    
    // Set up interval to refresh unread counts every 30 seconds
    this.unreadCountsInterval = setInterval(() => {
      this.getUnreadCounts();
    }, 30000);
  }

   clearUnreadCountsInterval() {
    if (this.unreadCountsInterval) {
      clearInterval(this.unreadCountsInterval);
      this.unreadCountsInterval = null;
    }
  }





  updateUnreadCounts(counts: Record<string, number>): void {
  this.unreadCountsSubject.next(counts);
}

// Make the unreadCountsSubject accessible as a value
 getUnreadCountsValue(): Record<string, number> {
   return this.unreadCountsSubject.value;
}

}
