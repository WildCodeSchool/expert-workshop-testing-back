import "reflect-metadata";
import {startServer} from "./server";
import { config } from "./config/environnement.testing";
import { gql } from "apollo-server-core";
import mongoose from "mongoose"; 
import { ApolloServer } from "apollo-server";
import { MongoMemoryServer } from "mongodb-memory-server";
const { createTestClient } = require('apollo-server-testing');

const GET_ALL_WILDERS = gql`{getAllWilders{_id, name, city}}`;
const GET_WILDER_BY_ID = gql`
query GetWilderById($id: String!){
    getWilderById(id: $id){
        _id 
        name 
        city
    }
}`; 

const CREATE_WILDER = gql`
mutation CreateWilder($name: String!, $city: String!) {
    createWilder(name: $name, city: $city) {
      _id  
      name
      city
    }
  }
`;

const UPDATE_WILDER = gql`
mutation UpdateWilder($id: String!, $name: String!, $city: String!) {
    updateWilder(id: $id, name: $name, city: $city) {
      _id
      name
      city
    }
  }
`;

const DELETE_WILDER = gql`
mutation DeleteWilder($id: String!) {
    deleteWilder(id: $id) {
      _id
      name
      city
    }
  }
`;


describe(
    "test suite", 
    ()=>{
        let apollo:ApolloServer|null = null;
        let mongo:MongoMemoryServer = new MongoMemoryServer();

        // avant tous les tests
        beforeAll(
            async ()=>{
                // on crée une version in memory de mongo
                mongo = new MongoMemoryServer();
                config.uri = await mongo.getUri();
                
                // et on connecte notre apollo server
                apollo = await startServer(config);
            }
        ); 

        // après chaque test
        afterEach(
            async ()=>{
                // on vide toutes les collections après chaque test, comme ça on 
                // ne dépend pas de l'ordre d'éxécution des tests
                const collections = mongoose.connection.collections; 
                for( let key in collections ){
                    await mongoose.connection.db.collection(key).deleteMany({});
                }
            }
        )

        // après tous les tests
        afterAll(
            async ()=>{
                // on stoppe apollo server
                if( apollo !== null )
                    await apollo.stop();

                // on stoppe notre serveur mongo "in memory"
                await mongo.stop();
                // on déconnecte mongoose
                await mongoose.disconnect();
            }
        );

       
        it( 
            "should return an empty list of wilders", 
            async ()=>{
                const { query, mutate } = createTestClient(apollo);
                const res = await query({ query: GET_ALL_WILDERS });

                // par défaut on retourne une liste vide de wilders
                expect(res.data).toBeDefined();
            }
        );

        it( 
            "should insert wilder", 
            async ()=>{
                const data = {name:"Bruce Wayne", city: "Gotham City"}
                const { query, mutate } = createTestClient(apollo);
                const res = await mutate(
                    { 
                        query: CREATE_WILDER, 
                        variables: data
                    }
                );

                // on vérifie que notre wilder a bien été inséré en bdd
                expect(res.data.createWilder.name).toEqual(data.name);
                expect(res.data.createWilder.city).toEqual(data.city);
            }
        );


        it( 
            "should be able to retrieve a wilder by its id", 
            async ()=>{
                const data = {name:"Bruce Wayne", city: "Gotham City"}
                const { query, mutate } = createTestClient(apollo);
                const res = await mutate(
                    { 
                        query: CREATE_WILDER, 
                        variables: data
                    }
                );

                const res2 = await query(
                    {
                        query: GET_WILDER_BY_ID, 
                        variables: {id: res.data.createWilder._id}
                    }
                );

                // on vérifie que notre wilder a bien été retrouvé en bdd par le biais de son id
                expect(res.data.createWilder).toEqual(res2.data.getWilderById);
            }
        );

        it( 
            "should update a wilder", 
            async ()=>{
                
                // on crée notre faux client apollo client
                const { query, mutate } = createTestClient(apollo);

                // on crée un wilder
                const data = { name:"Bruce Wayne", city: "Gotham City"};

                const res = await mutate(
                    { 
                        query: CREATE_WILDER, 
                        variables: data
                    }
                );

                // et on le met à jour
                const updateData = {id: res.data.createWilder._id, name: "Clark Kent", city: "Metropolis" };
                
                const res2 = await mutate(
                    { 
                        query: UPDATE_WILDER, 
                        variables: updateData
                    }
                );

                // on vérifie que les données ont bien été mises à jour
                expect(res2.data.updateWilder.name).toEqual(updateData.name);
                expect(res2.data.updateWilder.city).toEqual(updateData.city);
            }
        );

        it( 
            "should delete a wilder", 
            async ()=>{
                 // on crée notre faux client apollo client
                const { query, mutate } = createTestClient(apollo);
                
                // on crée un wilder
                const data = { name:"Bruce Wayne", city: "Gotham City"};
                const res = await mutate(
                    { 
                        query: CREATE_WILDER, 
                        variables: data
                    }
                );
                
                // puis on le supprime
                const res2 = await mutate(
                    { 
                        query: DELETE_WILDER, 
                        variables: {id: res.data.createWilder._id}
                    }
                );

                // on vérifie que l'utilisateur supprimé est bien celui 
                // que l'on a envoyé en paramètre
                expect(res2.data.deleteWilder.name).toEqual(data.name);
                expect(res2.data.deleteWilder.city).toEqual(data.city);
            }
        );
        
    }
);