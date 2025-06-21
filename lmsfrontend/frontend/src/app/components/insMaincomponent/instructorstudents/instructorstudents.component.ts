import { Component, OnInit } from '@angular/core';
import { InstructorcourseService } from '../../../services/instructorservice/course/instructorcourse.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instructorstudents',
  imports: [CommonModule,FormsModule],
  templateUrl: './instructorstudents.component.html',
  styleUrl: './instructorstudents.component.scss'
})
export class InstructorstudentsComponent implements OnInit{

  students:any[]=[]
  loading:boolean=true
  error:string|null=null
  currentPage:number=1
  totalPages:number=0
  totalStudents:number=0
  limit:number=10

  searchTerm:string=''
  constructor(private instructorService:InstructorcourseService){}

  ngOnInit():void{
    this.loadStudents()
  }

  loadStudents(page:number=1):void{
    this.loading=true
    this.error=null

    this.instructorService.getEnrolledStudents(page,this.limit,this.searchTerm).subscribe({
      next:(response)=>{
        console.log('Full response:', response.data);
        console.log('Number of students:', response.data.students.length);
        console.log('Total count:', response.data.pagination.total);
        this.students=response.data.students
        this.totalPages=response.data.pagination.totalPages
        this.totalStudents=response.data.students.length
        this.currentPage=page
        this.loading=false
        console.log('students who buyed my course',this.students)
      },
      error:(error)=>{
        this.error='Failed to load students'
        this.loading=false
      }
    })
  }


  // onPageChange(page: number): void {
  //   if (page !== this.currentPage && page > 0 && page <= this.totalPages) {
  //     this.loadStudents(page);
  //   }
  // }

  // formatDate(date: string): string {
  //   return new Date(date).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric'
  //   });
  // }


  onPageChange(page: number): void {
    if (page !== this.currentPage) {
      this.loadStudents(page);
    }
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  onSearchChange(){
    this.currentPage=1
    this.loadStudents()
  }
}
