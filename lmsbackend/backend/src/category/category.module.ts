import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategorySchema } from './schema/category.schema';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CATEGORY_REPOSITORY, CATEGORY_SERVICE } from './constants/constant';
import { CategoryRepository } from './repository/category.repository';

@Module({
    imports:[
        MongooseModule.forFeature([{name:Category.name,schema:CategorySchema}])
    ],
    controllers:[CategoryController],
    providers:[
        {
            provide:CATEGORY_SERVICE,
            useClass:CategoryService
        },
        {
            provide:CATEGORY_REPOSITORY,
            useClass:CategoryRepository   
        }
    ],
    exports:[CATEGORY_SERVICE,CATEGORY_REPOSITORY]
})
export class CategoryModule {
   
}
