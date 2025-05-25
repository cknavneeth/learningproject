export interface Category{
    _id:string
    name:string
    description:string
    isActive:boolean
    createdAt:Date
    updatedAt:Date
}



export interface CreateCategoryDto{
    name:string
    description?:string
}


export interface UpdateCategoryDto{
    name?:string
    description?:string
}

export interface CategoryResponse{
   categories:Category[],
   pagination?:{
    total:number,
    page:number,
    limit:number,
    totalPages:number
   }

}