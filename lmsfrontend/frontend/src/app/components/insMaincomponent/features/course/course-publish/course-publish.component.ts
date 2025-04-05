import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-course-publish',
  standalone:true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
  ],
  templateUrl: './course-publish.component.html',
  styleUrl: './course-publish.component.scss'
})
export class CoursePublishComponent {
  @Input() courseData:any;
  @Output() publishCourse=new EventEmitter<void>()
  @Output() previousStep=new EventEmitter<void>()

  ngOnInit() {
    console.log('Course Data:', this.courseData); // Debug log
  }

  onPublish(){
    this.publishCourse.emit()
  }

  onPrevious() {
    this.previousStep.emit();
  }
}
