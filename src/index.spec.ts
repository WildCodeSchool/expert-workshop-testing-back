import "reflect-metadata";
import {startServer} from "./server";
import { config } from "./config/environnement.testing";
import { gql } from "apollo-server-core";
import mongoose from "mongoose"; 
import { ApolloServer } from "apollo-server";
import { MongoMemoryServer } from "mongodb-memory-server";
const { createTestClient } = require('apollo-server-testing');

const GET_ALL_WILDERS = gql`{getAllWilders{id, name, city}}`;


describe(
    "test suite", 
    ()=>{
        var apollo:ApolloServer|null = null;
        var mongo:MongoMemoryServer = new MongoMemoryServer();

        beforeAll(
            async ()=>{
                ///// uncomment lines below if you want an inmemory version
                mongo = new MongoMemoryServer();
                config.uri = await mongo.getUri();
                
                apollo = await startServer(config);
            }
        ); 

        afterAll(
            async ()=>{
                if( apollo !== null )
                    await apollo.stop();

                await mongo.stop();
                await mongoose.disconnect();
            }
        );

       
        it( 
            "test", 
            async ()=>{
                const { query, mutate } = createTestClient(apollo);
                const res = await query({ query: GET_ALL_WILDERS });
                expect(res.data).toBeDefined();
            }
        );
    }
);