interface EnrolledCourse{
    _id:string,
    title:string,
    price:number,
    thumbnailUrl:string,
    instructor:{
        name:string
    },
    progress:number
}