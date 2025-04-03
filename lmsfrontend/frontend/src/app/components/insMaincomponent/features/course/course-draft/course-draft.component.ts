import { Component } from '@angular/core';
import { InstructorcourseService } from '../../../../../services/instructorservice/course/instructorcourse.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { ConfirmationcomponentComponent } from '../../../../common/confirmationcomponent/confirmationcomponent.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-draft',
  imports: [CommonModule],
  templateUrl: './course-draft.component.html',
  styleUrl: './course-draft.component.scss'
})
export class CourseDraftComponent {

  drafts:any[]=[]
  loading:boolean=true
  error:string|null=null

  constructor(private courseService:InstructorcourseService,private router:Router,private dialog:MatDialog,private snackBar:MatSnackBar){}

  ngOnInit():void{
    this.loadDrafts()
  }

  async loadDrafts(){
    try {
       this.loading=true
       this.drafts=await firstValueFrom(this.courseService.getDrafts())
    } catch (error) {
       console.error('error loading drafts',error)
       this.error='Failed to load drafts'
      
    }finally{
      this.loading=false
    }
  }

  editDraft(draftId:string){
    this.router.navigate(['/instructor/courses'],{queryParams:{id:draftId}})
  }

  async deleteDraft(draftId:string){
    const dialogRef=this.dialog.open(ConfirmationcomponentComponent,{
      data:{title:'Confirm Deletion',message:'Are you sure you want to delete this draft?'}
    })

    dialogRef.afterClosed().subscribe(async (result)=>{
      if(result){
        try {
          await this.courseService.deleteDraft(draftId).toPromise()
          this.drafts=this.drafts.filter(draft=>draft._id !== draftId)

          this.snackBar.open('Draft deleted successfully!','Close',{
            duration:3000,
            horizontalPosition:'right',
            verticalPosition:'top'
          })
        } catch (error) {
          console.log('Error deleting draft',error)
          this.snackBar.open('Failed to delete draft','Close',{
            duration:3000,
            horizontalPosition:'right',
            verticalPosition:'top'
          })
        }
      }
    })
  }


  createNewDraft(){
    this.router.navigate(['/instructor/courses'])
  }

  getFormattedDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }


}
