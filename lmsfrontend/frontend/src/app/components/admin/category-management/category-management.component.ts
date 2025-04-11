import { Component, OnInit } from '@angular/core';
import { Category } from '../../../interfaces/category.interface';
import { CategoryService } from '../../../services/adminservice/category/category.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationcomponentComponent } from '../../common/confirmationcomponent/confirmationcomponent.component';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-management',
  imports: [CommonModule,FormsModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent implements OnInit{
       categories:Category[]=[]
       newCategory={name:'',description:''}
       editingCategory:Category|null=null
       currentPage:number=1
       itemsPerPage:number=10
       totalPages=1
       totalItems=0

       constructor(
        private categoryService:CategoryService,
        private dialog:MatDialog,
        private snackBar:MatSnackBar
      ){}

      ngOnInit():void{
        this.loadCategories()
      }

      loadCategories(): void {
        this.categoryService.getAllCategories(this.currentPage, this.itemsPerPage).subscribe({
          next: (response: any) => {
            console.log('loaded categories', response);
            if (Array.isArray(response)) {
              console.log('Response is an array');
              this.categories = response;
              this.totalPages = Math.ceil(response.length / this.itemsPerPage);
              this.totalItems = response.length;
              this.currentPage = 1;
            } else if (response.categories) {
              console.log('Response is an object with categories');
              this.categories = response.categories;
              this.totalPages = response.pagination?.totalPages || 1;
              this.totalItems = response.pagination?.total || response.categories.length;
              this.currentPage = response.pagination?.page || 1;
            }
          },
          error: (error) => {
            this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
            console.error('Error:', error);
          }
        });
      }


      createCategory():void{
        if(!this.newCategory.name.trim()){
          this.snackBar.open('Category name is required','Close',{duration:3000})
          return
        }

        this.categoryService.createCategory(this.newCategory).subscribe(
          response=>{
            this.loadCategories()
            this.newCategory={name:'',description:''}
            this.snackBar.open('Category created successfully','Close',{duration:3000})
          },
          error=>{
            this.snackBar.open('Error creating category','Close',{duration:3000})
          }
        )
      }


      startEdit(category:Category):void{
        this.editingCategory={...category}
      }

      cancelEdit():void{
        this.editingCategory=null
      }

      updateCategory():void{
        if(!this.editingCategory)return

        this.categoryService.updateCategory(this.editingCategory._id,{name:this.editingCategory.name,description:this.editingCategory.description}).subscribe(
          response=>{
            this.loadCategories()
            this.editingCategory=null
            this.snackBar.open('Category updated successfully','Close',{duration:3000})

          },
          error=>{
            this.snackBar.open('Error updating category','Close',{duration:3000})
          }
        )
      }


      deleteCategory(category:Category):void{
        const dialogRef=this.dialog.open(ConfirmationcomponentComponent,{
          data:{title:'Confirm Deletion',message:'Are you sure you want to delete this category?'}
        })

        dialogRef.afterClosed().subscribe(result=>{
          if(result){
            this.categoryService.deleteCategory(category._id).subscribe(
              response=>{
                this.loadCategories()
                this.snackBar.open('Category deleted successfully','Close',{duration:3000})
              },
              error=>{
                this.snackBar.open('Error deleting category','Close',{duration:3000})
              }
            )
          }
        })
      }



      onPageChange(page: number) {
        if (page !== this.currentPage && page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.loadCategories();
        }
    }

    getPageNumbers(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

}
