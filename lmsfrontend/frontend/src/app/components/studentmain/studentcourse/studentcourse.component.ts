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
    categories: [] as string[]
  };

  selectedLanguage: string = '';
  selectedCategory: string = '';

  constructor(private studentService:StudentcourseService,private snackBar:MatSnackBar,private router:Router,private categoryService:CategoryService){}

  ngOnInit():void{
    this.categoryService.getAllCategories().subscribe({
      next: (response) => {
        console.log(response)
        if (response && response.categories) {
          response.categories.forEach((category: any) => {
            this.categories.set(category._id, category.name);
            console.log('category response ahda',response)
            console.log('in maps',this.categories)
          });
        }
        // Load courses after categories are loaded
        this.loadCourses();
      },
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadCourses() {
    this.loading = true;
    
    // Create a params object with all filters
    const params: any = {
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    
    // Add price filters if set
    if (this.filters.minPrice !== null) {
      params.minPrice = this.filters.minPrice;
    }
    
    if (this.filters.maxPrice !== null) {
      params.maxPrice = this.filters.maxPrice;
    }
    
    // Add language filter if set
    if (this.filters.languages && this.filters.languages.length > 0) {
      params.languages = this.filters.languages.join(',');
    }
    
    // Add category filter if set - THIS IS THE IMPORTANT PART
    if (this.filters.categories && this.filters.categories.length > 0) {
      params.categories = this.filters.categories.join(',');
      console.log('Setting categories param:', params.categories);
    }
    
    console.log('Final params being sent to API:', params);
    
    // Call the service with the params
    this.studentService.getAllCourses(params).subscribe({
      next: (response) => {
        console.log('API Response:', response);
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
      error: (error) => {
        console.error('API Error:', error);
        this.error = 'Failed to load courses';
        this.loading = false;
      }
    });
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
      categories: []
    };
    this.searchTerm=''
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
  } else {
    this.filters.languages = []; // Clear if no value
  }
  this.applyFilters();
  }
// Add this method to handle category changes
onCategoryChange(event: any) {
  const value = event.target.value;
  console.log('Selected category ID:', value);
  
  if (value) {
    this.selectedCategory = value;
    this.filters.categories = [value]; // Make sure this is an array with the selected value
    console.log('Updated filters with category:', this.filters);
  } else {
    this.selectedCategory = '';
    this.filters.categories = [];
    console.log('Cleared category filters');
  }
  
  this.currentPage = 1; // Reset to first page when filter changes
  this.loadCourses(); // Call loadCourses directly to apply the filter
}


  getCategoryName(categoryId: string): string {
    return this.categories.get(categoryId) || categoryId;
  }


}
