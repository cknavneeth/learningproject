import { Component, OnInit } from '@angular/core';
import { StudentcertificateService } from '../../../services/studentservice/certificate/studentcertificate.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-certificates',
  imports: [MatSnackBarModule,CommonModule,FormsModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss'
})
export class CertificatesComponent implements OnInit{
     
  certificates:any[]=[]
  loading=false
  currentPage=1
  totalPages=1
  limit=10


  constructor(private certificateService:StudentcertificateService,private snackBar:MatSnackBar){}

  ngOnInit():void{
    this.loadCertificates()
  }

  loadCertificates(page:number=1):void{
    this.loading=true
    this.certificateService.getUserCertificates(page,this.limit).subscribe({
      next:(response)=>{
         this.certificates=response.certificates
         this.currentPage=response.pagination.page
         this.totalPages=response.pagination.totalPages
         this.loading=false
      },
      error:(error)=>{
         this.snackBar.open('Failed to load certificates','Close',{duration:3000})
         this.loading=false
      }
    })
  }


  onPageChange(page:number):void{
    this.loadCertificates(page)
  }

  downloadCertificate(certificateUrl:string):void{
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = 'certificate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  viewCertificate(certificateUrl: string): void {
    window.open(certificateUrl, '_blank');
  }
}
