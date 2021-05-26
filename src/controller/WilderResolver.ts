import { Int, Resolver, Query, Arg, Mutation } from "type-graphql";
import { Wilder } from "../model/graphql/Wilder";
import WilderModel from "../model/WilderModel";

@Resolver(Wilder)
export class WilderResolver {

    // cette méthode est une query, çàd qu'elle va servir à la lecture de données
    // elle retourne un wilder ou null (en fonction de si l'id correspond bien à un document)
    @Query(returns => Wilder, { nullable: true })
    public async getWilderById(@Arg("id", type => String) id: string) {
        // si l'id n'existe pas, mongoose renvoie undefined, ce qui me permet 
        // de renvoyer null parce que, rappel: 
        // undefined || something ---  renvoie toujours something
        return await WilderModel.findById(id)||null;
    }

    // cette méthode est une query, çàd qu'elle va servir à la lecture de données
    // elle retourne tous les documents de type Wilder
    @Query(returns => [Wilder])
    public async getAllWilders() {
        return await WilderModel.find();
    }

    // cette méthode est une mutation, çàd qu'elle va servir à écrire /modifier/supprimer de la donnée
    // elle retourne le wilder nouvellement crée
    @Mutation(returns => Wilder)
    public async createWilder(
        @Arg("name") name: string,
        @Arg("city") city: string
    ) {
        await WilderModel.init();
        const body: any = {
            name: name,
            city: city
        };
        const model = new WilderModel(body);
        const result = await model.save();
        return result;
    }

    // cette méthode est une mutation, çàd qu'elle va servir à écrire /modifier/supprimer de la donnée
    // elle retourne le wilder mis à jour
    @Mutation(returns => Wilder)
    public async updateWilder(
        @Arg("id", type => String) id: number,
        @Arg("name") name: string,
        @Arg("city") city: string
    ) {
        const body: any = { name: name, city: city };
        await WilderModel.updateOne({ _id: id }, body);
        return await WilderModel.findById(id);
    }
    
    // cette méthode est une mutation, çàd qu'elle va servir à écrire /modifier/supprimer de la donnée
    // elle retourne le wilder supprimé
    @Mutation(returns => Wilder, { nullable: true })
    public async deleteWilder(@Arg("id", type => String) id: string) {
        const wilder = await WilderModel.findById(id);
        await WilderModel.deleteOne({ _id: id });
        return wilder;
    }

}