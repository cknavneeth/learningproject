import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';



export interface TableColumn{
  header:string;
  field:string;
  type:'text'|'image'|'status'|'action';
  statusOptions?:{
    trueValue:string;
    falseValue:string;
    trueClass:string;
    falseClass:string;
  }
}

@Component({
  selector: 'app-tablecomponent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tablecomponent.component.html',
  styleUrl: './tablecomponent.component.scss'
})
export class TablecomponentComponent implements OnInit,OnChanges{

  @Input() columns:TableColumn[]=[];
  @Input() data:any[]=[];
  @Input() title:string='';
  @Input() searchPlaceholder:string='Search...';
  @Input() itemsPerPage:number=10;


  @Output() actionClick=new EventEmitter<{action:string,item:any}>()
  @Output() searchChange=new EventEmitter<string>()


  currentPage:number=1;
  filteredData:any[]=[];
  searchTerm:string='';

  ngOnInit(): void {
    this.filteredData=[...this.data]
  }

  ngOnChanges(): void {
    this.filteredData = [...this.data];
  }

  get totalPages():number{
    return Math.ceil(this.filteredData.length/this.itemsPerPage)
  }
  get paginatedData(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredData.slice(start, end);
  }

  get displayRange():{start:number;end:number;total:number}{
    const start=(this.currentPage-1)*this.itemsPerPage+1;
    const end=Math.min(start+this.itemsPerPage-1,this.filteredData.length)
    return {start,end,total:this.filteredData.length}
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredData = this.data.filter(item =>
      Object.values(item).some(val =>
        val?.toString().toLowerCase().includes(this.searchTerm)
      )
    );
    this.currentPage = 1; 
    this.searchChange.emit(this.searchTerm);
  }

  getPageNumbers(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const maxPages = 5;

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



  getStatusClass(item:any,column:TableColumn):string{
    if(!column.statusOptions)return ''

    const value=item[column.field]
    return value?column.statusOptions.trueValue:column.statusOptions.falseValue
  }


  getStatusLabel(item:any,column:TableColumn):string{
    if(!column.statusOptions)return ''
    const value=item[column.field]
    return value?column.statusOptions.trueValue:column.statusOptions.falseValue
  }

  onAction(action:string,item:any){
    this.actionClick.emit({action,item})
  }

  // onSearch(event:any):void{
  //   this.searchChange.emit(event.target.value)
  // }

  handleImageError(event: any) {
    event.target.src = 'assets/default-avatar.png';
  }
  
}
