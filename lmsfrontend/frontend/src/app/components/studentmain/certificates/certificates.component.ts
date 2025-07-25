import { Component, OnInit } from '@angular/core';
import { StudentcertificateService } from '../../../services/studentservice/certificate/studentcertificate.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-certificates',
  imports: [MatSnackBarModule,CommonModule,FormsModule,MatPaginatorModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit{
     
  certificates:any[]=[]
  loading=false
  totalPages=1
  limit=6
  pagedCertificates: any[] = [];

  currentPage = 0;
  pageSize = 3;
  totalItems = 0;
  pageSizeOptions = [3,6,9,12];

  


  constructor(private certificateService:StudentcertificateService,private snackBar:MatSnackBar){}

  ngOnInit():void{
    this.loadCertificates()
  }

  loadCertificates(page:number=1):void{
    this.loading=true
    this.certificateService.getUserCertificates(page,this.pageSize).subscribe({
      next:(response)=>{
        console.log('certificate response for you',response.certificates)
        console.log('page for certificcates',response.pagination.page)
        
         this.totalItems=response.pagination.total
         this.certificates=response.certificates
         this.currentPage=response.pagination.page-1
         this.totalPages=response.pagination.totalPages
         this.loading=false
        
      },
      error:(error)=>{
         this.snackBar.open('Failed to load certificates','Close',{duration:3000})
         this.loading=false
      }
    })
  }


  // onPageChange(page:number):void{
  //   this.loadCertificates(page)
  // }

  downloadCertificate(certificateUrl: string): void {
    console.log('got the certificate url in frontend',certificateUrl)
    fetch(certificateUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'certificate.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(error => {
        this.snackBar.open('Failed to download certificate', 'Close', {
          duration: 3000
        });
        console.error('Download error:', error);
      });
  }

  viewCertificate(certificateUrl: string): void {
    // For viewing, we'll use the browser's PDF viewer
    const newWindow = window.open();
    if (newWindow) {
      newWindow.location.href = certificateUrl;
    } else {
      this.snackBar.open('Please allow pop-ups to view the certificate', 'Close', {
        duration: 3000
      });
    }
  }


  // handlePageEvent(event: PageEvent) {
  //   this.currentPage = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   this.loadCertificates();
  //   // Smooth scroll to top
  //   window.scrollTo({ top: 0, behavior: 'smooth' });
  // }









  // onPageChange(page: number): void {
  //   if (page >= 1 && page <= this.totalPages) {
  //     this.loadCertificates(page);
  //     // Smooth scroll to top
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   }
  // }

  getCertificateUrl(certificateUrl:string){
    console.log('certificate generating function in frontend is called')
     return `${environment.cloudinaryBase}${certificateUrl}`
    // return `${environment.cloudinaryBase}${environment.sub.imageUploadFolder}${certificateUrl}`
  }




  handlePageEvent(event: PageEvent) {
    this.currentPage = event.pageIndex + 1; 
    this.pageSize = event.pageSize;

    this.loadCertificates(this.currentPage);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
