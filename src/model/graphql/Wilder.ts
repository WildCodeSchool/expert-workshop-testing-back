import { Field, ID, ObjectType } from "type-graphql";


@ObjectType()
export class Wilder{
    @Field(type=>ID, {nullable: true})
    _id:string = "";


    @Field(type=>String, {nullable: true})
    name:string = "";
    

    @Field(type=>String, {nullable: true})
    city:string = "";
}

