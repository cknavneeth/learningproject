import { Component, OnInit } from '@angular/core';
import { StudentcourseService } from '../../../services/studentservice/course/studentcourse.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CategoryService } from '../../../services/instructorservice/category/category.service';

@Component({
  selector: 'app-studentcourse',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './studentcourse.component.html',
  styleUrl: './studentcourse.component.scss'
})
export class StudentcourseComponent implements OnInit{

  Math = Math; 

  courses:any[]=[]
  loading:boolean=false
  error:string=''
  searchTerm:string=''
  filteredCourses:any[]=[]

  categories: Map<string, string> = new Map();

  currentPage: number = 1;
  itemsPerPage: number = 9; // Number of courses per page
  totalItems: number = 0;
  totalPages: number = 0;

  filters = {
    minPrice: null as number | null,
    maxPrice: null as number | null,
    languages: [] as string[],
    levels: [] as string[]
  };

  selectedLanguage: string = '';
  selectedLevel: string = '';

  constructor(private studentService:StudentcourseService,private snackBar:MatSnackBar,private router:Router,private categoryService:CategoryService){}

  ngOnInit():void{
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        console.log(response)
        if (response && response.categories) {
          response.categories.forEach((category: any) => {
            this.categories.set(category._id, category.name);
          });
        }
        // Load courses after categories are loaded
        this.loadCourses();
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadCourses(){
    this.loading=true
    
      const params = {
        page: this.currentPage,
        limit: this.itemsPerPage,
        ...(this.filters.minPrice !== null && { minPrice: this.filters.minPrice }),
        ...(this.filters.maxPrice !== null && { maxPrice: this.filters.maxPrice }),
        ...(this.filters.languages.length > 0 && { languages: this.filters.languages }),
        ...(this.filters.levels.length > 0 && { levels: this.filters.levels })
      };

    this.studentService.getAllCourses(params).subscribe(
      response=>{
        console.log('couses ellam load aayi',response)
        // this.courses=response.courses
        // this.courses = Array.isArray(response) ? response : [];
        // console.log('normal courses',this.courses)
        // this.filteredCourses=[...this.courses]
        // console.log('Filtered Courses:', this.filteredCourses); 
        // this.loading=false
        if (Array.isArray(response)) {
          this.courses = response;
          this.filteredCourses = response;
          this.totalItems = response.length;
          this.totalPages = Math.ceil(response.length / this.itemsPerPage);
        } else if (response.courses) {
          this.courses = response.courses;
          this.filteredCourses = response.courses;
          this.totalItems = response.total;
          this.totalPages = response.totalPages;
        }
        
        this.loading = false;
       
      },
      error=>{
        this.error='Failed to load courses'
        this.loading=false
        console.error('Error loading courses',error)
      }
    )
  }


  //gonna have search
  onSearch(){
    if(!this.searchTerm.trim()){
      this.filteredCourses=[...this.courses]
      return
    }
    const searchTermLower=this.searchTerm.toLowerCase()
    this.filteredCourses=this.courses.filter(course=>{
      return  course.title.toLowerCase().includes(searchTermLower)||
      course.instructor?.name.toLowerCase().includes(searchTermLower)||
      course.category.toLowerCase().includes(searchTermLower)
    })
  }


  enrollCourse(courseId:string){
    // this.loading=true
    // this.studentService.enrollCourse(courseId).subscribe(
    //   response=>{
    //     this.snackBar.open('Successfully enrolled in the course!','Close',{
    //       duration:3000,
    //       horizontalPosition:'right',
    //       verticalPosition:'top'
    //     })
    //     console.log('course enrolled successfully')
    //     this.router.navigate(['/student/my-courses'])
    //   },
    //   error=>{
    //     console.log('enrollement failed',error)
    //   }
    // )
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCourses(); // Reload courses with new page
    }
  }

  getPageNumbers(): number[] {
    const maxPages = 5; // Show maximum 5 page numbers
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(currentPage - Math.floor(maxPages / 2), 1);
    let endPage = startPage + maxPages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPages + 1, 1);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }

  clearFilters() {
    this.filters = {
      minPrice: null,
      maxPrice: null,
      languages: [],
      levels: []
    };
    this.currentPage = 1; // Reset to first page
    this.loadCourses(); // Reload courses without filters
  }

  applyFilters() {
    this.currentPage = 1; // Reset to first page when applying filters
    this.loadCourses();
  }

  onLanguageChange(event: any) {
    const value = event.target.value;
    if (value) {
      this.filters.languages = [value]; // Replace with single value
      this.applyFilters();
    }
  }

  onLevelChange(event: any) {
    const value = event.target.value;
    if (value) {
      this.filters.levels = [value]; // Replace with single value
      this.applyFilters();
    }
  }


  getCategoryName(categoryId: string): string {
    return this.categories.get(categoryId) || categoryId;
  }


}
