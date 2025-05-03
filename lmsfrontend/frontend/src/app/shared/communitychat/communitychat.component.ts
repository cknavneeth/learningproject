import { AfterViewChecked, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommunityService } from '../../services/communityservice/community.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmationcomponentComponent } from '../../components/common/confirmationcomponent/confirmationcomponent.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-communitychat',
  imports: [
    CommonModule, 
    FormsModule, 
    MatIconModule, 
    MatButtonModule, 
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './communitychat.component.html',
  styleUrl: './communitychat.component.scss'
})
export class CommunitychatComponent implements OnInit,OnDestroy,AfterViewChecked,OnChanges{
      @Input() courseId!:string
      @Input() userType:'student'|'instructor'='student'
      @ViewChild('messagesContainer') messagesContainer!:ElementRef
      @ViewChild('fileInput') private fileInput!:ElementRef;
      

      messages:any[]=[]
      newMessage:string=''
      isInstructor:boolean=false
      userId:string=''
      loading:boolean=true
      error:string=''
      private currentCourseId:string=''

      private subscriptions:Subscription[]=[]

      constructor(private readonly communityService:CommunityService,private dialog:MatDialog){}

         ngOnChanges(changes:SimpleChanges):void{
           if(changes['courseId']&& !changes['courseId'].firstChange){
            console.log('courseId changes from',
              changes['courseId'].previousValue,'to',
              changes['courseId'].currentValue
            )
           }


           if(this.currentCourseId){
            console.log('Leaving previous room',this.currentCourseId)
            this.communityService.leaveRoom(this.currentCourseId)
           }

           this.messages=[]
           this.loading=true
           this.error=''
           this.initializeChatRoom();
      }

      ngOnInit(){
        console.log('community chat component initialized with courseId:', this.courseId, 'usertype:', this.userType);
        this.initializeChatRoom();
      }

      private async initializeChatRoom(): Promise<void> {
        console.log('Initializing chat room with courseId:', this.courseId, 'usertype:', this.userType);
        if (!this.courseId) {
          this.error = 'No course selected';
          this.loading = false;
          return;
        }

        this.currentCourseId = this.courseId;
        this.loading = true;

        try {
          // Connect to socket and wait for connection
          console.log('Connecting to socket as', this.userType);
          const connected = await this.communityService.connect(this.userType);
          
          if (!connected) {
            console.error('Failed to connect to socket');
            this.error = 'Failed to connect to chat server. Please try again.';
            this.loading = false;
            return;
          }
          
          console.log('Socket connected successfully, now joining room');
          
          // Add a small delay to ensure socket is fully ready
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Join course room
          console.log('Joining course room with courseId:', this.courseId);
          const success = await this.communityService.joinCourseRoom(this.courseId);
          
          this.loading = false;
          
          if (success) {
            this.isInstructor = this.userType === 'instructor' || this.communityService.isUserInstructor();
            this.userId = this.communityService.getUserId();
            
            console.log('User joined room successfully. isInstructor:', this.isInstructor, 'userId:', this.userId);

            // Unsubscribe from previous subscriptions
            this.subscriptions.forEach(sub => sub.unsubscribe());
            this.subscriptions = [];

            this.subscriptions.push(
              this.communityService.getMessages().subscribe(messages => {
                console.log(`Received ${messages.length} messages`);
                this.messages = messages;
                this.scrollToBottom();
              })
            );

            this.subscriptions.push(
              this.communityService.onNewMessage().subscribe(message => {
                console.log('Received new message:', message);
                this.messages.push(message);
                this.scrollToBottom();
              })
            );

            this.subscriptions.push(
              this.communityService.onMessageDeleted().subscribe(data => {
                console.log('Message deleted:', data);
                this.messages = this.messages.filter(message => message._id !== data.messageId);
              })
            );
          } else {
            console.error('Failed to join room');
            this.error = 'Failed to join room. Please try again.';
          }
        } catch (error:any) {
          console.error('Error in chat initialization:', error);
          this.loading = false;
          this.error = 'Error initializing chat: ' + (error.message || 'Unknown error');
        }
      }


      ngAfterViewChecked(): void {
          this.scrollToBottom()
      }

      scrollToBottom(): void {
        try {
          this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
        } catch(err) {}
      }


      sendMessage() {
        if (this.newMessage.trim()) {
          this.communityService.sendTextMessage(this.courseId, this.newMessage);
          this.newMessage = '';
        }
      }
      
      triggerFileInput() {
        this.fileInput.nativeElement.click();
      }


      handleFileInput(event: any) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageData = (e.target as FileReader).result as string;
            this.communityService.sendImageMessage(this.courseId, imageData);
          };
          reader.readAsDataURL(file);
          // Reset file input
          event.target.value = '';
        }
      }


      deleteMessage(messageId: string) {
        const dialogRef=this.dialog.open(ConfirmationcomponentComponent,{
          data:{
            title:'Confirm Deletion',
            message:'Are you sure you want to delete this message?'
          }
        })

        dialogRef.afterClosed().subscribe(result=>{
          if(result){
            this.communityService.deleteMessage(this.courseId, messageId);
          }
        })
       
      }
      
      isCurrentUser(senderId: string): boolean {
        return senderId === this.userId;
      }
      
      canDeleteMessage(message: any): boolean {
        return this.isInstructor || message.senderId === this.userId;
      }

      ngOnDestroy() {
        // Leave the room when component is destroyed
        if (this.courseId) {
          this.communityService.leaveRoom(this.courseId);
        }
        
        // Unsubscribe from all subscriptions
        this.subscriptions.forEach(sub => sub.unsubscribe());
      }
}
