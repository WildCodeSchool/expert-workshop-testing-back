import "reflect-metadata";
import { Wilder } from "../model/graphql/Wilder";
import { WilderResolver } from "./WilderResolver"; 
import WilderModel from "../model/WilderModel";

describe(
    "WilderResolver test suite", 
    ()=>{
        it(
            "should return a wilder by it's id", 
            async ()=>{
                // on crée un faux wilder (mock data)
                const fakeWilder:Wilder = new Wilder();
                fakeWilder._id  = "monsuperid";
                fakeWilder.city = "Gotham city"; 
                fakeWilder.name = "Jean louis la chaussette"; 

                // on espionne l'appel à la méthode findById de notre WilderModel
                const spy = jest.spyOn(WilderModel, "findById");

                // et quand cette méthode est appellée on retourne 
                // le mock data (faux wilder)
                spy.mockResolvedValue(fakeWilder);
              
                // on crée une instance de notre resolver
                const resolver:WilderResolver = new WilderResolver(); 

                // puis on appelle la méthode à tester, on enregistre le résultat
                const result:Wilder|null = await resolver.getWilderByIdIfItsNameBeginsWithAVowel(fakeWilder._id);

                // on s'attend à ce qu'il soit null parce que la première lettre du nom
                // de notre faux wilder est 'J' ce qui n'est pas une voyelle
                expect(result).toBeNull();

                // on s'attend à ce que notre WilderModel.findById ait été appellée une fois 
                // avec le paramètre correspondant à l'id de notre fakewilder
                expect(spy).toHaveBeenCalledWith(fakeWilder._id);

                // on nettoie tous les mocks
                spy.mockClear();
            }
        )
    }
)