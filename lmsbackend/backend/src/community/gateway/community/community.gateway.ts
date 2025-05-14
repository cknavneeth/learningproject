import { Inject, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { CommunityService } from 'src/community/service/community.service';
import { ICommunityService } from 'src/community/service/interfaces/community.service.interface';
import { subscribe } from 'diagnostics_channel';
import { Payment, PaymentDocument } from 'src/payment/schema/payment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

interface JoinRoomDto{
  courseId:string
}

interface TextMessageDto{
  courseId:string,
  content:string
}

interface DeleteMessageDto{
  courseId:string,
  messageId:string
}

@WebSocketGateway({
  cors:{
    origin:'http://localhost:4200',
    credentials:false
  },
  namespace:'community'
})
export class CommunityGateway  implements OnGatewayConnection,OnGatewayDisconnect{
 
  private readonly logger=new Logger(CommunityGateway.name)

  private readonly connectedClients=new Map<string,{userId:string,username:string,role?:string}>()


  @WebSocketServer()
  server:Server


  constructor(
    @Inject('COMMUNITY_SERVICE') private readonly communityService:ICommunityService,
    private readonly jwtService:JwtService,
    @InjectModel(Payment.name) private paymentModel:Model<PaymentDocument>
  ){}

  async handleConnection(client:Socket){
    try {
      this.logger.log(`Client connected: ${client.id}`)

      const token=client.handshake.auth.token

      this.logger.log('initially got connected to community')

      if(!token){
        this.logger.error('No token provided')
        client.disconnect()
        return
      }


      try {
        const decoded=this.jwtService.verify(token)

        const userId=decoded.userId||decoded.InstructorId
        const username=decoded.username||decoded.username||'unknown'
        const role=decoded.role||(decoded.isInstructor?'instructor':'student')

        this.logger.log(`User connected: ${username} (${userId}) with role: ${role}`);


        this.connectedClients.set(client.id,{userId,username,role})

        

         this.logger.log(`Authenticated User connected: ${username} ${userId} with role ${role}`);
      } catch (error) {
        this.logger.log(`Invalid token provided: ${error.message}`)
        client.disconnect()
      }
    } catch (error) {
      this.logger.error(`Error handling connection: ${error.message}`)
      client.disconnect()
    }
  }


  handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`)
      this.connectedClients.delete(client.id)
  }


  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client:Socket,
    @MessageBody() data:JoinRoomDto
  ){
    try {
      const {courseId}=data
      const clientData=this.connectedClients.get(client.id)

      if(!clientData){
        this.logger.error(`Client not authenticated: ${client.id}`)
        return {success:false,message:'Client not authenticated'}
      }

      const {userId,role}=clientData

      this.logger.log(`User ${userId} with role ${role} attempting to join room for course ${courseId}`)

      //for instructor
      if (role === 'instructor') {
        this.logger.log(`User is an instructor, bypassing all checks`);
        
        // Join the room
        client.join(courseId);
        this.logger.log(`Instructor joined room for course ${courseId}`);
        
        // Get messages
        const messages = await this.communityService.getMessages(courseId);
        
        return {
          success: true,
          messages,
          userId,
          isInstructor: true
        };
      }

      //for instructor

      //fetching instructor here for checking if user is instructor
      const community=await this.communityService.getCommunity(courseId)

      this.logger.log(`Community data: ${JSON.stringify(community)}`)

      const isInstructor = community && community.instructorId ? 
      community.instructorId.toString() === userId : false;

      this.logger.log(`Is user an instructor? ${isInstructor}`);

      if (!isInstructor) {
        const hasPaid = await this.paymentModel.findOne({
          userId: new Types.ObjectId(userId),
          'coursesDetails.courseId': new Types.ObjectId(courseId),
          status: 'completed'
        });
  
        if (!hasPaid) {
          this.logger.error(`User ${userId} has not paid for course ${courseId}`);
          return { success: false, message: 'You have not paid for this course' };
        }
      }

      client.join(courseId)
      this.logger.log(`User ${clientData.userId} joined room for course ${courseId}`)


      //mark messages as read when joining the room
      await this.communityService.markMessageAsRead(courseId,userId)
      this.logger.log(`Marked messages as read for user ${userId} in course ${courseId}`);

      const messages=await this.communityService.getMessages(courseId)

      return {
        success:true,
        messages,
        userId,
        isInstructor
      }
    } catch (error) {
       this.logger.error(`Error joining room: ${error.message}`)
       return {success:false,message:'Failed to join room'}
    }
  }



  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client:Socket,
    @MessageBody() data:JoinRoomDto
  ){
    try {
      const {courseId}=data
      client.leave(courseId)
      this.logger.log(`User left room for course ${courseId}`)

      const clientData=this.connectedClients.get(client.id)

      if(clientData){
        this.logger.log(`User ${clientData.userId} left room for course ${courseId}`)
      }

      return {success:true}
    } catch (error) {
       this.logger.error(`Error leaving room: ${error.message}`)
       return {success:false,message:'Failed to leave room'}
    }
  }


  @SubscribeMessage('sendTextMessage')
  async handleSendTextMessage(
    @ConnectedSocket() client:Socket,
    @MessageBody() data:TextMessageDto
  ){
    try {
      const {courseId,content}=data
      const clientData=this.connectedClients.get(client.id)

      if(!clientData){
        this.logger.error(`Client not authenticated: ${client.id}`)
        return {success:false,message:'Client not authenticated'}
      }

      const {userId,username}=clientData

      const message=await this.communityService.addTextMessage(courseId,userId,username,content)

       this.server.to(courseId).emit('newMessage',message,courseId)

      return {success:true,message}
    } catch (error) {
         this.logger.error(`Error sending text message: ${error.message}`)
         return {success:false,message:'Failed to send text message'}
    }
  }



  @SubscribeMessage('sendImageMessage')
  async handleSendImageMessage(
    @ConnectedSocket() client:Socket,
    @MessageBody() data:{courseId:string,image:string}
  ){
      try {
        const {courseId,image}=data
        const clientData=this.connectedClients.get(client.id)

        if(!clientData){
          this.logger.error(`Client not authenticated: ${client.id}`)
          return {success:false,message:'Client not authenticated'}
        }

        const {userId,username}=clientData

        const imageBuffer=Buffer.from(image.split(',')[1],'base64')

        const message=await this.communityService.addImageMessage(courseId,userId,username,imageBuffer)

        this.server.to(courseId).emit('newMessage',message,courseId)

        return {success:true,message}

      } catch (error) {
          this.logger.error(`Error sending image message: ${error.message}`)
          return {success:false,message:'Failed to send image message'}
      }
  }



  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @ConnectedSocket() client:Socket,
    @MessageBody() data:DeleteMessageDto
  ){
    try {
      const {courseId,messageId}=data
      const clientData=this.connectedClients.get(client.id)
      if(!clientData){
        this.logger.error(`Client not authenticated: ${client.id}`)
        return {success:false,message:'Client not authenticated'}
      }


      const {userId}=clientData

      const success=await this.communityService.deleteMessage(courseId,messageId,userId)

      if(success){
        this.server.to(courseId).emit('messageDeleted',{messageId})
        return {success:true}
      }else{
        return {success:false,message:'You can only delete your own messages'}
      }
    } catch (error) {
        this.logger.error(`Error deleting message: ${error.message}`)
        return {success:false,message:'Failed to delete message'}
    }
  }




  //add new handler for getting unread counts
  @SubscribeMessage('getUnreadCounts')
  async handleGetUnreadCounts(
    @ConnectedSocket() client : Socket
  ){
      try {
        const clientData=this.connectedClients.get(client.id)

        if(!clientData){
           this.logger.error(`Client not authenticated: ${client.id}`);
           return { success: false, message: 'Client not authenticated' };
        }

        const {userId}=clientData

        this.logger.log(`Getting unread counts for user: ${userId}`);

        const unreadCounts=await this.communityService.getUnreadMessageCountsForUser(userId)

         this.logger.log(`Unread counts for user ${userId}: ${JSON.stringify(unreadCounts)}`);

         return {success:true,unreadCounts}
      } catch (error) {
         this.logger.error(`Error getting unread counts: ${error.message}`);
         return { success: false, message: 'Failed to get unread counts' };
      }
  }


}
